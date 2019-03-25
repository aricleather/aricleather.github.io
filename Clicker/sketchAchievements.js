// Interactive Scene
// Aric Leather
// Date: March 4, 2019
// 
// Mouse incorporation: clicking on cookie and store stuff, keyboard incorporation: press R key to reset game
//
// Extra for Experts:
// - My game can successfully handle window resizing, in terms of scaling and canvas
// - My game incorporates sound effects

achievements = {
  clicks: {
    tier1: {
      text: "Click 10 times.",
      // completion: clicks / 10,
    },
    tier2: {
      text: "Click 1,000 times.",
      // completion: clicks / 1000,

    },
    tier3: {
      text: "Click 1,000,000 times.",
      // completion: clicks / 1000000,
    },
  },
};

let trackedAchievement = achievements.clicks.tier1;

function updateAchievements() {
  void 0;
}

function displayTrackedAchievment() {
  if(trackedAchievement) {
    // Achievement goal text
    fill(0);
    textSize(15);
    text(trackedAchievement.text, width / 2, height * 0.98);

    rectMode(CORNER);
    noStroke();
    fill("green");
    rect(width / 3, height * 0.93, clicks/10 * width / 3, height * 0.02);

    stroke(0);
    noFill();
    rect(width / 3, height * 0.93, width / 3, height * 0.02);
  }
}