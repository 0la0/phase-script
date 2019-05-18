export default class PatchAudioModel {
  constructor(name, audioModel, inputType, outputType) {
    this.name = name;
    this.audioModel = audioModel;
    this.inputType = inputType;
    this.outputType = outputType;
    this.connectionFn = this.audioModel.connect ? this.audioModel.connect.bind(this.audioModel) : undefined;
  }

  connectTo(audioModel) {
    if (this.getOutputType() !== audioModel.getInputType()) {
      throw new Error(`Incompatible connection attempted: ${this.name} to ${audioModel.name}`);
    }
    this.audioModel.connect(audioModel.getAudioModelInput());
  }

  getConnectionFn() {
    return this.connectionFn;
  }

  disconnect(audioModel) {
    const output = audioModel ? audioModel.getAudioModelInput() : undefined;
    this.audioModel.disconnect(output);
  }

  disconnectFrom(audioModel) {
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
