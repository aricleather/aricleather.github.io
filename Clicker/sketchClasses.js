// All classes used in my game to create clickable, interactive objects on screen
// Use of mouseClicked() removed due to built in mouse-related functions and global
// gMouseControl() function to control what can be clicked, how much, and when

class GameObject {
  // Main class used in game. Gives x coord, y coord, width, and height
  // Gives function calcMouse to check if mouse is on object
  constructor(x, y, width, height) {
    this.mouse;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // Objects in my game check if they are clicked on by themselves. This variable is set to true when the mouse is clicked
    // Which blocks further clicks, until the mouse button is released (this function given in subclasses)
    this.calcMouse = function() {
      this.mouse = Math.abs(mouseX - this.x) <= this.width / 2 && Math.abs(mouseY - this.y) <= this.height / 2;
    };
  }
}
  
class Button extends GameObject {
  constructor(x, y, width, height, buttonText, clicked) {
    super(x, y, width, height);
    // Vars
    this.tSize = this.width / 10;
    this.buttonText = formatText(buttonText, this.width, this.tSize);
    this.clicked = clicked;
    this.alreadyClicked = false;
    this.color = 200;
  }
  
  run() {
    // When a Button is run, calculate if mouse is on top, draw the rectangle around it, fill it in with
    // a shade of gray dependent on whether the mouse is inside or not, then the text inside
    this.calcMouse();

    // Darkens button if mouse inside
    if(this.mouse) {
      this.color = [80, 80, 80];
    }
    else {
      this.color = [40, 40, 40];
    }
    // Formatting and drawing rectangle, text
    stroke(255);
    strokeWeight(3);
    fill(this.color);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
    noStroke();
    fill(255);
    textSize(this.tSize);
    textAlign(CENTER, CENTER);
    text(this.buttonText, this.x, this.y);
  
    this.alreadyClicked = false;
    this.checkClicked();

    return this.alreadyClicked;
      
  }

  checkClicked() {
    if(this.mouse && mouseIsPressed && gMouse < 2) {
      this.clicked();
      this.alreadyClicked = 1;
      // After a click, set gMouseToggle to true temporarily to block further clicks until mouse button released
      gMouseToggle = 1;
    }
  }
  
  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.tSize = this.width / 10;
    this.text = formatText(this.buttonText, this.width, this.tSize);
  }
}

  
class ImageObject extends GameObject {
  constructor(x, y, width, height, objImage, clicked, extendRun = 0) {
    super(x, y, width, height);
    // Vars
    this.objImage = objImage;
    this.clicked = clicked;
    this.extendRun = extendRun;
  }
  
  run() {
    // Image objects when run() draw their image to the screen with specified x, y, width, height
    this.calcMouse();
    tint(255, 255);
    fill(0, 255);
  
    // If ImageObject has extendRun function (passed during construction), run it here before drawing image
    // Used in classes that want images to have more functionality (ex. ImageButton)
    if(this.extendRun) {
      this.extendRun();
    }
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    // Again, utilizing calcMouse() and this.alreadyClicked to run this.clicked() on click only *once*
    if(this.mouse) {
      if(mouseIsPressed && gMouse < 1) {
        this.clicked();
        gMouseToggle = 1;
      }
    }
  }
      
  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class SpinImage extends GameObject {
  constructor(x, y, width, height, objImage, speed) {
    // Creates an object you can .run() to draw its image spinning 
    // Complete one full rotation per "this.speed" frames
    // Vars
    super(x, y, width, height);
    this.objImage = objImage;
    this.speed = speed;
    this.spinCount = 0;
    this.rotateAmount;
  }

  // Translate to the x and y of the object, rotate, draw image, rotate back, translate back
  run() {
    this.rotateAmount = 360 * (this.spinCount % this.speed / this.speed);
    console.log(this.rotateAmount);
    translate(this.x, this.y);
    rotate(this.rotateAmount);
    imageMode(CENTER);
    fill("white");
    image(this.objImage, 0, 0, this.width, this.height);
    rotate(-this.rotateAmount);
    translate(-this.x, -this.y);
    this.spinCount++;
  }
}


class ImageButton extends GameObject {
  // Same as ImageObject but enlarges on hover for a more button-like effect
  constructor(x, y, width, height, objImage, clicked, hoverScalar, objText) {
    super(x, y, width, height);
    // Vars
    this.objImage = objImage;
    this.clicked = clicked;
    this.hoverScalar = hoverScalar;
    this.tSize = this.width / 6;
    this.objText = formatText(objText, this.width, this.tSize);
    this.minWidth = this.width;
    this.minHeight = this.height;
  }
  
