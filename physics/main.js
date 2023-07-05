let avgFrames = 0;
const AVG_WEIGHT = 0.9;
const CURR_WEIGHT = 1 - AVG_WEIGHT;

let showGrid = false;

const GRID_WIDTH = 50;
const GRID_HEIGHT = GRID_WIDTH;
const POINT_SIZE = 10;

const nodes = [];
const springs = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    textAlign(LEFT, TOP);
    textSize(18);

    let n1 = new Node(50, 50);
    let n2 = new Node(100, 50);
    let n3 = new Node(50, 100);
    let n4 = new Node(100, 100);
    nodes.push(n1, n2, n3, n4);

    let s1 = new Spring(n1, n2);
    let s2 = new Spring(n2, n4);
    let s3 = new Spring(n4, n3);
    let s4 = new Spring(n3, n1);
    springs.push(s1, s2, s3, s4);
}

function draw() {
    background(0);
    fill(lerpColor(color(255, 0, 0), color(0, 255, 0), avgFrames / getTargetFrameRate()));
    text("FPS: " + nf(avgFrames, 0, 2), 0, 0);
    if (showGrid) {
        push();
        strokeWeight(POINT_SIZE);
        stroke(255);
        for (let px = 0; px < width; px += GRID_WIDTH) {
            for (let py = 0; py < height; py += GRID_HEIGHT) {
                point(px, py);
            }
        }
        pop();
    }
    for (let node of nodes) {
        node.draw(this);
    }

    for (let spring of springs) {
        spring.draw(this);
    }
    avgFrames = avgFrames * AVG_WEIGHT + frameRate() * CURR_WEIGHT;
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

const MOVEMENT_KEYS = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
function keyPressed() {
    if (MOVEMENT_KEYS.includes(key)) return; // reserved for other purposes, like eventually moving around
    else if (key == 'g') showGrid = !showGrid;
}