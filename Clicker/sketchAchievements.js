// Where I will store my big JSON with achievement data, and the functions to edit and display it

let achievements;
let trackedAchievement;

function updateAchievements() {
  achievements.clicks.update();
}

function initAchievements() {
  achievements = {
    clicks: {
      tiers: 3,
      tier: 0,
      goals: [10, 1000, 1000000],
      text: "Click 10 times.",
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
      },

      buildObj: function() {
        this.obj = new AchievementObject(clickUpgrade.width, clickUpgrade.height, clickUpgrade, 3, this.tier, this.init, this.goals, "Don't break mouse", this.text);
      }
    }
  };

  achievements.clicks.init();
  achievements.clicks.buildObj();

  trackedAchievement = achievements.clicks;
}

function displayTrackedAchievment() {
  if(trackedAchievement) {
    // Achievement goal text
    fill(0);
    textSize(15);
    text(trackedAchievement.text, width / 2, height * 0.98);

    // The green inside
    strokeWeight(3);
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
  achievements.clicks.obj.run();
  closeAchievementsButton.run();
}