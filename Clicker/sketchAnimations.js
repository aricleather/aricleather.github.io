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
  if(whichAnimation === "newGameAnimation") {
    animation = new NewGameAnimation;
    animationState = true;
    console.log("Animation created.");
  }
}

function displayAnimation() {
  if(animationState > 0) {
    animation.run();
  }
}

class NewGameAnimation {
  // When the new game animation is called and run, a black box covers the screen before 
  // giving the player an introduction
  constructor() {
    this.animationPart = 0;
    this.rectWidth = 0;
    this.dRectWidth = 1;
  }

  run() {
    if(this.animationPart === 0) {
      gMouseToggle = 2;
      fill(0);
      rectMode(CORNER);
      rect(width, 0, this.rectWidth, height);
      this.rectWidth -= this.dRectWidth;
      this.dRectWidth += 1;
    }
  }
}