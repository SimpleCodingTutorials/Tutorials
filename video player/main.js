let vidElement;
let isPaused = true;
let isMute = false;
let menuVisible = false;
let settingsClicked = false;
let sliderClicked = false;
let sliderWidth;
let k= 1920/1080;
let canvasWidth,canvasHeight;
let originalVolume;
let myCanvas;
let mediaControlContainer;
let soundSlider;

function setup() {
  canvasWidth = windowWidth * 0.7;
  vidElement = createVideo("test1.mp4");
  vidElement.hide();
  document.body.addEventListener("mouseover",mouseOver);
  document.body.addEventListener("mouseout",mouseOut);

  createControlBar();
  canvasHeight = canvasWidth/k;
  myCanvas = createCanvas(canvasWidth,canvasHeight);
  myCanvas.mouseClicked(togglePlay);
  forward = createDiv("");
  forward.addClass("forward");
  forward.html(`<i class="fa-solid fa-forward"></i>`);
  backward = createDiv("");
  backward.addClass("backward");
  backward.html(`<i class="fa-solid fa-backward"></i>`);
  playPause = createDiv("");
  playPause.addClass("playPause");
  canvasContainer = createDiv("");
  canvasContainer.addClass("canvasContainer");
  canvasContainer.child(myCanvas);
  canvasContainer.child(forward);
  canvasContainer.child(backward);
  canvasContainer.child(playPause);

  mainContainer = createDiv("");
  mainContainer.addClass("mainContainer");
  mainContainer.child(mediaControlContainer);
  mainContainer.child(canvasContainer);
}

function createControlBar() {
  mediaControlContainer = createDiv("");
  mediaControlContainer.style("width",canvasWidth+"px");
  mediaControlContainer.addClass("mediaControlContainer");

  seekBar = createSlider(0,1,0,0.001);
  seekBar.input(seekVideo);
  seekBar.addClass("seekBar");

  playbackControlsLeft = createDiv("");
  playbackControlsLeft.addClass("playbackControlsLeft");
  playbackControlsLeft.elt.addEventListener("mouseleave",playbackControlsLeftMouseOut);

  playbackControlsRight = createDiv("");
  playbackControlsRight.addClass("playbackControlsRight");

  playbackControls = createDiv("");
  playbackControls.addClass("playbackControls");

  playButton = createDiv(`<i class="fa-solid fa-play" style="color:white"></i>`);
  playButton.mousePressed(togglePlay);
  playButton.addClass("icon");

  soundButton = createDiv(`<img src="volume.png">`);
  soundButton.mousePressed(toggleSound);
  soundButton.mouseOver(showSoundSlider);
  soundButton.addClass("icon");

  soundSlider = createSlider(0,1,1,0.001);
  soundSlider.addClass("soundSlider");
  soundSlider.changed(volumeChanged);

  timeText = createDiv("");
  timeText.addClass("icon");
  timeText.style("width","140px");

  fullScreenButton = createDiv(`<img src="full-screen.png">`);
  fullScreenButton.addClass("icon");
  fullScreenButton.mousePressed(toggleFullScreen);

  miniPlayerButton = createDiv(`<img src="miniPlayer.png">`);
  miniPlayerButton.addClass("icon");
  miniPlayerButton.mousePressed(togglePictureInPicture);

  gearButton = createDiv(`<i class="fa-solid fa-gear" style="color:white;font-size:20px"></i>`);
  gearButton.addClass("icon");
  gearButton.mousePressed(openMenu);

  settingsMenu = createDiv("");
  settingsMenu.addClass("menu");
  settingsMenu.html(`<div>Playback Speed</div><div><span class="tick"></span><span>0.25<span></div><div><span class="tick"></span><span>0.5<span></div><div><span class="tick"></span><span>0.75<span></div><div><span class="tick"><i class="fa-solid fa-check"></i></span><span>Normal<span></div><div><span class="tick"></span><span>1.25<span></div><div><span class="tick"></span><span>1.5<span></div><div><span class="tick"></span><span>1.75<span></div><div ><span class="tick"></span><span>2<span></div>`
  );

  let menuItems = settingsMenu.elt.children;
  for (let i=1;i<menuItems.length;i++) {
    menuItems[i].addEventListener("click",settingsMenuItemSelect);
  }

  playbackControlsLeft.child(playButton);
  playbackControlsLeft.child(soundButton);
  playbackControlsLeft.child(soundSlider);
  playbackControlsLeft.child(timeText);

  playbackControlsRight.child(gearButton);
  playbackControlsRight.child(miniPlayerButton);
  playbackControlsRight.child(fullScreenButton);

  playbackControls.child(playbackControlsLeft);
  playbackControls.child(playbackControlsRight);

  mediaControlContainer.child(seekBar);
  mediaControlContainer.child(playbackControls);
  mediaControlContainer.child(settingsMenu);
}

function draw() {
  background(0);
  let vidWidth = vidElement.width;
  let vidHeight = vidElement.height;
  let vidAspectRatio = vidWidth/vidHeight;
  let canvasAspectRatio = width/height;
  let drawHeight,drawWidth;

  if(vidAspectRatio>canvasAspectRatio) {
    drawWidth = width;
    drawHeight = width/vidAspectRatio;
  } else {
    drawHeight = height;
    drawWidth = height * vidAspectRatio;
  }
  if(!document.pictureInPictureElement) {
    image(vidElement,0,(height-drawHeight)/2,drawWidth,drawHeight);
  }
  if(!isPaused) {
    let seekBarValue = vidElement.time()/vidElement.duration();
    seekBar.value(seekBarValue);
  }

  let totalDuration = vidElement.duration();
  let currentTime = vidElement.time();
  timeText.html(formatTime(currentTime)+" / " + formatTime(totalDuration));

  let volume = soundSlider.value();
  vidElement.volume(volume);

  seekBar.elt.style.setProperty("--thumb-opacity","0");
  if(vidElement.duration()=== vidElement.time()) {
    isPaused = false;
    seekBar.elt.style.setProperty("--thumb-opacity","1");
    togglePlay();
  }
  menuVisible ? settingsMenu.style("display","block"):settingsMenu.style("display","none");
}

