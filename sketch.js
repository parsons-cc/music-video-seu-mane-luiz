var song;
var info;
var fft;
var amplitude;
var wave;

// color vars
var nightSky;
var daySky;
var nightLines;
var dayLines;
var lineColor;

// start volume at 0
var volume = 0;
var ellipseX;
var ellipseY;

function preload() {
  // load the sound file!
  info = loadJSON('assets/description.json');
  song = loadSound('https://dl.dropboxusercontent.com/u/2100102/parsons-cc/seu-mane-luiz.mp3');
}

function setup() {
  console.log('info', info);

  // create full-screen canvas
  createCanvas(windowWidth, windowHeight);
  // let's set the volume to the initial value of `volume` (0)
  song.setVolume(volume);
  // start the song in loop mode
  song.loop();
  // initialize the FFT spectrom analyzer
  fft = new p5.FFT();

  // set colors
  lightSky = color('yellow');
  darkSky = color('blue');
  lightLine = color('red');
  darkLine = color('black');
}

function draw() {
  var ellipseBase;
  var radius;
  var offset;

  // set `volume` variable based on mouse positions
  volume = map(mouseY, height, 0, 0, 1);
  // set the song volume
  song.setVolume(volume);

  // set background color as a blend between `darkSky` and `lightSky`
  // based on the current volume
  background(lerpColor(darkSky, lightSky, volume));

  // only want to do this stuff if the song is playing
  if(song.isPlaying()) {
    wave = fft.waveform();

    push();
      lineColor = lerpColor(darkLine, lightLine, volume);

      // set shape styling `with lineColor` as stroke
      stroke(lineColor);
      strokeWeight(1);
      noFill();

      // set elipse center based on mouseX, but keep it confined
      // within the middle 2/3 of the screen
      ellipseX = map(mouseX, 0, width, width * 1/3, width * 2/3);
      ellipseY = map(mouseY, 0, height, height * 1/3, height * 2/3);

      // the base size of our ellipse, the size of the center
      ellipseBase = map(volume, 0, 1, 50, 200);

      // loop through wave datapoints, skipping to every 15th one
      for (var i = 0; i< wave.length; i=i+15){

        // these are the x, y coordinates if we were drawing the wave as a line
        radius = map(i, 0, wave.length, 0, 1.5 * width) + ellipseBase;
        offset = map( wave[i], -1, 1, -1/2 * height, 1/2 * height);

        // draw an ellipse based on the mouse position and radius/offset
        // calculated from the waveform
        ellipse( ellipseX, ellipseY, radius + offset, radius + offset );
      }
    pop();
  }

  drawOcean(volume);

  if(!song.isPlaying()) {
    push();
    noStroke();
    fill(0);
    textStyle(BOLD);
    textSize(20);
    text(info.description, 1/5 * width, 1/5 * width, 3/5 * width, 3/5 * width);
    pop();
  }

}

function drawOcean(volume) {
  var h = 242;
  var s = map(volume, 0, 1, 20, 70);
  var l = map(volume, 0, 1, 20, 86);
  var oceanColor


  push();
  // change color mode to HSL (hue, saturation, lightness)
    colorMode(HSL);
    oceanColor = color(h, s, l);
    fill(oceanColor);
    noStroke();

    // draw a rectangle across the bottom 1/3 of screen
    rect(0, 2/3 * height, width, 2/3 * height);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if(key === ' ') {
    if(song.isPaused()) {
      song.play();
    } else {
      song.pause();
    }
  }
}
