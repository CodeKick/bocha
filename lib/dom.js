module.exports = {
    click: click
};

function click(selectorOrElement) {
    var element;
    if (typeof selectorOrElement === 'string') {
        element = document.querySelector(selectorOrElement);
        if (!element) {
            throw new Error('No element is matching ' + selectorOrElement);
        }
    }
    else if (selectorOrElement instanceof HTMLElement) {
        element = selectorOrElement;
    }
    else {
        throw new Error('Illegal argument: Must be selector or HTMLElement');
    }

    element.click();
}