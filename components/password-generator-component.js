import { addChildren, createCheckBox, createFieldset, craeteButton, createInput } from './utils.js';
import { generateRandomKey } from '../assets/js/modules/crypt/main.js';

export class PasswordGeneratorComponent extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.input = createInput('length');
        this.container = createFieldset('Ramdom password generator');
        this.uppercase = createCheckBox('uppercase');
        this.lowercase = createCheckBox('lowercase');
        this.numbers = createCheckBox('numbers');
        this.generatePasswordButton = craeteButton('generate-password-button', {
            text: 'Generate password',
            events: [
                {
                    name: 'click',
                    callback: this.onGeneratePassword.bind(this)
                }
            ]
        });

        addChildren(this.container, [
            this.input,
            this.uppercase,
            this.lowercase,
            this.numbers,
            this.generatePasswordButton,
        ]);
        addChildren(this, this.container);
    }

    onGeneratePassword() {
        const customEvent = new CustomEvent('ramdomPasswordGenerated', {
            bubbles: false,
            detail: {
                value: generateRandomKey({
                    uppercase: this.uppercase.checkboxValue,
                    lowercase: this.lowercase.checkboxValue,
                    numbers: this.numbers.checkboxValue,
                    specialChars: [],
                    length: +(this.input.inputValue),
                    minUppercase: +(this.uppercase.inputValue),
                    minLowercase: +(this.lowercase.inputValue),
                    minNumbers: +(this.numbers.inputValue),
                    minSpecialChars: 0,
                }),
            }
        });
        this.dispatchEvent(customEvent);
    }

}

window.customElements.define('crypt-tomb-password-generator', PasswordGeneratorComponent);