// Interactive Scene
// Aric Leather
// Date:
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Declaring varoius variables
let cookie;
let gameFont;
let cookies = 0;
let autoCookies = 0;
let clickScalar = 1;
let cookieFallAmount = 0;
let gameState = 0;
let shopState = 0;

// Load images used in game
function preload() {
  cookie = loadImage("assets/cookie1.png");
  gameFont = loadFont("assets/gameFont.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(60);
}

function draw() {
  if (gameState === 0) {
    menu();
  } 
  else {
    mainGame();
  }
}

// Variables used for menu()
let titleText = "Cookie Clicker"; // strings
let hoverAlphaStart;              // button rectangle fills
let hoverAlphaOptions;

function menu() { // gameState 0
  background(30, 144, 255);

  // Game title text
  fill(0);
  textFont(gameFont);
  textSize(75);
  textAlign(CENTER, CENTER);
  text(titleText , width / 2, height * 0.2);

  // image: center - half the width of text - it's size (to be positioned right next to text) (opposite for second image)
  image(cookie, width / 2 - textWidth(titleText) / 2 - width * 0.06, height * 0.2, width * 0.06, width * 0.06);
  image(cookie, width / 2 + textWidth(titleText) / 2 + width * 0.06, height * 0.2, width * 0.06, width * 0.06);
  
  // if mouse hovering start, button darkens
  if (Math.abs(mouseX - width / 2) < width * 0.08 && Math.abs(mouseY - height / 2) < height * 0.04) {
    hoverAlphaStart = 150;
  }
  else {
    hoverAlphaStart = 200;
  }
  // if mouse hovering options, button darkens
  if (Math.abs(mouseX - width / 2) < width * 0.08 && Math.abs(mouseY - height / 2 - height * 0.12) < height * 0.04) {
    hoverAlphaOptions = 150;
  }
  else {
    hoverAlphaOptions = 200;
  }

  // menu buttons
  rectMode(CENTER);
  fill(hoverAlphaStart);
  strokeWeight(3);
  rect(width / 2, height / 2, width * 0.16, height * 0.08);
  fill(hoverAlphaOptions);
  rect(width / 2, height / 2 + height * 0.12, width * 0.16, height * 0.08);

  // text in menu buttons
  fill(0);
  textSize(30);
  text("Start", width / 2, height / 2);
  text("Options", width / 2, height / 2 + height * 0.12);
}

function mainGame() { // gameState 1
  background(30, 144, 255);

  // This creates the "popping" animation on click
  if (clickScalar > 1) {
    clickScalar -= 1/10 * (clickScalar - 1);
  }
  constrain(clickScalar, 1, 1.25);

  // Draws main cookie image to screen
  tint(255, 255);
  image(cookie, width/2, height/2, width * 0.15 * clickScalar, width * 0.15 * clickScalar);

  // Draws text to screen
  textFont(gameFont);
  textSize(40);
  textAlign(CENTER);
  text(str(Math.floor(cookies)) + " Cookies" , width / 2, height * 0.9);

  if (frameCount % 6 === 0) {
    cookies += autoCookies / 10;
  }

  if (shopState === 1) {
    shop();
  }

  //cookieFall();
  //cookieFallAmount--;

  //text(frameRate(), width / 2, height * 0.1);

}

function shop() {
  image(cookie, width * 0.7, height * 0.1, width * 0.06, width * 0.06);
}

function cookieFall() {
  tint(255, 80);
  image(cookie, 100, 100 - cookieFallAmount, width * 0.06, width * 0.06);
}

function mouseClicked() {
  if (gameState === 0) {
    if (Math.abs(mouseX - width / 2) < width * 0.08 && Math.abs(mouseY - height / 2) < height * 0.04) {
      gameState = 1;
    }
    if (Math.abs(mouseX - width / 2) < width * 0.08 && Math.abs(mouseY - height / 2 - height * 0.12) < height * 0.04) {
      gameState = 1;
    }
  }
  else {
    // Increment cookie counter on click and begin "popping" animation
    if (Math.abs(mouseX - width / 2) < width * 0.075 && Math.abs(mouseY - height / 2) < width * 0.075) {
      cookies++;
      clickScalar += 0.1;
      constrain(clickScalar, 1, 1.25);
    }

    if (shopState === 1) {
      if (Math.abs(mouseX - width * 0.7) < width * 0.03 && Math.abs(mouseY - height * 0.1) < width * 0.03) {
        if (cookies >= 10) {
          cookies -= 10;
          autoCookies += 1;
        }
      }
    }
  }
}