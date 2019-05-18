export default class EventGraph {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
    return this;
  }

  addEventGraph(eventGraph) {
    this.nodes = this.nodes.concat(eventGraph.getNodes());
  }

  getInputNode() {
    const firstNode = this.nodes[0];
    if (!firstNode) {
      throw new Error('EventGraph.getInputNode on graph without nodes');
    }
    return firstNode;
  }

  getOutputNode() {
    const lastNode = this.nodes[this.nodes.length - 1];
    if (!lastNode) {
      throw new Error('EventGraph.getOutputNode on graph without nodes');
    }
    return lastNode;
  }

  getNodes() {
    return this.nodes;
  }
}
