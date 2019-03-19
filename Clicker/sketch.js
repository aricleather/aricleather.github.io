// Interactive Scene
// Aric Leather
// Date: March 4, 2019
// 
// Mouse incorporation: clicking on cookie and store stuff, keyboard incorporation: press R key to reset game
//
// Extra for Experts:
// - My game can successfully handle window resizing, in terms of scaling and canvas
// - My game incorporates sound effects

let gMouse = false;

function mouseCooldown() {
  if(!mouseIsPressed) {
    gMouse = false;
  }
}

function cookieIncrement() {
  if(dialogState === 0) {
    // Increment cookie counter on click and begin "popping" animation
    cookies += clickPower;
    popSound.play();
    newFallingCookie();
  }
}

// Load content used in game
let cookie, coin, oven, bakery, rightArrow, gameCursor, clickUpgrade; // Images
let coinSound, popSound; // Sounds
let gameFont; // Fonts

// Position / scaling variables
let scalars; // Scalars used throughout code definied in initScalars()
let cookieGetAlpha; // Alpha / transparency values
let messageAlpha = 0; 
let cookieGetX, cookieGetY; // Position values
let cookiesFalling = [];
let scroll = 0;

// Game states:
let gameState = 0;
let shopState = 0;
let dialogState = 0;

// Clicker game variables:
let cookies = 0;
let autoCookies = 0;
let clickPower = 1;
let lastMillis = 0;
let increments = 0;
let shopItems;
let dialog;

// Variables used for menu()
let titleText = "Cookie Clicker"; // strings
let hoverFillStart = 200;         // button rectangle fills
let hoverFillOptions = 200;

// variables used for shop()

let cookieGetText;
let tempText;
let globalMessage;
let globalMessageDecay;

