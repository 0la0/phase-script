import DynamicParameter from 'services/EventCycle/EventGraph/DynamicParameter';

export default class BaseUnitGenerator {
  constructor() {
    this.outputAudioModels = new Set();
  }

  batchConnect(outputAudioModels) {
    const currentConnections = new Set();
    outputAudioModels.forEach((outputAudioModel) => {
      this.audioModel.connectTo(outputAudioModel);
      currentConnections.add(outputAudioModel);
    });
    // disconnect former connections
    this.outputAudioModels.forEach(outputAudioModel => {
      if (!currentConnections.has(outputAudioModel)) {
        setTimeout(() => this.audioModel.disconnectFrom(outputAudioModel));
      }
    });
    this.outputAudioModels = currentConnections;
  }

  getAudioModel() {
    return this.audioModel;
  }

  disconnect() {
    this.audioModel && this.audioModel.disconnect && this.audioModel.disconnect();
    this.eventModel && this.eventModel.disconnect && this.eventModel.disconnect();
  }

  _ifNumberOr(val, fallback) {
    return typeof val === 'number' ? val : fallback;
  }

  updateParams(params, time) {
    if (!this.paramMap) {
      return;
    }
    Object.keys(params).forEach(paramKey => {
      const paramVal = params[paramKey];
      if (paramVal instanceof DynamicParameter) {
        console.log('TODO: received dynamicParam, fix'); // eslint-disable-line no-console
        return;
      }
      if (!this.paramMap[paramKey]) {
        return;
      }
      this.paramMap[paramKey].setParamValue(paramVal, time);
    });
  }
}
