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
    this.alreadyClicked = false;
    this.calcMouse = function() {
      this.mouse = Math.abs(mouseX - this.x) <= this.width / 2 && Math.abs(mouseY - this.y) <= this.height / 2;
    };
  }
}
  
class Button extends GameObject {
  constructor(x, y, width, height, buttonText, clicked) {
    super(x, y, width, height);
    // Vars
    this.buttonText = buttonText;
    this.tSize = this.width / 10;
    this.clicked = clicked;
    this.color = 200;
  
    this.run = function() {
      // When a Button is run, calculate if mouse is on top, draw the rectangle around it, fill it in with
      // a shade of gray dependent on whether the mouse is inside or not, then the text inside
      this.calcMouse();
      this.mouseHover(mouseX, mouseY);
      stroke(0);
      strokeWeight(3);
      fill(this.color);
      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height);
      noStroke();
      fill(0);
      textSize(this.tSize);
      textAlign(CENTER, CENTER);
      text(this.buttonText, this.x, this.y);
  
      this.checkClicked(mouseX, mouseY);
      if(!mouseIsPressed) {
        this.alreadyClicked = false;
      }

      return this.alreadyClicked;
    };
  
    this.mouseHover = (mX, mY) => {
      // Darkens button if mouse inside
      if(this.mouse) {
        this.color = 150;
      }
      else {
        this.color = 200;
      }
    };
  
    this.checkClicked = (mX, mY) => {
      if(this.mouse && mouseIsPressed && !this.alreadyClicked) { // If the global mouse variable is true DON'T REGISTER CLICK!
        this.clicked();
        this.alreadyClicked = true;
        // After a click, set gMouse to true temporarily to block further clicks until mouse button released
        gMouseToggle = true;
      }
    };
  
    this.resize = function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.tSize = this.width / 10;
      this.text = formatText(this.buttonText, this.width, this.tSize);
    };
  }
}
  
class ImageObject extends GameObject {
  constructor(x, y, width, height, objImage, clicked, extendRun = 0) {
    super(x, y, width, height);
    // Vars
    this.objImage = objImage;
    this.clicked = clicked;
    this.extendRun = extendRun;
  
    this.run = function() {
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
        if(mouseIsPressed && !this.alreadyClicked && !gMouse) {
          this.clicked();
          this.alreadyClicked = true;
        }
      }
  
      // After click, when mouse released set alreadyClicked back to false to allow for another click
      if(!mouseIsPressed) {
        this.alreadyClicked = false;
      }
    };
      
    this.resize = function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    };
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

    // Translate to the x and y of the object, rotate, draw image, rotate back, translate back
    this.run = function() {
      this.rotateAmount = 360 * (this.spinCount % this.speed / this.speed);
      console.log(this.rotateAmount);
      translate(this.x, this.y);
      rotate(this.rotateAmount);
      imageMode(CENTER);
      fill("white");
      rect(0, 0, this.width, this.height);
      rotate(-this.rotateAmount);
      translate(-this.x, -this.y);
      this.spinCount++;
    };
  }
}

class ImageButton extends ImageObject {
  constructor(x, y, width, height, objImage, clicked, hoverScalar, objText) {
    super(x, y, width, height, objImage, clicked, () => this.mouseHover);
    // Vars
    this.hoverScalar = hoverScalar;
    this.minWidth = this.width;
    this.minHeight = this.height;
    this.tSize = this.width / 6;
    this.objText = formatText(objText, this.width, this.tSize);
  
    this.extendRun = function() {
      if(this.mouse && !gMouse && this.width === this.minWidth) {
        this.width *= this.hoverScalar;
        this.height *= this.hoverScalar;
      }
      else if (!this.mouse && this.width > this.minWidth) {
        this.width = this.minWidth;
        this.height = this.minHeight;
      }
      textAlign(CENTER, TOP);
      textSize(this.tSize);
      text(this.objText, this.x, this.minHeight * 1.1);
    };
  
    this.resize = function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.minWidth = this.width;
      this.minHeight = this.height;
      this.tSize = this.width / 6;
      this.objText = formatText(objText, this.width, this.tSize);
    };
  }
}
  
