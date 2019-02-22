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
  const gainNode = new EventGraphNode('GAIN', `GAIN-${id}`).setParams({ gainValue });
  return _setCurrent.call(this, gainNode);
}

function buildOsc(attack, sustain, release, oscType, id) {
  const params = { attack, sustain, release, oscType, };
  const oscNode = new EventGraphNode('OSC', `OSC-${oscType}-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

function reverb(attack, decay, wet, id) {
  const params = { attack, decay, wet, };
  const oscNode = new EventGraphNode('REVERB', `REVERB-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

function chorus(frequency, depth, feedback, id) {
  const params = { frequency, depth, feedback, };
  const oscNode = new EventGraphNode('CHORUS', `CHORUS-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

function delay(delayMs, feedback, wet, id) {
  const params = { delayMs, feedback, wet, };
  const oscNode = new EventGraphNode('DELAY', `DELAY-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

function filter(type, frequency, q, id) {
  const params = { type, frequency, q, };
  const filterNode = new EventGraphNode('FILTER', `FILTER-${type}-${id}`).setParams(params);
  return _setCurrent.call(this, filterNode);
}

function lp(frequency, q, id) {
  return filter.call(this, 'lowpass', frequency, q, id);
}

function hp(frequency, q, id) {
  return filter.call(this, 'highpass', frequency, q, id);
}

function bp(frequency, q, id) {
  return filter.call(this, 'bandpass', frequency, q, id);
}

// // TODO
// function filter() {}
//
// // TODO
// function waveshaper() {}
//
// // TODO
// const samp = {};


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
      squ: osc.squ.bind(this),
      saw: osc.saw.bind(this),
      tri: osc.tri.bind(this),
    };
    this.reverb = reverb.bind(this);
    this.chorus = chorus.bind(this);
    this.delay = delay.bind(this);
    this.lp = lp.bind(this);
    this.hp = hp.bind(this);
    this.bp = bp.bind(this);
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

export const eventGraphApi = [
  _address,
  // chorus,
  dac,
  gain,
  osc,
  // reverb
];
