
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(canvas) {
        canvas.push();
        canvas.strokeWeight(4);
        canvas.stroke(255);
        canvas.point(this.x, this.y);
        canvas.pop();
    }
}