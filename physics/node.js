
class Node {
    constructor(x, y, mass = 1) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.connected = [];
        this.frozen = false;
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
            this.acceleration.mult(0);
        }
    }

    draw(canvas) {
        canvas.push();
        canvas.strokeWeight(4);
        if (this.frozen) canvas.stroke(0, 0, 255);
        else canvas.stroke(255);
        canvas.point(this.position.x, this.position.y);
        canvas.pop();
    }
}