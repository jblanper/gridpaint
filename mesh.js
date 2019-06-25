// https://nccastaff.bmth.ac.uk/jmacey/MastersProjects/Msc05/cloth_simulation.pdf
import Vector from './vector.js';
import Particle from './particle.js';
import Spring from './spring.js';

export default class Mesh {
    constructor ({
        ctx, lineWidth, rowNumber, sep, radius, origin,
        structuralSpringStrength, shearSpringStrength, bendSpringStrength
    }) {
        this.ctx = ctx;
        this.lineWidth = lineWidth;
        this.radius = radius;
        this.origin = origin;
        this.sep = sep;
        this.rowNumber = rowNumber;
        this.width = rowNumber * sep;
        this.structuralSpringStrength = structuralSpringStrength;
        this.shearSpringStrength = shearSpringStrength;
        this.bendSpringStrength = bendSpringStrength;

        this.setup();
    }

    col (i) {
        return i % this.rowNumber;
    }

    row (i) {
        return Math.floor(i / this.rowNumber);
    }

    lockParticles (...indexes) {
        if (indexes.length > 0) {
            indexes.forEach(i => this.particles[i].fixed = true);
        }
    }

    setup () {
        this.setParticles();
        this.setStructuralSprings();
        this.setShearSprings();
        this.setBendSprings();

        this.ctx.lineWidth = this.lineWidth;
    }

    setParticles () {
        this.particles = []; 
        const center = new Vector(this.rowNumber / 2 - .5, this.rowNumber / 2 - .5);

        this.particles = Array.from({length: this.rowNumber * this.rowNumber}, (_, i) => {
            let particle = new Particle({
                ctx: this.ctx, radius: this.radius,
                position: new Vector(
                    (this.col(i) - center.x) * this.sep + this.origin.x,
                    (this.row(i) - center.y) * this.sep + this.origin.y
                )
            });

            return particle;
        });
    }

    setStructuralSprings (
        strength = this.structuralSpringStrength, restLength = this.sep
    ) {
        // Handle extension and compression
        // They are connected vertically and horizontally
        this.structuralSprings = [];

        for (let [i, p] of this.particles.entries()) {
            // right
            if (this.col(i) < this.rowNumber - 1) {
                this.structuralSprings.push(new Spring({
                    ctx: this.ctx, restLength: restLength, strength: strength,
                    a: p, b: this.particles[i + 1], 
                }));
            }
            // down
            if (this.row(i) < this.rowNumber - 1) {
                this.structuralSprings.push(new Spring({
                    ctx: this.ctx, restLength: restLength, strength: strength,
                    a: p, b: this.particles[i + this.rowNumber], 
                }));
            }
        }
    }

    setShearSprings (strength = this.shearSpringStrength, restLength = this.sep) {
        // Handle shear stresses and are connected diagonally
        this.shearSprings = [];

        for (let [i, p] of this.particles.entries()) {
            // down left
            if (this.col(i) > 0 && this.row(i) < this.rowNumber - 1) {
                this.shearSprings.push(new Spring({
                    ctx: this.ctx, restLength: restLength, strength: strength,
                    a: p, b: this.particles[i + this.rowNumber - 1], 
                }));
            }
            // down right
            if (this.col(i) < this.rowNumber - 1 && this.row(i) < this.rowNumber - 1) {
                this.shearSprings.push(new Spring({
                    ctx: this.ctx, restLength: restLength, strength: strength,
                    a: p, b: this.particles[i + this.rowNumber + 1], 
                }));
            }
        }
    }

    setBendSprings (strength = this.bendSpringStrength) {
        // Handle bending stresses
        // They are connected vertically and horizontally to every other particle
        this.bendSprings = [];

        for (let [i, p] of this.particles.entries()) {
            // right
            if (this.col(i) < this.rowNumber - 2) {
                this.bendSprings.push(new Spring({
                    ctx: this.ctx, restLength: this.sep * 2, strength: strength,
                    a: p, b: this.particles[i + 2], 
                }));
            }
            // down
            if (this.row(i) < this.rowNumber - 2) {
                this.bendSprings.push(new Spring({
                    ctx: this.ctx, restLength: this.sep * 2, strength: strength,
                    a: p, b: this.particles[i + (this.rowNumber * 2)], 
                }));
            }
        }
    }

    update () {
        // springs
        this.structuralSprings.forEach(s => s.update());
        this.shearSprings.forEach(s => s.update());
        this.bendSprings.forEach(s => s.update());

        // particles
        this.particles.forEach(p => p.update() );
    }

    drawStructuralSprings () {
        this.structuralSprings.forEach(s => s.draw());
    }

    drawShearSprings () {
        this.shearSprings.forEach(s => s.draw());
    }

    drawBendSprings () {
        this.bendSprings.forEach(s => s.draw());
    }

    drawSprings () {
        this.drawStructuralSprings();
        this.drawShearSprings();
        this.drawBendSprings();
    }

    drawParticles () {
        this.particles.forEach(p => p.draw());
    }

    // drag functionality
    setDragging () {
        document.addEventListener('mousedown', e => {
            if (e.buttons === 1) {
                this.particles.forEach(p => p.handleClick(e.clientX, e.clientY));
            }
        });

        document.addEventListener('mousemove', e => {
            this.particles.forEach(p => p.handleDrag(e.clientX, e.clientY));
        });

        document.addEventListener('mouseup', e => {
            this.particles.forEach(p => p.stopDragging());
        });
    }
}
