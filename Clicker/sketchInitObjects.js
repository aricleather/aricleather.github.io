// Interactive Scene
// Aric Leather
// Date: March 4, 2019
// 
// Mouse incorporation: clicking on cookie and store stuff, keyboard incorporation: press R key to reset game
//
// Extra for Experts:
// - My game can successfully handle window resizing, in terms of scaling and canvas
// - My game incorporates sound effects

// Interactive functions (buttons, dialog boxes)

// GLOBAL VARIABLES
// Game content

// Global button declarations
let titleStartButton, titleOptionsButton;

// Global image object & image button declarations
let mainCookie;
let openShopButton, closeShopButton;

// Global shop Object declarations
let bakeryObj, ovenObj;

// Global scroll bar declarations
let shopScrollBar;

// Global vars used for initializing objects
let shopNumber = 0;

function initObjects() {
  // Buttons
  titleStartButton = new Button(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH, "Start", 30, function() {
    gameState = 1; // Defines "start" menu button, on click switches to gameState 1 (mainGame())
  });
  titleOptionsButton = new Button(width / 2, height * 0.62, scalars.menuButtonW, scalars.menuButtonH, "Options", 30, function() { // Options button on main menu
    gameState = 2; // Defines "options" menu button, on click switches to gameState 2 (mainGame())
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

  openShopButton = new ImageButton(width * 0.97, height * 0.06, scalars.storeCoinScalar, scalars.storeCoinScalar, coin, function() {
    shopState = 1;
  }, 1.05, "Open Shop");
  closeShopButton = new ImageButton(width * 0.67, height * 0.06, scalars.storeCloseScalar, scalars.storeCloseScalar, rightArrow, function() {
    shopState = 0;
  }, 1.05, "Close Shop");

  image(coin, width * 0.97, height * 0.06, scalars.storeCoinScalar * scalars.storeHoverScalar, scalars.storeCoinScalar * scalars.storeHoverScalar);
  // Scroll bar for shop
  shopScrollBar = new ScrollBar(width * 0.995, 0, width * 0.01, 7, height);

  // Shop Objects
  ovenObj = new ShopObject(oven.width, oven.height, oven, "Oven", "Bake more cookies!", 10, 0.1);
  bakeryObj = new ShopObject(bakery.width, bakery.height, bakery, "Bakery", "Mmm, smells good...", 150, 1);

  // Dialog objects
  testDialog = new DialogBox("Test", ["Test1", "function1"]);
}