// Where I will store my big JSON with achievement data, and the functions to edit and display it

achievements = {
  clicks: {
    tiers: 3,
    tier: 0,
    text: "",
    goals: [10, 1000, 1000000],
    completion: 0,
    position: 0,

    update: function() {
      this.completion = clicks / this.goals[this.tier];
      if(this.completion >=1 ){ 
        this.nextTier();
      }
    },

    nextTier: function() {
      this.tier++;
      playerLevel++;
      this.completion = clicks / this.goals[this.tier];
      this.text = "Click " + this.goals[this.tier] + " times.";
    },

    init: function() {
      this.tier = clicks < 10 ? 0 : clicks < 1000 ? 1 : clicks < 1000000 ? 2 : 3;
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

    // The green inside
    rectMode(CORNER);
    noStroke();
    fill("green");
    rect(width / 3, height * 0.93, trackedAchievement.completion * width / 3, height * 0.02);

    // The box around
    stroke(0);
    noFill();
    rect(width / 3, height * 0.93, width / 3, height * 0.02);
  }
}

function displayAchievementsMenu() {
  void 0;
  // My next thing to do
}