  run() {
    // Check if mouse is on top then enlarge image based on hoverScalar if mouse hovering
    this.calcMouse();
    if(this.mouse && !gMouse && this.width === this.minWidth) {
      this.width *= this.hoverScalar;
      this.height *= this.hoverScalar;
    }
    else if (!this.mouse && this.width > this.minWidth) {
      this.width = this.minWidth;
      this.height = this.minHeight;
    }
    
    tint(255, 255);
    fill(0, 255);
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    textAlign(CENTER, TOP);
    textSize(this.tSize);
    noStroke();
    text(this.objText, this.x, this.y + this.minHeight * 0.6);

    // Allow clicking only once before releasing mouse
    if(this.mouse) {
      if(mouseIsPressed && gMouse < 1) {
        this.clicked();
        gMouseToggle = 1;
      }
    }
  }
  
  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.minWidth = this.width;
    this.minHeight = this.height;
    this.tSize = this.width / 6;
    this.objText = formatText(this.objText, this.width, this.tSize);
  }
}

class TabButton extends GameObject {
  constructor(x, y, width, height, clicked, rgb, buttonText) {
    super(x, y, width, height);
    this.clicked = clicked;
    this.rgb = rgb;
    this.hoverRgb = lerpColor(color(this.rgb), color([0, 0, 0]), 0.1);
    this.buttonText = buttonText;
    this.tSize = this.width / 15;
  }

  run() {
    this.calcMouse();

    if(this.mouse && !gMouse) {
      fill(this.hoverRgb);
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle = 1;
      }
    }
    else {
      fill(this.rgb);
    }


    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height, 10, 10, 0, 0);

    textAlign(CENTER, CENTER);
    textSize(this.tSize);
    fill(0, 200);
    text(this.buttonText, this.x, this.y);
  }

  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
  
class ShopObject extends GameObject {
  constructor(imageWidth, imageHeight, objImage, name, metaText, price, cps) {
    // Used to construct an object in the shop
    super(width * 0.76, height * 0.125 * (shopNumber * 2 + 1), width * 0.0002 * imageWidth, width * 0.0002 * imageHeight);
  
    // Vars
    this.objImage = objImage;
    this.name = name;
    this.metaText = metaText;
    this.basePrice = price;
    this.price = price;
    this.cps = cps;
  
    this.position = shopNumber;
    this.owned = 0;
  
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
    this.scrollAmount = 0;
    this.scrollPosition = width * 0.0625;

    this.text = this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.cps) + " CPS\nOwned: " + str(this.owned);
  
    // shopNumber just keeps track of order in the shop, so that the next shopObject construction knows it comes after
    shopNumber++;
  }
  
  // The clicked() function here checks if you have enough money then does stuff if you do
  clicked() {
    if(cookies >= this.price) {
      autoCookies += this.cps;
      cookies -= this.price;
      purchaseSound.play();
      this.owned++;
      this.price = Math.ceil(this.basePrice * Math.pow(Math.E, this.owned / 4));
      this.updateText();
    }
    else{
      // If unable to play, play a little noise
      errorSound.play();
    }
  }
  
  // The extendRun for ShopObject draws the rectangle behind the ShopObject and it's text
  // Then, it sets a tint value for when the image is drawn (in ImageObjects run()) based on whether
  // or not the player has enough cookies. If mouse hovering, call metaTextBox
  run() {
    this.calcMouse();
      
    // Darken image if player cannot afford item
    if(cookies < this.price) {
      tint(50);
    }
    else {
      tint(255);
    }
    fill(0, 255);
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    // Again utilizing calcMouse() and alreadyClicked to run this.clicked() on click only once
    if(this.mouse && gMouse < 1) {
      // If mouseHover exists run when mouse hovering
      displayTextBox(this.metaText, mouseX, mouseY);
      
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle = 1;
      }
    }
    
    rectMode(CENTER);
    fill(30, 70);
    noStroke();
    rect(this.rectX, this.y, width * 0.3, height * 0.2);
    textAlign(LEFT, CENTER);
    fill(0);
    textSize(this.tSize);
    text(this.text, this.textX, this.y);
  }
  
  // Updates the text drawn by this object when called to match current data. Run once on construction and once on purchase
  updateText() {
    this.text = this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.cps) + " CPS\nOwned: " + str(this.owned);
  }
  
  // Since shopObjects are always in the same relative spot on the screen, resize should be called with no params
  // to let this extendResize function reset the scaling and position variables
  resize() {
    this.scrollPosition = width * 0.0625;
    this.x = width * 0.76;
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
    this.width = width * this.objImage.width * 0.0002;
    this.height = width * this.objImage.height * 0.0002;
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
  }
  
  // mouseHover() is run in run() if it exists. Here it uses function displayTextBox() to
  // display the little box over the item with some info
  
  mouseScroll(event) { 
    if(event > 0) {
      this.scrollAmount++;
    }
    else {
      this.scrollAmount--;
    }
    this.scrollAmount = constrain(this.scrollAmount, 0, 7);
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount; 
  }

  saveLoad(arr) {
    this.price = int(arr[0]);
    this.owned = int(arr[1]);
    this.updateText();
  }

  reset() {
    this.price = this.basePrice;
    this.owned = 0;
    this.updateText();
  }
}

