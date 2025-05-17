let mic, fft;
let cam;
let blurBuffer, blurMask;
let vinylRadius;

let volumeHistory = [];
let dotHistory = [];
let symbolHistory = [];
let pulseCircles = [];

let angle = 0;
let radiusOffset = 0;
let isRecording = false;
let rotationAngle = 0;
let micStarted = false;
let isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

function setup() {
  let s = min(windowWidth, windowHeight);
  createCanvas(s, s);
  angleMode(DEGREES);
  textFont('monospace');
  fft = new p5.FFT();

  cam = createCapture(VIDEO);
  cam.size(width, height);
  cam.hide();

  vinylRadius = s * 0.35;
  blurBuffer = createGraphics(width, height);
  blurMask = createGraphics(width, height);
}

function draw() {
  background(0);
  image(cam, 0, 0, width, height);

  blurBuffer.image(cam, 0, 0, width, height);
  blurBuffer.filter(BLUR, 6);
  blurMask.background(0);
  blurMask.noStroke();
  blurMask.fill(255);
  blurMask.ellipse(width / 2, height / 2, vinylRadius * 0.6);
  let masked = blurBuffer.get();
  masked.mask(blurMask.get());
  image(masked, 0, 0);

  push();
  translate(width / 2, height / 2);
  if (isRecording) rotationAngle += 0.1;
  rotate(rotationAngle);

  drawVinyl();

  if (isRecording && mic) {
    let level = mic.getLevel();
    let bass = fft.getEnergy("bass");
    let treble = fft.getEnergy("treble");

    let r = vinylRadius * 0.4 + radiusOffset + random(-1, 1);
    let a = angle - 90 + random(-0.6, 0.6);

    //volume
    if (level > 0.02) {
      if (random() < 0.35) {
        let h = map(level, 0, 0.3, 0, 200);
        volumeHistory.push({ angle: a, radius: r, height: h });
      }

      if (frameCount % 30 === 0) {
        symbolHistory.push({ angle: a, radius: r, symbol: "♒︎", size: 20 });
      }

      if (random() < 0.2) {
        dotHistory.push({ angle: a + random(-10, 10), radius: r + random(-8, 8), size: random(3, 6) });
      }

      //wave ring
      let waveformTrigger = isMobile
        ? (level > 0.000005 || bass > 0.5)
        : (level > 0.04 || bass > 30);

      if (waveformTrigger) {
        let ringR = random(10, 40);
        let maxR = vinylRadius * 0.95 - ringR;
        let pos;
        do {
          pos = {
            x: random(-maxR, maxR),
            y: random(-maxR, maxR)
          };
        } while (dist(0, 0, pos.x, pos.y) > vinylRadius - ringR);

        pulseCircles.push({ x: pos.x, y: pos.y, r: ringR, alpha: 255 });
      }
    }

    angle += random(0.6, 1.2);
    radiusOffset += random(0.02, 0.07);
    if (r > vinylRadius) {
      angle = 0;
      radiusOffset = 0;
    }
  }

  stroke(255);
  strokeWeight(0.5);
  for (let v of volumeHistory) {
    if (v.height !== null) {
      let x1 = v.radius * cos(v.angle);
      let y1 = v.radius * sin(v.angle);
      let x2 = (v.radius - v.height) * cos(v.angle);
      let y2 = (v.radius - v.height) * sin(v.angle);
      line(x1, y1, x2, y2);
    }
  }

  fill(255, 200);
  noStroke();
  for (let d of dotHistory) {
    let x = d.radius * cos(d.angle);
    let y = d.radius * sin(d.angle);
    ellipse(x, y, d.size);
  }

  for (let s of symbolHistory) {
    let x = s.radius * cos(s.angle);
    let y = s.radius * sin(s.angle);
    push();
    translate(x, y);
    rotate(s.angle);
    fill(255);
    stroke(0);
    strokeWeight(0.5);
    textAlign(CENTER, CENTER);
    textSize(s.size || 16);
    text(s.symbol, 0, 0);
    pop();
  }

  for (let i = pulseCircles.length - 1; i >= 0; i--) {
    let c = pulseCircles[i];
    stroke(255, c.alpha);
    strokeWeight(1);
    noFill();
    const spacing = 20;
    const segments = int(TWO_PI * c.r / spacing);
    for (let j = 0; j < segments; j++) {
      let angle = j * (360 / segments);
      let x = c.x + c.r * cos(angle);
      let y = c.y + c.r * sin(angle);
      ellipse(x, y, 3);
    }
    c.alpha -= 3;
    if (c.alpha <= 0) pulseCircles.splice(i, 1);
  }

  if (isRecording) {
    noFill();
    stroke(255, 60);
    strokeWeight(1);
    ellipse(0, 0, vinylRadius * 0.15 + sin(frameCount * 1.5) * 4);
  }
  pop();

  resetMatrix();
  textFont('monospace');
  textSize(10);
  fill(255);
  noStroke();
  textAlign(LEFT, BOTTOM);

let legend = [
  "◌   Pulse",
  "♒︎   Rhythm",
  "•   White Noise",
  "|   Amplitude"
];

for (let i = 0; i < legend.length; i++) {
  text(legend[i], 10, height - 40 - i * 12);
}

  let now = new Date();
  let dateStr = now.toLocaleDateString();
  let timeStr = now.toLocaleTimeString();

  textAlign(LEFT, TOP);
  text(dateStr, 10, 10);
  textAlign(RIGHT, TOP);
  text(timeStr, width - 10, 10);

  textAlign(CENTER, BOTTOM);
  text(isRecording ? "Detecting sound" : "Paused", width / 2, height - 8);
}

function drawVinyl() {
  noStroke();
  fill(255, 25);
  ellipse(0, 0, vinylRadius * 2.1);
  stroke(100, 15);
  noFill();
  for (let r = vinylRadius * 0.5; r < vinylRadius; r += 5) {
    ellipse(0, 0, r * 2);
  }
  noStroke();
  fill(220, 50);
  ellipse(0, 0, vinylRadius * 0.3);
  fill(180, 80);
  ellipse(0, 0, vinylRadius * 0.05);
}

function mousePressed() { toggleRecording(); }
function touchStarted() { toggleRecording(); }

function toggleRecording() {
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  if (d < vinylRadius * 0.15) {
    if (!micStarted) {
      mic = new p5.AudioIn();
      mic.start(() => {
        fft.setInput(mic);
        micStarted = true;
        isRecording = true;
      });
    } else {
      isRecording = !isRecording;
    }
  }
}

function windowResized() {
  let s = min(windowWidth, windowHeight);
  resizeCanvas(s, s);
  vinylRadius = s * 0.35;
  blurBuffer = createGraphics(width, height);
  blurMask = createGraphics(width, height);
}
