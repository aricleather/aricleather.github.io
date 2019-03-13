let tic;
let turn = 1;
let winState = 0;

function setup() {
  createCanvas(300, 300);
	textAlign(CENTER, CENTER);
	textSize(100);
	initBoard();
}

function draw() {
	drawBoard();
	if (turn === 1) {
		text("X", mouseX, mouseY);
	}
	if (turn === 2) {
		text("O", mouseX, mouseY);
	}
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

function drawBoard() {
	background(255);
	line(100, 0, 100, height);
	line(200, 0, 200, height);
	line(0, 100, width, 100);
	line(0, 200, width, 200);
}

function initBoard() {
	tic = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
}

function mousePressed() {
	let temp1 = Math.floor(mouseX/100);
	let temp2 = Math.floor(mouseY/100);
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

function winner() {
	for(let i = 0; i < tic.length; i++) {
		winState = isWinner(tic[i][0], tic[i][1], tic[i][2]);
		// print(winState);
	}
	if (winState > 0) {
		if (winState === 1) {
			textSize(10);
			text("Player 1 wins!", width/2, height/2);
			noLoop();
		}
	}
}

function isWinner(a, b, c) {
	print(str(a) + str(b) + str(c));
	if(a > 0 && b > 0 && c > 0) {
		if (a === b && b === c) {
			return a;
		}
		else {
			return 0;
		}
	}
	else {
		return 0;
	}
}