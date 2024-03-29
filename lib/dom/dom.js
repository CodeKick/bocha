import { getUniqueElement } from './domUtils.js';
import timeout from '../timeoutPromise.js';
import fakeClock from '../fakeClock.js';

export default {
    click,
    clickAndTick,
    setValue,
    setValueAndTick,
    focusAndTick,
    blurAndTick,
    keydownAndTick,
    keydownAndTickWithModifiers,
    mouseupAndTick,
    pasteIntoInputAndTick,
    htmlToElement,
    detachElements
};

function click(selectorOrElement) {
    let element = getUniqueElement(selectorOrElement);
    element.click();
}

function setValue(selectorOrElement, value) {
    let element = getUniqueElement(selectorOrElement);
    element.value = value;
    let tagName = element.tagName;
    let isInputOrTextarea = tagName === 'INPUT' || tagName === 'TEXTAREA';
    let eventType = isInputOrTextarea ? 'input' : 'change';
    let event = document.createEvent('HTMLEvents');
    event.initEvent(eventType, false, true);
    element.dispatchEvent(event);
}

export async function clickAndTick(selectorOrElement, time) {
    click(selectorOrElement);
    await timeoutWrapper(time);
}

export async function setValueAndTick(selectorOrElement, value, time) {
    setValue(selectorOrElement, value);
    await timeoutWrapper(time);
}

// Focus will only work if the testDom is "visible" (not display none)
export async function focusAndTick(selectorOrElement) {
    let element = getUniqueElement(selectorOrElement);
    element.focus();
    let event = document.createEvent('HTMLEvents');
    event.initEvent('focus', false, true);
    element.dispatchEvent(event);
    await timeoutWrapper();
}

// Blur will only work if the testDom is "visible" (not display none)
export async function blurAndTick(selectorOrElement) {
    let element = getUniqueElement(selectorOrElement);
    element.blur();
    let event = document.createEvent('HTMLEvents');
    event.initEvent('blur', false, true);
    element.dispatchEvent(event);
    await timeoutWrapper();
}

export function keydownAndTick(elementOrSelector, keyCodeOrLetter) {
    return triggerKeyboardEventAndTick(elementOrSelector, 'keydown', keyCodeOrLetter, {});
}

export function keydownAndTickWithModifiers(elementOrSelector, keyCodeOrLetter, eventKeyModifiers) {
    return triggerKeyboardEventAndTick(elementOrSelector, 'keydown', keyCodeOrLetter, eventKeyModifiers);
}

export async function mouseupAndTick(selectorOrElement) {
    let element = getUniqueElement(selectorOrElement);
    let event = document.createEvent("MouseEvents");
    event.initEvent("mouseup", true, true);
    element.dispatchEvent(event);
    await timeoutWrapper();
}

export async function pasteIntoInputAndTick(text, selectorOrElement) {
    let element = getUniqueElement(selectorOrElement);
    let event = new ClipboardEvent('paste');

    //Must make clipboardData a writable property
    Object.defineProperty(event, 'clipboardData', { writable: true, value: new DataTransfer() });
    event.clipboardData.items.add(text, 'text/plain');

    element.dispatchEvent(event);

    //Append text to element, as a programatically created ClipboardEvent won't do this.
    await Promise.resolve().then(() => {
        if (!event.defaultPrevented) {
            let newValue = element.value += text;

            setValue(element, newValue);
        }
    });
    await timeoutWrapper();
}

async function triggerKeyboardEventAndTick(selectorOrElement, eventType, keyCodeOrLetter, eventKeyModifiers) {
    eventKeyModifiers = eventKeyModifiers || {};

    let isString = typeof keyCodeOrLetter === 'string';
    let keyCode = isString ? keyCodeOrLetter.toUpperCase().charCodeAt(0) : keyCodeOrLetter;
    let element = getUniqueElement(selectorOrElement);
    let event = document.createEvent('HTMLEvents');
    Object.assign(event, eventKeyModifiers);
    event.initEvent(eventType, true, true);
    event.keyCode = keyCode;
    event.key = isString ? keyCodeOrLetter : '';
    element.dispatchEvent(event);
    await timeoutWrapper();
    return event;
}

export function htmlToElement(html) {
    let div = document.createElement('div');
    div.innerHTML = html.trim();
    if (div.children.length !== 1) {
        throw new Error('"html" must include ONE root element');
    }
    return div.firstElementChild;
}

export function detachElements(selector) {
    let elements = document.querySelectorAll(selector);
    for (let element of Array.from(elements)) {
        element.remove();
    }
}

async function timeoutWrapper(ms) {
    let clock = fakeClock.getInstance();
    if (clock) {
        await timeout(clock, ms);
    }
    else {
        await timeout(ms);
    }
}