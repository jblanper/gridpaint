//https://github.com/nature-of-code/noc-examples-processing/blob/master/chp03_oscillation/Exercise_3_16_springs_array/Spring.pde
import Vector from './vector.js';

export default class Spring {
    constructor ({
        ctx, a, b, restLength = a.getDistance(b), strength = .2
    }) {
        this.ctx = ctx;

        // particles
        this.a = a;
        this.b = b;

        // spring variables
        this.restLength = restLength;
        this.strength = strength;
    }

    update () {
        let force = Vector.sub(this.a.position, this.b.position);
        let distance = force.magnitude;

        let stretch = distance - this.restLength;
        // Hooke's Law: F = k * stretch
        force.normalize().mul(-1 * this.strength * stretch);

        if (!this.a.dragging) {
            this.a.applyForce(force);
        }

        if (!this.b.dragging) {
            force.mul(-1);
            this.b.applyForce(force);
        }
    }

    draw () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.a.position.x, this.a.position.y);
        this.ctx.lineTo(this.b.position.x, this.b.position.y);
        this.ctx.stroke();
    }
}
