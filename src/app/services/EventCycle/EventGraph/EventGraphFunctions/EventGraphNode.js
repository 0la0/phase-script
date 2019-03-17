import { uuid } from 'services/Math';

export class EventGraphNode {
  constructor({ type, id, params }) {
    this.type = type;
    this.id = id || uuid();
    this.isTemporary = !!id;
    this.params = params || {};
    this.inputs = new Set();
  }

  addInput(nodeId) {
    if (!nodeId) { return; }
    this.inputs.add(nodeId);
  }

  getInputs() {
    return this.inputs;
  }
}
