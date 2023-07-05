
class Spring {

    constructor(nodeA, nodeB, defaultRate = 1) {
        this.start = nodeA;
        this.end = nodeB;
        this.rate = defaultRate;
    }

    draw(canvas) {
        canvas.push();
        canvas.stroke(255);
        canvas.line(this.start.x, this.start.y, this.end.x, this.end.y);
        canvas.pop();
    }
}