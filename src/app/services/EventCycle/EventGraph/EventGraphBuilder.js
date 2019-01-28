import Address from './UnitGenerators/Address';
import Dac from './UnitGenerators/Dac';
import Gain from './UnitGenerators/Gain';
import Osc from './UnitGenerators/Osc';

const DAC_ID = 'DAC_ID';

const typeMap = {
  DAC: Dac,
  GAIN: Gain,
  ADDRESS: Address,
  OSC: Osc,
};

let currentBuiltGraph = {};
let currentGraph = {};

function teardownGraph(graph = {}) {
  if (!graph) { return; }
  Object.keys(graph).forEach(key => {
    const node = graph[key];
    if (node.instance) {
      node.instance.disconnect();
    }
  });
}

function buildNodeType(node) {
  const instance = typeMap[node.type];
  if (!typeMap[node.type]) {
    console.log('Audio graph definition not found for', node.type);
    return `TODO: ${node.type}`;
  }
  return instance;
}

function connectToInputs(node, graph) {
  if (!node) {
    return;
  }
  node.nodeDefinition.inputs.forEach(inputId => {
    const input = graph[inputId].instance;
    const output = node.instance;
    input.audioModel.connectTo(output.audioModel);
    connectToInputs(graph[inputId], graph);
  });
}

class NodeDescription {
  constructor(name, inDegree) {
    this.name = name;
    this.inDegree = inDegree;
  }

  equals(obj) {
    return this.name === obj.name && this.inDegree === obj.inDegree;
  }
}

function analyzeGraphDiff(nextGraph, lastGraph) {
  function describeNode(node) {
    return new NodeDescription(node.type, node.inputs.size);
  }
  const nextDefinition = Object.keys(nextGraph).map(key => describeNode(nextGraph[key]));
  const lastDefinition = Object.keys(lastGraph).map(key => describeNode(lastGraph[key]));
  const lengthsAreEqual = nextDefinition.length === lastDefinition.length;
  const nodesAreContained = nextDefinition.every(node => lastDefinition.find(_node => _node.equals(node)));
  return lengthsAreEqual && nodesAreContained;
}

export function buildEventGraph(graphDefinition = {}) {
  const graphsAreEqual = analyzeGraphDiff(graphDefinition, currentGraph);
  // if (graphsAreEqual) {
  //   // TODO: update params
  // }
  teardownGraph(currentBuiltGraph);
  currentBuiltGraph = null;
  if (!graphDefinition[DAC_ID]) {
    console.log('graphDefinition missing end node', graphDefinition);
    return;
  }
  const builtNodes = Object.keys(graphDefinition)
    .reduce((acc, key) => {
      const nodeDefinition = graphDefinition[key];
      const NodeClazz = buildNodeType(nodeDefinition);
      const instance = NodeClazz.fromParams(nodeDefinition.params);
      return Object.assign(acc, {
        [key]: { nodeDefinition, instance, },
      });
    }, {});
  connectToInputs(builtNodes[DAC_ID], builtNodes);
  currentGraph = graphDefinition;
  currentBuiltGraph = builtNodes;
}
