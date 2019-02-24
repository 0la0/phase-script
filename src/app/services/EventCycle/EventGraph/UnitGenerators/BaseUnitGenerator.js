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
}
