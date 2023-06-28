// Class representing a meteorite object in a game.
class Meteorite {
  // Constructor for creating a new meteorite object.
  // Takes initial position (xPosP, yPosP), speed (speedP),
  // and body color (bodyColorP) as parameters.
  constructor(xPosP, yPosP, speedP, bodyColorP) {
    // Initialize the meteorite's position, speed, color, size, and state.
    this.xPos = xPosP; // X position of the meteorite
    this.yPos = yPosP; // Y position of the meteorite
    this.xSpeed = speedP * 0.5; // X-axis speed of the meteorite (slower speed)
    this.ySpeed = speedP * 0.5; // Y-axis speed of the meteorite (slower speed)
    this.bodyColor = bodyColorP; // Color of the meteorite's body
    this.meteoriteSize = 1; // Scale factor for the size of the meteorite
    this.alive = true; // Flag indicating if the meteorite is alive (not hit)
    this.flameColor = color('#ef0f0f'); // Color of the meteorite's flame
    this.reset(); // Reset the meteorite's position
  }

  // Display the meteorite on the game screen.
  display() {
    push();
    translate(this.xPos, this.yPos);
    scale(this.meteoriteSize);

    noStroke();

    fill(this.flameColor); // Change color if it's raining or not
    triangle(-10, -10, 0, -40, 10, -10); // Shape representing the meteorite's flame

    fill('#8f4a23'); // Brown color for meteorite
    ellipse(0, 0, 30, 30); // Shape representing the meteorite's body

    pop();
  }

  // Move the meteorite downwards based on its speed.
  drop() {
    this.yPos += this.ySpeed;
  }

  // Reset the meteorite's position to a random location above the screen.
  reset() {
    this.yPos = random(-500, -50);
  }

  // Check if the meteorite has been hit by the mouse pointer.
  checkHit() {
    if (dist(mouseX, mouseY, this.xPos, this.yPos) < 40) {
      this.alive = false; // Set the meteorite as not alive (hit)
      gameScore += 10; // Increase the game score by 10

      // Change the gun color to red
      myRobot.gunColor = color(255, 0, 0);
      myRobot.gunColorTimer = millis();
    }
  }
}
