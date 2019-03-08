import { uuid } from 'services/Math';

export class EventGraphNode {
  constructor({ type, id, params, isModulatable }) {
    this.type = type;
    this.id = id || uuid();
    this.isTemporary = !!id;
    this.params = params || {};
    this.inputs = new Set();
    this.modulationInputs = new Set();
    if (isModulatable) {
      this.modulate = (graphOuputs) => {
        graphOuputs.forEach(node => this.modulationInputs.add(node.id));
      };
    }
  }

  addInput(nodeId) {
    if (!nodeId) { return; }
    this.inputs.add(nodeId);
  }

  getInputs() {
    return this.inputs;
  }
}
