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
    tiers: 3,
    tier: 0,
    text: "",
    goals: [10, 1000, 1000000],
    completion: 0,
    update: function() {
      this.completion = clicks / this.goals[this.tier];
      if(this.completion >=1 ){ 
        this.nextTier();
      }
    },
    nextTier: function() {
      this.tier++;
      this.completion = clicks / this.goals[this.tier];
      this.text = "Click " + this.goals[this.tier] + " times.";
    },
    init: function() {
      this.text = "Click " + this.goals[this.tier] + " times.";
      this.completion = clicks / this.goals[this.tier];
    }
  }
};

let trackedAchievement = achievements.clicks;

function updateAchievements() {
  achievements.clicks.update();
}

function initAchievements() {
  achievements.clicks.init();
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
    rect(width / 3, height * 0.93, trackedAchievement.completion * width / 3, height * 0.02);

    stroke(0);
    noFill();
    rect(width / 3, height * 0.93, width / 3, height * 0.02);
  }
}