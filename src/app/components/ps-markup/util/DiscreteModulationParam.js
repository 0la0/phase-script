const PARENTHESES = /\(([^)]+)\)/;

export default class DiscreteModulationParam {
  constructor({ attrName, element }) {
    this.attrName = attrName;
    this.element = element;
    this.modulationInputs = new Set();
  }

  _teardownPreviousConnections() {
    this.modulationInputs = new Set();
  }

  disconnect() {
    this._teardownPreviousConnections();
    this.element = null;
  }

  setValue(val) {
    const match = val.match(PARENTHESES);
    this._teardownPreviousConnections();
    if (!match) {
      return;
    }
    const target = this.element.getRootNode().getElementById(match[1]);
    if (!target || !target.audioModel) {
      return;
    }
    this.modulationInputs.add(target.audioModel.getConnectionFn());
  }
}
