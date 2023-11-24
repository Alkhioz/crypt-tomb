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


function createCheckBox (name) {
    const label = document.createElement('label');
    label.htmlFor = name;
    label.appendChild(document.createTextNode(name.toUpperCase()));
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = name;
    checkBox.name = name;
    checkBox.value = name;
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = '0';
    input.step = '1';
    input.id = `input-${name}`;
    input.style.visibility  = 'hidden';
    const check = document.createElement('div');
    check.checkboxValue = checkBox.checked;
    check.inputValue = input.value;
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
            input.style.visibility  = 'visible';
            input.value = '1';
            return;
        }
        input.value = '0';
        input.style.visibility  = 'hidden';
    });
    addChildren(check, [
        label,
        checkBox,
        input,
    ]);
    return check;
}

function createSpecialCharacters (name) {
    const label = createElement('label', [
        {
            key: 'htmlFor',
            value: name,
        }
    ]);
    addChildren(label, [
        createTextNode(name.toUpperCase()),
    ]);
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = '0';
    input.step = '1';
    input.id = `input-${name}`;
    input.style.visibility  = 'hidden';
    const element = createElement('input', [
        {
            key: 'id',
            value: name,
        },
        {
            key: 'name',
            value: name,
        },
    ],[
        {
            name: 'input',
            callback: ()=>{
                const specialChars = "!@#$%^&*()_+[]{}|;:',.<>/?`~";
                element.value = element.value.split('').filter((char, index, self) => 
                    specialChars.includes(char) && self.indexOf(char) === index
                ).join('');
                if (element.value!=='') {
                    input.style.visibility  = 'visible';
                    input.value = '1';
                    return;
                }
                input.value = '0';
                input.style.visibility  = 'hidden';
            }
        }
    ]);
    const spchar = createElement('div');
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

function createInput(name){
    const label = document.createElement('label');
    label.htmlFor = name;
    label.appendChild(document.createTextNode(name.toUpperCase()));
    const input = document.createElement('input');
    input.name = name;
    input.id = name;
    input.type = 'text';
    const div = document.createElement('div');
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
    const fielset_title = document.createElement('legend');
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