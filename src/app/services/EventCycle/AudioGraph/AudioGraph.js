export default class AudioGraph {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
    return this;
  }

  addAudioGraph(audioGraph) {
    this.nodes = this.nodes.concat(audioGraph.getNodes());
  }

  getInputNode() {
    const firstNode = this.nodes[0];
    if (!firstNode) {
      throw new Error('AudioGraph.getInputNode on graph without nodes');
    }
    return firstNode;
  }

  getOutputNode() {
    const lastNode = this.nodes[this.nodes.length - 1];
    if (!lastNode) {
      throw new Error('AudioGraph.getOutputNode on graph without nodes');
    }
    return lastNode;
  }

  getNodes() {
    return this.nodes;
  }
}
