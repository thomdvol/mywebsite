class Meteorite {
  constructor(xPosP, yPosP, speedP, bodyColorP) {
    this.xPos = xPosP;
    this.yPos = yPosP;
    this.xSpeed = speedP * 0.5; // Slower speed
    this.ySpeed = speedP * 0.5; // Slower speed
    this.bodyColor = bodyColorP;
    this.meteoriteSize = 1;
    this.alive = true;
    this.flameColor = color('#ef0f0f');
    this.reset();
  }

  display() {
    push();
    translate(this.xPos, this.yPos);
    scale(this.meteoriteSize);

    noStroke();

    fill(this.flameColor); // change color if it's raining or not
    triangle(-10, -10, 0, -40, 10, -10);

    fill('#8f4a23'); // Brown color for meteorite
    ellipse(0, 0, 30, 30);

    pop();
  }

  drop() {
    this.yPos += this.ySpeed;
  }

  reset() {
    this.yPos = random(-500, -50);
  }

  checkHit() {
    if (dist(mouseX, mouseY, this.xPos, this.yPos) < 40) {
      this.alive = false;
      gameScore += 10;
      // Change the gun color to red
      myRobot.gunColor = color(255, 0, 0);
      myRobot.gunColorTimer = millis();
    }
  }
}
