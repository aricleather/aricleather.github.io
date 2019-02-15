// Interactive Scene
// Aric Leather
// Date:
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Declaring varoius variables
let cookie;
let cookies = 0;
let clickScalar = 1;
let cookieFallAmount = 0;

// Load images used in game
function preload() {
  cookie = loadImage('assets/cookie1.png');
  gameFont = loadFont('assets/gameFont.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(60);
}

function draw() {
  // This creates the "popping" animation on click
  if (clickScalar > 1) {
    clickScalar -= (1/10) * (clickScalar - 1)
  }
  constrain(clickScalar, 1, 1.25);
  
  background(30, 144, 255);
  // Draws image to screen
  image(cookie, width/2, height/2, width * 0.15 * clickScalar, width * 0.15 * clickScalar);

  // Draws text to screen
  textFont(gameFont);
  textSize(75);
  textAlign(CENTER);
  text(str(cookies) + " Cookies" , width / 2, height * 0.9);

  cookieFall();
  cookieFallAmount--;
}

function mouseClicked() {
  // Increment cookie counter on click and begin "popping" animation
	cookies++;
  clickScalar += 0.1;
  constrain(clickScalar, 1, 1.25);

}

function cookieFall() {
  tint(255, 200)
  image(cookie, 100, 100 - cookieFallAmount, width * 0.06, width *0.06);
}