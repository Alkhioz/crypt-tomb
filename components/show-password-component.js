import { addChildren, createFieldset, createElement } from './utils.js';
export class ShowPasswordComponent extends HTMLElement {
    
    constructor() {
        super();
        this.innerElements = {};
    }

    connectedCallback() {
        this.password = '';
        this.style.display  = 'none';
        this.innerElements.container = createFieldset('New Password');
        this.innerElements.password = createElement('p');
        this.innerElements.copytoclipboard = createElement('button', [
            {
                key: 'innerText',
                value: 'Copy to clipboard',
            }
        ],[
            {
                name: 'click',
                callback: ()=> navigator.clipboard.writeText(this.password),
            }
        ]);
        addChildren(this.innerElements.container, [
            this.innerElements.password,
            this.innerElements.copytoclipboard,
        ]);
        addChildren(this, this.innerElements.container);
        this.updateVisibility();
    }

    static get observedAttributes() { return ['password']; }

    attributeChangedCallback(name) {
        if (name === 'password') {
            this.updateVisibility();
        }
    }

    get password() {
        return this.getAttribute('password');
    }

    set password(newValue) {
        this.setAttribute('password', newValue);
    }

    updateVisibility() {
        if (this.password) {
            this.style.display = '';
            this.innerElements.password.innerText = this.password;
        } else {
            this.style.display  = 'none';
        }
    }

}

window.customElements.define('crypt-tomb-show-password', ShowPasswordComponent);