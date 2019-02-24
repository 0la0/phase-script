import { uuid } from 'services/Math';

export class EventGraphNode {
  constructor(type, id) {
    this.type = type;
    this.id = id || uuid();
    this.isTemporary = !!id;
    this.params = {};
    this.inputs = new Set();
  }

  setParams(params) {
    this.params = params;
    return this;
  }

  addInput(nodeId) {
    if (!nodeId) { return; }
    this.inputs.add(nodeId);
  }

  getInputs() {
    return this.inputs;
  }
}
