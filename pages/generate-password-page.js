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
                callback: (evt)=>{
                    if(evt.detail.value.status){
                        this.innerElements.showPassword.password = evt.detail.value.password;
                    }else{
                        this.innerElements.showPassword.password = '';
                    }
                },
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
        this.innerElements.showPassword = createElement('crypt-tomb-show-password');
        addChildren(this.innerElements.content, [
            this.innerElements.title,
            this.innerElements.passwordGenerator,
            this.innerElements.showPassword,
            this.innerElements.goBackButton,
        ]);
        addChildren(this, [this.innerElements.content]);
    }
}

window.customElements.define('crypt-tomb-generate-password-page', PasswordPage);