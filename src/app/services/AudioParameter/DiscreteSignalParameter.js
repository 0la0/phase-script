import ParamTable from 'services/AudioParameter/ParamTable';

const identity = val => val;

export default class DiscreteSignalParamter {
  constructor(defaultValue, paramTransform = identity) {
    this.defaultValue = defaultValue;
    this.paramTransform = paramTransform;
    this.hasConstantValue = false;
    this.constantValue;
    this.setConstantValue(defaultValue);
    this.paramTable = new ParamTable();
  }

  setConstantValue(paramVal) {
    this.constantValue = this.paramTransform(paramVal);
    this.hasConstantValue = true;
  }

  setDynamicValue(paramVal) {
    this.hasConstantValue = false;
    paramVal.audioModel.outlets.add({
      schedule: (message) => {
        const value = this.paramTransform(message.note);
        this.paramTable.addScheduledValue(message.time.audio, value);
      }
    });
  }

  setParamValue(paramVal) {
    if (typeof paramVal === 'number') {
      this.setConstantValue(paramVal);
      return;
    }
    if (typeof paramVal === 'string') {
      this.setConstantValue(paramVal);
      return;
    }
    this.setDynamicValue(paramVal);
  }

  getValueForTime(time) {
    if (this.hasConstantValue) {
      return this.constantValue;
    }
    return this.paramTable.getValueForTime(time.audio);
  }
}
