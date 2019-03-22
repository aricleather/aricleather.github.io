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

let animationState = 0;
let animations = [];

function startAnimation(whichAnimation) {
  if(whichAnimation === "newGameAnimation") {
    animationState = 1;
  }
}

function displayAnimation() {
  if(animationState > 0) {
    animations[animationState - 1].run();
  }
}

class NewGameAnimation {
  constructor() {
    this.animationPart = 0;
    this.rectWidth = width;
  }

  run() {
    if(this.animationPart === 0) {
      fill(0);
      rectMode(CORNER);
      rect(width, 0, this.rectWidth, height);
      this.rectWidth -= 5;
    }
  }
}

function initAnimations() {
  animations.push(new NewGameAnimation);
}
