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
let cookie, coin, oven, bakery, rightArrow, gameCursor, clickUpgrade; // Images
let coinSound, popSound; // Sounds
let gameFont; // Fonts
let shopGraphic; // Graphics

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
let buttons;

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
let globalMessage;
let globalMessageDecay;

// Load content used in game
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
  initVar();
  initScalars();
  generateGraphics();
}

function initVar() {
  // Sets variables in shopItems. Width and height of each item defined in initScalars() to allow for window resizing functionality
  shopItems = [
    { name: "Upgrade Click",
      text: "Mo' cookies,\nmo' problems.",
      metaText: "cookie(s) per click",
      image: clickUpgrade,
      width: 0,
      height: 0,
      price: 100,
      cps: 1,
      func: function() {
        clickPower += this.cps;
        this.owned++;
      },
      owned: 0,},
    { name: "Oven",
      text: "Bake more\ncookies!",
      image: oven,
      width: 0,
      height: 0,
      price: 10,
      cps: 0.1,
      owned: 0,},
    { name: "Bakery",
      text: "Mmm, smells\ngood...",
      image: bakery,
      width: 0,
      height: 0,
      price: 150,
      cps: 1,
      owned: 0,}
  ];
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
  buttons = [
    {
      text: "Start",
      tSize: 30,
      func: function() {
        gameState = 1;
      },
    }
  ];
}

function initScalars() {
  scalars = {
    // Click or hover based:
    clickScalar: 1,
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

  // Init width and height in shopItems
  for(let shopItem = 0; shopItem < shopItems.length; shopItem++) {
    let theItem = shopItems[shopItem];
    theItem.width = width * theItem.image.width * 0.0002;
    theItem.height = width * theItem.image.height * 0.0002;
  }
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
}

function menu() { // gameState 0
  displayMenu();
  animateMenu();
  menuButtonHover();
}

function mainGame() { // gameState 1
  incrementCookies();
  cookiePop();
  displayGame();
  animateCookieGet();
  if (shopState) {
    shop();
  }
  else {
    shopOpenButton();
  }
}

function displayGame() {
  cookieFall();

  // Draws main cookie image to screen
  tint(255, 255);
  fill(0, 255);
  image(cookie, width/2, height/2, scalars.mainCookieScalar * scalars.clickScalar, scalars.mainCookieScalar * scalars.clickScalar);

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

  // For each shop item, draw it and various data
  let theItem;
  let theText;
  textSize(15 * scalars.textScalar);
  textAlign(LEFT, CENTER);
  rectMode(CENTER);
  noStroke();
  for(let shopItem = 0; shopItem < shopItems.length; shopItem++) {
    theItem = shopItems[shopItem];
    fill(30, 70);
    rect(width * 0.85, height * (2 * shopItem + 1) * 0.125 - scroll * scalars.scrollScalar, width * 0.3, height * 0.2);
    fill(0);
    tint(enoughCookies(cookies, theItem.price));
    image(theItem.image, width * 0.76, height * (2 * shopItem + 1) * 0.125 - scroll * scalars.scrollScalar, theItem.width, theItem.height);
    if(typeof theItem.metaText === "undefined") {
      theText = theItem.name + "\nCost: " + str(theItem.price) + " Cookies\n" + str(theItem.cps) + " CPS\nOwned: " + str(theItem.owned);
    }
    else {
      theText = theItem.name + "\nCost: " + str(theItem.price) + " Cookies\n" + str(theItem.cps) + " " + theItem.metaText + "\nOwned: " + str(theItem.owned);
    }
    text(theText, width * 0.825, height * (2 * shopItem + 1) * 0.125 - scroll * scalars.scrollScalar);
  }

  // Scroll bar
  noStroke();
  fill(75);
  rectMode(CORNER);
  rect(width * 0.99, scroll / 4 * height, width * 0.01, height/4);
  
  displayMessage();
  textBox();
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

function displayTextBox(theText, x, y) {
  // Called from textBox(), displays a shop item's text attribute in a rectangle if hovered over
  textAlign(LEFT, TOP);
  textSize(15 * scalars.textScalar);
  rectMode(CORNERS);
  stroke(0);
  strokeWeight(4);
  fill(186, 211, 252);
  rect(x - 150, y - 75, x, y);
  noStroke();
  fill(0);
  text(theText, x - 145, y - 70);
}

function textBox() {
  // Call displayTextBox if user is hovering over a shop item
  let theItem;
  for(let shopItem = 0; shopItem < shopItems.length; shopItem++) {
    theItem = shopItems[shopItem];
    if (Math.abs(mouseX - width * 0.76) < theItem.width / 2 && Math.abs(mouseY - height * (2 * shopItem + 1) * 0.125 + scroll * scalars.scrollScalar) < theItem.height / 2) {
      displayTextBox(theItem.text, mouseX, mouseY);
    }
  }
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

function mouseClicked() {
  if (gameState === 0) {
    if (Math.abs(mouseX - width / 2) < scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2) < scalars.menuButtonH / 2) {
      gameState = 1;
    }
    if (Math.abs(mouseX - width / 2) < scalars.menuButtonW / 2 && Math.abs(mouseY - height / 2 - height * 0.12) < scalars.menuButtonH / 2) {
      gameState = 2;
    }
  }
  else if (gameState === 1) {
    if(dialogState === 0) {
      // Increment cookie counter on click and begin "popping" animation
      if (Math.abs(mouseX - width / 2) < scalars.mainCookieScalar / 2 && Math.abs(mouseY - height / 2) < scalars.mainCookieScalar / 2) {
        cookies += clickPower;
        scalars.clickScalar += 0.1;
        constrain(scalars.clickScalar, 1, 1.25);
        popSound.play();
        newFallingCookie();
      }

      if (shopState === 1) {
        let theItem;
        for(let shopItem = 0; shopItem < shopItems.length; shopItem++) {
          theItem = shopItems[shopItem];
          if (Math.abs(mouseX - width * 0.76) < theItem.width / 2 && Math.abs(mouseY - height * (2 * shopItem + 1) * 0.125 + scroll * scalars.scrollScalar) < theItem.height / 2) {
            if(cookies >= theItem.price) {
              if (typeof theItem.func === "undefined") {
                theItem.owned++;
                cookies -= theItem.price;
                autoCookies += theItem.cps;
                coinSound.play();
              } 
              else {
                theItem.func();
              }
            } 
          }
        }
        if (Math.abs(mouseX - width * 0.67) < scalars.storeCloseScalar / 2 && Math.abs(mouseY - height * 0.06) < scalars.storeCloseScalar / 2) {
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

function calculateTextSize(theString, theWidth, theSize) {
  // Many functions require the ability to break text in the right location so it doesn't go "out of bounds."
  // This function returns an edited string with line breaks that fit into the specified width given the text size
  theString = theString.split(" ");
  let widthCounter = 0;
  let returnString = "";
  textSize(theSize);
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initScalars();
  generateGraphics();
}

// Functions that require user interaction (buttons, dialog boxes, clickable objects)

function drawButton(buttonObject) {
  let theText = buttonObject.text;
  let tSize = buttonObject.tSize;
  
}