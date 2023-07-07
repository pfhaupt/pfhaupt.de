
class Node {
    constructor(x, y, mass = 1) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.frozen = false;
        this.selected = false; // for spring creation
        this.mass = mass;
    }

    applyForce(force) {
        let f = force.copy();
        f.div(this.mass);
        this.acceleration.add(f);
    }

    update() {
        if (!this.frozen) {
            this.velocity.mult(0.99); // Friction
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
        }
        this.acceleration.mult(0);
        return this.position.y <= 900;
    }

    draw(canvas) {
        canvas.push();
        canvas.strokeWeight(NODE_SIZE);
        if (this.selected) canvas.stroke(0, 255, 0);
        else if (this.frozen) canvas.stroke(0, 0, 255);
        else canvas.stroke(255);
        canvas.point(this.position.x, this.position.y);
        canvas.pop();
    }

    equals(other) {
        if (other === null) return false;
        if (!(other instanceof Node)) return false;
        if (this === other) return true;
        return dist(this.position.x, this.position.y, other.position.x, other.position.y) <= NODE_SIZE;
    }
}