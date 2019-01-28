export default class EventGraph {
  constructor() {
    this.nodes = [];
    this.currentNode;
  }

  addNode(node) {
    if (this.currentNode && node.id) {
      this.currentNode.addInput(node.id);
    }
    this.nodes.push(node);
    this.currentNode = node;
    return this;
  }
}
