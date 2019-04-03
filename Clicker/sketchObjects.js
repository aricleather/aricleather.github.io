// With sketchClasses.js, actually creates all the objects necessary for game function

// Global button declarations
let titleStartButton, titleOptionsButton;

// Global image object, image button and image spinner declarations
let mainCookie;
let openShopButton, closeShopButton;
let cookieSpinner;

// Global shop Object declarations
let bakeryObj, ovenObj, factoryObj;
let shopItems;

// Global scroll bar declarations
let shopScrollBar;

// Global dialog object declarations
let returnToMenuDialog;

// Global vars used for initializing objects
let shopNumber = 0;
let achievementNumber = 0;

// Generate all game objects
function initObjects() {
  // Buttons
  titleNewGameButton = new Button(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH, "New Game", function() {
    buttonSelect1.play();
    // gameState = 1; // Defines "start" menu button, on click switches to gameState 1 (mainGame())
  });
  titleOptionsButton = new Button(width / 2, height * 0.62, scalars.menuButtonW, scalars.menuButtonH, "Options", function() { // Options button on main menu
    gameState = 2; // Defines "options" menu button, on click switches to gameState 2 (mainGame())
  });
  titleLoadButton = new Button(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH, "Load Game", function() {
    gameState = 1;
  });
  optionsDeleteDataButton = new Button(width / 2, height * 0.5, scalars.menuButtonW, scalars.menuButtonH * 1.5, "Delete Data", function() {
    newDialogBox(deleteDataDialog);
  });

  // Image objects
  // Main cookie object. On click, cookieIncrement() and increase width and height of cookie to create popping animation
  // The extended run of this object refers to scalars.mainCookieScalar to complete popping animation
  mainCookie = new ImageObject(width / 2, height / 2, scalars.mainCookieScalar, scalars.mainCookieScalar, cookie, 
    function() {
      cookieIncrement();
      this.width = 1.15 * this.width;
      this.height = 1.15 * this.height;
    },
    function() {
      this.width -= 1/10 * (this.width - scalars.mainCookieScalar);
      this.height -= 1/10 * (this.height - scalars.mainCookieScalar);
      this.width = constrain(this.width, scalars.mainCookieScalar, scalars.mainCookieScalar * 1.25);
      this.height = constrain(this.height, scalars.mainCookieScalar, scalars.mainCookieScalar * 1.25);
    });

  openShopButton = new ImageButton(width * 0.97, height * 0.1, scalars.storeCoinScalar, scalars.storeCoinScalar, coin, function() {
    shopState = 1;
  }, 1.05, "Open Shop");
  closeShopButton = new ImageButton(width * 0.67, height * 0.1, scalars.storeCloseScalar, scalars.storeCloseScalar, rightArrow, function() {
    shopState = 0;
  }, 1.05, "Close Shop");
  openAchievementsButton = new ImageButton(width * 0.03, height * 0.1, scalars.openAchievementsScalar, scalars.openAchievementsScalar, goldStar, function() {
    achievementState = 1;
  }, 1.05, "");
  closeAchievementsButton = new ImageButton(width * 0.33, height * 0.1, scalars.closeAchievementsScalar, scalars.closeAchievementsScalar, leftArrow, function() {
    achievementState = 0;
  }, 1.05, "Close");

  cookieSpinner = new SpinImage(width / 2, height / 2, 500, 500, coin, 60);

  // Scroll bar for shop
  shopScrollBar = new ScrollBar(width * 0.995, 0, width * 0.01, 7, height);

  // Shop Objects
  ovenObj = new ShopObject(oven.width, oven.height, oven, "Oven", "Bake more cookies!", 5, 0.1);
  bakeryObj = new ShopObject(bakery.width, bakery.height, bakery, "Bakery", "Mmm, smells good...", 150, 1);
  factoryObj = new ShopObject(factory.width, factory.height, factory, "Factory", "Autonomous cookie production.", 500, 5);
  shopItems = [ovenObj, bakeryObj, factoryObj];

  // Dialog objects
  returnToMenuDialog = new DialogBox("Go back to main menu?", "Yes", "No", function() {
    gameState = 0;
    saveGame();
    loadSaveFile();
    if(window.localStorage.length === 0) {
      startAnimation("titleScreenAnimation1");
    }
  },
  function() {
    void 0;
  });
  deleteDataDialog = new DialogBox("Really delete all data?", "Yes", "No", function() {
    resetGame();
    loadSaveFile();
  },
  function() {
    void 0;
  });

  // Global messages
  globalMessage = new GlobalMessage();
}

// Called when window resized to properly resize all game objects
function resizeObjects() {
  // Image objects
  mainCookie.resize(width / 2, height / 2, scalars.mainCookieScalar, scalars.mainCookieScalar);

  // Image buttons
  openShopButton.resize(width * 0.97, height * 0.1, scalars.storeCoinScalar, scalars.storeCoinScalar);
  closeShopButton.resize(width * 0.67, height * 0.1, scalars.storeCloseScalar, scalars.storeCloseScalar);
  openAchievementsButton.resize(width * 0.03, height * 0.1, scalars.openAchievementsScalar, scalars.openAchievementsScalar);
  closeAchievementsButton.resize(width * 0.33, height * 0.1, scalars.closeAchievementsScalar, scalars.closeAchievementsScalar);

  // Buttons
  titleNewGameButton.resize(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH);
  titleOptionsButton.resize(width / 2, height * 0.62, scalars.menuButtonW, scalars.menuButtonH);
  titleLoadButton.resize(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH);
  optionsDeleteDataButton.resize(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH * 1.5);

  // Shop objects get resized with no params, taken care of by their resize function
  ovenObj.resize();
  bakeryObj.resize();
  factoryObj.resize();

  // Same with achievements
  achievements.clicks.obj.resize();

  // Scroll bars
  shopScrollBar.resize(width * 0.995, 0, width * 0.01, height);

  // Dialog objects
  returnToMenuDialog.resize();
  deleteDataDialog.resize();

  // Global message object
  globalMessage.resize(width / 2, height / 5, width * 0.6, height * 0.2);
}