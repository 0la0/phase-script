export default class PatchAudioModel {
  constructor(name, audioModel, inputType, outputType) {
    this.name = name;
    this.audioModel = audioModel;
    this.inputType = inputType;
    this.outputType = outputType;
  }

  connectTo(audioModel) {
    // TODO: check compatibility
    console.log('connecting to:', audioModel);
    this.audioModel.connect(audioModel.getAudioModelInput());
  }

  disconnect(audioModel) {
    this.audioModel.disconnect(audioModel.getAudioModelInput());
  }

  getAudioModelInput() {
    return this.audioModel.getInput();
  }

  getInputType() {
    return this.inputType;
  }

  getOutputType() {
    return this.outputType;
  }
}
