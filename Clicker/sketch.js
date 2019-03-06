// Interactive Scene
// Aric Leather
// Date: March 4, 2019
// 
// Mouse incorporation: clicking on cookie and store stuff, keyboard incorporation: press R key to reset game
//
// Extra for Experts:
// - My game can successfully handle window resizing, in terms of scaling and canvas
// - My game incorporates sound effects

// Declaring varoius variables before preload and setup
let cookie, coin, oven, rightArrow; // Images
let coinSound, popSound; // Sounds
let gameFont; // Fonts
let scalars; // Scalars
let cookieGetAlpha, cookieGetX, cookieGetY, tempText;
let resetAlpha = 0;

// Load images used in game
function preload() {
  // Images
  cookie = loadImage("assets/cookie1.png");
  coin = loadImage("assets/coin.png");
  oven = loadImage("assets/oven.png");
  rightArrow = loadImage("assets/rightarrow.png");

  // Sounds and fonts
  gameFont = loadFont("assets/gameFont.ttf");
  coinSound = loadSound("assets/coinSound.wav");
  popSound = loadSound("assets/pop.ogg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(60);
  //shopState = 1;
  textFont(gameFont);
  initVar();
}

function initVar() {
  scalars = {
    // Click or hover based:
    clickScalar: 1,
    storeHoverScalar: 1,
    storeCloseHoverScalar: 1,

    // Buttons
    menuButtonW: width * 0.16,
    menuButtonH: height * 0.08,
  
    // Image based:
    mainCookieScalar: width * 0.15,
    titleScreenCookie: width * 0.06,
    storeCoinScalar: width * 0.05,
    storeCloseScalar: width * 0.05,
    ovenScalar: width * 0.0002,
    cookieGetScalar: width * 0.025,
  
    // Text based:
    textScalar: width / 1920,
  
  };
}

// Declaring variables after preload and setup
// "Hover" variables and scalars:
let hoverCoin, hoverRightArrow;

let cookieFallAmount = 0;
// Game states:
let gameState = 0;
let shopState = 0;
// Clicker game variables:
let cookies = 0;
let autoCookies = 0;

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
  textSize(75 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(titleText , width / 2, height * 0.2);

  // image: center - half the width of text - it's size (to be positioned right next to text) (opposite for second image)
  image(cookie, width / 2 - textWidth(titleText) / 2 - scalars.titleScreenCookie, height * 0.2, scalars.titleScreenCookie, scalars.titleScreenCookie);
  image(cookie, width / 2 + textWidth(titleText) / 2 + scalars.titleScreenCookie, height * 0.2, scalars.titleScreenCookie, scalars.titleScreenCookie);
  
  // if mouse hovering start, button darkens
  if (Math.abs(mouseX - width / 2) < scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2) < scalars.menuButtonH / 2) {
    hoverAlphaStart = 150;
  }
  else {
    hoverAlphaStart = 200;
  }
  // if mouse hovering options, button darkens
  if (Math.abs(mouseX - width / 2) < scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2 - height * 0.12) < scalars.menuButtonH / 2) {
    hoverAlphaOptions = 150;
  }
  else {
    hoverAlphaOptions = 200;
  }

  // menu buttons
  rectMode(CENTER);
  fill(hoverAlphaStart);
  strokeWeight(3);
  rect(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH);
  fill(hoverAlphaOptions);
  rect(width / 2, height / 2 + height * 0.12, scalars.menuButtonW, scalars.menuButtonH);

  // text in menu buttons
  fill(0);
  textSize(30 * scalars.textScalar);
  text("Start", width / 2, height / 2);
  text("Options", width / 2, height / 2 + height * 0.12);
}

let cookieGetText;

