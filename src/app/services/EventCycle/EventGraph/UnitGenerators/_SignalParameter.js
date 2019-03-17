
export default class SignalParameter {
  constructor(param, defaultValue) {
    this.defaultValue = defaultValue;
    this.param = param;
    this.param.setValueAtTime(defaultValue, 0);
  }

  setParamValueAtTime(value, time) {
    if (typeof value !== 'number') {
      return;
    }
    console.log('setParamValueAtTime', value, time);
    this.param.linearRampToValueAtTime(value, time.audio);
  }

  setDynamicParam(dynamicParam) {
    console.log('pan.setDynamicParam', dynamicParam);
    if (dynamicParam.outputType === 'MESSAGE') {
      const gainParamOutlet = {
        schedule: msg => this.param.linearRampToValueAtTime(msg.note, msg.time.audio),
      };
      dynamicParam.audioModel.outlets.add(gainParamOutlet);
      return;
    }
    if (dynamicParam.outputType === 'SIGNAL') {
      console.log('connecting to:', this.param);
      dynamicParam.connectTo({
        getInputType: () => 'SIGNAL',
        getAudioModelInput: () => this.param,
      });
      return;
    }
    throw new Error('Invalid Param', dynamicParam);
  }
}
