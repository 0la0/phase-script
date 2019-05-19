import AudioGraph from './AudioGraph';

export default class AudioGraphBuilder {
  constructor(_audioGraphNodes) {
    this.audioGraph = new AudioGraph();
    this.currentNode;
    Object.keys(_audioGraphNodes).forEach(fnName =>
      this[fnName] = _audioGraphNodes[fnName].bind(this));
  }

  // TODO: reverse connection strucure: currentNode.addOutput
  _setCurrent(node) {
    if (this.currentNode) {
      if (Array.isArray(this.currentNode)) {
        this.currentNode.forEach(currentNode => node.addInput(currentNode.id));
      } else {
        node.addInput(this.currentNode.id);
      }
    }
    this.currentNode = node;
    this.audioGraph.addNode(node, this.currentNode);
    return this;
  }

  getAudioGraph() {
    return this.audioGraph;
  }

  to(...graphBuilders) {
    if (!graphBuilders.length) {
      throw new Error('.to() requires at least one argument');
    }
    if (!graphBuilders.every(ele => ele instanceof AudioGraphBuilder)) {
      throw new Error('.to() requires every argument to be an event graph node');
    }
    const subGraphOutputs = graphBuilders.map(graphBuilder => {
      const subGraphInput = graphBuilder.getAudioGraph().getInputNode();
      const subGraphOutput = graphBuilder.getAudioGraph().getOutputNode();
      // CONNECT CURRENT NODE TO subGraphInput
      Array.isArray(this.currentNode) ?
        this.currentNode.forEach(currentNode => subGraphInput.addInput(currentNode.id)) :
        subGraphInput.addInput(this.currentNode.id);
      // ADD ALL NODES TO THIS GRAPH
      this.audioGraph.addAudioGraph(graphBuilder.getAudioGraph());
      return subGraphOutput;
    });
    // set subGraphOutputs as the current node
    this.currentNode = subGraphOutputs;
    return this;
  }
}
