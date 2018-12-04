import ParamTable from 'services/PatchSpace/ParamTable';

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

  // getAudioModelInput() {
  //   // return this.audioModel.getInput();
  //   return this;
  // }

  getValueForTime(time) {
    return this.paramTable.getValueForTime(time);
  }
}
