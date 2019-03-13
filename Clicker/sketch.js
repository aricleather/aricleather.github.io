// Interactive Scene
// Aric Leather
// Date: March 4, 2019
// 
// Mouse incorporation: clicking on cookie and store stuff, keyboard incorporation: press R key to reset game
//
// Extra for Experts:
// - My game can successfully handle window resizing, in terms of scaling and canvas
// - My game incorporates sound effects

// GLOBAL VARIABLES
// Game content
let cookie, coin, oven, bakery, rightArrow, gameCursor; // Images
let coinSound, popSound; // Sounds
let gameFont; // Fonts
let shopGraphic; // Graphics

// Position / scaling variables
let scalars; // Scalars used throughout code definied in initVar()
let cookieGetAlpha; // Alpha / transparency values
let resetAlpha = 0; 
let cookieGetX, cookieGetY; // Position values
let cookieFallAmount = 0;
let scroll = 0;

// Game states:
let gameState = 0;
let shopState = 0;

// Clicker game variables:
let cookies = 0;
let autoCookies = 0;
let lastMillis = 0;
let increments = 0;
let shopItems;

// Variables used for menu()
let titleText = "Cookie Clicker"; // strings
let hoverFillStart = 200;         // button rectangle fills
let hoverFillOptions = 200;

// variables used for shop()
let ovenPrice = 10;
let ovenOwned = 0;
let bakeryPrice = 150;
let bakeryOwned = 0;
let i, j;

let cookieGetText;
let tempText;

