import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';

// TODO: COMBINE WITH PATCH PARAM TYPES
const InputTypes = {
  NUMERIC: 'NUMERIC',
  MESSAGE: 'MESSAGE',
  SIGNAL: 'SIGNAL',
};

export class InputType {
  constructor() {
    this.inputTypes = [];
  }

  numeric() {
    this.inputTypes.push(InputTypes.NUMERIC);
    return this;
  }

  message() {
    this.inputTypes.push(InputTypes.MESSAGE);
    return this;
  }

  signal() {
    this.inputTypes.push(InputTypes.SIGNAL);
    return this;
  }

  build() {
    return this.inputTypes;
  }
}


export default class SignalParameter {
  constructor(param, defaultValue, inputTypes) {
    this.defaultValue = defaultValue;
    this.param = param;
    this.param.setValueAtTime(defaultValue, 0);
    this.inputTypes = inputTypes || [];
  }

  _setNumericValue(value, time) {
    if (!this.inputTypes.includes(InputTypes.NUMERIC)) {
      throw new Error('Parameter does not accept numeric values');
    }
    this.param.linearRampToValueAtTime(value, time.audio);
  }

  _setDynamicParamForSignal(dynamicParam) {
    if (!this.inputTypes.includes(InputTypes.SIGNAL)) {
      throw new Error('Parameter does not accept signal modulation');
    }
    dynamicParam.connectTo({
      getInputType: () => 'SIGNAL',
      getAudioModelInput: () => this.param,
    });
  }

  _setDynamicParamForMessage(dynamicParam) {
    if (!this.inputTypes.includes(InputTypes.MESSAGE)) {
      throw new Error('Parameter does not accept message modulation');
    }
    const gainParamOutlet = {
      schedule: msg => {
        msg.interpolate ?
          this.param.linearRampToValueAtTime(msg.note, msg.time.audio) :
          this.param.setValueAtTime(msg.note, msg.time.audio);
      },
    };
    dynamicParam.audioModel.outlets.add(gainParamOutlet);
  }

  _setDynamicParam(dynamicParam) {
    if (dynamicParam.outputType === 'MESSAGE') {
      this._setDynamicParamForMessage(dynamicParam);
      return;
    }
    if (dynamicParam.outputType === 'SIGNAL') {
      this._setDynamicParamForSignal(dynamicParam);
      return;
    }
    throw new Error('Invalid Param', dynamicParam);
  }

  setParamValue(value, time) {
    if (value instanceof PatchAudioModel) {
      this._setDynamicParam(value);
      return;
    }
    this._setNumericValue(value, time);
  }
}
