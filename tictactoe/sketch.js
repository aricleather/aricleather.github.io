let tic;
let turn = 1;
let winState = 0;
let gameState = 0;

function setup() {
	// Create a canvas and call initBoard()
  createCanvas(300, 300);
	textAlign(CENTER, CENTER);
	initBoard();
}

function draw() {
  // Draw the board, draw the "X" or "Y" on screen based on who's turn it is,
  // read the game board from "tic" and draw X's and Y's in the proper positions
  drawBoard();

  if(gameState === 0) {
    if (turn === 1) {
      text("X", mouseX, mouseY);
    }
    if (turn === 2) {
      text("O", mouseX, mouseY);
    }
  }
  else {
    onWin();
  }
}

function drawBoard() {
  // White background, 2 horizontal lines, 2 vertical lines
	background(255);
	line(100, 0, 100, height);
	line(200, 0, 200, height);
	line(0, 100, width, 100);
  line(0, 200, width, 200);
  
  // Draw X's and Y's that have been placed on board
  textSize(100);
	for(let i = 0; i < tic.length; i++) {
		for(let j = 0; j < tic[i].length; j++) {
			if (tic[i][j] === 1) {
				text("X", i * 100 + 50, j * 100 + 50);
			}
			else if (tic[i][j] === 2) {
				text("O", i * 100 + 50, j * 100 + 50);
			}
    }
  }
}

function initBoard() {
  // Set tic to an empty board. 0 denotes an empty space
	tic = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
}

function mousePressed() {
  if(gameState === 0) {
    // Use floor to find which tile the mouse is in
    let temp1 = Math.floor(mouseX/100);
    let temp2 = Math.floor(mouseY/100);
    // If the tile is empty, set that tile to turn. Turn can be "1" which will
    // denote an "X", or a "2" which will denote a "Y". Then check if someone won
    if (tic[temp1][temp2] === 0) {
      tic[temp1][temp2] = turn;
      if (turn === 1) {
        turn = 2;
      }
      else {
        turn = 1;
      }
    }
    winner();
  }
}

function onWin() {
  if (winState === 1) {
    textSize(50);
    text("Player 1 wins!", width/2, height/2);
  }
  else {
    textSize(50);
    text("Player 2 wins!", width/2, height/2);
  }
}

function winner() {
	for(let i = 0; i < tic.length; i++) {
		winState = isWinner();
		// print(winState);
	}
	if (winState > 0) {
    gameState = 1;
	}
}

function isWinner() {
  // Check vertical and horizontal lines
  for(let i = 0; i < 3; i++) {
    if((tic[0][i] === tic[1][i] && tic[1][i] === tic[2][i]) ||
      (tic[i][0] === tic[i][1] && tic[i][1] === tic[i][2])) {
        return tic[i][i];
    }
  }
  // Check for diagonals
  if(tic[0][0] === tic[1][1] && tic[1][1] === tic[2][2]) {
    return tic[0][0];
  }
  if(tic[0][2] === tic[1][1] && tic[1][1] === tic[2][0]) {
    return tic[0][2];
  }
  return 0;
}