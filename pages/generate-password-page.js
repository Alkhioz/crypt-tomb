import { createElement, addChildren } from '../components/utils.js';

export class PasswordPage extends HTMLElement {
    constructor() {
        super();
        this.innerElements = {};
    }

    connectedCallback() {
        this.classList.add('crypt-tomb-container');
        this.innerElements.content = createElement('div', [
            {
                key: 'classList.add',
                value: 'crypt-tomb-content',
            },
        ]);
        this.innerElements.title = createElement('H1', [
            {
                key: 'innerText',
                value: 'Generate password',
            },
        ]);
        
        this.innerElements.passwordGenerator = createElement('crypt-tomb-password-generator', [], [
            {
                name: 'ramdomPasswordGenerated',
                callback: (evt)=>console.log(evt.detail.value),
            }
        ]);
        this.innerElements.goBackButton = createElement('button', [
            {
                key: 'classList.add',
                value: 'crypt-tomb-button',
            },{
                key: 'innerText',
                value: 'Go Back',
            },
        ],[
            {
                name: 'click',
                callback: ()=>{
                    window.customRouter.goTo('/');
                }
            },
        ]);
        addChildren(this.innerElements.content, [
            this.innerElements.title,
            this.innerElements.passwordGenerator,
            this.innerElements.goBackButton,
        ]);
        addChildren(this, [this.innerElements.content]);
    }
}

window.customElements.define('crypt-tomb-generate-password-page', PasswordPage);