class ShopObject extends GameObject {
  constructor(imageWidth, imageHeight, objImage, name, metaText, price, cps) {
    // Used to construct a more complicated ImageObject. Has a set x coord, set y coord based on order of construction,
    // image width, image height (objWidth, objHeight), an image, and references to special this.clicked and this.extendRun
    // functions defined in the constructor
    super(width * 0.76, height * 0.125 * (shopNumber * 2 + 1), width * 0.0002 * imageWidth, width * 0.0002 * imageHeight);
  
    // All the variables
    this.objImage = objImage;
    this.name = name;
    this.metaText = metaText;
    this.price = price;
    this.cps = cps;
  
    this.position = shopNumber;
    this.owned = 0;
  
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
    this.scrollAmount = 0;
    this.scrollPosition = width * 0.0625;
  
    // shopNumber just keeps track of order in the shop, so that the next shopObject construction knows it comes after
    shopNumber++;
  
    // The clicked() function here checks if you have enough money then does stuff if you do
    this.clicked = function() {
      if(cookies >= this.price) {
        autoCookies += cps;
        cookies -= price;
        coinSound.play();
        this.owned++;
        this.updateText();
      }
    };
  
    // The extendRun for ShopObject draws the rectangle behind the ShopObject and it's text
    // Then, it sets a tint value for when the image is drawn (in ImageObjects run()) based on whether
    // or not the player has enough cookies. If mouse hovering, call metaTextBox
    this.run = function() {
      this.calcMouse();
  
      tint(shopTint(cookies, this.price));
      fill(0, 255);
      image(this.objImage, this.x, this.y, this.width, this.height);
  
      // Again utilizing calcMouse() and alreadyClicked to run this.clicked() on click only once
      if(this.mouse) {
        // If mouseHover exists run when mouse hovering
        if(this.mouseHover) {
          this.mouseHover();
        }
        if(mouseIsPressed && !this.alreadyClicked && !gMouse) {
          this.clicked();
          this.alreadyClicked = true;
        }
      }
      if(!mouseIsPressed) {
        this.alreadyClicked = false;
      }
        
      rectMode(CENTER);
      fill(30, 70);
      rect(this.rectX, this.y, width * 0.3, height * 0.2);
      textAlign(LEFT, CENTER);
      fill(0);
      textSize(this.tSize);
      text(this.text, this.textX, this.y);
    };
  
    // Updates the text drawn by this object when called to match current data. Run once on construction and once on purchase
    this.updateText = function() {
      this.text = this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.cps) + " CPS\nOwned: " + str(this.owned);
    };
    this.updateText();
  
    // Since shopObjects are always in the same relative spot on the screen, resize should be called with no params
    // to let this extendResize function reset the scaling and position variables
    this.resize = function() {
      this.scrollPosition = width * 0.0625;
      this.x = width * 0.76;
      this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
      this.width = width * this.objImage.width * 0.0002;
      this.height = width * this.objImage.height * 0.0002;
      this.textX = width * 0.825;
      this.tSize = 15 * scalars.textScalar;
      this.rectX = width * 0.85;
    };
  
    // mouseHover() is run in run() if it exists. Here it uses function displayTextBox() to
    // display the little box over the item with some info
    this.mouseHover = function() {
      displayTextBox(this.metaText, mouseX, mouseY);
    };
  
    this.mouseScroll = function(event) {
      if(event > 0) {
        this.scrollAmount++;
      }
      else {
        this.scrollAmount--;
      }
      this.scrollAmount = constrain(this.scrollAmount, 0, 7);
      this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;  
    };
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
  
    this.mouseScroll = function(event) {
      if(event > 0) {
        this.scrollAmount++;
      }
      else {
        this.scrollAmount--;
      }
      // this.scrollAmount = constrain(this.scrollAmount, 0, this.scrollCount);
      this.scrollAmount = constrain(this.scrollAmount, 0, this.scrollCount);
      this.deltaY = this.scrollAmount * (this.scrollDistance / this.scrollCount);
    };
      
    this.resize = function() {
      void 0;
    };
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

    this.run = function() {
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
        this.buttonClicked = this.buttonArr[i].run();
        if(this.buttonClicked === true) {
          closeDialog(1);
        }
      }

      gMouseToggle = true;
    };

    this.resize = function() {
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
    };
  }
}