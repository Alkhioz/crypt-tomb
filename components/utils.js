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
    createCheckBox,
    createFieldset,
    addChildren,
    craeteButton,
    createInput,
    bindValueToParent,
};