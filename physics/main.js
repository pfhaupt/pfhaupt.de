let avgFrames = 0;
const AVG_WEIGHT = 0.9;
const CURR_WEIGHT = 1 - AVG_WEIGHT;

let showGrid = true;
let update = true;

const GRID_WIDTH = 50;
const GRID_HEIGHT = GRID_WIDTH;
const POINT_SIZE = 10;

const UPDATE_COUNT = 1;

const nodes = [];
const springs = [];

let gravity;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    textAlign(LEFT, TOP);
    textSize(18);

    // Hardcoded test - Next step: Click on grid to place Nodes
    let n1 = new Node(50, 50);
    let n2 = new Node(100, 50);
    let n3 = new Node(50, 100);
    let n4 = new Node(100, 100);
    let n5 = new Node(300, 300);
    nodes.push(n1, n2, n3, n4, n5);

    let s1 = new Spring(n1, n2);
    let s2 = new Spring(n2, n4);
    let s3 = new Spring(n4, n3);
    let s4 = new Spring(n3, n1);
    let s5 = new Spring(n1, n4);
    let s6 = new Spring(n2, n3);
    let s7 = new Spring(n4, n5);
    springs.push(s1, s2, s3, s4, s5, s6, s7);
    
    n5.frozen = true;

    gravity = createVector(0, 0.05);
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
    for (let spring of springs) {
        spring.draw(this);
    }
    for (let node of nodes) {
        node.draw(this);
    }
    if (update) {
        for (let i = 0; i < UPDATE_COUNT; i++) {
            for (let spring of springs) {
                spring.update();
            }
            for (let node of nodes) {
                node.applyForce(gravity);
                node.update();
            }
        }
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
    else if (key == ' ') update = !update;
}