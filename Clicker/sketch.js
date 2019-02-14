// Interactive Scene
// Aric Leather
// Date:
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let cookie;
let cookies = 0;
let clickScalar = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(60);
}

function preload() {
  cookie = loadImage('assets/cookie1.png')
}

function draw() {
  if (clickScalar > 1) {
    clickScalar -= (1/10) * (clickScalar - 1)
  }
  constrain(clickScalar, 1, 1.25)
  
  background(133, 169, 226);
  image(cookie, width/2, height/2, cookie.width * clickScalar, cookie.height * clickScalar)
  text(cookies.toString() + " Cookies" , width - 60, height - 50)
}

function mouseClicked() {
	cookies++
  clickScalar += 0.1 
  constrain(clickScalar, 1, 1.25)
}
