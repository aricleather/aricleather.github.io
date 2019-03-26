// State Variables Assignment
// Aric Leather
// Date: March 25, 2019
// 
// State variables: my game has many state variables. Examples include: gameState (main game, main menu, options menu),
// shopState (is the shop open or not in mainGame), animationState (my game has an intro animation and will have more, dictates current animation)
//
// Extra for Experts:
// - My game incorporates sound effects
// - My game successfully utilizes class notation pretty much everywhere
// - I have experimented with my index.html (see style.css and my p5_loading div for preLoad())
// - My game successfully utilizes window.localStorage to load, save, and clear saved data

window.onbeforeunload = saveGame;

let playerName;
let playerLevel = 1;

let saveFile;
let gMouseToggle = 0;
let gMouse = 0;
let currentDialog = [];
let input = null;

function gMouseControl() {
  // This function exists so that gMouseToggle can be called at any time in draw loop and
  // still block clicks. gMouseControl is run at end of draw loop so that if anything 
  // sets gMouseToggle to true, gMouse will also be true at end of draw loop, blocking clicks
  if(gMouseToggle) {
    gMouse = gMouseToggle;
  }
  else if(!mouseIsPressed) {
    gMouse = 0;
  }
  gMouseToggle = 0;
}

function newInput(whichInput, x, y, width, height) {
  if(whichInput === "text") {
    input = new TextInput(x, y, width, height);
  }
}

function cookieIncrement() {
  // Increment cookie counter on click and begin "popping" animation
  cookies += clickPower;
  clicks++;
  popSound.play();
  updateAchievements();
  newFallingCookie();
}

// Load content used in game
let cookie, coin, oven, bakery, factory, rightArrow, gameCursor, clickUpgrade; // Images
let coinSound, popSound, textBlip; // Sounds
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
let shopTab = 1;

// Clicker game variables:
let cookies = 0;
let autoCookies = 0;
let clickPower = 1;
let lastMillis = 0;
let increments = 0;
let clicks = 0;

// Variables used for menu()
let titleText = "Cookie Clicker"; // strings
let hoverFillStart = 200;         // button rectangle fills
let hoverFillOptions = 200;

// variables used for shop()

let cookieGetText;
let tempText;

