
class Node {
    constructor(x, y, mass = 1) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.forces = [];
        this.frozen = false;
        this.selected = false; // for spring creation
        this.mass = mass;
    }

    applyForce(force) {
        this.forces.push(force.copy());
    }

    update() {
        for (let f of this.forces) {
            f.div(this.mass);
            this.acceleration.add(f);
        }
        this.forces = [];
        if (!this.frozen) {
            this.velocity.mult(0.99); // Friction
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
        }
        this.acceleration.mult(0);
        return this.position.y <= 900;
    }

    checkCollision(springs) {
        for (let s of springs) {
            if (this.willCollide(s)) {
                if (s.contains(this)) continue; // Node is part of spring itself
                console.error("Detected collision!!!");
                console.log(this, s);
                let v1 = s.start.position.sub(s.end.position);
                let angle1 = this.velocity.angleBetween(v1) - PI / 2;
                let angle = atan2(v1.y - this.velocity.y, v1.x - this.velocity.x);
                angle *= 180 / PI;
                angle1 *= 180 / PI;
                console.log(angle, angle1);

                this.applyForce(undefined);
                return;
            }
        }
    }

    willCollide(spring) {
        // Creates an imaginary line between the current position and the calculated position next frame
        // (pos + vec), and then performs a line-line intersection check
        if (this.frozen) return false;
        if (this.velocity.x === 0 && this.velocity.y === 0) return false;
        let start = this.position.copy();
        let end = start.copy();
        end.add(this.velocity);
        let x1 = start.x,
            y1 = start.y,
            x2 = end.x,
            y2 = end.y,
            x3 = spring.start.position.x,
            y3 = spring.start.position.y,
            x4 = spring.end.position.x,
            y4 = spring.end.position.y;
        let d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (d === 0) return false;
        let t = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
        let u = (x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2);
        t /= d;
        u /= d;
        return 0 <= t && t <= 1 && 0 <= u && u <= 1;
    }

    draw(canvas) {
        canvas.push();
        canvas.strokeWeight(NODE_SIZE);
        if (this.selected) canvas.stroke(0, 255, 0);
        else if (this.frozen) canvas.stroke(0, 0, 255);
        else canvas.stroke(255);
        canvas.point(this.position.x, this.position.y);
        canvas.translate(this.position.x, this.position.y);
        canvas.strokeWeight(1);
        canvas.stroke(255, 0, 255);
        this.velocity.mult(50);
        canvas.line(0, 0, this.velocity.x, this.velocity.y);
        this.velocity.div(50);
        canvas.pop();
    }

    equals(other) {
        if (other === null) return false;
        if (!(other instanceof Node)) return false;
        if (this === other) return true;
        return dist(this.position.x, this.position.y, other.position.x, other.position.y) <= NODE_SIZE;
    }
}