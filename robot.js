class Robot {
  constructor() {
    this.xPos = 0;
    this.yPos = 0;
    this.robotSize = 1;
    this.bodyColor = color(255);
    this.laserActive = false;
    this.gunColor = color(0, 0, 255); // Blue color for the gun
    this.gunColorTimer = 0;
    this.gunColorDuration = 250; // 0.25 second duration for the gun color change
  }

  display() {
    push();
    translate(this.xPos, this.yPos);
    scale(this.robotSize);

    // Body
    stroke(0);
    fill(this.bodyColor);
    arc(0, -90, 150, 300, 0, PI);

    // Head
    fill(255);
    ellipse(0, -120, 175, 125);
    strokeWeight(3);

    // Eyes
    fill(0);
    rect(-70, -135, 140, 20);
    arc(0, -115, 140, 20, 0, PI);
    fill(255);
    arc(0, -137, 140, 20, 0, PI);
    noFill();
    stroke(255);
    arc(-35, -120, 20, 5, 0, PI);
    arc(35, -120, 20, 5, 0, PI);
    stroke(0);

    // Mouth
    noFill();
    arc(0, -95, 120, 35, 0, PI);
  

    // Arms
    noFill();
    arc(-45, -14, 7.5, 80, 1.5 * PI, 0.5 * PI);
    arc(45, -14, 7.5, 80, 0.5 * PI, 1.5 * PI);

    // Gun
    fill(this.gunColor);
    ellipse(0, -150, 20, 20);
    pop();
  }

  drive() {
    this.xPos = width / 2;
    this.yPos = height / 1.2;
  }

  drawLaser() {
    if (this.laserActive) {
      stroke('#FF0000');
      strokeWeight(4);
      line(this.xPos, this.yPos - 150, mouseX, mouseY);
      noStroke();
      strokeWeight(1);
    }

    if (this.gunColor !== color(0, 0, 255)) {
      // Gun color changed, check if it's time to reset it
      if (millis() - this.gunColorTimer >= this.gunColorDuration) {
        this.gunColor = color(0, 0, 255); // Reset gun color to blue
      }
    }

  }
}
