let gameState = 0;
let charX;
let charSize = 50;
let dJump = 0;
let charAcc = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  
  charX = width / 2;
}

function draw() {
  background(220);
  drawWorld();
  drawCharacter();
  characterPhysics();
  checkKey();
}

function drawWorld() {
  line(0, 0.9 * height, width, 0.9 * height);
}

function drawCharacter() {
  fill(0);
  rect(charX, 0.9 * height - charSize - dJump, charSize, charSize);
}

function characterPhysics() {
  // Apply physics
  dJump += charAcc;
  if(dJump !== 0) {
    charAcc -= 1.5;
  }
  else {
    charAcc = 0;
  }

  // If the jump would place the character below the ground, place it on ground instead
  if(dJump < 0) {
    dJump = 0;
  }
}

function checkKey() {
  if(keyIsDown(68)) {
    charX += 5;
  }
  if(keyIsDown(65)) {
    charX -= 5;
  }
}

function keyPressed() {
  console.log('test');
  if((key === "w" || key === "W") && dJump === 0) {
    charAcc = 25;
  }
}
