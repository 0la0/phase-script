export default class EventGraph {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
    return this;
  }
}
