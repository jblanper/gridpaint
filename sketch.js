import { createCanvas, getPng } from './helper.js';
import { createTogglePanelButton, createControlPanel } from './ui.js';
import Vector from './vector.js';
import Oscillator from './oscillator.js';
import Mesh from './mesh.js';
import setAnimation from './animate.js';

function createSketch ({ctx}) {
    // constants
    const height = ctx.canvas.clientHeight;
    const width = ctx.canvas.clientWidth;
    const origin = new Vector(width / 2, height / 2); 

    const osc1 = new Oscillator({
        amp: 127.5, vShift: 127.5, angleVel: .03 
    });

    // variables
    let backgroundColor = 'white';

    let mesh = new Mesh({
        ctx: ctx, rowNumber: 10, sep: 35, radius: 2, lineWidth: .3,
        origin: origin,
        structuralSpringStrength: .2,
        shearSpringStrength: .08,
        bendSpringStrength: .09
    });

    mesh.setDragging();

    // ctx options
    ctx.fillStyle = 'rgba(255, 255, 255, .05)';
    ctx.strokeStyle = 'rgba(0, 0, 0, .05)';

    // methods
    const clean = _ => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    // draw background
    clean();

    const draw = _ => {
        //mesh.drawSprings();
        if (mesh.lineWidth > 0) mesh.drawStructuralSprings();
        mesh.drawParticles();
    };
    
    const update = _ => {
        const osc1Val = osc1.oscillate();

        ctx.fillStyle = `rgba(${osc1Val}, ${osc1Val}, ${osc1Val}, .5)`;
        ctx.strokeStyle = `rgba(${osc1Val}, ${osc1Val}, ${osc1Val}, .5)`;

        mesh.update();
    };
    
    const animation = setAnimation(_ => {
        draw();
        update();
    }, 0);

    // bindings
    document.addEventListener('keyup', e => {
        if (e.key == 's') animation.toggle();
        if (e.key == 'e') clean();
        if (e.key == 'r') {
            clean();
            mesh.setup();
        }
    });

    // ui
    createControlPanel({
        mesh: mesh, oscillator: osc1,
        eraseFn: _ => { clean(); },
        animationToggleFn: _ => { animation.toggle(); },
        saveImgFn: _ => {
            if (animation.animating) animation.stop();
            getPng(ctx.canvas);
        },
        restartFn: _ => {
            clean();
            mesh.setup();
        },
        invertFn: _ => {
            if (backgroundColor === 'white') backgroundColor = 'black';
            else backgroundColor = 'white';
            clean();
        },
        updateFn: _ => {
            clean();
            mesh.setup();

            // oscillator lightness
            if (osc1.vShift > 127.5) osc1.amp = 127.5 - (osc1.vShift % 127.5);
            else osc1.amp = osc1.vShift;
        }
    });

    // return obj
    return {clean, draw, update, animation};
};

createTogglePanelButton();
const ctx = createCanvas();
const sketch = createSketch({ctx});
sketch.animation.start();