function seekVideo() {
  let seekTime = seekBar.value()*vidElement.duration();
  vidElement.time(seekTime);
}

function playbackControlsLeftMouseOut() {
  if(isPaused)
    soundSlider.style("display","none");
}

function togglePlay() {
  if(!isPaused) {
    playPause.html(`<i class="fa-solid fa-pause"></i>`);
    vidElement.pause();
    isPaused = true;
    playButton.html(`<i class="fa-solid fa-play" style="color:white"></i>`);
  } else {
    playPause.html(`<i class="fa-solid fa-play" style="color:white"></i>`);
    vidElement.play();
    isPaused = false;
    soundSlider.style("display","none");
    playButton.html(`<i class="fa-solid fa-pause" style="color:white"></i>`);
  }
  playAnimation("playPause");
}

function showSoundSlider() {
  soundSlider.style("display","block");
}

function toggleSound() {
  if(!isMute) {
    soundButton.html(`<img src="mute.png">`);
    originalVolume = soundSlider.value();
    soundSlider.value(0);
    isMute = true;
  } else {
    soundButton.html(`<img src="volume.png">`);
    soundSlider.value(originalVolume);
    isMute = false;
  }
}

function volumeChanged() {
  soundSlider.value() === 0 ? soundButton.html(`<img src="mute.png">`) : soundButton.html(`<img src="volume.png">`);
}

function toggleFullScreen() {
  let fs = fullscreen();
  fullscreen(!fs);
  mediaControlContainer.style("opacity","0");
  menuVisible = false;
}

function windowResized() {
  if(fullscreen()) {
    resizeCanvas(windowWidth,0.995*windowHeight);
    mediaControlContainer.style("width","100%");
    fullScreenButton.html(`<img src="exit-full-screen.png">`);
  } else {
    if(isPaused)
      mediaControlContainer.style("opacity","1");
    resizeCanvas(canvasWidth,canvasHeight);
    mediaControlContainer.style("width",width+"px");
    fullScreenButton.html(`<img src="full-screen.png">`);
  }
}

function togglePictureInPicture() {
  if(document.pictureInPictureElement) {
    document.exitPictureInPicture().catch((error)=>{
      console.log(error);
    });
  } else if (vidElement.elt.requestPictureInPicture) {
    vidElement.elt.requestPictureInPicture().catch((error)=>{
      console.log(error);
    });
  }
  vidElement.elt.onleavepictureinpicture = e => {
    const was_playing = !vidElement.elt.paused;
    setTimeout(()=>{
      if(!vidElement.elt.paused) {
        isPaused = true;
        togglePlay();
      } else if (was_playing) {
        isPaused = false;
        togglePlay();
      } else {
        isPaused = false;
        togglePlay();
      }
    },0);
  }
}

function openMenu() {
  settingsClicked = true;
  menuVisible = !menuVisible;
}

function formatTime(seconds) {
  let hours = Math.floor(seconds/3600);
  let minutes = Math.floor((seconds - hours*3600)/60);
  seconds = Math.floor(seconds- hours * 3600 - minutes*60);
  if(hours>0) {
    return nf(hours,2)+":" +nf(minutes,2)+":"+nf(seconds,2);
  } else {
    return nf(minutes,2)+":"+nf(seconds,2);
  }
}

function settingsMenuItemSelect() {
  let playbackSpeed = this.getElementsByTagName("span")[1].innerText;
  playbackSpeed = playbackSpeed === "Normal" ? 1 : parseFloat(playbackSpeed);
  vidElement.speed(playbackSpeed);

  let tickElements = document.getElementsByClassName("tick");
  for(let i=0; i<tickElements.length; i++) {
    tickElements[i].innerHTML = "";
  }
  this.getElementsByTagName("span")[0].innerHTML = `<i class="fa-solid fa-check"></i>`;
  menuVisible = !menuVisible;
}

function mouseClicked() {
  if(!settingsClicked) menuVisible = false;
  settingsClicked = false;
}

function mouseOver() {
  mediaControlContainer.style("opacity","1");
}

function mouseOut() {
  if(menuVisible) {
    mediaControlContainer.style("opacity","1");
  } else if(!isPaused)
    mediaControlContainer.style("opacity","0");
}

function keyPressed() {
  let currentTime = vidElement.time();
  if(keyCode === LEFT_ARROW) {
    vidElement.time(currentTime-5);
    seekBar.value((currentTime-5)/vidElement.duration());
    playAnimation("backward");
  }
  if(keyCode === RIGHT_ARROW) {
    vidElement.time(currentTime+5);
    seekBar.value((currentTime+5)/vidElement.duration());
    playAnimation("forward");
  }
  if(keyCode === 32) {
    togglePlay();
  }
}

function playAnimation(elementClassName) {
  let element = document.querySelector('.'+elementClassName);
  element.style.animation = "none";
  void element.offsetWidth;
  element.style.animation = "appear-disappear 1s";
}

