class ShopWeaponObject extends GameObject {
  constructor(objImage, name, metaText, price, power, powerType) {
    // Used to construct an object in the shop
    super(width * 0.76, height * 0.125 * (shopWeaponNumber * 2 + 1), width * 0.06, width * 0.06);
  
    // Vars
    this.objImage = objImage;
    this.name = name;
    this.metaText = metaText;
    this.basePrice = price;
    this.price = price;
    this.power = power;
    this.powerType = powerType;
  
    this.position = shopWeaponNumber;
    this.owned = 0;
  
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
    this.scrollAmount = 0;
    this.scrollPosition = width * 0.0625;

    this.text = this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.power) + " " + this.powerType + " Power\nOwned: " + str(this.owned);
  
    // shopWeaponNumber just keeps track of order in the shop, so that the next shopWeaponObject construction knows it comes after
    shopWeaponNumber++;
  }
  
  // The clicked() function here checks if you have enough money then does stuff if you do
  clicked() {
    if(cookies >= this.price) {
      autoCookies += this.cps;
      cookies -= this.price;
      purchaseSound.play();
      this.owned++;
      // this.price = Math.ceil(this.basePrice * Math.pow(Math.E, this.owned / 4));
      this.updateText();
    }
    else {
      errorSound.play();
    }
  }
  
  // The extendRun for ShopObject draws the rectangle behind the ShopObject and it's text
  // Then, it sets a tint value for when the image is drawn (in ImageObjects run()) based on whether
  // or not the player has enough cookies. If mouse hovering, call metaTextBox
  run() {
    this.calcMouse();
      
    // Darken image if player cannot afford item
    if(cookies < this.price) {
      tint(50);
    }
    else {
      tint(255);
    }
    fill(0, 255);
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    // Again utilizing calcMouse() and alreadyClicked to run this.clicked() on click only once
    if(this.mouse && gMouse < 1) {
      // If mouseHover exists run when mouse hovering
      displayTextBox(this.metaText, mouseX, mouseY);
      
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle = 1;
      }
    }
    
    rectMode(CENTER);
    fill(30, 70);
    noStroke();
    rect(this.rectX, this.y, width * 0.3, height * 0.2);
    textAlign(LEFT, CENTER);
    fill(0);
    textSize(this.tSize);
    text(this.text, this.textX, this.y);
  }
  
  // Updates the text drawn by this object when called to match current data. Run once on construction and once on purchase
  updateText() {
    this.text = this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.power) + " " + this.powerType + " Power\nOwned: " + str(this.owned);
  }
  
  // Since shopObjects are always in the same relative spot on the screen, resize should be called with no params
  // to let this extendResize function reset the scaling and position variables
  resize() {
    this.scrollPosition = width * 0.0625;
    this.x = width * 0.76;
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
    this.width = width * 0.06;
    this.height = width * 0.06;
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
  }
  
  // mouseHover() is run in run() if it exists. Here it uses function displayTextBox() to
  // display the little box over the item with some info
  
  mouseScroll(event) { 
    if(event > 0) {
      this.scrollAmount++;
    }
    else {
      this.scrollAmount--;
    }
    this.scrollAmount = constrain(this.scrollAmount, 0, 7);
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount; 
  }

  saveLoad(arr) {
    this.price = int(arr[0]);
    this.owned = int(arr[1]);
    this.updateText();
  }

  reset() {
    this.price = this.basePrice;
    this.owned = 0;
    this.updateText();
  }
}