function mainGame() { // gameState 1
  background(30, 144, 255);

  // This creates the "popping" animation on click
  if (scalars.clickScalar > 1) {
    scalars.clickScalar -= 1/10 * (scalars.clickScalar - 1);
  }
  constrain(scalars.clickScalar, 1, 1.25);

  // Draws main cookie image to screen
  tint(255, 255);
  fill(0, 255);
  image(cookie, width/2, height/2, scalars.mainCookieScalar * scalars.clickScalar, scalars.mainCookieScalar * scalars.clickScalar);

  // Draws text to screen
  textFont(gameFont);
  textSize(40 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(str(Math.floor(cookies)) + " Cookies" , width / 2, height * 0.9);

  // Draws the "+ Cookie Amount" thing on screen when autoCookies is greater than 0 
  if (frameCount % 15 === 0) {
    cookies += autoCookies / 4;
    if (frameCount % 60 === 0 && autoCookies > 0) {
      // Random location under cookie total
      cookieGetX = random(width * 0.4, width * 0.6);
      cookieGetY = height * 0.955;
      cookieGetAlpha = 255;
      // Temporary variable for the "+" and cookies just gained
      tempText = "+" + autoCookies.toFixed(1);
    }
  }
  if (cookieGetAlpha > 0) {
    // Draws text to screen with a cookie beside it, for cookie gains
    fill(0, cookieGetAlpha);
    textSize(15 * scalars.textScalar);
    text(tempText, cookieGetX, cookieGetY);
    tint(255, cookieGetAlpha);
    image(cookie, cookieGetX + textWidth(tempText) , cookieGetY, scalars.cookieGetScalar, scalars.cookieGetScalar);
    cookieGetAlpha -= 8.5;
  }

  if (shopState === 1) {
    shop();
  }
  else {
    // Make shop coin button enlarge upon hovering
    if (Math.abs(mouseX - width * 0.97) < scalars.storeCoinScalar / 2 && Math.abs(mouseY - height * 0.06) < scalars.storeCoinScalar / 2) {
      scalars.storeHoverScalar = 1.05;
    }
    else {
      scalars.storeHoverScalar = 1;
    }
    // Draw coin + text underneath
    tint(255, 255);
    image(coin, width * 0.97, height * 0.06, scalars.storeCoinScalar * scalars.storeHoverScalar, scalars.storeCoinScalar * scalars.storeHoverScalar);
    textSize(15 * scalars.textScalar);
    textAlign(CENTER, CENTER);
    fill(0, 255);
    text("Store", width * 0.97, height * 0.06 + width * 0.035);
  }

  //cookieFall();
  //cookieFallAmount--;

  //text(frameRate(), width / 2, height * 0.1);

  if (resetAlpha > 0) {
    textSize(50 * scalars.textScalar);
    fill(0, resetAlpha);
    text("Game reset!", width / 2, height * 0.2);
    resetAlpha -= 8.5;
  }
}

// variables used for shop()
let ovenPrice = 10;
let ovenOwned = 0;
let bakeryPrice = 150;
let bakeryOwned = 0;
let i, j;

function shop() {
  // Shop background & lines
  rectMode(CORNER);
  fill(139, 82, 45, 200);
  noStroke();

  // Close shop arrow
  if (Math.abs(mouseX - width * 0.67) < scalars.storeCloseScalar / 2 && Math.abs(mouseY - height * 0.06) < scalars.storeCloseScalar / 2) {
    scalars.storeCloseHoverScalar = 1.05;
  }
  else {
    scalars.storeCloseHoverScalar = 1;
  }
  // Draw arrow + text underneath
  tint(255, 255);
  image(rightArrow, width * 0.67, height * 0.06, scalars.storeCloseScalar * scalars.storeCloseHoverScalar, scalars.storeCloseScalar * scalars.storeCloseHoverScalar);
  fill(0);
  textSize(15 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text("Close\nStore", width * 0.67, height * 0.06 + width * 0.035);

  // Draws the checkerboard shop pattern
  for(i = 0; i < 8; i++) {
    for(j = 0; j < 4; j++) {
      if ((i + j) % 2 === 0) {
        fill(70, 130, 180);
      }
      else {
        fill(135, 206, 250);
      }
      rect(width * (0.7 + j * 0.075), height * i * 0.125, width * (0.7 + (j + 1) * 0.075), height * (i + 1) * 0.125);
    }
  }

  stroke(0);
  line(width * 0.7, height * 0.25, width, height * 0.25);
  line(width * 0.7, height * 0.5, width, height * 0.5);
  line(width * 0.7, height * 0.75, width, height * 0.75);

  // Text in shop() displays name of upgrade, cost, how many cookies per second given, and owned number
  // Oven
  if (cookies < ovenPrice) {
    tint(50);
  }
  else {
    tint(255);
  }
  image(oven, width * 0.775, height * 0.1, oven.width * scalars.ovenScalar, oven.height * scalars.ovenScalar);
  textSize(12 * scalars.textScalar);
  textAlign(CENTER, TOP);
  fill(0);
  noStroke();
  text("Oven\nCost: " + str(ovenPrice) + " Cookies\n0.1 CPS\nOwned: " + str(ovenOwned), width * 0.775, height * 0.1 + width * 0.03 * 1.1);

  // Bakery
  if (cookies < bakeryPrice) {
    tint(50);
  }
  else {
    tint(255);
  }
  image(cookie, width * 0.925, height * 0.1, width * 0.06, width * 0.06);
  text("Bakery\nCost: " + str(bakeryPrice) + " Cookies\n1 CPS\nOwned: " + str(bakeryOwned), width * 0.925, height * 0.1 + width * 0.03 * 1.1);
}

function cookieFall() {
  tint(255, 80);
  image(cookie, 100, 100 - cookieFallAmount, width * 0.06, width * 0.06);
}

function mouseClicked() {
  if (gameState === 0) {
    if (Math.abs(mouseX - width / 2) < scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2) < scalars.menuButtonH / 2) {
      gameState = 1;
    }
    if (Math.abs(mouseX - width / 2) < scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2 - height * 0.12) < scalars.menuButtonH / 2) {
      gameState = 1;
    }
  }
  else {
    // Increment cookie counter on click and begin "popping" animation
    if (Math.abs(mouseX - width / 2) < scalars.mainCookieScalar / 2 && Math.abs(mouseY - height / 2) < scalars.mainCookieScalar / 2) {
      cookies++;
      scalars.clickScalar += 0.1;
      constrain(scalars.clickScalar, 1, 1.25);
      popSound.play();
    }

    if (shopState === 1) {
      // Oven
      if (Math.abs(mouseX - width * 0.775) < oven.width * scalars.ovenScalar / 2 && Math.abs(mouseY - height * 0.1) < oven.width * scalars.ovenScalar / 2) {
        if (cookies >= ovenPrice) {
          cookies -= ovenPrice;
          ovenOwned++;
          autoCookies += 0.1;
          coinSound.play();
        }
      }
      // Bakery
      else if (Math.abs(mouseX - width * 0.925) < width * 0.03 && Math.abs(mouseY - height * 0.1) < width * 0.03) {
        if (cookies >= bakeryPrice) {
          cookies -= bakeryPrice;
          bakeryOwned++;
          autoCookies += 1;
          coinSound.play();
        }
      }
      else if (Math.abs(mouseX - width * 0.67) < scalars.storeCloseScalar / 2 && Math.abs(mouseY - height * 0.06) < scalars.storeCloseScalar / 2) {
        shopState = 0;
      }
      else {
        null;
      }
    }
    // Opens shop when arrow clicked
    else {
      if (Math.abs(mouseX - width * 0.97) < scalars.storeCoinScalar / 2 && Math.abs(mouseY - height * 0.06) < scalars.storeCoinScalar / 2) {
        shopState = 1;
      }
      else {
        null;
      }
    }
  }
}

function keyPressed() {
  if (gameState === 1) {
    if (key === "r") {
      // Resets game upon pressing "r" on keyboard. resetAlpha is used in mainGame() to draw "Game reset!" to screen which fades away
      cookies = 0;
      autoCookies = 0;
      ovenOwned = 0;
      bakeryOwned = 0;
      resetAlpha = 255;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initVar();
}
