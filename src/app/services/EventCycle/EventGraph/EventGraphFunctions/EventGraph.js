class EventGraph {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
    return this;
  }

  clear() {
    this.nodes = [];
  }
}
const eventGraph = new EventGraph();
export { eventGraph };
