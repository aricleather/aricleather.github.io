// Interactive Scene
// Aric Leather
// Date: March 4, 2019
// 
// Mouse incorporation: clicking on cookie and store stuff, keyboard incorporation: press R key to reset game
//
// Extra for Experts:
// - My game can successfully handle window resizing, in terms of scaling and canvas
// - My game incorporates sound effects

// Nothing yet

let animationState = false;
let animation;

function startAnimation(whichAnimation) {
  // When called, generate the correct animation object and set it to animation,
  // then set animationState to true so that the animation will be run by displayAnimation in draw loop
  if(whichAnimation === "newGameAnimation") {
    animation = new NewGameAnimation;
    animationState = true;
  }
}

function displayAnimation() {
  // If an animation was called, run it while animationState is true
  if(animationState) {
    animation.run();
  }
  else {
    animation = null;
  }
}

class NewGameAnimation {
  // When the new game animation is called and run, a black box covers the screen before 
  // giving the player an introduction
  constructor() {
    this.animationPhase = 0;
    this.rectWidth = 0;
    this.dRectWidth = 1;
    this.tSize = width / 40;
    this.x = width / 2;
    this.y = height / 3;
    this.fullText = "A novice cookie baker,\n" +
                    "you have but one goal:\n" +
                    "take over the world.";
  }

  run() {
    // User cannot make any input during anim
    gMouseToggle = 2;
    if(this.animationPhase === 0) {
      // Phase 1: Black rectangle slowly envelops screen, accelerating (dRectWidth)
      fill(0);
      rectMode(CORNER);
      rect(width, 0, this.rectWidth, height);
      this.rectWidth -= this.dRectWidth;
      this.dRectWidth += 1;

      // Move to next phase when rectangle covers screen
      if(-this.rectWidth > width) {
        this.animationPhase = 1;
        gameState = 3;
        // Set up for next phase, initial vals
        this.nextLetterTime = millis() + 250;
        this.currentText = "";
      }
    }

    else if(this.animationPhase === 1) {
      // Phase 2, draw intro text to screen before starting game
      fill(0);
      rect(0, 0, width, height);
      textAlign(CENTER, TOP);
      textSize(this.tSize);
      fill(255);
      text(this.currentText, this.x, this.y);
      if(millis() > this.nextLetterTime) {
        // Switch to next phase once text is done writing itself out
        if(this.currentText.length === this.fullText.length){
          // Set up for next phase
          this.fadeOutTime = millis() + 3000;
          this.animationPhase = 2;
          this.textAlpha = 255;
        }
        // Every 50ms add next character to text being drawn
        this.currentText = this.currentText + this.fullText[this.currentText.length];
        textBlip.play();
        // Unless that character is a new line, then wait a full second for emphasis
        if(this.currentText[this.currentText.length - 1] === "\n") {
          this.nextLetterTime = millis() + 1000;
        }
        else {
          this.nextLetterTime = millis() + 50;
        }
      }
    }

    else if(this.animationPhase === 2) {
      // Keep text on screen, fade out after 3 seconds
      fill(0);
      rect(0, 0, width, height);
      textAlign(CENTER, TOP);
      textSize(this.tSize);
      fill(255, this.textAlpha);
      text(this.fullText, this.x, this.y);
      if(millis() > this.fadeOutTime) {
        this.textAlpha -= 8.5;
        if(this.textAlpha <= 0) {
          // Once text is faded, next phase, set up here
          this.animationPhase = 3;
          this.rectWidth = width;
          this.dRectWidth = 1;
          this.endTime = millis() + 500;
          gameState = 1;
        }
      }
    }
    else {
      // Black rectangle covering screen pulls away from screen in same fashion it entered
      fill(0);
      rect(0, 0, this.rectWidth, height);
      if(millis() > this.endTime) {
        this.rectWidth -= this.dRectWidth;
        this.dRectWidth += 1;
        if(this.rectWidth <= 0) {
          animationState = false;
        }
      }
    }
  }
}