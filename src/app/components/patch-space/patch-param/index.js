import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import style from './patch-param.css';
import markup from './patch-param.html';

const dom = [ 'label', 'slider', 'output', 'paramInlet' ];

export class PatchParamModel {
  constructor({
    label,
    defaultValue,
    setValue,
    setValueFromMessage,
    showValue
  }) {
    this.label = label;
    this.defaultValue = defaultValue;
    this.setValue = setValue;
    this.setValueFromMessage = setValueFromMessage;
    this.showValue = showValue;
  }
}

// TODO:
// * disable slider if param has input
// * accept signal input
// * if param has input, hook into global render cycle to update UI

class PatchParam extends BaseComponent {
  constructor(model) {
    super(style, markup, dom);
    this.model = model;
  }

  connectedCallback() {
    requestAnimationFrame(() => {
      this.dom.slider.setValue(this.model.defaultValue, true);
      if (this.model.label) {
        this.dom.label.innerText = this.model.label;
      }
    });
  }

  getAudioModelInput() {
    return this;
  }

  // TODO: accept signal input
  // getSignalModel() {
  //   return this.model.getSignalModel;
  // }

  // TODO: use param table...
  schedule(message) {
    this.model.setValueFromMessage(message);
  }

  onSliderUpdate(value) {
    this.model.setValue(value);
    if (this.model.showValue) {
      this.dom.output.innerText = value.toFixed(2);
    }
  }

  // TODO: move to common DOM_UTIL service or something
  getInletCenter() {
    const boundingBox = this.dom.paramInlet.getBoundingClientRect();
    return {
      x: boundingBox.left + (boundingBox.width / 2),
      y: boundingBox.top + (boundingBox.height / 2),
    };
  }
}

export default new Component('patch-param', PatchParam);
