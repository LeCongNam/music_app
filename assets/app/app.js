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
  
                  // xử lí cd quay và dừng
                  const cdThumbAnimate = cdThumb.animate([
                      { transform: 'rotate(360deg)' }
                  ],
                      {
                          duration: 10000,
                          iterations: Infinity
                      })
  
                  cdThumbAnimate.pause();
  
  
  
                  // xử lí zoomIn/ zoomOut cd thumbnail
                  document.onscroll = function () {
                      const scrollTop = window.scrollY || document.documentElement.scrollTop;
                      const newCdWidth = cdWidth - scrollTop;
  
                      // fix bug not hiden avatar when scrool fast
                      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                      cd.style.opacity = newCdWidth / cdWidth;
                  }
  
                  // xử lí khi player
                  playBtn.onclick = function () {
                      if (_this.isPlaying) {
                          audio.pause();
                      } else {
                          audio.play();
                          console.log(audio.volume);
                      }
  
                  }
                  // Khi song đưỢc play
                  audio.onplay = function () {
                      _this.isPlaying = true;
                      player.classList.add('playing');
                      cdThumbAnimate.play();
  
                  }
  
                  // Khi song bị pause
                  audio.onpause = function () {
                      _this.isPlaying = false;
                      player.classList.remove('playing');
                      cdThumbAnimate.pause();
  
                  }
  
                  // khi tiến độ bài hát thay đổi
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
  
                  // xử lí tua
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
  
                  // xử lí Random
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
  
                  // xử lí khi ended
                  audio.onended = function () {
                      if (_this.isRepeat) {
                          audio.play();
                      } else {
  
                          nextBtn.click();
                      }
                  }
  
  
  
                  // xử lí click song
                  playList.onclick = function (e) {
                      const songNode = e.target.closest('.song:not(.active)');
                      if (songNode || e.target.closest('.option')) {
  
                          // xử lí khi click song 
                          if (songNode) {
                              // get index: songNode.getAttribute('data-index')
                              _this.currentIndex = Number(songNode.dataset.index)
                              _this.loadCurrentSong();
                              audio.play();
                          }
  
                          // xử lí khi click song òption
  
                      }
                  }
  
  
  
                  // Chỉnh Volume
                  volumeBtn.oninput = function (vol) {
                      let confirmVolume = false;
  
                      if (vol.target.value > 0.5) {
                          if (_this.isVolumeUp == false) {
                              confirmVolume = confirm('Tăng âm lượng quá cao thời gian dài sẽ ảnh hưởng đến thính giác!')
                              audio.volume = Number(vol.target.value);
                              // _this.isVolumeUp= confirmVolume;
  
                          } else {
                              audio.volume = Number(vol.target.value);
                          }
                      }
                      _this.volume = vol.target.value;
                    
                      
                  }
  
                  audio.onvolumechange= function (e){
                      _this.setConfig('isVolumeUp', _this.isVolumeUp);
                      _this.setConfig('volume', _this.volume);
                  }
  
                  document.onkeydown = function (e) {
                      console.log(e.keyCode);
                      if (e.keyCode === 175 && audio.volume <= 1) {
                          audio.volume += 0.1;
                          volumeBtn.value = audio.volume;
                      } else if (e.keyCode === 174 && audio.volume >= 0.1) {
                          audio.volume -= 0.1;
                          volumeBtn.value = audio.volume;
                          
                      }
  
                  
                  }
  
  
              },
  
  
  
  
              loadCurrentSong() {
                  heading.textContent = this.currentSong.name;
                  cdThumb.style.background = `url('${this.currentSong.image}')`;
                  audio.src = `${this.currentSong.path}`;
  
                  // là khi load xong 1 bài mới xóa. chưa load xong thì không xóa được
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
                  this.currentSong = this.currentIndex;
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
              //             confirmVolume = confirm('Tăng âm lượng quá cao thời gian dài sẽ ảnh hưởng đến thính giác!')
              //             audio.volume = Number(vol.target.value);
              //             // _this.isVolumeUp= confirmVolume;
  
              //         } else {
              //             audio.volume = Number(vol.target.value);
              //         }
              //     }
              // },
  
              start() {
                  // Gán cấu hình config vào app
                  this.loadConfig();
  
                  // Định nghĩa currentIndex
                  this.defineProperties();
                  // Lắng nghe và xử lý sự kiện
                  this.handleEvent();
  
                  // tải bài hát hiện tại vào UI khi chạy ứng dụng
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