class ScrollBar extends GameObject {
  constructor(x, y, scrollBarWidth, scrollCount, scrollDistance) {
    // For scroll bars in game, for example in the shop
    super(x, y, scrollBarWidth, scrollDistance / scrollCount);
    this.scrollCount = scrollCount; // Amount of times it can scroll before reaching bottom
    this.scrollBarHeight = scrollDistance / scrollCount; // Scroll bar height is the distance it scroll in divided by how many times it can so it fits
    this.scrollDistance = scrollDistance - this.scrollBarHeight; // Edit scroll distance not to include the scroll bar height so nothing goes off screen
    this.scrollAmount = 0; // Originally, the scroll bar has not been scrolled at all
    this.deltaY = 0; // This is edited when the mouse is scrolled by how much the scroll bar needs to move
    this.run = function() {
      noStroke();
      fill(75, 200);
      rectMode(CENTER);
      // Rect mode is center, so half the height is the center of it, plus its original y coord and the deltaY from scrolling
      rect(this.x, this.y + this.scrollBarHeight / 2 + this.deltaY, this.width, this.height);
    };
  }
  
  mouseScroll(event) {
    if(shopState) {
      if(event > 0) {
        this.scrollAmount++;
      }
      else {
        this.scrollAmount--;
      }
      // this.scrollAmount = constrain(this.scrollAmount, 0, this.scrollCount);
      this.scrollAmount = constrain(this.scrollAmount, 0, this.scrollCount);
      this.deltaY = this.scrollAmount * (this.scrollDistance / this.scrollCount);
    }
  }
      
  resize(x, y, scrollBarWidth, scrollDistance) {
    this.x = x;
    this.y = y;
    this.width = scrollBarWidth;
    this.height = scrollDistance / this.scrollCount;
    
    this.scrollBarHeight = this.scrollDistance / this.scrollCount;
    this.scrollDistance = scrollDistance - this.scrollBarHeight;
    this.deltaY = this.scrollAmount * (this.scrollDistance / this.scrollCount);
  }
}

class DialogBox extends GameObject {
  // When constructing, first send x strings then x functions
  constructor(dialogText, ...textAndFunctions) {
    super(width / 2, height * 0.25, width / 2, height * 0.3);

    // Take in args, first half of rest param is text on buttons, second half is functions to run on button press
    // Stored in arrays
    this.buttonText = textAndFunctions.slice(0, textAndFunctions.length / 2);
    this.buttonFunctions = textAndFunctions.slice(textAndFunctions.length / 2);
    this.buttons = this.buttonText.length;
    this.buttonClicked = false;

    // Text formatting
    this.textY = this.y - this.height / 2 + this.height * 0.1; // Y coord text drawn at
    this.tSize = this.width * 0.8 / 25;
    this.dialogText = formatText(dialogText, this.width * 0.8, this.tSize);

    // Button formatting
    this.buttonArr = [];
    this.buttonY = this.y + this.height / 2 - this.height * 0.2;
    this.buttonWidth = this.width / (this.buttons + 2);
    this.buttonHeight = this.height / 5;
    // Push new buttons into this.buttonArr
    for(let i = 0; i < this.buttons; i++) {
      this.buttonArr.push(new Button(this.x - this.width / 2 + this.width * (i + 1) / (this.buttons + 1), this.buttonY, this.buttonWidth, this.buttonHeight, 
        this.buttonText[i], this.buttonFunctions[i]));
    }
  }

