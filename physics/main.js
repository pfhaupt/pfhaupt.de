let avgFrames = 0;
const AVG_WEIGHT = 0.9;
const CURR_WEIGHT = 1 - AVG_WEIGHT;

let showGrid = false;
let update = false;
let showMenu = true;

const GRID_WIDTH = 50;
const GRID_HEIGHT = GRID_WIDTH;
const POINT_SIZE = 10;

const NODE_SIZE = 15;

const MS_PER_TICK = 1;

const Mode = {
    NONE: 0,
    CREATE_NODE: 1,
    FREEZE_NODE: 2,
    CREATE_SPRING: 3
}
const MODE_COUNT = Object.keys(Mode).length;

let mode = Mode.NONE;

const nodes = [];
const springs = [];

let gravity;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    textAlign(LEFT, TOP);
    textSize(18);

    // Hardcoded test
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

let timeAccumulator = 0;
function draw() {
    if (update) timeAccumulator += deltaTime;
    background(0);
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

    while (timeAccumulator > MS_PER_TICK) {
        for (let spring of springs) {
            if (!spring.update()) {
                springs[springs.indexOf(spring)] = null;
            }
        }
        springs.splice(0, springs.length,...springs.filter((s) => s !== null));
        for (let node of nodes) {
            node.checkCollision(springs);
            node.applyForce(gravity);
            if (!node.update()) {
                nodes[nodes.indexOf(node)] = null;
            }
        }
        nodes.splice(0, nodes.length,...nodes.filter((n) => n !== null));
        timeAccumulator -= MS_PER_TICK;
    }

    if (showMenu) showStats(deltaTime);

    avgFrames = avgFrames * AVG_WEIGHT + frameRate() * CURR_WEIGHT;
}

function showStats(deltaTime) {
    let str = [];
    let y = textSize();
    const appendStr = (s) => {
        str.push(s);
        y = y + textSize();
    }
    appendStr("Show Grid: " + showGrid);
    appendStr("Update: " + update);
    appendStr("Updates per frame: " + deltaTime / MS_PER_TICK);
    appendStr("Mode: " + Object.keys(Mode)[mode]);
    
    switch (mode) {
        case Mode.NONE: {
            appendStr("No mode active.");
            break;
        }
        case Mode.CREATE_NODE: {
            appendStr("Click on the grid to place a Node.");
            break;
        }
        case Mode.FREEZE_NODE: {
            appendStr("Click on a Node to (un-)freeze it.");
            appendStr("Frozen Nodes are not affected by gravity.");
            break;
        }
        case Mode.CREATE_SPRING: {
            appendStr("Click on a Node to select it as part of a Spring.");
            appendStr("Click on another Node to create a Spring.");
            break;
        }
        default: {
            appendStr("no text yet");
        }
    }
    
    appendStr("");
    appendStr("Press Space to enable/disable Updates.");
    appendStr("Press `p` to switch between Modes.");
    appendStr("Press `g` to show/hide the grid.");
    appendStr("Press `h` to show/hide this Menu.");

    const alpha = 100;
    push();
    noStroke();
    fill(255, alpha);
    rect(0, 0, 400, y);
    fill(lerpColor(color(255, 0, 0), color(0, 255, 0), avgFrames / getTargetFrameRate()));
    text("FPS: " + nf(avgFrames, 0, 2), 0, 0);
    fill(0);
    y = textSize();
    for (let s of str) {
        text(s, 0, y);
        y += textSize();
    }
    pop();
}

let firstNode = null;
let secondNode = null;

function mousePressed() {
    const resetFirst = () => {
        if (firstNode) firstNode.selected = false;
        firstNode = null;
    }
    const resetSecond = () => {
        if (secondNode) secondNode.selected = false;
        secondNode = null;
    }
    const resetBoth = () => {
        resetFirst();
        resetSecond();
    }
    if (mode !== Mode.CREATE_SPRING) resetBoth();
    let x = mouseX / GRID_WIDTH;
    let y = mouseY / GRID_HEIGHT;
    if (mode === Mode.CREATE_NODE) {
        x = Math.round(x);
        y = Math.round(y);
    }
    x *= GRID_WIDTH;
    y *= GRID_HEIGHT;
    let node = findNodeAtPosition(x, y);
    switch (mode) {
        case Mode.NONE:
            break;
        case Mode.CREATE_NODE:
            if (dist(mouseX, mouseY, x, y) > POINT_SIZE) return; // Did not click on grid point
            if (node === null) nodes.push(new Node(x, y));
            break;
        case Mode.FREEZE_NODE:
            if (node !== null) node.frozen = !node.frozen;
            break;
        case Mode.CREATE_SPRING:
            if (node === null) return;
            if (node.equals(firstNode)) {
                // unselect
                resetFirst();
                return;
            }
            if (node.equals(secondNode)) {
                // unselect
                resetSecond();
                return;
            }
            node.selected = true;
            if (firstNode === null) {
                firstNode = node;
                return;
            }
            if (secondNode === null) {
                secondNode = node;
            }
            if (firstNode === null || secondNode === null) return;
            else if (firstNode.equals(secondNode)) {
                resetBoth();
                return;
            }
            let s = new Spring(firstNode, secondNode);
            for (let spr of springs) {
                if (spr.equals(s)) {
                    // Spring already exists
                    resetBoth();
                    return;
                }
            }
            springs.push(s);
            resetBoth();
            break;
        default:
            console.warn("not implemented");
    }
}

function findNodeAtPosition(x, y) {
    let newNode = new Node(x, y);
    let node = null;
    for (let n of nodes) {
        if (n.equals(newNode)) {
            node = n;
            break;
        }
    }
    return node;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

const MOVEMENT_KEYS = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
function keyPressed() {
    if (MOVEMENT_KEYS.includes(key)) return; // reserved for other purposes, like eventually moving around
    else if (key == 'g') showGrid = !showGrid;
    else if (key == ' ') update = !update;
    else if (key == 'p') mode = (mode + 1) % MODE_COUNT;
    else if (key == 'h') showMenu = !showMenu;
}