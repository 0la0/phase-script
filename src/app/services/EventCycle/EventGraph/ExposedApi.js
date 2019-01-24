import { uuid } from 'services/Math';

class EventGraphNode {
  constructor(type, id) {
    this.type = type;
    this.id = id;
    this.inputs = new Set();
  }

  setParams(params) {
    this.params = params;
    return this;
  }

  addInput(nodeId) {
    if (!nodeId) { return; }
    this.inputs.add(nodeId);
  }

  getInputs() {
    return this.inputs;
  }
}

class EventGraph {
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

function eventNodeWrapper(transformer) {
  function higherOrderFunction(param) {
    if (param instanceof EventGraph) {
      return transformer(param);
    }
    if (typeof param === 'function') {
      return arg => {
        const result = param(arg);
        if (result instanceof EventGraph) {
          return transformer(result);
        }
        return higherOrderFunction(result);
      };
    }
    throw new TypeError(`Invalid type: ${param}`);
  }
  return higherOrderFunction;
}

function reverb(reverbValue) {
  const id = uuid();
  return eventNodeWrapper((graph) => {
    const reverb = new EventGraphNode('REVERB', id).setParams({ reverbValue: reverbValue });
    return graph.addNode(reverb);
  });
}

class osc {
  static _buildOsc(attack, sustain, release, oscType) {
    const id = uuid();
    const params = { attack, sustain, release, oscType, };
    return eventNodeWrapper((graph) => {
      console.log('cool osc', params);
      const gain = new EventGraphNode('OSC', id).setParams(params);
      return graph.addNode(gain);
    });
  }

  static sin(attack, sustain, release) {
    return osc._buildOsc(attack, sustain, release, 'sin');
  }
  static squ(attack, sustain, release) {
    return osc._buildOsc(attack, sustain, release, 'squ');
  }
  static saw(attack, sustain, release) {
    return osc._buildOsc(attack, sustain, release, 'saw');
  }
  static tri(attack, sustain, release) {
    return osc._buildOsc(attack, sustain, release, 'tri');
  }
}

function gain(gainValue) {
  const id = uuid();
  return eventNodeWrapper((graph) => {
    const gain = new EventGraphNode('GAIN', id).setParams({ gainValue: gainValue });
    return graph.addNode(gain);
  });
}

function dac() {
  const dac = new EventGraphNode('DAC', 'DAC_ID');
  return new EventGraph().addNode(dac);
}

export const eventGraphApi = [ dac, gain, osc, reverb, eventNodeWrapper, EventGraphNode ];
