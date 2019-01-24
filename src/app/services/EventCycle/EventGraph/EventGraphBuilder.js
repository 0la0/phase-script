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

function getOccurance(strList) {
  return strList.reduce((cnt, str) => {
    if (!cnt[str]) {
      cnt[str] = 1;
    } else {
      cnt[str]++;
    }
    return cnt;
  }, {});
}

function analyzeGraphDiff(nextGraph, lastGraph) {
  console.log('allNodes:', nextGraph)
  function getInDegree(node) {
    return node.inputs.size;
  }

  function describeNode(node) {
    return `${node.type} in degree: ${getInDegree(node)}`;
  }

  const nodes = {
    next: getOccurance(Object.keys(nextGraph).map(key => describeNode(nextGraph[key]))),
    last: getOccurance(Object.keys(lastGraph).map(key => describeNode(lastGraph[key]))),
  };

  console.log('nodes', nodes);
}

export function buildEventGraph(graphDefinition = {}) {
  analyzeGraphDiff(graphDefinition, currentGraph);
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
