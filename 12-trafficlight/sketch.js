// Traffic Light Starter Code
// Dan Schellenberg
// Sept 25, 2018

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/

let state = 1;
let milliseconds;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  drawOutlineOfLights();
  determineColour();
  fillLight();
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

  //lights
  fill(255);
  ellipse(width/2, height/2 - 65, 50, 50); //top
  ellipse(width/2, height/2, 50, 50); //middle
  ellipse(width/2, height/2 + 65, 50, 50); //bottom
}

function determineColour() {
  milliseconds = millis();
  if (state === 1 && milliseconds % 7500 < 5000 && milliseconds % 7500 >= 2500) {
    state = 2;
  }
  else if (state === 2 && milliseconds % 7500 < 7500 && milliseconds % 7500 >= 5000) {
    state = 3;
  }
  else if (state === 3 && milliseconds % 7500 > 0 && milliseconds % 7500 < 2500) {
    state = 1;
  }
}

function fillLight() {
  if (state === 1) {
    fill("green");
    ellipse(width/2, height/2 + 65, 50, 50);
  }
  else if (state === 2) {
    fill("yellow");
    ellipse(width/2, height/2, 50, 50);
  }
  else {
    fill("red");
    ellipse(width/2, height/2 - 65, 50, 50);
  }
}