export default class PatchAudioModel {
  constructor(name, audioModel, inputType, outputType) {
    this.name = name;
    this.audioModel = audioModel;
    this.inputType = inputType;
    this.outputType = outputType;
  }

  connectTo(audioModel) {
    // TODO: check compatibility
    this.audioModel.connect(audioModel.getAudioModelInput());
  }

  disconnect(audioModel) {
    const output = audioModel ? audioModel.getAudioModelInput() : undefined;
    this.audioModel.disconnect(output);
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
