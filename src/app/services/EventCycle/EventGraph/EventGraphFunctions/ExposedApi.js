import { EventGraphNode } from './EventGraphNode';
import { eventGraph } from './EventGraph';
import { mtof, ftom, } from 'services/midi/util';

// TODO:
//   * parameter validation
//   * message duplicator
//   * message delay (with rand parameters)
//   * message threshold (like svg graph)
//   * message scale
//   * message repeater
//   * midi out
//   * continuous osc
//   * modulator connections
//   * connection fan out / fan in
//   * mic in
//   * audio signal thresh -> trigger event
//   * bitcrusher worklet
//   * noise gen worklet

function _setCurrent(node) {
  if (this instanceof EventGraphBuilder) {
    return this._setCurrent(node);
  }
  return new EventGraphBuilder()._setCurrent(node);
}

function _address(address) {
  const addressNode = new EventGraphNode('MSG_ADDRESS').setParams({ address });
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

function biquadFilter(type, frequency, q, id) {
  const params = { type, frequency, q, };
  const filterNode = new EventGraphNode('FILTER', `FILTER-${type}-${id}`).setParams(params);
  return _setCurrent.call(this, filterNode);
}

function lp(frequency, q, id) {
  return biquadFilter.call(this, 'lowpass', frequency, q, id);
}

function hp(frequency, q, id) {
  return biquadFilter.call(this, 'highpass', frequency, q, id);
}

function bp(frequency, q, id) {
  return biquadFilter.call(this, 'bandpass', frequency, q, id);
}

function sin(attack, sustain, release, id) {
  return buildOsc.call(this, attack, sustain, release, 'sin', id);
}

function squ(attack, sustain, release, id) {
  return buildOsc.call(this, attack, sustain, release, 'squ', id);
}

function saw(attack, sustain, release, id) {
  return buildOsc.call(this, attack, sustain, release, 'saw', id);
}

function tri(attack, sustain, release, id) {
  return buildOsc.call(this, attack, sustain, release, 'tri', id);
}

function buildWvshp(type, wet, id) {
  const params = { type, wet, id, };
  const filterNode = new EventGraphNode('WAVESHAPER', `WAVESHAPER-${type}-${id}`).setParams(params);
  return _setCurrent.call(this, filterNode);
}

function pan(panValue, id) {
  const params = { panValue, id, };
  const pannerNode = new EventGraphNode('PANNER', `PANNER-${id}`).setParams(params);
  return _setCurrent.call(this, pannerNode);
}

const wvshp = {
  squ: function (wet, id) { return buildWvshp.call(this, 'square', wet, id); },
  cube: function (wet, id) { return buildWvshp.call(this, 'cubed', wet, id); },
  cheb: function (wet, id) { return buildWvshp.call(this, 'chebyshev2', wet, id); },
  sig: function (wet, id) { return buildWvshp.call(this, 'sigmoidLike', wet, id); },
  clip: function (wet, id) { return buildWvshp.call(this, 'hardClip', wet, id); },
};

function samp(sampleName, attack, sustain, release, id) {
  const params = { sampleName, attack, sustain, release, };
  const samplerNode = new EventGraphNode('SAMPLER', `SAMPLER-${sampleName}-${id}`).setParams(params);
  return _setCurrent.call(this, samplerNode);
}

function map(mapFn) {
  const params = { mapFn, };
  const messageMapNode = new EventGraphNode('MSG_MAP').setParams(params);
  return _setCurrent.call(this, messageMapNode);
}

function filter(filterFn) {
  const params = { filterFn, };
  const messageFilterNode = new EventGraphNode('MSG_FILTER').setParams(params);
  return _setCurrent.call(this, messageFilterNode);
}



class EventGraphBuilder {
  constructor() {
    eventGraph.clear();
    this.currentNode;

    this.address = _address.bind(this);
    this.dac = dac.bind(this);
    this.gain = gain.bind(this);
    this.sin = sin.bind(this),
    this.squ = squ.bind(this),
    this.saw = saw.bind(this),
    this.tri = tri.bind(this),
    this.reverb = reverb.bind(this);
    this.chorus = chorus.bind(this);
    this.delay = delay.bind(this);
    this.lp = lp.bind(this);
    this.hp = hp.bind(this);
    this.bp = bp.bind(this);
    this.wvshp = {
      squ: wvshp.squ.bind(this),
      cube: wvshp.cube.bind(this),
      cheb: wvshp.cheb.bind(this),
      sig: wvshp.sig.bind(this),
      clip: wvshp.clip.bind(this),
    };
    this.samp = samp.bind(this);
    this.map = map.bind(this);
    this.filter = filter.bind(this);
    this.pan = pan.bind(this);
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
  // osc,
  // reverb
  mtof,
  ftom,
];
