// Variabele om de robot bij te houden
let myRobot;

// Array om meteorieten bij te houden
let meteoriteArmy = [];

// Variabelen voor scores en tellingen
let gameScoreCalculated;
let gameScore;
let missedMeteoritesCount = 0;

// Geluidseffecten
let laserSound;
let winningSound;
let loserSound;

// Achtergrondafbeelding
let backgroundImg;

// Knoppen voor herstarten en volgend niveau
let restartButton;
let nextLevelButton;

// Vlag om het einde van het spel aan te geven
let gameOverFlag = false;

// Huidig niveau en maximaal niveau
let currentLevel = 1;
const maxLevel = 5;

// Functie om vooraf geladen geluidsbestanden en afbeeldingen te laden
function preload() {
  soundFormats('mp3');
  laserSound = loadSound('data/LaserSound.mp3');
  winningSound = loadSound('data/mixkit-video-game-win-2016.wav');
  loserSound = loadSound('data/mixkit-player-losing-or-failing-2042.wav')
  backgroundImg = loadImage('data/aarde.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Variabelen voor scores en tellingen initialiseren
  gameScoreCalculated = false;
  gameScore = 0;

  // Een nieuwe Robot instantie maken
  myRobot = new Robot();
  myRobot.xPos = width / 2; 
  myRobot.yPos = height / 1.5;

  // Het huidige niveau instellen
  setupLevel(currentLevel);

  // Achtergrondafbeelding formaat aanpassen aan het vensterformaat
  backgroundImg.resize(width, height);

  // Knop voor herstarten maken en instellen
  restartButton = createButton("RESTART");
  restartButton.mouseClicked(restart);
  restartButton.size(100, 50);
  restartButton.style("font-family", "Arial");
  restartButton.style("font-size", "18px");
  restartButton.position(width / 2 - 50, 350);
  restartButton.hide();

  // Knop voor volgend niveau maken en instellen
  nextLevelButton = createButton("NEXT LEVEL");
  nextLevelButton.mouseClicked(nextLevel);
  nextLevelButton.size(100, 50);
  nextLevelButton.style("font-family", "Arial");
  nextLevelButton.style("font-size", "20px");
  nextLevelButton.position(width / 2 - 50, 350);
  nextLevelButton.hide();

  // Weervariabelen
  let weatherData;
  let apiKey = 'c80c6daeb684d5fe5fe110847ede2769'; 
  let city = 'Kortrijk'; 
  let country = 'BE'; 

  // Weergegevens laden van API
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;
  loadJSON(weatherUrl, gotWeatherData);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  backgroundImg.resize(width, height);
}

function draw() {
  if (gameOverFlag) {
    // Zwarte achtergrond tekenen
    background(0);

    // "YOU FAILED" tekst tekenen
    push();
    textSize(60);
    textAlign(CENTER);
    fill('#ee1423');
    text("YOU FAILED", width / 2, 200);
    pop();

    // Herstartknop weergeven
    restartButton.show();
  } else {
    // Spel tekenen
    image(backgroundImg, 0, 0);
    myRobot.display();
    myRobot.drive();
    myRobot.drawLaser();

    let destroyedMeteorites = 0;
    for (let i = 0; i < meteoriteArmy.length; i++) { //i wordt 0 gemaakt, loop moet blijven lopen zolang i kleiner is dan var., i+1 bij elke keer doorlopen loop
      if (meteoriteArmy[i].alive) {
        meteoriteArmy[i].display(); //meteoriet (indien nog levend) oproepen
        meteoriteArmy[i].drop(); //meteoriet laten vallen
        if (meteoriteArmy[i].yPos >= height / 1.2) {
          gameOver(); //onder de onzichtbare lijn betekent game over
          return;
        }
      } else {
        destroyedMeteorites++; 
      }
    }

    if (destroyedMeteorites >= meteoriteArmy.length) {
      levelComplete(); //level is opgelost als het aantal vern. meteorieten gelijk of groter is dan de grootte van het meteorieten"leger"
    }

    // Controleren op gemiste meteorieten
    let meteoriteHit = false;
    for (let i = 0; i < meteoriteArmy.length; i++) {
      //Als alle drie de condities kloppen betekend dit dat een meteoriet is geraakt
      if (meteoriteArmy[i].alive && myRobot.laserActive && meteoriteArmy[i].checkHit()) { 
        meteoriteHit = true;
        break; 
      }
    }

    if (meteoriteHit) {

    } else if (myRobot.laserActive) {
      gameScore -= 1;
      //er gaat -1 van de score als de laser actief is en de meteoriet niet geraakt is
    }
  }
}

// Functie voor het ontvangen van weergegevens van de API
function gotWeatherData(data) {
  // Weerconditie ophalen (bijv. regen, sneeuw, heldere lucht, enz.)
  let weatherCondition = data.weather[0].main;

  // Meteorietkleur aanpassen op basis van de weersconditie
  if (weatherCondition === 'Rain') {
    for (let i = 0; i < meteoriteArmy.length; i++) {
      meteoriteArmy[i].flameColor = color('#0000FF'); // Blauwe kleur
    }
  }
}

function mousePressed() {
  myRobot.laserActive = true;
  //als de muis ingedrukt wordt is de laser actief

  // Controleren op laserhit op meteorieten
  for (let i = 0; i < meteoriteArmy.length; i++) {
    if (meteoriteArmy[i].checkHit()) {
      return; // 
    }
  }
  laserSound.play();
}

function mouseReleased() {
  myRobot.laserActive = false;

  // Controleren op laserhit op meteorieten
  for (let i = 0; i < meteoriteArmy.length; i++) {
    if (meteoriteArmy[i].checkHit()) {
      return; // De functie verlaten als een hit wordt gedetecteerd
    }
  }
}

// Functie voor het beëindigen van het spel
function gameOver() {
  gameOverFlag = true;
  restartButton.show();
  loserSound.play();
  missedMeteoritesCount = 0; 
}

// Functie voor het voltooien van een niveau
function levelComplete() {
  if (!gameScoreCalculated) {
    gameScoreCalculated = true;
    winningSound.play();
  }

  if (currentLevel < maxLevel) {
    nextLevelButton.show();
    push(); //slaat op
    textSize(60);
    textAlign(CENTER);
    fill('#00ff00');
    text("LEVEL " + currentLevel + " COMPLETE", width / 2, 200);
    pop(); //herstelt
  
    push();
    textSize(30);
    textAlign(CENTER);
    fill('#00ff00');
    text("Score: " + gameScore, width / 2, 300);
    pop();
  } else {
    restartButton.show();
    // Zwarte achtergrond tekenen
    background(0);
    // "YOU SAVED THE WORLD" tekst tekenen
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

// Functie voor het herstarten van het spel
function restart() {
  gameOverFlag = false;
  restartButton.hide();
  nextLevelButton.hide();
  gameScoreCalculated = false;
  meteoriteArmy = [];
  currentLevel = 1; // Terug naar niveau 1
  gameScore = 0; // Score resetten naar nul
  setupLevel(currentLevel); // Niveau 1 instellen
}

// Functie voor het volgende niveau
function nextLevel() {
  gameOverFlag = false;
  nextLevelButton.hide();
  gameScoreCalculated = false;
  meteoriteArmy = [];
  currentLevel++; // Naar het volgende niveau gaan
  setupLevel(currentLevel); // Het volgende niveau instellen
}

// Functie voor het instellen van een niveau
function setupLevel(level) {
  // Bestaande meteorieten wissen
  meteoriteArmy = [];

  // Het aantal meteorieten bepalen op basis van het niveau
  let numMeteorites = level * 2;

  // Nieuwe meteorieten maken
  for (let i = 0; i < numMeteorites; i++) {
    let xPosMeteorite = random(0, width);
    let yPosMeteorite = random(0, 500);
    meteoriteArmy[i] = new Meteorite(xPosMeteorite, yPosMeteorite, random(1, 10), color('#009900'));
  }
}