  run() {
    //Formatting
    rectMode(CENTER);
    stroke(0);
    strokeWeight(4);
    fill(186, 211, 252);

    // Main box
    rect(this.x, this.y, this.width, this.height);

    // Text in main box
    textSize(this.tSize);
    textAlign(CENTER, TOP);
    fill(0);
    noStroke();
    text(this.dialogText, this.x, this.textY);

    // Run the buttons
    for(let i = 0; i < this.buttons; i++) {
      // While clicked, buttons will return a true, which is utilized to close dialog boxes
      this.buttonClicked = this.buttonArr[i].run();
      if(this.buttonClicked) {
        closeDialog(1);
        this.buttonClicked = false;
      }
    }

    gMouseToggle = 1;
  }

  resize() {
    // Main resizing
    this.x = width / 2;
    this.y = height * 0.25;
    this.width = width / 2;
    this.height = height * 0.3;

    // Resize the text
    this.tSize = this.width * 0.8 / 25;
    this.dialogText = formatText(this.dialogText, this.width * 0.8, this.tSize);
    this.textY = this.y - this.height / 2 + this.height * 0.1;

    // Recalculate button sizes and call resize on each button to finish resizing
    this.buttonY = this.y + this.height / 2 - this.height * 0.2;
    this.buttonWidth = this.width / (this.buttons + 2);
    this.buttonHeight = this.height / 5;
    for(let i = 0; i < this.buttons; i++) {
      this.buttonArr[i].resize(this.x - this.width / 2 + this.width * (i + 1) / (this.buttons + 1), this.buttonY, this.buttonWidth, this.buttonHeight);
    }
  }
}

class GlobalMessage extends GameObject {
  constructor() {
    super(width / 2, height / 5, width * 0.6, height * 0.2);
    // Vars
    this.textAlpha = 0;
    this.tSize = this.width / 20;
    this.toggled = false;
    this.objText = "";
  }

  // If toggled, display the text
  run() {
    if(this.toggled) {
      fill(0, this.textAlpha);
      textSize(this.tSize);
      textAlign(CENTER, CENTER);
      text(this.objText, this.x, this.y);

      // If fadeTime surpassed, start fading then untoggle
      if(this.fadeTime < millis()) {
        this.textAlpha -= 8.5;
        if(this.textAlpha <= 0) {
          this.toggled = false;
        }
      }
    }
  }
    
  // Call toggle on a GlobalMessage with a duration to have one display for that duration
  toggle(objText, duration) {
    this.objText = formatText(objText, this.width, this.tSize);
    this.textAlpha = 255;
    this.toggled = true;
    // Will start fading when duration has passed, fadeTime = current time + duration
    this.fadeTime = millis() + duration;
  }

  resize() {
    this.x = width / 2;
    this.y = height / 5;
    this.width = width * 0.6;
    this.height = height * 0.2;
    this.tSize = this.width / 20;
    this.objText = formatText(this.objText, this.width, this.tSize);
  }
}

class TextInput extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.currentText = "";
    this.tSize = 50;
    this.blinkToggle = true;
    this.reToggleBlink = 0;
    this.endInput = false;
  }

  run() {
    textSize(50);
    fill(255);
    textAlign(LEFT, CENTER);
    text(this.currentText, this.x, this.y);
    this.blinkingTextLine();
    if(this.endInput) {
      buttonSelect1.play();
      return this.currentText;
    }
  }

  getInput(key) {
    if(key.length === 1 && key.toUpperCase() !== key.toLowerCase()) {
      this.currentText += key;
      this.reToggleBlink = millis() + 500;
      this.blinkToggle = false;
    }
    else if(key === "Backspace") {
      this.currentText = this.currentText.slice(0, -1);
    }
    else if(key === " ") {
      this.currentText += key;
    }
    else if(key === "Enter") {
      buttonSelect1.play();
      this.endInput = true;
    }
  }

  blinkingTextLine() {
    // If toggled, make the little line blink. If not, make it stay constant
    if(this.blinkToggle) {
      if(Math.floor((millis() - this.reToggleBlink) / 500) % 2 === 0) {
        fill(255);
      }
      else {
        fill(0);
      }
    }
    else {
      fill(255);
      if(millis() > this.reToggleBlink) {
        this.blinkToggle = true;
      }
    }
    noStroke();
    rectMode(CENTER);
    rect(this.x + textWidth(this.currentText) + 5, this.y, 3, this.tSize);
  }
}

