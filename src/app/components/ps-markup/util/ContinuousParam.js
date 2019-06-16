import Subscription from 'services/EventBus/Subscription';
import { audioEventBus } from 'services/EventBus';

const PARENTHESES = /\(([^)]+)\)/;

export default class ContinuousParam {
  constructor({ attrName, param, inputType, defaultValue, element, }) {
    this.attrName = attrName;
    this.param = param;
    this.inputType = inputType;
    this.defaultValue = defaultValue;
    this.element = element;
    this.isConstant = true;
    this.audioEventSubscription;
    this.modulationInputModel;
    this.modulationConnection = { getInputType: () => 'SIGNAL', getAudioModelInput: () => this.param, };
    this._setDefaultValue();
    setTimeout(() => this.setValue(element.getAttribute(attrName)));
  }

  disconnect() {
    this._teardownPreviousConnections();
    this.element = null;
    this.param = null;
    this.modulationInputModel = null;
    this.audioEventSubscription = null;
    this.modulationConnection = null;
    this.isConstant = true;
  }

  _setDefaultValue() {
    this.param.linearRampToValueAtTime(this.defaultValue, 0);
  }

  _teardownPreviousConnections() {
    if (this.audioEventSubscription) {
      audioEventBus.unsubscribe(this.audioEventSubscription);
    }
    if (this.modulationInputModel) {
      this.modulationInputModel.disconnect(this.modulationConnection);
      this.modulationInputModel = null;
    }
  }

  _setMessage(val) {
    const match = val.match(PARENTHESES);
    if (!match) {
      console.log(`error paring address ${val}`);
      return this._setDefaultValue();
    }
    const address = match[1];
    this.audioEventSubscription = new Subscription()
      .setAddress(address)
      .setOnNext(message => {
        if (this.isConstant) { return; }
        message.interpolate ?
          this.param.linearRampToValueAtTime(message.note, message.time.audio) :
          this.param.setValueAtTime(message.note, message.time.audio);
      });
    audioEventBus.subscribe(this.audioEventSubscription);
    this.isConstant = false;
  }

  _setSignal(val) {
    const match = val.match(PARENTHESES);
    if (!match) {
      console.log(`error paring modulation value ${val}`);
      return this._setDefaultValue();
    }
    const target = this.element.getRootNode().getElementById(match[1]);
    if (!target) {
      return this._setDefaultValue();
    }
    
    if (target && target.audioModel) {
      target.audioModel.connectTo(this.modulationConnection);
      this.modulationInputModel = target.audioModel;
      this.isConstant = false;
      return;
    }

    this._setDefaultValue();
  }

  _setNumeric(stringValue) {
    const numericValue = parseFloat(stringValue, 10);
    if (Number.isNaN(numericValue)) {
      console.log(`non numeric value ${stringValue}`);
      return this._setDefaultValue();
    }
    this.param.linearRampToValueAtTime(numericValue, 0);
    this.isConstant = true;
  }

  setValue(val) {
    this._teardownPreviousConnections();
    if (val === null) {
      return this._setDefaultValue();
    }
    if (this.inputType.isMessage && val.indexOf('addr') === 0) {
      return this._setMessage(val);
    }
    if (this.inputType.isSignal && val.indexOf('mod') === 0) {
      return this._setSignal(val);
     }
    if (this.inputType.isNumeric) {
      return this._setNumeric(val);
    }
    console.log(`error classifying ${val}`);
  }
}