/**
 * Binds a value from a child element to a property of a parent element.
 * 
 * @param {HTMLElement} parentElement - The parent element whose property will be updated.
 * @param {HTMLElement} childElement - The child element from which the value will be retrieved.
 * @param {string} eventName - The event name on the child element that triggers the update.
 * @param {string} parentPropertyName - The property name of the parent element to be updated.
 * @param {string} childValueName - The property name of the child element to retrieve the value from.
 */
function bindValueToParent(parentElement, childElement, eventName, parentPropertyName, childValueName) {
    parentElement[parentPropertyName] = childElement[childValueName];
    childElement.addEventListener(eventName, () => {
        parentElement[parentPropertyName] = childElement[childValueName];
    });
}

function createElement(type, args, events) {
    const element = document.createElement(type);

    args?.forEach(arg => {
        if (!arg?.key?.includes('.')) {
            element[arg.key] = arg.value;
        } else {
            let parts = arg.key.split('.');
            let current = element;

            // Traverse the object structure, stopping at the last part
            for (let i = 0; i < parts.length - 1; i++) {
                current = current[parts[i]];
                if (!current) return; // Exit if a part is not found
            }

            // Handle the last part
            let lastPart = parts[parts.length - 1];
            if (typeof current[lastPart] === 'function') {
                // Call the function with proper context
                current[lastPart].call(current, arg.value);
            } else {
                current[lastPart] = arg.value;
            }
        }
    });

    events?.forEach(event => {
        const eventName = event?.name;
        const callback = event?.callback;
        if (eventName && callback) element.addEventListener(eventName, callback);
    });

    return element;
}

function createTextNode (str) {
    return document.createTextNode(str);
}


function createCheckBox (name, config=null) {
    const label = document.createElement('label');
    label.htmlFor = name;
    label.appendChild(document.createTextNode(
        config?.labelName ? config?.labelName : name
    ));
    label.classList.add('crypt-tomb-checkbox-label');
    label.classList.add(`crypt-tomb-checkbox-label-${name}`);
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = name;
    checkBox.name = name;
    checkBox.value = name;
    checkBox.classList.add('crypt-tomb-checkbox-checkBox');
    checkBox.classList.add(`crypt-tomb-checkbox-checkBox-${name}`);
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = '0';
    input.step = '1';
    input.id = `input-${name}`;
    input.style.display  = 'none';
    input.classList.add('crypt-tomb-checkbox-input');
    input.classList.add(`crypt-tomb-checkbox-input-${name}`);
    input.classList.add('crypt-tomb-checkbox-input-sm');
    input.classList.add(`crypt-tomb-checkbox-input-sm-${name}`);
    const check = document.createElement('div');
    check.checkboxValue = checkBox.checked;
    check.inputValue = input.value;
    check.classList.add('crypt-tomb-checkbox-container');
    check.classList.add(`crypt-tomb-checkbox-container-${name}`);
    bindValueToParent(
        check,
        checkBox,
        'change',
        'checkboxValue',
        'checked',
    );
    bindValueToParent(
        check,
        input,
        'input',
        'inputValue',
        'value',
    );
    checkBox.addEventListener('change', () => {
        if (checkBox.checked) {
            input.style.display  = '';
            input.value = '1';
            check.inputValue = '1';
            return;
        }
        input.value = '0';
        check.inputValue = '0';
        input.style.display  = 'none';
    });
    addChildren(check, [
        label,
        checkBox,
        input,
    ]);
    return check;
}

function createSpecialCharacters (name, config = null) {
    const label = createElement('label', [
        {
            key: 'htmlFor',
            value: name,
        }
    ]);
    label.classList.add('crypt-tomb-special-characteristics-label');
    label.classList.add(`crypt-tomb-special-characteristics-label-${name}`);
    addChildren(label, [
        createTextNode(config?.labelName ? config?.labelName : name),
    ]);
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = '0';
    input.step = '1';
    input.id = `input-${name}`;
    input.style.display  = 'none';
    input.classList.add('crypt-tomb-special-characteristics-input');
    input.classList.add(`crypt-tomb-special-characteristics-input-${name}`);
    input.classList.add('crypt-tomb-special-characteristics-input-sm');
    input.classList.add(`crypt-tomb-special-characteristics-input-sm-${name}`);
    const element = createElement('input', [
        {
            key: 'id',
            value: name,
        },
        {
            key: 'name',
            value: name,
        },
        {
            key: 'classList.add',
            value: 'crypt-tomb-special-characteristics-input'
        }
    ],[
        {
            name: 'input',
            callback: ()=>{
                const specialChars = "!@#$%^&*()_+[]{}|;:',.<>/?`~";
                element.value = element.value.split('').filter((char, index, self) => 
                    specialChars.includes(char) && self.indexOf(char) === index
                ).join('');
                if (element.value!=='') {
                    input.style.display  = '';
                    input.value = '1';
                    spchar.spValues = '1'
                    return;
                }
                input.value = '0';
                spchar.spValues = '0'
                input.style.display  = 'none';
            }
        }
    ]);
    const spchar = createElement('div');
    spchar.classList.add('crypt-tomb-special-characteristics-container');
    spchar.classList.add(`crypt-tomb-special-characteristics-container-${name}`);
    bindValueToParent(
        spchar,
        element,
        'input',
        'spValues',
        'value',
    );
    bindValueToParent(
        spchar,
        input,
        'input',
        'spQuantity',
        'value',
    );
    addChildren(spchar, [
        label,
        element,
        input,
    ])
    return spchar;
}

function createInput(name, config=null){
    const label = document.createElement('label');
    label.classList.add('crypt-tomb-input-label');
    label.classList.add(`crypt-tomb-input-label-${name}`);
    label.htmlFor = name;
    label.appendChild(document.createTextNode(
        config?.labelName ? config?.labelName : name
    ));
    const input = document.createElement('input');
    input.name = name;
    input.id = name;
    input.type = config?.type ? config?.type : 'text';
    input.classList.add('crypt-tomb-input-input');
    input.classList.add(`crypt-tomb-input-input-${name}`);
    const div = document.createElement('div');
    div.classList.add('crypt-tomb-input-continer');
    div.classList.add(`crypt-tomb-input-continer-${name}`);
    bindValueToParent(
        div,
        input,
        'input',
        'inputValue',
        'value',
    );
    addChildren(div, [
        label,
        input,
    ]);
    return div;
}

function createFieldset(legend){
    const fielset = document.createElement('fieldset');
    fielset.classList.add('crypt-tomb-fieldset');
    const fielset_title = document.createElement('legend');
    fielset_title.classList.add('crypt-tomb-fieldset-legend');
    fielset_title.innerText = legend;
    fielset.appendChild(fielset_title);
    return fielset;
}

function addChildren(parent, children){
    if(Array.isArray(children)){
        children.forEach(child => {
            parent.appendChild(child);
        });
        return;
    }
    parent.appendChild(children);
}

function craeteButton(name, configuration){
    const button = document.createElement('button');
    button.name = name;
    button.id = name;
    button.innerText = configuration?.text ?? name;
    button.classList.add('crypt-tomb-button');
    button.classList.add(`crypt-tomb-button-${name}`);
    configuration?.events?.forEach(event=>{
        const eventName = event?.name;
        const callback = event?.callback;
        if (eventName && callback) button.addEventListener(eventName, callback);
    });
    return button;
}

export {
    createElement,
    createSpecialCharacters,
    createCheckBox,
    createFieldset,
    addChildren,
    craeteButton,
    createInput,
    bindValueToParent,
};