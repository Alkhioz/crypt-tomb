import { addChildren, createCheckBox, createFieldset, craeteButton, createInput } from './utils.js';
import { generateRandomKey } from '../assets/js/modules/crypt/main.js';

export class PasswordGeneratorComponent extends HTMLElement {

    constructor() {
        super();
        this.innerElements = {};
    }

    connectedCallback() {
        this.innerElements.input = createInput('length');
        this.innerElements.container = createFieldset('Ramdom password generator');
        this.innerElements.uppercase = createCheckBox('uppercase');
        this.innerElements.lowercase = createCheckBox('lowercase');
        this.innerElements.numbers = createCheckBox('numbers');
        this.innerElements.generatePasswordButton = craeteButton('generate-password-button', {
            text: 'Generate password',
            events: [
                {
                    name: 'click',
                    callback: this.onGeneratePassword.bind(this)
                }
            ]
        });

        addChildren(this.innerElements.container, [
            this.innerElements.input,
            this.innerElements.uppercase,
            this.innerElements.lowercase,
            this.innerElements.numbers,
            this.innerElements.generatePasswordButton,
        ]);
        addChildren(this, this.innerElements.container);
    }

    onGeneratePassword() {
        const customEvent = new CustomEvent('ramdomPasswordGenerated', {
            bubbles: false,
            detail: {
                value: generateRandomKey({
                    uppercase: this.innerElements.uppercase.checkboxValue,
                    lowercase: this.innerElements.lowercase.checkboxValue,
                    numbers: this.innerElements.numbers.checkboxValue,
                    specialChars: [],
                    length: +(this.innerElements.input.inputValue),
                    minUppercase: +(this.innerElements.uppercase.inputValue),
                    minLowercase: +(this.innerElements.lowercase.inputValue),
                    minNumbers: +(this.innerElements.numbers.inputValue),
                    minSpecialChars: 0,
                }),
            }
        });
        this.dispatchEvent(customEvent);
    }

}

window.customElements.define('crypt-tomb-password-generator', PasswordGeneratorComponent);