class AchievementObject extends GameObject {
  constructor(imageWidth, imageHeight, objImage, tiers, tier, goals, metaText, achvText) {
    super(width * 0.06, height * 0.125 * (achievementNumber * 2 + 1), width * 0.0002 * imageWidth, width * 0.0002 * imageHeight);
    this.objImage = objImage;
    this.tiers = tiers; 
    this.tier = tier;
    this.completion;
    
    this.goals = goals;
    this.position = achievementNumber;
    achievementNumber++;

    this.achvText = achvText;
    this.metaText = metaText;
    this.rectX = width * 0.15;
    this.textX = width * 0.125;
    this.starX = width * 0.135;
    this.starY = this.y + height * 0.07;
    this.starSize = 40;
    this.starDist = this.starSize * 1.4;
    this.tSize = 15 * scalars.textScalar;

    this.scrollPosition = width * 0.0625;
    this.scrollAmount = 0;
  }

  clicked() {
    void 0;
  }
  
  run() {
    this.calcMouse();
  
    // Again utilizing calcMouse() and alreadyClicked to run this.clicked() on click only once
    
    rectMode(CENTER);
    fill(212, 175, 55, 150);
    noStroke();
    rect(this.rectX, this.y, width * 0.3, height * 0.2);
    textAlign(LEFT, CENTER);
    fill(0, 255);
    textSize(this.tSize);
    text(this.achvText, this.textX, this.y);

    tint(255, 255);
    fill(0, 255);
    image(this.objImage, this.x, this.y, this.width, this.height);

    for(let i = 0; i < this.tiers; i++) {
      if(i < this.tier) {
        tint(255, 255);
      }
      else {
        tint(50, 255);
      }
      image(goldStar, this.starX + i * this.starDist, this.starY, this.starSize, this.starSize);
    }

    if(this.mouse && gMouse < 1) {
      // If mouseHover exists run when mouse hovering
      displayTextBox(this.metaText, mouseX, mouseY);
      
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle = 1;
      }
    }
  }
  
  // Since shopObjects are always in the same relative spot on the screen, resize should be called with no params
  // to let this extendResize function reset the scaling and position variables
  resize() {
    this.scrollPosition = width * 0.0625;
    this.x = width * 0.06;
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
    this.width = width * this.objImage.width * 0.0002;
    this.height = width * this.objImage.height * 0.0002;
    this.textX = width * 0.125;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.15;

    this.starX = width * 0.135;
    this.starY = this.y + height * 0.07;
    this.starSize = 40;
    this.starDist = this.starSize * 1.4;
  }
  
  // mouseHover() is run in run() if it exists. Here it uses function displayTextBox() to
  // display the little box over the item with some info
  
  mouseScroll(event) {
    if(event > 0) {
      this.scrollAmount++;
    }
    else {
      this.scrollAmount--;
    }
    this.scrollAmount = constrain(this.scrollAmount, 0, 7);
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
    this.starY = this.y + height * 0.07;
  }

  updateCompletion(completion) {
    this.completion = completion;
  }

  updateTier(tier, updatedText) {
    this.tier = tier;
    this.achvText = updatedText;
  }

  reset() {
    void 0;
    // this.price = this.basePrice;
    // this.owned = 0;
    // this.updateText();
  }
}

class ExperienceBar extends GameObject {
  constructor(x, y, width, height, exp, expToNextLevel) {
    // Vars
    super(x, y, width, height);
    this._exp = exp;
    this.expToNextLevel = expToNextLevel;
    this.expToGain = 0;
    this.expToGainCounter = 0;

    // Special vars for green filling so rectMode can be CORNER
    this.expGreenX = this.x - this.width / 2;
    this.expGreenY = this.y - this.height / 2;
    this.expGreenWidth = this.width * this._exp / this.expToNextLevel || 0;
  }

  run() {
    this.calcMouse();

    if(this.expToGain) {
      this.animate();
    }

    // Exp bar itself
    fill("green");
    noStroke();
    rectMode(CORNER);
    rect(this.expGreenX, this.expGreenY, this.expGreenWidth, this.height);
    noFill();
    stroke(0);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);

