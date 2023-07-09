
class Spring {
    constructor(nodeA, nodeB, defaultRate = 5, defaultRadius = 3) {
        this.start = nodeA;
        this.end = nodeB;
        this.rate = defaultRate;
        this.radius = defaultRadius;
        this.area = PI * this.radius * this.radius;
        this.restLength = dist(this.start.position.x, this.start.position.y, this.end.position.x, this.end.position.y);
        this.stress = 0;
    }

    draw(canvas) {
        canvas.push();
        canvas.strokeWeight(this.radius);
        canvas.stroke(lerpColor(color(0, 255, 0), color(255, 0, 0), this.stress));
        canvas.line(this.start.position.x, this.start.position.y, this.end.position.x, this.end.position.y);
        canvas.pop();
    }

    update() {
        let force = p5.Vector.sub(this.end.position, this.start.position);
        let fMag = force.mag();
        let x = (fMag - this.restLength) / 10;
        force.normalize();
        force.mult(this.rate * x);
        this.stress = 100 * force.mag() / this.area;
        this.start.applyForce(force);
        force.mult(-1);
        this.end.applyForce(force);
        if (this.stress > 1.5) return false;
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

    contains(node) {
        return this.start.equals(node) || this.end.equals(node);
    }
}