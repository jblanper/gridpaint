import Slider from './ui/slider.js';
import ToggleButton from './ui/toggleButton.js';
import Button from './ui/button.js';
import { icons } from './ui/icons.js';
import { getRandomNum } from './helper.js';

// functions
function createEmptyPanel (label) {
    const ui = document.querySelector('#ui');
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = label;
    div.appendChild(p);
    ui.appendChild(div);

    return div;
}

function setRandomSliderValue (slider, min = slider.min, max = slider.max) {
    slider.input.value = getRandomNum(min, max, false);
    slider.eventHandler();
}

export function createControlPanel ({
    mesh, oscillator, updateFn, eraseFn, animationToggleFn, saveImgFn
}) {

    const buttonsDiv = document.querySelector('#buttons');

    const erase = new Button({
        parent: buttonsDiv, fn: eraseFn, updateFn: null, label: icons.erase 
    });

    const toggleAnimation = new ToggleButton({
        parent: buttonsDiv, prop: 'toggle-animation-btn', value: true,
        labelTrue: icons.pause, labelFalse: icons.play,
        updateFn: animationToggleFn
    });

    const saveImg = new Button({
        parent: buttonsDiv, fn: saveImgFn, updateFn: null, label: icons.saveImg
    });

    const div1 = createEmptyPanel('Grid options');

    const rowNum = new Slider({
        parent: div1, max: 30, min: 2, value: 10, label: 'row #',
        prop: 'rowNumber', scope: mesh, updateFn: updateFn
    });

    const sep = new Slider({
        parent: div1, max: 65, min: 10, value: 35, label: 'nodes distance',
        prop: 'sep', scope: mesh, updateFn: updateFn
    });

    const radius = new Slider({
        parent: div1, max: 10, min: 0, value: 2, label: 'particles radius',
        prop: 'radius', scope: mesh, updateFn: updateFn
    });

    const lineWidth = new Slider({
        parent: div1, max: 10, min: 0, value: .3, step: .01, label: 'line width',
        prop: 'lineWidth', scope: mesh, updateFn: updateFn
    });

    const div2 = createEmptyPanel('Spring forces');

    const structuralSprings = new Slider({
        parent: div2, max: .3, min: 0, value: .2, step: .01, label: 'structural',
        prop: 'structuralSpringStrength', scope: mesh, updateFn: updateFn
    });

    const shearSprings = new Slider({
        parent: div2, max: .3, min: 0, value: .08, step: .01, label: 'shear',
        prop: 'shearSpringStrength', scope: mesh, updateFn: updateFn
    });

    const bendSprings = new Slider({
        parent: div2, max: .3, min: 0, value: .09, step: .01, label: 'bend',
        prop: 'bendSpringStrength', scope: mesh, updateFn: updateFn
    });

    const div3 = createEmptyPanel('Other options');

    const oscAngleVel = new Slider({
        parent: div3, max: .1, min: 0, value: .03, step: .001,
        label: 'oscillator speed', prop: 'angleVel', scope: oscillator,
        updateFn: updateFn
    });

    const oscVshift = new Slider({
        parent: div3, max: 255, min: 0, value: 127.5, step: .5,
        label: 'color lightness', prop: 'vShift', scope: oscillator,
        updateFn: updateFn
    });

    const randomOptions = new Button({
        parent: buttonsDiv, updateFn: null, label: icons.randomOptions,
        fn: _ => {
            setRandomSliderValue(rowNum);
            setRandomSliderValue(sep);
            setRandomSliderValue(radius);
            setRandomSliderValue(lineWidth);
            setRandomSliderValue(structuralSprings);
            setRandomSliderValue(shearSprings);
            setRandomSliderValue(bendSprings);
            setRandomSliderValue(oscAngleVel);
            setRandomSliderValue(oscVshift, 87.5, 167.5);
        }
    });

    return {
        rowNum, sep, radius, lineWidth,
        structuralSprings, shearSprings, bendSprings,
        oscAngleVel, oscVshift,
        erase, toggleAnimation, saveImg, randomOptions
    };
}

export function createTogglePanelButton () {
    const panel = document.querySelector('#panel');
    const togglePanelDiv = document.querySelector('#toggle-panel');

    const toggleButton = new ToggleButton({
        parent: togglePanelDiv, prop: 'toggle-panel-btn', value: false,
        labelTrue: icons.circleSolid, labelFalse: icons.cross,
        updateFn: function () {
            if (this.value) panel.classList.add('hide'); 
            else panel.classList.remove('hide'); 
        }
    });

    return toggleButton;
}