    if(this.mouse && !gMouse) {
      displayTextBox("Exp: " + this._exp.toFixed(0) + "/" + str(this.expToNextLevel), this.x, this.y + this.height * 1.5, "center", "small");
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle = 1;
      }
    }

    // text("Exp: " + exp.toFixed(0) + "/" + str(expToNextLevel[playerLevel - 1]), width * 0.205, height * 0.02);

  }

  clicked() {
    void 0;
  }

  set exp(val) {
    // For direct setting, used by loadSaveFile();
    this._exp = val;
    this.resizeGreen();
  }

  resizeGreen() {
    // When called, calculate new width necessary to display current exp amount
    this.expGreenWidth = this.width * this._exp / this.expToNextLevel || 0;
  }

  expGain(exp) {
    // The function that is actually called to increment the exp bar, will cause animation to take place
    this.expToGain = this._exp + exp;
    this.expToGainCounter = 60;
    expGainSound.play();
  }

  animate() {
    // Animates exp bar by making it move toward where it is supposed to be at a decreasing rate
    this._exp += (this.expToGain - this._exp) * 1/12;
    this.expToGainCounter--;

    // After 60 frames, animation is cut off
    if(!this.expToGainCounter) {
      console.log(this.expToGain);
      this._exp = this.expToGain;
      this.expToGain = 0;
    }
    this.resizeGreen();
  }

  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.expGreenX = this.x - this.width / 2;
    this.expGreenY = this.y - this.height / 2;
    this.expGreenWidth = this.width * this._exp / this.expToNextLevel || 0;
  }
}

class BackgroundBox extends GameObject {
  constructor(x, y, width, height, rgb, priority) {
    super(x, y, width, height);
    this.rgb = rgb;
    this.priority = priority;
    this.close = false;
  }

  run() {
    this.calcMouse();

    stroke(0);
    strokeWeight(4);
    fill(this.rgb);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);

    if(!this.mouse && gMouse <= this.priority && mouseIsPressed) {
      this.clicked();
    }

    // Because of the order in which functions were run, without adding 1 to this toggle,
    // clicking an on-screen button to open a box would cause immediate closing.
    // Putting this gMouseToggle at the end of the run prevents this from happening
    gMouseToggle = mouseIsPressed ? this.priority + 1 : this.priority;
  }

  
  
  clicked() {
    this.close = true;
  }
}

class InventoryScreen extends GameObject {
  constructor(x, y, width, rgb, priority, cols, rows) {
    // Vars
    super(x, y, width, width / cols * rows);
    this.cols = cols;
    this.rows = rows;
    this.mouseXPos = null;
    this.mouseYPos = null;

    // Somewhere to put the inventory screen
    this.box = new BackgroundBox(this.x, this.y, this.width, this.height, rgb, priority);
    this.priority = priority;

    // Corner useful for the for loop drawing the 2d array and checking what box mouse is in
    this.leftX = this.x - this.width / 2;
    this.rightX = this.x + this.width / 2;
    this.topY = this.y - this.height / 2;
    this.bottomY = this.y + this.height / 2;

    // Box size for calculating what box mouse is in
    this.boxSize = this.width / cols;

    this.itemArr = [];
    for(let i = 0; i < rows; i++) {
      let emptyArr = [];
      for(let j = 0; j < cols; j++) {
        emptyArr.push(0);
      }
      this.itemArr.push(emptyArr);
    }
  }

  run() {
    this.calcMouse();
    this.box.run();

    // Draw the lines separating each item box
    stroke(0);
    strokeWeight(2);
    for(let i = 1; i <= this.cols; i++) {
      let x = this.leftX + i / this.cols * this.width;
      line(x, this.topY, x, this.bottomY);
    }
    for(let j = 1; j <= this.rows; j++) {
      let y = this.topY + j / this.rows * this.height;
      line(this.leftX, y, this.rightX, y);
    }

    if(this.mouse) {
      // What box is the mouse inside
      this.mouseXPos = Math.floor((mouseX - this.leftX) / this.boxSize);
      this.mouseYPos = Math.floor((mouseY - this.topY) / this.boxSize);

      // Give a text box if the player is hovering
      if(this.itemArr[this.mouseYPos] && this.itemArr[this.mouseYPos][this.mouseXPos] === 0) {
        displayTextBox("Empty.", mouseX, mouseY, 0, "small");
      }
    }

    if(this.box.close) {
      closeInventory();
      // So it doesn't auto-close next time
      this.box.close = false;
    }
  }
}