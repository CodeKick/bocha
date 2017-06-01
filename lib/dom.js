module.exports = {
    click: click
};

function click(selectorOrElement) {
    var element;
    if (typeof selectorOrElement === 'string') {
        var elements = document.querySelectorAll(selectorOrElement);
        if (elements.length !== 1) {
            throw new Error('Exactly one element must match selector ' + selectorOrElement);
        }
        element = elements[0];
    }
    else if (selectorOrElement instanceof HTMLElement) {
        element = selectorOrElement;
    }
    else {
        throw new Error('Illegal argument: Must be selector or HTMLElement');
    }

    element.click();
}