
class Spring {
    constructor(nodeA, nodeB, defaultRate = 0.1) {
        this.start = nodeA;
        this.end = nodeB;
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
        return nodes.indexOf(this.start) !== -1 && nodes.indexOf(this.end) !== -1;
    }

    equals(other) {
        if (other === null) return false;
        if (!(other instanceof Spring)) return false;
        if (this === other) return true;
        let option1 = this.start.equals(other.start) && this.end.equals(other.end);
        if (option1) return true;
        let option2 = this.start.equals(other.end) && this.end.equals(other.start);
        return option2;
    }
}