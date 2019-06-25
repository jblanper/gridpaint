export default class Oscillator {
    constructor ({
        type = 'sin', amp, freq = 1, phase = 0, vShift = 0, angleVel, angle = 0 
    }) {
        this.type = type;
        this.amp = amp;
        this.freq = freq;
        this.phase = phase;
        this.vShift = vShift;
        this.angle = angle;
        this.angleVel = angleVel;

        this.orig = {amp, freq, phase, vShift, angle, angleVel};
    }

    oscillate (angleVel = this.angleVel) {
        this.angle += angleVel;
        return this.amp * Math.cos(this.freq * this.angle + this.phase) + this.vShift;
    }

    reset () {
        Object.entries(this.orig).forEach((k, v) => this[k] = v);
        return this;
    }

    copy () {
        return new this({
            amp: this.amp, freq: this.freq, phase: this.phase,
            vShift: this.vShift, angle: this.angle,
            angleVel: this.angleVel, type: this.type
        });
    }
}
