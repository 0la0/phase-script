import EventGraph from './EventGraph';

export default class EventGraphBuilder {
  constructor(_eventGraphNodes) {
    this.eventGraph = new EventGraph();
    this.currentNode;
    Object.keys(_eventGraphNodes).forEach(fnName =>
      this[fnName] = _eventGraphNodes[fnName].bind(this));
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
    this.eventGraph.addNode(node, this.currentNode);
    return this;
  }

  getEventGraph() {
    return this.eventGraph;
  }

  to(...graphBuilders) {
    if (!graphBuilders.length) {
      throw new Error('.to() requires at least one argument');
    }
    if (!graphBuilders.every(ele => ele instanceof EventGraphBuilder)) {
      throw new Error('.to() requires every argument to be an event graph node');
    }
    const subGraphOutputs = graphBuilders.map(graphBuilder => {
      const subGraphInput = graphBuilder.getEventGraph().getInputNode();
      const subGraphOutput = graphBuilder.getEventGraph().getOutputNode();
      // CONNECT CURRENT NODE TO subGraphInput
      Array.isArray(this.currentNode) ?
        this.currentNode.forEach(currentNode => subGraphInput.addInput(currentNode.id)) :
        subGraphInput.addInput(this.currentNode.id);
      // ADD ALL NODES TO THIS GRAPH
      this.eventGraph.addEventGraph(graphBuilder.getEventGraph());
      return subGraphOutput;
    });
    // set subGraphOutputs as the current node
    this.currentNode = subGraphOutputs;
    return this;
  }
}
