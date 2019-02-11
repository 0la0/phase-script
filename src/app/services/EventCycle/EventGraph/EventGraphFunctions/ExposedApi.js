import { EventGraphNode } from './EventGraphNode';
import { eventGraph } from './EventGraph';

function _setCurrent(node) {
  if (this instanceof EventGraphBuilder) {
    return this._setCurrent(node);
  }
  return new EventGraphBuilder()._setCurrent(node);
}

function _address(address) {
  const addressNode = new EventGraphNode('ADDRESS').setParams({ address });
  return _setCurrent.call(this, addressNode);
}

function dac() {
  const dacNode = new EventGraphNode('DAC', 'DAC_ID');
  return _setCurrent.call(this, dacNode);
}

function gain(gainValue, id) {
  const gainNode = new EventGraphNode('GAIN', id).setParams({ gainValue });
  return _setCurrent.call(this, gainNode);
}

function buildOsc(attack, sustain, release, oscType, id) {
  const params = { attack, sustain, release, oscType, };
  const oscNode = new EventGraphNode('OSC', id).setParams(params);
  return _setCurrent.call(this, oscNode);
}

const osc = {
  sin: function (attack, sustain, release, id) {
    return buildOsc.call(this, attack, sustain, release, 'sin', id);
  },
  squ: function (attack, sustain, release, id) {
    return buildOsc.call(this, attack, sustain, release, 'squ', id);
  },
  saw: function (attack, sustain, release, id) {
    return buildOsc.call(this, attack, sustain, release, 'saw', id);
  },
  tri: function (attack, sustain, release, id) {
    return buildOsc.call(this, attack, sustain, release, 'tri', id);
  },
};

class EventGraphBuilder {
  constructor() {
    eventGraph.clear();
    this.currentNode;

    this.address = _address.bind(this);
    this.dac = dac.bind(this);
    this.gain = gain.bind(this);
    this.osc = {
      sin: osc.sin.bind(this),
    };
  }

  _setCurrent(node) {
    if (this.currentNode) {
      node.addInput(this.currentNode.id);
    }
    this.currentNode = node;
    eventGraph.addNode(node, this.currentNode);
    return this;
  }

  __buildOsc(attack, sustain, release, oscType, id) {
    const params = { attack, sustain, release, oscType, };
    const oscNode = new EventGraphNode('OSC', id).setParams(params);
    return this._setCurrent(oscNode);
  }

  showGraph() {
    return eventGraph;
  }
}

export const eventGraphApi = [ _address, dac, gain, osc, ];
