import BaseComponent from 'common/util/base-component';
import { buildAttributeCallback } from 'common/util/dom';
import buttonStyle from '../text-button/text-button.css';

const style = `
  ${buttonStyle}
  .button--active {
    background-color: var(--color-grey-light);
    color: var(--color-black-light);
  }
`;
const markup = '<button id="button"/>';

const BUTTON_ACTIVE = 'button--active';

export default class ToggleButton extends BaseComponent {
  static get tag() {
    return 'toggle-button';
  }

  constructor() {
    super(style, markup, ['button']);
    this.isOn = false;
  }

  connectedCallback() {
    this.onClick = buildAttributeCallback(this, 'click');
    this.addEventListener('click', this.handleClick.bind(this));
    this.onText = this.getAttribute('onlabel') || '';
    this.offText = this.getAttribute('offlabel') || '';
    this.isOn = !!this.getAttribute('ison');
    this.render();
  }

  handleClick(event) {
    this.onClick(event);
    this.isOn = !this.isOn;
    this.render();
  }

  render() {
    this.isOn ?
      this.dom.button.classList.add(BUTTON_ACTIVE) :
      this.dom.button.classList.remove(BUTTON_ACTIVE);
    this.dom.button.innerText = this.isOn ? this.onText : this.offText;
  }
}
