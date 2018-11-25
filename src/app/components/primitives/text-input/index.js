import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getElementWithFunctionName } from 'components/_util/dom';

const COMPONENT_NAME = 'text-input';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

// TODO: move to dom util
function reflectAttribute(component, attribute, element) {
  if (!component.hasAttribute(attribute)) { return; }
  element.setAttribute(attribute, component.getAttribute(attribute));
}

// TODO: move to dom util
function reflectCallback(component, attribute, element) {
  const attr = `on${attribute}`;
  if (!component.hasAttribute(attr)) { return; }
  const functionName = component.getAttribute(attr);
  const targetElement = getElementWithFunctionName(component.parentNode, functionName);
  element[attr] = targetElement[functionName].bind(targetElement);
}

class TextInput extends BaseComponent {
  constructor() {
    super(style, markup, ['textInput']);
    reflectAttribute(this, 'type', this.dom.textInput);
    reflectAttribute(this, 'value', this.dom.textInput);
    reflectCallback(this, 'change', this.dom.textInput);
  }
}

export default new Component(COMPONENT_NAME, TextInput);
