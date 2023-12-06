import { addChildren, createCheckBox, createFieldset, craeteButton, createInput, createSpecialCharacters } from './utils.js';
import { generateRandomKey } from '../assets/js/modules/crypt/main.js';

export class PasswordGeneratorComponent extends HTMLElement {

    constructor() {
        super();
        this.innerElements = {};
    }

    connectedCallback() {
        this.innerElements.input = createInput('length', {
            labelName: 'Length',
            type: 'number',
        });
        this.innerElements.container = createFieldset('Ramdom password generator');
        this.innerElements.uppercase = createCheckBox('uppercase', {
            labelName: 'Uppercase'
        });
        this.innerElements.lowercase = createCheckBox('lowercase', {
            labelName: 'Lowercase'
        });
        this.innerElements.numbers = createCheckBox('numbers', {
            labelName: 'Numbers'
        });
        this.innerElements.specialChars = createSpecialCharacters('special-chars', {
            labelName: 'Special Characters',
        });
        this.innerElements.generatePasswordButton = craeteButton('create-password', {
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
            this.innerElements.specialChars,
            this.innerElements.generatePasswordButton,
        ]);
        addChildren(this, this.innerElements.container);
    }

    onGeneratePassword() {
        if( +(this.innerElements.input.inputValue ?? 0) > 1000) return false;
        const customEvent = new CustomEvent('ramdomPasswordGenerated', {
            bubbles: false,
            detail: {
                value: generateRandomKey({
                    uppercase: this.innerElements.uppercase.checkboxValue,
                    lowercase: this.innerElements.lowercase.checkboxValue,
                    numbers: this.innerElements.numbers.checkboxValue,
                    specialChars: this.innerElements?.specialChars?.spValues?.split() ?? [],
                    length: +(this.innerElements.input.inputValue ?? 0),
                    minUppercase: +(this.innerElements.uppercase.inputValue ?? 0),
                    minLowercase: +(this.innerElements.lowercase.inputValue ?? 0),
                    minNumbers: +(this.innerElements.numbers.inputValue ?? 0),
                    minSpecialChars: +(this.innerElements.specialChars.spQuantity ?? 0),
                }),
            }
        });
        this.dispatchEvent(customEvent);
    }

}

window.customElements.define('crypt-tomb-password-generator', PasswordGeneratorComponent);