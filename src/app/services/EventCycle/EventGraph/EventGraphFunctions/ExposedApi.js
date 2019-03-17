import { EventGraphNode } from './EventGraphNode';
import EventGraph from './EventGraph';
import nodeDefinitions, { PARAM_TYPES, CONSTANTS} from './EventGraphApiDefinition';

// TODO:
//   * parameter validation
//   * message duplicator
//   * rand parameters for msgDelay
//   * message repeater
//   * midi out
//   * continuous osc
//   * modulator connections
//   * mic in
//   * compressor node
//   * wet levels on audio effect nodes
//   * arpeggiators
//   * address as graph parameters
//   * anonymous patterns
//   * key shortcut to generate node IDs
//   * sample bank
//   * midi config editor

export class DynamicParameter {
  constructor(nodeId) {
    this.nodeId = nodeId;
  }

  getNodeId() {
    return this.nodeId;
  }
}

function _setCurrent(node) {
  if (this instanceof EventGraphBuilder) {
    return this._setCurrent(node);
  }
  return new EventGraphBuilder()._setCurrent(node);
}

function buildNodeEvaluator(dto) {
  const { name, fnName, paramDefinitions = [], constantDefinitions = [] } = dto;
  const scopedFuncitonName = `_${fnName}`;
  return { [scopedFuncitonName]: function(...args) {
    let tag = '';
    const variableParams = paramDefinitions.reduce((acc, definition, index) => {
      const arg = args[index];
      // TODO: if definition.isOptional && validateType(arg, definition.type) === false
      if (definition.type === PARAM_TYPES.GRAPH_NODE && (!(arg instanceof EventGraphBuilder))) {
        return acc;
      }

      if (definition.paramName === CONSTANTS.ID) {
        tag += (definition.value || arg);
        return acc;
      }
      let paramValue;
      if (arg instanceof EventGraphBuilder) {
        const outputNode = arg.currentNode;
        paramValue = new DynamicParameter(outputNode.id);
      } else {
        paramValue = arg;
        if (definition.isTaggable) {
          tag += arg;
        }
      }
      acc[definition.paramName] = paramValue;
      return acc;
    }, {});
    const constantParams = constantDefinitions.reduce((acc, definition) => {
      if (definition.isTaggable) {
        tag += definition.value;
      }
      if (definition.paramName === CONSTANTS.ID) {
        return acc;
      }
      acc[definition.paramName] = definition.value;
      return acc;
    }, {});
    const eventGraphNode = new EventGraphNode({
      type: name,
      id: tag ? `${name}-${tag}` : undefined,
      params: Object.assign({}, variableParams, constantParams),
    });
    return _setCurrent.call(this, eventGraphNode);
  }, }[scopedFuncitonName];
}

const eventGraphNodes = nodeDefinitions.reduce((acc, nodeDefinition) =>
  Object.assign(acc, {
    [nodeDefinition.fnName]: buildNodeEvaluator(nodeDefinition)
  }), {});

class EventGraphBuilder {
  constructor() {
    this.eventGraph = new EventGraph();
    this.currentNode;
    Object.keys(eventGraphNodes).forEach(fnName =>
      this[fnName] = eventGraphNodes[fnName].bind(this));
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

export const eventGraphApi = Object.keys(eventGraphNodes)
  .map(key => ({ name: key, fn: eventGraphNodes[key] }));
