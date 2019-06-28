import { html } from '../helper.js';

export default class Button {
    constructor ({parent, fn, updateFn = null, label}) {
        this.fn = fn;
        this.updateFn = updateFn;

        this.label = label;

        this.node = null;
        this.parent = parent;

        this.render();
        this.eventListener();
    }

    render () {
        this.node = html('button', {
            id: this.label.replace(/\s/g, '-') 
        }, null);
        this.node.innerHTML = this.label;

        this.parent.appendChild(this.node);
    }

    eventListener () {
        this.node.addEventListener('click', this.eventHandler.bind(this));
    }

    eventHandler (e) {
        this.fn();

        if (this.updateFn) this.updateFn();
    }
}
