import ParamTable from 'services/AudioParameter/ParamTable';

function defaultParamTransform(message) {
  return message.note / 127;
}

export default class ParamScheduler {
  constructor(paramTransform) {
    this.paramTransform = paramTransform || defaultParamTransform;
    this.paramTable = new ParamTable();
  }

  schedule(message) {
    const value = this.paramTransform(message);
    this.paramTable.addScheduledValue(message.time.audio, value);
  }

  setParamValue(paramVal) {
    if (paramVal.outputType !== 'MESSAGE') {
      throw new Error('ParamScheduler requires message model');
    }
    paramVal.audioModel.outlets.add({
      schedule: (message) => {
        const value = this.paramTransform(message.note);
        this.paramTable.addScheduledValue(message.time.audio, value);
      }
    });
  }

  getValueForTime(time) {
    return this.paramTable.getValueForTime(time);
  }
}
