let x = 0, y = 0;
let dX = 5, dY = 5;
let w, h;
let fillColor;
let lastCornerFrame = -Number.MAX_VALUE;

let displayText = "Work in Progress";

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    textAlign(LEFT, TOP);
    textSize(64);
    x = width / 2;
    y = height / 2;
    w = textWidth(displayText);
    h = textSize();
    fillColor = color(255);
}

function draw() {
    background(0);
    fill(fillColor);
    if (frameCount - lastCornerFrame < 60) {
        displayText = "It hit a corner!";
        w = textWidth(displayText);
    } else {
        displayText = "Work in Progress";
        w = textWidth(displayText);
    }
    text(displayText, x, y);
    x += dX;
    y += dY;
    let w1 = w2 = w3 = w4 = false;
    if (x + w > windowWidth) {
        x = windowWidth - w;
        dX *= -1;
        fillColor = color(random(0,255), random(0,255), random(0,255));
        w1 = true;
    } else if (x < 0) {
        x = 0;
        dX *= -1;
        fillColor = color(random(0,255), random(0,255), random(0,255));
        w2 = true;
    }
    if (y + h > windowHeight) {
        y = windowHeight - h;
        dY *= -1;
        fillColor = color(random(0,255), random(0,255), random(0,255));
        w3 = true;
    } else if (y < 0) {
        y = 0;
        dY *= -1;
        fillColor = color(random(0,255), random(0,255), random(0,255));
        w4 = true;
    }

    if ((w1 && w3) || (w1 && w4) || (w2 && w3) || (w2 && w4)) {
        lastCornerFrame = frameCount;
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}