// Load content used in game
function preload() {
  // Images
  cookie = loadImage("assets/cookie1.png");
  coin = loadImage("assets/coin.png");
  oven = loadImage("assets/oven.png");
  rightArrow = loadImage("assets/rightarrow.png");
  gameCursor = loadImage("assets/cursor.png");
  bakery = loadImage("assets/bakery.png");

  // Sounds and fonts
  gameFont = loadFont("assets/gameFont.ttf");
  coinSound = loadSound("assets/coinSound.wav");
  popSound = loadSound("assets/pop.ogg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont); // Font used throughout whole game
  imageMode(CENTER);
  initVar();
  generateGraphics();
  cursor(gameCursor);
}

function initVar() {
  scalars = {
    // Click or hover based:
    clickScalar: 1,
    storeHoverScalar: 1,
    storeCloseHoverScalar: 1,

    // Animation based:
    menuAnimScalar: 1,
    menuAnimSpeed: 0.008,

    // Buttons:
    menuButtonW: width * 0.16,
    menuButtonH: height * 0.08,
  
    // Image based:
    mainCookieScalar: width * 0.15,
    titleScreenCookie: width * 0.06,
    storeCoinScalar: width * 0.05,
    storeCloseScalar: width * 0.05,
    cookieGetScalar: width * 0.025,
  
    // Text based:
    textScalar: width / 1920,
  };
  
  shopItems = [
    { name: "Oven",
      text: "",
      image: oven,
      width: oven.width * width * 0.0002,
      height: oven.height * width * 0.0002,
      price: 10,
      cps: 0.1,
      owned: 0,},
    { name: "Bakery",
      text: "",
      image: bakery,
      width: bakery.width * width * 0.0002,
      height: bakery.height * width * 0.0002,
      price: 150,
      cps: 1,
      owned: 0,}
  ];
}

function generateGraphics() {
  let testNum = width * 0.3;
  shopGraphic = createGraphics(testNum, height);
  shopGraphic.strokeWeight(testNum/80);
  for(let i = 0; i < 100; i++) {
    shopGraphic.stroke(30 + 2.25 * i, 144 + i, 255);
    shopGraphic.line(testNum/100 * i, 0, testNum/100 * i, height);
  }
}

function draw() {
  background(30, 144, 255);
  textSize(15);
  text(frameRate().toFixed(0), 20, 20);
  if (gameState === 0) {
    menu();
  } 
  else {
    mainGame();
  }
}

function menu() { // gameState 0
  displayMenu();
  animateMenu();
  menuButtonHover();
}

function mainGame() { // gameState 1
  cookiePop();
  incrementCookies();
  displayGame();
  animateCookieGet();
  if (shopState === 1) {
    shop();
  }
  else {
    shopOpenButton();
  }
}

function displayGame() {
  // Draws main cookie image to screen
  tint(255, 255);
  fill(0, 255);
  image(cookie, width/2, height/2, scalars.mainCookieScalar * scalars.clickScalar, scalars.mainCookieScalar * scalars.clickScalar);

  // Draws cookie amount text to screen
  textFont(gameFont);
  textSize(40 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(str(Math.floor(cookies)) + " Cookies" , width / 2, height * 0.9);

  // "Game reset!" text when r clicked on keyboard
  if (resetAlpha > 0) {
    textSize(50 * scalars.textScalar);
    fill(0, resetAlpha);
    text("Game reset!", width / 2, height * 0.2);
    resetAlpha -= 8.5;
  }
}

function cookiePop() {
  // This creates the "popping" animation on click
  if (scalars.clickScalar > 1) {
    scalars.clickScalar -= 1/10 * (scalars.clickScalar - 1);
  }
  constrain(scalars.clickScalar, 1, 1.25);
}

function incrementCookies() {
  // Increments the cookie amount 4 times a second
  if (autoCookies > 0 && millis() - lastMillis > 250) {
    cookies += autoCookies / 4;
    lastMillis = millis();
    increments ++;
    if (increments % 4 === 0) {
      cookieGet();
    }
  } 
}

function cookieGet() {
  // This function creates the effect underneath cookie total showing cookies gained every second
  // Random location somewhere under cookie total text
  cookieGetX = random(width * 0.4, width * 0.6);
  cookieGetY = height * 0.955;
  cookieGetAlpha = 255;
  // Temporary variable for the "+" and cookies just gained in a string
  tempText = "+" + autoCookies.toFixed(1);
}

function animateCookieGet() {
  // Draws tempText to screen with a cookie beside it every second, showing how many cookies gained that second
  if (cookieGetAlpha > 0) {
    fill(0, cookieGetAlpha);
    textSize(15 * scalars.textScalar);
    text(tempText, cookieGetX, cookieGetY);
    tint(255, cookieGetAlpha);
    image(cookie, cookieGetX + textWidth(tempText) , cookieGetY, scalars.cookieGetScalar, scalars.cookieGetScalar);
    // Reduces alpha value so that it fades away
    cookieGetAlpha -= 8.5;
  }
}

function shopOpenButton() {
  shopOpenButtonHover();

  // Draw shop coin + "Store" text underneath
  tint(255, 255);
  image(coin, width * 0.97, height * 0.06, scalars.storeCoinScalar * scalars.storeHoverScalar, scalars.storeCoinScalar * scalars.storeHoverScalar);
  textSize(15 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  fill(0, 255);
  text("Shop", width * 0.97, height * 0.06 + width * 0.035);

}

function shopOpenButtonHover() {
  // Make shop coin button enlarge upon hovering
  if (Math.abs(mouseX - width * 0.97) < scalars.storeCoinScalar / 2 && Math.abs(mouseY - height * 0.06) < scalars.storeCoinScalar / 2) {
    scalars.storeHoverScalar = 1.05;
  }
  else {
    scalars.storeHoverScalar = 1;
  }
}

function displayMenu() {
  // Draws everything to screen in menu()
  // Game title text
  fill(0);
  textSize(75 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(titleText , width / 2, height * 0.2);

  // Cookies that are next to title text, positions based on length of titleText
  image(cookie, width / 2 - textWidth(titleText) / 2 - scalars.titleScreenCookie, height * 0.2, scalars.titleScreenCookie * scalars.menuAnimScalar, scalars.titleScreenCookie * scalars.menuAnimScalar);
  image(cookie, width / 2 + textWidth(titleText) / 2 + scalars.titleScreenCookie, height * 0.2, scalars.titleScreenCookie * scalars.menuAnimScalar, scalars.titleScreenCookie * scalars.menuAnimScalar);

  // Menu buttons
  rectMode(CENTER);
  fill(hoverFillStart);
  strokeWeight(3);
  stroke(0);
  rect(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH); // Start
  fill(hoverFillOptions);
  rect(width / 2, height / 2 + height * 0.12, scalars.menuButtonW, scalars.menuButtonH); // Options

  // Text inside menu buttons
  fill(0);
  noStroke();
  textSize(30 * scalars.textScalar);
  text("Start", width / 2, height / 2);
  text("Options", width / 2, height / 2 + height * 0.12);
}

function animateMenu() {
  // Animates the text and cookies on menu by alternating a scalar
  if (scalars.menuAnimScalar > 1.05) {
    scalars.menuAnimSpeed = -scalars.menuAnimSpeed;
    scalars.menuAnimScalar = 1.05;
  }
  else if (scalars.menuAnimScalar < 0.95) {
    scalars.menuAnimSpeed = -scalars.menuAnimSpeed;
    scalars.menuAnimScalar = 0.95;
  }
  scalars.menuAnimScalar += scalars.menuAnimSpeed;
}

function menuButtonHover() {
  // If mouse hovering start, button darkens
  if (Math.abs(mouseX - width / 2) < scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2) < scalars.menuButtonH / 2) {
    hoverFillStart = 150;
  }
  else {
    hoverFillStart = 200;
  }
  // If mouse hovering options, button darkens
  if (Math.abs(mouseX - width / 2) < scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2 - height * 0.12) < scalars.menuButtonH / 2) {
    hoverFillOptions = 150;
  }
  else {
    hoverFillOptions = 200;
  }
}

function shop() {
  // Close shop arrow
  displayShop();
  shopCloseButtonHover();
}

function displayShop() {
  // Draw "close shop" arrow + text underneath
  tint(255, 255);
  image(rightArrow, width * 0.67, height * 0.06, scalars.storeCloseScalar * scalars.storeCloseHoverScalar, scalars.storeCloseScalar * scalars.storeCloseHoverScalar);
  fill(0);
  textSize(15 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text("Close\nShop", width * 0.67, height * 0.06 + width * 0.035);

  // Draws gradient shop background from pre-rendered "shopGraphic"
  imageMode(CORNER);
  fill(30, 148, 255);
  image(shopGraphic, width * 0.7, 0);
  imageMode(CENTER);

  // Text in shop() displays name of upgrade, cost, how many cookies per second given, and owned number
  // Oven
  // tint(enoughCookies(cookies, ovenPrice));
  // image(oven, width * 0.775, height * 0.125 + scroll, oven.width * scalars.ovenScalar, oven.height * scalars.ovenScalar);
  // textSize(15 * scalars.textScalar);
  // textAlign(LEFT, CENTER);
  // fill(0);
  // noStroke();
  // text("Oven\nCost: " + str(ovenPrice) + " Cookies\n0.1 CPS\nOwned: " + str(ovenOwned), width * 0.83, height * 0.125 + scroll);

  // Bakery
  // tint(enoughCookies(cookies, bakeryPrice));
  // image(cookie, width * 0.775, height * 0.375 + scroll, width * 0.06, width * 0.06);
  // text("Bakery\nCost: " + str(bakeryPrice) + " Cookies\n1 CPS\nOwned: " + str(bakeryOwned), width * 0.83, height * 0.375 + scroll);

  let theItem;
  textSize(15 * scalars.textScalar);
  textAlign(LEFT, CENTER);
  fill(0);
  noStroke();
  for(let shopItem = 0; shopItem < shopItems.length; shopItem++) {
    theItem = shopItems[shopItem];
    tint(enoughCookies(cookies, theItem.price));
    image(theItem.image, width * 0.775, height * (2 * shopItem + 1) * 0.125, theItem.width, theItem.height);
    text(theItem.name + "\nCost: " + str(theItem.price) + " Cookies\n" + str(theItem.cps) + " CPS\nOwned: " + str(theItem.owned));
  }

  // Scroll bar
  fill(200);
  rectMode(CORNER);
  stroke(0);
  rect(width * 0.99, 0, width * 0.99, height);
  noStroke();
  fill(75);
  rect(width * 0.99 + 2, 2 + scroll, width * 0.01 - 2, height * 0.1);
}

function shopCloseButtonHover() {
  if (Math.abs(mouseX - width * 0.67) < scalars.storeCloseScalar / 2 && Math.abs(mouseY - height * 0.06) < scalars.storeCloseScalar / 2) {
    scalars.storeCloseHoverScalar = 1.05;
  }
  else {
    scalars.storeCloseHoverScalar = 1;
  }
}

function enoughCookies(cookies, price) {
  if (cookies < price) {
    return 50;
  }
  else {
    return 255;
  }
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
      resetAlpha = 255; // This is used when drawing "Game Reset!"
    }
  }
}

function mouseWheel() {
  scroll += event.delta/2;
  scroll = constrain(scroll, 0, 1000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initVar();
}