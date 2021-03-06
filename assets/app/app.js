/*
          1. render song
          2. Scroll top
          3. Play /pause/seek
          4. CD rotate
          5. Next / prev
          6. Random
          7. Next/ Repeat when ended
          8. active song   ->doing
          9.scroll active song into viewport 
          10. Play song when click
        */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd .cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const volume = $('#volume');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const preBtn = $('.btn-prev');
const randomBtn = $('.btn-random')
var arrayTempSong = [];
const timeLine = $('.time');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const PLAYER_STORAGE_KEY = 'f8_PLAYER';
const volumeBtn = $('#volume');




const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isVolumeUp: false,
    volume: 0.4,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Nevada",
            singer: "K-391_ Alan Walker_ Julie Berga",
            path: "./assets/music/Nevada.mp3",
            image: "./assets/img/8.jpg"
        },
        {
            name: "Darkside",
            singer: "Alan Walker_ Tomine Harket_ A",
            path: "./assets/music/Darkside.mp3",
            image: "./assets/img/2.jpg"
        },
        {
            name: "Ignite",
            singer: "K-391_ Alan Walker_ Julie Berga",
            path: "./assets/music/Ignite.mp3",
            image: "./assets/img/3.jpg"
        },
        {
            name: "MaYaHi Remix",
            singer: "K-391_ Alan Walker_ Julie Berga",
            path: "./assets/music/MaYaHi.mp3",
            image: "./assets/img/4.jpg"
        },
        {
            name: "Amore Mio",
            singer: "Karma",
            path: "./assets/music/AmoreMio.mp3",
            image: "./assets/img/1.jpg",
        },
        {
            name: "On And On",
            singer: "Cartoon_ Daniel Levi",
            path: "././assets/music/OnAndOn.mp3",
            image: "./assets/img/6.jpg",
        },
        {
            name: "Qua Khu Anh Khong The Quen Remix",
            singer: "Unknow",
            path: "./assets/music/QuaKhuAnhKhongTheQuen_ Remix.mp3",
            image: "./assets/img/5.jpg",
        },
        {
            name: "The Spectre - Alan Walker_ Danny Shah",
            singer: "Alan Walker_ Danny Shah",
            path: "./assets/music/TheSpectre.mp3",
            image: "./assets/img/3.jpg",
        },
        {
            name: "Vi Nguoi Khong Xung Dang Remix",
            singer: "Tuan Hung",
            path: "./assets/music/ViNguoiKhongXungDang.mp3",
            image: "./assets/img/9.jpg",
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render() {
        let tmpIndex = this.currentIndex
        //  ${index === tmpIndex ? 'active' : ''}
        const htmls = this.songs.map(function (song, index) {

            return `
                      <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
                          <div class="thumb" style="background-image: url('${song.image}')">
                          </div>
                          <div class="body">
                              <h3 class="title">${song.name}</h3>
                              <p class="author">${song.singer}</p>
                          </div>
                          <div class="option">
                              <i class="fas fa-ellipsis-h"></i>
                          </div>
                      </div>
                      `
        });
        playList.innerHTML = htmls.join('');
    },

    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },


    handleEvent() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // x??? l?? cd quay v?? d???ng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ],
            {
                duration: 10000,
                iterations: Infinity
            })

        cdThumbAnimate.pause();



        // x??? l?? zoomIn/ zoomOut cd thumbnail
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            // fix bug not hiden avatar when scrool fast
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // x??? l?? khi player
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
                console.log(audio.volume);
            }

        }
        // Khi song ???????c play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();

        }

        // Khi song b??? pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        }

        // khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }

            // time audio
            let timeAudio = audio.currentTime;
            let s = Math.round(audio.currentTime % 60)
            let m = Math.floor(audio.currentTime / 60);
            if (s == 60) {
                s = 0;
                m++;
            };
            if (s < 10) {
                s = "0" + s;
            }
            let time = `${m}:${s}`
            timeLine.textContent = time;
        }

        // x??? l?? tua
        progress.oninput = function (e) {
            const seekTime = (audio.duration * e.target.value) / 100;
            audio.currentTime = seekTime;
        }

        // khi next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong();
        }



        // khi prev
        preBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {

                _this.prevSong();
            }
            audio.play();
            _this.render()

        }

        // x??? l?? Random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
            _this.setConfig('isRandom', _this.isRandom);
        }



        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
            _this.setConfig('isRepeat', _this.isRepeat);

        }

        // x??? l?? khi ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {

                nextBtn.click();
            }
        }



        // x??? l?? click song
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {

                // x??? l?? khi click song 
                if (songNode) {
                    // get index: songNode.getAttribute('data-index')
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    audio.play();
                }

                // x??? l?? khi click song ??ption

            }
        }



        // Ch???nh Volume
        volumeBtn.oninput = function (vol) {
            let confirmVolume = false;

            if (vol.target.value > 0.5) {
                if (_this.isVolumeUp == false) {
                    confirmVolume = confirm('T??ng ??m l?????ng qu?? cao th???i gian d??i s??? ???nh h?????ng ?????n th??nh gi??c!')
                    audio.volume = Number(vol.target.value);
                    _this.isVolumeUp = confirmVolume;

                } 
            }
            audio.volume = Number(vol.target.value);
            console.log(audio.volume);
            _this.volume = vol.target.value;
            _this.setConfig('isVolumeUp', _this.isVolumeUp);
            _this.setConfig('volume', _this.volume);

        }

        audio.onvolumechange = function (e) {
            _this.setConfig('isVolumeUp', _this.isVolumeUp);
            _this.setConfig('volume', _this.volume);
        }

          document.onkeydown = function (e) {
              console.log(e.keyCode);
              if (e.keyCode === 175 && audio.volume < 1) {
                  audio.volume += 0.1;
             
                  if (audio.volume >1) {
                      audio.volume = 1;
                    }
                    volumeBtn.value =audio.volume;
              } else if (e.keyCode === 174 && audio.volume >= 0.1) {
                  audio.volume -= 0.1;
                  if (audio.volume < 0) {
                    audio.volume = 0;
                  }
                  volumeBtn.value = audio.volume;
              }
          }


    },




    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.background = `url('${this.currentSong.image}')`;
        audio.src = `${this.currentSong.path}`;

        // l?? khi load xong 1 b??i m???i x??a. ch??a load xong th?? kh??ng x??a ???????c
        if ($('.song.active')) {
            $('.song.active').classList.toggle('active')
        }
        $$('.song')[app.currentIndex].classList.toggle('active');
        this.setConfig('currentIndex', this.currentIndex);
    },
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.volume = this.config.volume;
        this.isVolumeUp = this.config.isVolumeUp;
        this.currentIndex = this.currentIndex;
    }
    ,
    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong() {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong() {
        let newIndex;
        let check = false;

        if (arrayTempSong.length == this.songs.length) {
            arrayTempSong = [];
        }

        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
            check = arrayTempSong.includes(newIndex);
        } while (check == true && newIndex != this.currentIndex);

        this.currentIndex = newIndex;
        arrayTempSong.push(this.currentIndex);
        this.loadCurrentSong();
    },
    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'end'
            })
        }, 300)
    },
    loadSetting() {
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    },

    defaultVolume() {
        audio.volume = this.volume;
        volumeBtn.value = audio.volume;
    },
    // volumeUp() {
    //     let confirmVolume = false;
    //     console.log(audio.volume = vol.target.value);
    //     if (vol.target.value > 0.5) {
    //         if (_this.isVolumeUp == false) {
    //             confirmVolume = confirm('T??ng ??m l?????ng qu?? cao th???i gian d??i s??? ???nh h?????ng ?????n th??nh gi??c!')
    //             audio.volume = Number(vol.target.value);
    //             // _this.isVolumeUp= confirmVolume;

    //         } else {
    //             audio.volume = Number(vol.target.value);
    //         }
    //     }
    // },

    start() {
        // G??n c???u h??nh config v??o app
        this.loadConfig();

        // ?????nh ngh??a currentIndex
        this.defineProperties();
        // L???ng nghe v?? x??? l?? s??? ki???n
        this.handleEvent();

        // t???i b??i h??t hi???n t???i v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong();

        // render playlist
        this.render();

        // setting 
        this.loadSetting();

        // default volume
        this.defaultVolume();


    }
}

app.start();