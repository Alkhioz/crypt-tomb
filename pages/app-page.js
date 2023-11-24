import { createElement, addChildren } from '../components/utils.js';

export class AppPage extends HTMLElement {
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
                value: 'Crypt-Tomb',
            },
        ]);
        this.innerElements.subtitle = createElement('H2', [
            {
                key: 'innerText',
                value: 'Local password generator and manager',
            },
        ]);
        this.innerElements.imageContainer = createElement('div', [
            {
                key: 'classList.add',
                value: 'crypt-tomb-logo',
            },
        ]);
        this.innerElements.logo = createElement('img', [
            {
                key: 'src',
                value: './assets/img/logo.png',
            },
            {
                key: 'alt',
                value: 'A tombstone with a keyloak in the middle is a logo.',
            },
        ]);
        addChildren(this.innerElements.imageContainer, [this.innerElements.logo]);
        this.innerElements.buttonContainer = createElement('div', [
            {
                key: 'classList.add',
                value: 'crypt-tomb-columns',
            },
        ]);
        this.innerElements.addVaultButton = createElement('button', [
            {
                key: 'classList.add',
                value: 'crypt-tomb-button',
            },{
                key: 'classList.add',
                value: 'crypt-tomb-disabled',
            },{
                key: 'innerText',
                value: 'Add New Vault',
            },
        ]);
        this.innerElements.openVault = createElement('button', [
            {
                key: 'classList.add',
                value: 'crypt-tomb-button',
            },{
                key: 'classList.add',
                value: 'crypt-tomb-disabled',
            },{
                key: 'innerText',
                value: 'Open Existing Vault',
            },
        ]);
        this.innerElements.generateKey = createElement('button', [
            {
                key: 'classList.add',
                value: 'crypt-tomb-button',
            },{
                key: 'innerText',
                value: 'Generate password',
            },
        ],[
            {
                name: 'click',
                callback: ()=>{
                    window.customRouter.goTo('/generate-password');
                }
            },
        ]);
        addChildren(this.innerElements.buttonContainer, [
            this.innerElements.addVaultButton,
            this.innerElements.openVault,
            this.innerElements.generateKey,
        ]);
        addChildren(this.innerElements.content, [
            this.innerElements.title,
            this.innerElements.subtitle,
            this.innerElements.imageContainer,
            this.innerElements.buttonContainer,
        ]);
        addChildren(this, [this.innerElements.content]);
    }
}

window.customElements.define('crypt-tomb-app-page', AppPage);