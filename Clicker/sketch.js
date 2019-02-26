// Interactive Scene
// Aric Leather
// Date:
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Declaring varoius variables before preload and setup
// Images / other loadable assets:
let cookie, coin, oven, rightArrow;
let gameFont;
let cookieGetArray = [];

// Load images used in game
function preload() {
  cookie = loadImage("assets/cookie1.png");
  coin = loadImage("assets/coin.png");
  oven = loadImage("assets/oven.png");
  rightArrow = loadImage("assets/rightarrow.png");
  gameFont = loadFont("assets/gameFont.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(60);
  //shopState = 1;
  textFont(gameFont);
}

// Declaring variables after preload and setup
// "Hover" variables and scalars:
let hoverCoin, hoverRightArrow;
let scalars = {
  // Click or hover based:
  clickScalar: 1,
  storeHoverScalar: 1,
  storeCloseHoverScalar: 1,
  menuButtonW: 0.16,
  menuButtonH: 0.08,

  // Image based:
  mainCookieScalar: 0.15,
  titleScreenCookie: 0.06,
  storeCoinScalar: 0.05,
  storeCloseScalar: 0.05,
  ovenScalar: 0.0002,

  // Text based:

};
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
  textSize(75);
  textAlign(CENTER, CENTER);
  text(titleText , width / 2, height * 0.2);

  // image: center - half the width of text - it's size (to be positioned right next to text) (opposite for second image)
  image(cookie, width / 2 - textWidth(titleText) / 2 - width * scalars.titleScreenCookie, height * 0.2, width * scalars.titleScreenCookie, width * scalars.titleScreenCookie);
  image(cookie, width / 2 + textWidth(titleText) / 2 + width * scalars.titleScreenCookie, height * 0.2, width * scalars.titleScreenCookie, width * scalars.titleScreenCookie);
  
  // if mouse hovering start, button darkens
  if (Math.abs(mouseX - width / 2) < width * scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2) < height * scalars.menuButtonH / 2) {
    hoverAlphaStart = 150;
  }
  else {
    hoverAlphaStart = 200;
  }
  // if mouse hovering options, button darkens
  if (Math.abs(mouseX - width / 2) < width * scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2 - height * 0.12) < height * scalars.menuButtonH / 2) {
    hoverAlphaOptions = 150;
  }
  else {
    hoverAlphaOptions = 200;
  }

  // menu buttons
  rectMode(CENTER);
  fill(hoverAlphaStart);
  strokeWeight(3);
  rect(width / 2, height / 2, width * scalars.menuButtonW, height * scalars.menuButtonH);
  fill(hoverAlphaOptions);
  rect(width / 2, height / 2 + height * 0.12, width * scalars.menuButtonW, height * scalars.menuButtonH);

  // text in menu buttons
  fill(0);
  textSize(30);
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
  image(cookie, width/2, height/2, width * scalars.mainCookieScalar * scalars.clickScalar, width * scalars.mainCookieScalar * scalars.clickScalar);

  // Draws text to screen
  textFont(gameFont);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(str(Math.floor(cookies)) + " Cookies" , width / 2, height * 0.9);

  if (frameCount % 6 === 0) {
    cookies += autoCookies / 10;
    cookieGetText = {
      num: String(cookies),
      xpos: random(width * 0.4, width * 0.6),
      ypos: height * 0.95,
      alphaval: 255,
    };
    cookieGetArray.push(cookieGetText);
  }
  cookieGet();

  if (shopState === 1) {
    shop();
  }
  else {
    // Make shop coin button enlarge upon hovering
    if (Math.abs(mouseX - width * 0.97) < width * scalars.storeCoinScalar / 2 && Math.abs(mouseY - height * 0.06) < width * scalars.storeCoinScalar / 2) {
      scalars.storeHoverScalar = 1.05;
    }
    else {
      scalars.storeHoverScalar = 1;
    }
    // Draw coin + text underneath
    image(coin, width * 0.97, height * 0.06, width * scalars.storeCoinScalar * scalars.storeHoverScalar, width * scalars.storeCoinScalar * scalars.storeHoverScalar);
    textSize(15);
    text("Store", width * 0.97, height * 0.06 + width * 0.035);
  }

  //cookieFall();
  //cookieFallAmount--;

  //text(frameRate(), width / 2, height * 0.1);

}

let tempText; 

function cookieGet() {
  textSize(15);
  textAlign(LEFT, CENTER);
  for(let i = 0; i < cookieGetArray.length; i++) {
    tempText = "+" + cookieGetArray[i].num 
    fill(0, cookieGetArray[i].alphaval);
    text(tempText, cookieGetArray[i].xpos, cookieGetArray[i].ypos);
    image(cookie, cookiegetArray[i].xpos + text, cookieGetArray[i].ypos, )
    cookieGetArray[i].alphaval -= 25.5;
    if (cookieGetArray[i].alphaval === 0) {
      cookieGetArray.splice(i, 1);
    }
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
  if (Math.abs(mouseX - width * 0.67) < width * scalars.storeCloseScalar / 2 && Math.abs(mouseY - height * 0.06) < width * scalars.storeCloseScalar / 2) {
    scalars.storeCloseHoverScalar = 1.05;
  }
  else {
    scalars.storeCloseHoverScalar = 1;
  }
  // Draw arrow + text underneath
  image(rightArrow, width * 0.67, height * 0.06, width * scalars.storeCloseScalar * scalars.storeCloseHoverScalar, width * scalars.storeCloseScalar * scalars.storeCloseHoverScalar);
  fill(0);
  textSize(15);
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
  image(oven, width * 0.775, height * 0.1, oven.width * width * scalars.ovenScalar, oven.height * width * scalars.ovenScalar);
  textSize(12);
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
    if (Math.abs(mouseX - width / 2) < width * scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2) < height * scalars.menuButtonH / 2) {
      gameState = 1;
    }
    if (Math.abs(mouseX - width / 2) < width * scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2 - height * 0.12) < height * scalars.menuButtonH / 2) {
      gameState = 1;
    }
  }
  else {
    // Increment cookie counter on click and begin "popping" animation
    if (Math.abs(mouseX - width / 2) < width * 0.075 && Math.abs(mouseY - height / 2) < width * 0.075) {
      cookies++;
      scalars.clickScalar += 0.1;
      constrain(scalars.clickScalar, 1, 1.25);
    }

    if (shopState === 1) {
      // Oven
      if (Math.abs(mouseX - width * 0.775) < oven.width * width * scalars.ovenScalar / 2 && Math.abs(mouseY - height * 0.1) < oven.width * width * scalars.ovenScalar / 2) {
        if (cookies >= ovenPrice) {
          cookies -= ovenPrice;
          ovenOwned++;
          autoCookies += 0.1;
        }
      }
      // Bakery
      else if (Math.abs(mouseX - width * 0.925) < width * 0.03 && Math.abs(mouseY - height * 0.1) < width * 0.03) {
        if (cookies >= bakeryPrice) {
          cookies -= bakeryPrice;
          bakeryOwned++;
          autoCookies += 1;
        }
      }
      else if (Math.abs(mouseX - width * 0.67) < width * 0.025 && Math.abs(mouseY - height * 0.06) < width * 0.025) {
        shopState = 0;
      }
      else {
        null;
      }
    }
    // Opens shop when arrow clicked
    else {
      if (Math.abs(mouseX - width * 0.97) < width * 0.025 && Math.abs(mouseY - height * 0.06) < width * 0.025) {
        shopState = 1;
      }
      else {
        null;
      }
    }
  }
}