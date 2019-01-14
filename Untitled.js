const inputs = [];

function getRandomId() {
  return `${Math.floor(1000000 * Math.random())}`;
}

class Node {
  constructor(type, id) {
    this.type = type;
    this.id = id;
    this.inputs = [];
  }

  setParams(params) {
    this.params = params;
    return this;
  }

  setInput(node) {
    if (!node) { return; }
    this.inputs.push(node.id);
  }
}

class AudioGraph {
  constructor() {
    this.nodes = [];
    this.currentNode;
  }

  addNode(node) {
    if (this.currentNode) {
      this.currentNode.setInput(node);
    }
    this.nodes.push(node);
    this.currentNode = node;
    return this;
  }
}

function buildHof(transformer) {
  function hof(param) {
    if (param instanceof AudioGraph) {
      return transformer(param);
    }
    if (typeof param === 'function') {
      return arg => {
        const result = param(arg);
        if (result instanceof AudioGraph) {
          return transformer(result);
        }
        return hof(result);
      };
    }
    throw new TypeError(`Invalid type: ${param}`);
  }
  return hof;
}

function addr(a) {
  const id = getRandomId();
  return buildHof((graph) => {
    const address = new Node('ADDRESS', id).setParams({ address: a });
    graph.addNode(address);
    inputs.push(graph);
    return graph;
  });
}

function reverb(reverbValue) {
  const id = getRandomId();
  return buildHof((graph) => {
    const reverb = new Node('REVERB', id).setParams({ reverbValue: reverbValue });
    return graph.addNode(reverb);
  });
}

function gain(gainValue) {
  const id = getRandomId();
  return buildHof((graph) => {
    const gain = new Node('GAIN', id).setParams({ gainValue: gainValue });
    return graph.addNode(gain);
  });
}

function dac() {
  const dac = new Node('DAC', 'DAC_ID');
  return new AudioGraph().addNode(dac);
}

// function getStringRepresentation(graph, start) {
//   let activeNode = start;
//   if (!activeNode) { return ''; }
//   let str = activeNode.type;
//   while (activeNode.inputs.length) {
//     const inputNode = graph.find(node => node.id === activeNode.inputs[0]);
//     if (!inputNode) {
//       break;
//     }
//     str = `${inputNode.type} -> ${str}`;
//     activeNode = inputNode;
//   }
//   return str;
// }


const _gain = gain(0.5);

addr('a') (_gain) (dac())
addr('b') (_gain) (reverb(1)) (dac())
addr('c') (gain(0.5)) (reverb(1))

const allNodes = inputs.map(graph => graph.nodes).flat();

console.log('allNodes:', allNodes)