function preload() {
  // Images
  cookie = loadImage("assets/cookie1.png");
  coin = loadImage("assets/coin.png");
  oven = loadImage("assets/oven.png");
  rightArrow = loadImage("assets/rightarrow.png");
  gameCursor = loadImage("assets/cursor.png");
  bakery = loadImage("assets/bakery.png");
  factory = loadImage("assets/factory.png");
  clickUpgrade = loadImage("assets/clickUpgrade.png");

  // Sounds and fonts
  gameFont = loadFont("assets/gameFont.ttf");
  coinSound = loadSound("assets/coinSound.wav");
  popSound = loadSound("assets/pop.ogg");
  textBlip = loadSound("assets/textBlip.wav");
  keyType1 = loadSound("assets/keyType1.wav");
  keyType2 = loadSound("assets/keyType2.wav");
  buttonSelect1 = loadSound("assets/buttonSelect1.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont); // Font used throughout whole game
  imageMode(CENTER);
  initScalarsPositions();
  initObjects();

  angleMode(DEGREES);
  loadSaveFile();
  if(window.localStorage.length === 0) {
    startAnimation("titleScreenAnimation1");
  }
  initAchievements();

  coinSound.setVolume(0.08);
  popSound.setVolume(0.15);
  textBlip.setVolume(0.1);
  keyType1.setVolume(0.2);
  keyType2.setVolume(0.2);
  buttonSelect1.setVolume(0.8);
}

function loadSaveFile() {
  if(window.localStorage.length === 0) {
    void 0;
  }
  else {
    // As long as a save game exists, take data from window.localStorage and import it
    cookies = int(window.localStorage.getItem("cookies"));
    autoCookies = float(window.localStorage.getItem("autoCookies"));
    clicks = int(window.localStorage.getItem("clicks"));
    playerName = window.localStorage.getItem("playerName");
    playerLevel = window.localStorage.getItem("playerLevel");
    ovenObj.saveLoad(window.localStorage.getItem("oven").split(","));
    bakeryObj.saveLoad(window.localStorage.getItem("bakery").split(","));
    factoryObj.saveLoad(window.localStorage.getItem("factory").split(","));
  }
}

function saveGame() {
  // Takes data from game that needs to be saved in order for player to be able to resume
  // and stores it in window.localStorage
  if(cookies > 0) {
    window.localStorage.setItem("cookies", cookies);
    window.localStorage.setItem("autoCookies", autoCookies);
    window.localStorage.setItem("clicks", clicks);
    window.localStorage.setItem("playerName", playerName);
    window.localStorage.setItem("playerLevel", playerLevel);
    window.localStorage.setItem("oven", [ovenObj.price, ovenObj.owned]);
    window.localStorage.setItem("bakery", [bakeryObj.price, bakeryObj.owned]);
    window.localStorage.setItem("factory", [factoryObj.price, factoryObj.owned]);
  }
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
  background(102, 153, 204);
  // cursor("assets/cursor.png");
  textSize(15);
  fill(0);
  textAlign(CENTER, CENTER);
  text(frameRate().toFixed(0), 20, 60);
  if (gameState === 0) {
    menu();
  } 
  else if (gameState === 1) {
    mainGame();
  }
  else if (gameState === 2) {
    displayOptions();
  }
  else if (gameState === 3) {
    // Gamestate during some animations
    void 0;
  }
  runDialogBoxes();
  if(input) {
    input.run();
  }
  globalMessage.run();
  displayAnimation();
  gMouseControl();
}

function menu() { // gameState 0
  displayMenu();
  animateMenu();
  if(window.localStorage.length > 0) {
    titleLoadButton.run();
  }
  else {
    titleNewGameButton.run();
  }
  titleOptionsButton.run();
  // If save file was stored as cookie in browser, show load option
}

function mainGame() { // gameState 1
  incrementAutoCookies();
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
  // cookieSpinner.run();
  mainCookie.run();

  // Draws cookie amount text to screen
  noStroke();
  textFont(gameFont);
  textSize(40 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(str(Math.floor(cookies)) + " Cookies" , width / 2, height * 0.85);

  displayTrackedAchievment();
  displayPlayerData();
}

function displayPlayerData() {
  stroke(0);
  fill(186, 211, 252);
  rectMode(CENTER);
  rect(width * 0.125, height * 0.02, width * 0.15, height * 0.04);
  rect(width * 0.5, height * 0.02, width * 0.6, height * 0.04);

  fill(0);
  noStroke();
  textAlign(LEFT, CENTER);
  text(playerName + " Lvl " + playerLevel, width * 0.055, height * 0.02);
  text("Exp: 0/0", width * 0.205, height * 0.02);
  text("(There will be an EXP bar here later)", width * 0.35, height * 0.02);
  
}

function incrementAutoCookies() {
  // Increments the cookie amount 4 times a second
  if (autoCookies > 0 && millis() - lastMillis > 25) {
    cookies += autoCookies / 40;
    lastMillis = millis();
    increments ++;
    if (increments % 40 === 0) {
      cookieGet();
    }
  } 
}

function cookieGet() {
  // This function creates the effect underneath cookie total showing cookies gained every second
  // Random location somewhere under cookie total text
  cookieGetX = random(width * 0.4, width * 0.6);
  cookieGetY = height * 0.9;
  cookieGetAlpha = 255;
  // Temporary variable for the "+" and cookies just gained in a string
  tempText = "+" + autoCookies.toFixed(1);
}

function animateCookieGet() {
  // Draws tempText to screen with a cookie beside it every second, showing how many cookies gained that second
  if (cookieGetAlpha > 0) {
    fill(0, cookieGetAlpha);
    textSize(15 * scalars.textScalar);
    noStroke();
    text(tempText, cookieGetX, cookieGetY);
    tint(255, cookieGetAlpha);
    image(cookie, cookieGetX + textWidth(tempText) , cookieGetY, scalars.cookieGetScalar, scalars.cookieGetScalar);
    // Reduces alpha value so that it fades away
    cookieGetAlpha -= 8.5;
  }
}

function displayMenu() {
  // Draws everything to screen in menu()
  // Game title text
  fill(255);
  textSize(75 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(titleText , width / 2, height * 0.2);

  // Cookies that are next to title text, positions based on length of titleText
  tint(255, 255);
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
  optionsDeleteDataButton.run();
  textSize(25);
  text("(Press 'm' to go back)", width * 0.5, height * 0.9);
}

function shop() {
  // Run objects for game shop
  closeShopButton.run();
  if(shopTab === 1) {
    ovenObj.run();
    bakeryObj.run();
    factoryObj.run();
  }
  else{
    console.log("There are no other tabs yet, just keep shopTab set to 1.");
  }

  shopScrollBar.run();
}

function displayTextBox(theText, x, y) {
  // Called from within shop objects in mouseHover() 
  // Displays a shop object's metaText in a box if hovered over

  // Position vars
  let rectWidth = width / 10;
  let rectHeight = width / 25;
  let tSize = Math.ceil(rectWidth / 15);
  let formattedText = formatText(theText, rectWidth, tSize);

  // Formatting
  textAlign(LEFT, TOP);
  textSize(tSize);
  rectMode(CORNERS);
  stroke(0);
  strokeWeight(4);
  fill(186, 211, 252);
  // Draw the rectangle
  rect(x - rectWidth, y - rectHeight, x, y);
  noStroke();
  fill(0);
  // Text inside
  text(formattedText, x - rectWidth + 5, y - rectHeight + 5);
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

function newDialogBox(theDialog) {
  // If arg is a dialog box, push to currentDialog. Will be run in draw()
  if (theDialog.constructor.name === "DialogBox") {
    currentDialog.push(theDialog);
  }
}

function runDialogBoxes() {
  // Run in draw, calls run on all dialog boxes in currentDialog
  for(let i = 0; i < currentDialog.length; i++) {
    currentDialog[i].run();
  }
}

function closeDialog() {
  // Called from dialog boxes when a button is clicked, removing itself from currentDialog
  currentDialog.shift();
}

function calculateTextSize(theString, theWidth, theHeight = 0) {
  theString = theString.split(" ");
  let longestWord = "";
  for(let i = 0; i < theString.length; i++) {
    if (theString[i].length > longestWord.length) {
      longestWord = theString[i];
    }
  }
  tSize = theWidth / longestWord.length * 0.7;
  textSize(tSize);
  if(theHeight) {
    if(textAscent(theString) > theHeight * 0.7) {
      tSize = theHeight * 0.7;
    }
  }

  return tSize;
}

function formatText(theString, theWidth, tSize) {
  // Many functions require the ability to break text in the right location so it doesn't go "out of bounds."
  // This function returns an edited string with line breaks that fit into the specified width given the text size and width
  // Set up data
  theString = theString.split(" ");
  let widthCounter = 0;
  let returnString = "";
  textSize(tSize);

  // Remove pre-existing new-lines from string
  for(let i = 0; i < theString.length; i++) {
    if(theString[i].includes("\n")) {
      let theString1 = theString.slice(0, i);
      let splitString = theString[i].split("\n");
      let theString2 = theString.slice(i + 1);
      theString = theString1.concat(splitString, theString2);
    }
  }

  // By counting width with textWidth, add new lines in appropiate places
  for(let i = 0; i < theString.length; i++) {
    if(i !== theString.length - 1) {
      widthCounter += textWidth(theString[i] + " ");
    }
    else {
      widthCounter += textWidth(theString[i]);
    }
    if(widthCounter >= theWidth) {
      returnString += "\n" + theString[i];
      widthCounter = textWidth(theString[i]);
    } 
    else {
      returnString += " " + theString[i];
    }
  }

  // This method may leave whitespace on front of string, trim to remove it
  return returnString.trim();
}

function keyPressed() {
  if (gameState === 1 || gameState === 2) {
    if (key === "r" && gameState === 1) {
      // Resets game upon pressing "r" on keyboard. resetAlpha is used in mainGame() to draw "Game reset!" to screen which fades away
      void 0;
    }  
    else if (key === "m") {
      newDialogBox(returnToMenuDialog);
    }
  }
  if(input) {
    input.getInput(key);
  }
}

function resetGame() {
  cookies = 0;
  autoCookies = 0;
  clicks = 0;
  playerName = "";
  playerLevel = 1;

  ovenObj.reset();
  bakeryObj.reset();
  factoryObj.reset();

  // Delete save file
  window.localStorage.clear();
  initAchievements();
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
  factoryObj.mouseScroll(event.delta);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initScalarsPositions();
  resizeObjects();
}