function preload() {
  // Images
  cookie = loadImage("assets/cookie1.png");
  coin = loadImage("assets/coin.png");
  oven = loadImage("assets/oven.png");
  rightArrow = loadImage("assets/rightarrow.png");
  gameCursor = loadImage("assets/cursor.png");
  bakery = loadImage("assets/bakery.png");
  clickUpgrade = loadImage("assets/clickUpgrade.png");

  // Sounds and fonts
  gameFont = loadFont("assets/gameFont.ttf");
  coinSound = loadSound("assets/coinSound.wav");
  popSound = loadSound("assets/pop.ogg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont); // Font used throughout whole game
  imageMode(CENTER);
  initScalarsPositions();
  initVar();
  initObjects();
}

function initVar() {
  // Each element has text, button options, and calls to do on various button presses. Drawn by dialogBox(), the one being drawn tracked by dialogState
  dialog = [
    {
      text: "Are you sure you want to reset?",
      buttonText: [
        "Yes", "No"
      ],
      buttonCalls: [
        resetGame,
        closeDialog,
      ],
    },
    {
      text: "Go back to main menu?",
      buttonText: [
        "Yes", "No"
      ],
      buttonCalls: [
        function() {
          gameState = 0;
        },
        closeDialog
      ]
    },
  ];
}

function initScalarsPositions() {
  scalars = {
    // Click or hover based:
    storeHoverScalar: 1,
    storeCloseHoverScalar: 1,

    // Animation based:
    menuAnimScalar: 1,
    menuAnimSpeed: 0.008,
    scrollScalar: width * 0.0625,

    // Buttons:
    menuButtonW: width * 0.16,
    menuButtonH: height * 0.08,
  
    // Image based:
    mainCookieScalar: width * 0.15,
    titleScreenCookie: width * 0.06,
    storeCoinScalar: width * 0.05,
    storeCloseScalar: width * 0.05,
    cookieGetScalar: width * 0.025,
    fallingCookieScalar: 50,
  
    // Text based:
    textScalar: width / 1920,
  };
}

function draw() {
  background(30, 144, 255);
  // cursor("assets/cursor.png");
  textSize(15);
  fill(0);
  textAlign(CENTER, CENTER);
  text(frameRate().toFixed(0), 20, 20);
  if (gameState === 0) {
    menu();
  } 
  else if (gameState === 1) {
    mainGame();
  }
  else {
    displayOptions();
  }
  mouseCooldown();
}

function menu() { // gameState 0
  displayMenu();
  animateMenu();
  titleStartButton.run();
  titleOptionsButton.run();
}

function mainGame() { // gameState 1
  // testDialog.run();
  incrementCookies();
  displayGame();
  animateCookieGet();
  if (shopState) {
    shop();
  }
  else {
    openShopButton.run();
  }
}

function displayGame() {
  cookieFall();
  mainCookie.run();

  // Draws cookie amount text to screen
  noStroke();
  textFont(gameFont);
  textSize(40 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(str(Math.floor(cookies)) + " Cookies" , width / 2, height * 0.9);

  // "Game reset!" text when r clicked on keyboard
  displayMessage();
  if(dialogState) {
    dialogBox(dialog[dialogState - 1]);
  }
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

function displayOptions() {
  textSize(50);
  text("Nothing here yet!", width * 0.5, height * 0.2);
  textSize(25);
  text("(Press 'm' to go back)", width * 0.5, height * 0.25);
  if(dialogState) {
    dialogBox(dialog[dialogState - 1]);
  }
}

function shop() {
  // Close shop arrow
  displayShop();
}

function displayShop() {
  // Draw "close shop" arrow + text underneath
  closeShopButton.run();
  ovenObj.run();
  bakeryObj.run();
  shopScrollBar.run();
  
  displayMessage();
}

function newMessage(message, decay) {
  globalMessage = message;
  messageAlpha = 255;
  globalMessageDecay = millis() + decay * 1000;
}

function displayMessage() {
  if (messageAlpha > 0) {
    textSize(50 * scalars.textScalar);
    fill(0, messageAlpha);
    text(globalMessage, width / 2, height * 0.2);
    if(millis() > globalMessageDecay) {
      messageAlpha -= 8.5;
    }
  }
}

function shopTint(cookies, price) {
  if (cookies < price) {
    return 50;
  }
  else {
    return 255;
  }
}

function displayTextBox(theText, x, y) {
  // Called from within shop objects in mouseHover() 
  // Displays a shop object's metaText in a box if hovered over

  // Formatting
  textAlign(LEFT, TOP);
  textSize(15 * scalars.textScalar);
  rectMode(CORNERS);
  stroke(0);
  strokeWeight(4);
  fill(186, 211, 252);
  // Draw the rectangle
  rect(x - 150, y - 75, x, y);
  noStroke();
  fill(0);
  // Text inside
  text(theText, x - 145, y - 70);
}

function newFallingCookie() {
  // Creates a new cookie object to be drawn with cookieFall(), called when mousePressed() on main cookie
  let tempCookie = {
    x: random(0, width),
    y: -25,
    grav: 0,
  };
  cookiesFalling.push(tempCookie);
}

function cookieFall() {
  // For each object in cookiesFalling, draws a semi-transparent cookie that falls from top of screen
  tint(255, 200);
  let theCookie;
  for(let i = 0; i < cookiesFalling.length; i++) {
    theCookie = cookiesFalling[i];
    theCookie.y += theCookie.grav;
    theCookie.grav++;
    image(cookie, theCookie.x, theCookie.y, scalars.fallingCookieScalar, scalars.fallingCookieScalar);
    if (theCookie.y > height + scalars.fallingCookieScalar) {
      // When cookie leaves screen, remove from list
      cookiesFalling.splice(i, 1);
    }
  }
}

function newDialogBox(option) {
  if(typeof dialog[option - 1].formatted === "undefined") {
    // Prepares variables in dialogBox object for dialogBox(), text formatting and stuff
    let whichDialog = dialog[option - 1];
    whichDialog.text = calculateTextSize(whichDialog.text, width * 0.4, scalars.textScalar * 40);
    for(let i = 0; i < whichDialog.buttonText.length; i++) {
      whichDialog.buttonText[i] = calculateTextSize(whichDialog.buttonText[i], width * 0.06, scalars.textScalar * 23);
    }
    dialog[option - 1].formatted = true;
  }
  messageAlpha = 0;
  dialogState = option;
}

function dialogBox(dialogObject) {
  if(dialogState) {
    // Takes a dialog object from dialog, displays it's text and it's options, runs option based on user selection
    // Variables
    let xPos;
    let dWidth = width * 0.4;
    let dHeight = height * 0.2;
    let options = dialogObject.buttonText.length;
    let optionHeight = height * 0.045;
    let optionWidth = width * 0.06;
    

    //Formatting
    rectMode(CENTER);
    stroke(0);
    strokeWeight(4);
    fill(186, 211, 252);
    // Main box
    rect(width * 0.5, height * 0.2, dWidth, dHeight);
    // Text in main box
    textSize(scalars.textScalar * 40);
    textAlign(CENTER, CENTER);
    fill(0);
    noStroke();
    text(dialogObject.text, width * 0.5, height * 0.17);

    textSize(scalars.textScalar * 23);
    for(let i = 0; i < options; i++) {
      // More formatting
      xPos = width * 0.3 + dWidth * ((i + 1) / (options + 1));
      if(Math.abs(mouseX - xPos) <= optionWidth / 2 && Math.abs(mouseY - height * 0.26) <= optionHeight / 2) {
        fill(150);
      }
      else {
        fill(200);
      }
      stroke(0);
      // The smaller boxes
      rect(xPos, height * 0.26, optionWidth, optionHeight);
      fill(0);
      noStroke();
      text(dialogObject.buttonText[i], xPos, height * 0.26);
    }

    // If we are clicking on an option, run the function
    for(let i = 0; i < options; i++) {
      xPos = width * 0.3 + dWidth * ((i + 1) / (options + 1));
      if (mouseIsPressed && Math.abs(mouseX - xPos) <= optionWidth / 2 && Math.abs(mouseY - height * 0.26) <= optionHeight / 2) {
        dialogObject.buttonCalls[i]();
        dialogState = 0;
      }
    }
  }
}

function closeDialog() {
  dialogState = 0;
}

function calculateTextSize(theString, theWidth) {
  theString = theString.split(" ");
  let longestWord = "";
  for(let i = 0; i < theString.length; i++) {
    if (theString[i].length > longestWord.length) {
      longestWord = theString[i];
    }
  }
  return theWidth / longestWord.length * 0.7;
}

function formatText(theString, theWidth, tSize) {
  // Many functions require the ability to break text in the right location so it doesn't go "out of bounds."
  // This function returns an edited string with line breaks that fit into the specified width given the text size
  theString = theString.split(" ");
  let widthCounter = 0;
  let returnString = "";
  textSize(tSize);
  for(let i = 0; i < theString.length; i++) {
    widthCounter += textWidth(theString[i] + " ");
    if(widthCounter >= theWidth) {
      returnString += "\n" + theString[i];
      widthCounter = textWidth(theString[i]);
    } 
    else {
      returnString += " " + theString[i];
    }
  }
  return returnString.trim();
}

function keyPressed() {
  if (dialogState === 0) {
    if (gameState === 1 || gameState === 2) {
      if (key === "r" && gameState === 1) {
        // Resets game upon pressing "r" on keyboard. resetAlpha is used in mainGame() to draw "Game reset!" to screen which fades away
        newDialogBox(1);
      }  
      else if (key === "m") {
        newDialogBox(2);
      }
    }
  }
}

function resetGame() {
  cookies = 0;
  autoCookies = 0;
  for(let shopItem = 0; shopItem < shopItems.length; shopItem++) {
    shopItems[shopItem].owned = 0;
  }
  messageAlpha = 255; // This is used when drawing "Game Reset!"
  newMessage("Game reset!", 1);
}

function mouseWheel(event) {
  if (shopState === 1) {
    if (event.delta > 0) {
      scroll++;
    }
    else {
      scroll--;
    }
    scroll = constrain(scroll, 0, 3);
  }
  shopScrollBar.mouseScroll(event.delta);
  ovenObj.mouseScroll(event.delta);
  bakeryObj.mouseScroll(event.delta);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initScalarsPositions();
  resizeObjects();
}

function resizeObjects() {
  mainCookie.resize(width / 2, height / 2, scalars.mainCookieScalar, scalars.mainCookieScalar);
  titleStartButton.resize(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH);
  titleOptionsButton.resize(width / 2, height * 0.62, scalars.menuButtonW, scalars.menuButtonH);

  // Shop objects get resized with no params, taken care of by
  // their extendResize() function called in their resize() function
  ovenObj.resize();
  bakeryObj.resize();
}