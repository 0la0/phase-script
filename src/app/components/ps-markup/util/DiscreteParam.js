import Subscription from 'services/EventBus/Subscription';
import { audioEventBus } from 'services/EventBus';
import ParamTable from 'services/AudioParameter/ParamTable';

export const InputType = {
  number: 'number',
  string: 'string',
};

const identity = param => param;
const PARENTHESES = /\(([^)]+)\)/;

export default class DiscreteParameter {
  constructor({ attrName, inputType, defaultValue, element, transform, isAddressable, }) {
    this.attrName = attrName;
    this.inputType = inputType;
    this.defaultValue = defaultValue;
    this.element = element;
    this.transform = transform || identity;
    this.isAddressable = !!isAddressable;
    this.isConstant = true;
    this.audioEventSubscription;
    this.paramTable = new ParamTable();
    setTimeout(() => this.setValue(element.getAttribute(attrName)));
  }

  disconnect() {
    this._teardownPreviousConnections();
    this.element = null;
    this.audioEventSubscription = null;
  }

  _teardownPreviousConnections() {
    if (this.audioEventSubscription) {
      audioEventBus.unsubscribe(this.audioEventSubscription);
    }
  }

  _setConstantValue(value) {
    if (this.inputType === InputType.number) {
      const parsedValue = parseFloat(value, 10);
      this.constantValue = Number.isNaN(parsedValue) ?
        this.transform(this.defaultValue) :
        this.transform(parsedValue);
    } else {
      this.constantValue = this.transform(value);
    }
    this.isConstant = true;
  }

  _setDefaultValue() {
    this.setValue(this.defaultValue);
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
        console.log('setOnNext', message);
        const value = this.transform(message.note);
        this.paramTable.addScheduledValue(message.time.audio, value);
      });
    audioEventBus.subscribe(this.audioEventSubscription);
    this.isConstant = false;
  }

  getValueForTime(time) {
    if (this.isConstant) {
      return this.constantValue;
    }
    return this.paramTable.getValueForTime(time.audio);
  }

  setValue(val) {
    console.log('setting discrete value', val)
    this._teardownPreviousConnections();
    if (val === null) {
      return this._setDefaultValue();
    }
    if (this.isAddressable && val.indexOf('addr') === 0) {
      console.log('set message', val);
      return this._setMessage(val);
    }
    this._setConstantValue(val);
  }
}