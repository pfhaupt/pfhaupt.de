
class Spring {
    constructor(nodeA, nodeB, defaultRate = 0.1) {
        this.start = nodeA;
        this.end = nodeB;
        nodeA.connected.push(nodeB);
        nodeB.connected.push(nodeA);
        this.rate = defaultRate;
        this.restLength = dist(this.start.position.x, this.start.position.y, this.end.position.x, this.end.position.y);
    }

    draw(canvas) {
        canvas.push();
        canvas.stroke(255);
        canvas.line(this.start.position.x, this.start.position.y, this.end.position.x, this.end.position.y);
        canvas.pop();
    }

    update() {
        let force = p5.Vector.sub(this.end.position, this.start.position);
        let x = force.mag() - this.restLength;
        force.normalize();
        force.mult(this.rate * x);
        this.start.applyForce(force);
        force.mult(-1);
        this.end.applyForce(force);
    }
}