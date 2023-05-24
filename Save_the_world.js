let myRobot;

let meteoriteArmy = [];
let meteoriteMy;
let gameScoreCalculated;
let gameScore;
let missedMeteoritesCount = 0;

let laserSound;
let winningSound;
let loserSound;

let backgroundImg;

let restartButton;
let nextLevelButton;

let gameOverFlag = false; // Flag to indicate game over state
let currentLevel = 1; // Current level
const maxLevel = 6; // Maximum level

function preload() {
  soundFormats('mp3');
  laserSound = loadSound('data/LaserSound.mp3');
  winningSound = loadSound('data/mixkit-video-game-win-2016.wav');
  loserSound = loadSound('data/mixkit-player-losing-or-failing-2042.wav')
  backgroundImg = loadImage('data/aarde.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameScoreCalculated = false;
  gameScore = 0;
  myRobot = new Robot();
  myRobot.xPos = width / 2; // Set the robot's x position to the center of the screen
  myRobot.yPos = height / 1.5; // Set the robot's y position to the center of the screen

  setupLevel(currentLevel); // Set up the initial level

  backgroundImg.resize(width, height);

  restartButton = createButton("RESTART");
  restartButton.mouseClicked(restart);
  restartButton.size(100, 50);
  restartButton.style("font-family", "Arial");
  restartButton.style("font-size", "18px");
  restartButton.position(width / 2 - 50, 350);
  restartButton.hide();

  nextLevelButton = createButton("NEXT LEVEL");
  nextLevelButton.mouseClicked(nextLevel);
  nextLevelButton.size(100, 50);
  nextLevelButton.style("font-family", "Arial");
  nextLevelButton.style("font-size", "20px");
  nextLevelButton.position(width / 2 - 50, 350);
  nextLevelButton.hide();

  // Declare variables for weather data
let weatherData;
let apiKey = 'c80c6daeb684d5fe5fe110847ede2769'; // my OpenWeatherMap API key
let city = 'Kortrijk'; 
let country = 'BE'; 

// Load weather data from API
let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;
loadJSON(weatherUrl, gotWeatherData);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  backgroundImg.resize(width, height);
}

function draw() {
  if (gameOverFlag) {
    // Draw black screen
    background(0);

    // Draw "YOU FAILED" text
    push();
    textSize(60);
    textAlign(CENTER);
    fill('#ee1423');
    text("YOU FAILED", width / 2, 200);
    pop();

    // Draw restart button
    restartButton.show();
  } else {
    // Draw game
    image(backgroundImg, 0, 0);
    myRobot.display();
    myRobot.drive();
    myRobot.drawLaser();

    let destroyedMeteorites = 0;
    for (let i = 0; i < meteoriteArmy.length; i++) {
      if (meteoriteArmy[i].alive) {
        meteoriteArmy[i].display();
        meteoriteArmy[i].drop();
        if (meteoriteArmy[i].yPos >= height / 1.2) {
          gameOver();
          return;
        }
      } else {
        destroyedMeteorites++;
      }
    }

    if (destroyedMeteorites >= meteoriteArmy.length) {
      levelComplete();
    }

    // Check for missed meteorites
    let meteoriteHit = false;
    for (let i = 0; i < meteoriteArmy.length; i++) {
      if (meteoriteArmy[i].alive && myRobot.laserActive && meteoriteArmy[i].checkHit()) {
        meteoriteHit = true;
        break;
      }
    }

    if (meteoriteHit) {
      gameScore += 5;
    } else if (myRobot.laserActive) {
      gameScore -= 1;
    }
  }
}

function gotWeatherData(data) {
  // Retrieve the weather condition ((e.g., rain, snow, clear sky, etc.))
  let weatherCondition = data.weather[0].main;

  // Modify the meteorite color based on the weather condition
  if (weatherCondition === 'Rain') {
    for (let i = 0; i < meteoriteArmy.length; i++) {
      meteoriteArmy[i].flameColor = color('#0000FF'); // Blue color
    }
  }
}

function mousePressed() {
  myRobot.laserActive = true;

  // Check for laser hit on meteorites
  for (let i = 0; i < meteoriteArmy.length; i++) {
    if (meteoriteArmy[i].checkHit()) {
      return; // Exit the function if a hit is detected
    }
  }
  // Play laser sound effect
  laserSound.play();
}

function mouseReleased() {
  myRobot.laserActive = false;

  // Check for laser hit on meteorites
  for (let i = 0; i < meteoriteArmy.length; i++) {
    if (meteoriteArmy[i].checkHit()) {
      return; // Exit the function if a hit is detected
    }
  }
}



function gameOver() {
  gameOverFlag = true;
  restartButton.show();
  loserSound.play();
  missedMeteoritesCount = 0; // Reset the missed meteorites count
}

function levelComplete() {
  if (!gameScoreCalculated) {
    gameScoreCalculated = true;
    winningSound.play();
    
  }

  if (currentLevel < maxLevel) {

    nextLevelButton.show();
    push();
    textSize(60);
    textAlign(CENTER);
    fill('#00ff00');
    text("LEVEL " + currentLevel + " COMPLETE", width / 2, 200);
    pop();
  
    push();
    textSize(30);
    textAlign(CENTER);
    fill('#00ff00');
    text("Score: " + gameScore, width / 2, 300);
    pop();
  } else {
    restartButton.show();
    // Draw black screen
    background(0);
    // Draw "YOU SAVED THE WORLD" text
    push();
    textSize(60);
    textAlign(CENTER);
    fill('#00ff00');
    text("YOU SAVED THE WORLD", width / 2, 200);
    pop();
    push();
    textSize(30);
    textAlign(CENTER);
    fill('#00ff00');
    text("Score: " + gameScore, width / 2, 300);
    pop();
  }
}

function restart() {
  gameOverFlag = false;
  restartButton.hide();
  nextLevelButton.hide();
  gameScoreCalculated = false;
  meteoriteArmy = [];
  currentLevel = 1; // Reset to level 1
  gameScore = 0; // Reset score to zero
  setupLevel(currentLevel); // Set up level 1
}

function nextLevel() {
  gameOverFlag = false;
  nextLevelButton.hide();
  gameScoreCalculated = false;
  meteoriteArmy = [];
  currentLevel++; // Move to the next level
  setupLevel(currentLevel); // Set up the next level
}

function setupLevel(level) {
  // Clear any existing meteorites
  meteoriteArmy = [];

  // Determine the number of meteorites based on the level
  let numMeteorites = level * 2;

  // Create new meteorites
  for (let i = 0; i < numMeteorites; i++) {
    let xPosMeteorite = random(0, width);
    let yPosMeteorite = random(0, 500);
    meteoriteArmy[i] = new Meteorite(xPosMeteorite, yPosMeteorite, random(1, 10), color('#009900'));
  }
}

