import { EventGraphNode } from './EventGraphNode';
import EventGraph from './EventGraph';

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

function _dac() {
  const dacNode = new EventGraphNode('DAC', 'DAC_ID');
  return _setCurrent.call(this, dacNode);
}

function _gain(gainValue, id) {
  const gainNode = new EventGraphNode('GAIN', `GAIN-${id}`).setParams({ gainValue });
  return _setCurrent.call(this, gainNode);
}

function buildContinuousOsc(frequency, id, oscType) {
  const params = { frequency, oscType, };
  const oscNode = new EventGraphNode('CONTINUOUS_OSC', `OSC-${oscType}-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

// attack, sustain, release, type
// attack, sustain, release, type, id
// frequency, type
// frequency, type, id
function buildOsc(...args) {
  if (args.length > 3) {
    return buildEnvelopedOsc.apply(this, args);
  }
  return buildContinuousOsc.apply(this, args);
}

function buildEnvelopedOsc(attack, sustain, release, id, oscType) {
  const params = { attack, sustain, release, oscType, };
  console.log('buildEnvelopedOsc', params, id)
  const oscNode = new EventGraphNode('ENVELOPED_OSC', `OSC-${oscType}-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

function _reverb(attack, decay, wet, id) {
  const params = { attack, decay, wet, };
  const oscNode = new EventGraphNode('REVERB', `REVERB-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

function _chorus(frequency, depth, feedback, id) {
  const params = { frequency, depth, feedback, };
  const oscNode = new EventGraphNode('CHORUS', `CHORUS-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

function _delay(delayMs, feedback, wet, id) {
  const params = { delayMs, feedback, wet, };
  const oscNode = new EventGraphNode('DELAY', `DELAY-${id}`).setParams(params);
  return _setCurrent.call(this, oscNode);
}

function _biquadFilter(type, frequency, q, id) {
  const params = { type, frequency, q, };
  const filterNode = new EventGraphNode('FILTER', `FILTER-${type}-${id}`).setParams(params);
  return _setCurrent.call(this, filterNode);
}

function _lp(frequency, q, id) {
  return _biquadFilter.call(this, 'lowpass', frequency, q, id);
}

function _hp(frequency, q, id) {
  return _biquadFilter.call(this, 'highpass', frequency, q, id);
}

function _bp(frequency, q, id) {
  return _biquadFilter.call(this, 'bandpass', frequency, q, id);
}

function _sin(...args) {
  return buildOsc.apply(this, args.concat('sin'));
}

function _squ(...args) {
  return buildOsc.apply(this, args.concat('squ'));
}

function _saw(...args) {
  return buildOsc.apply(this, args.concat('saw'));
}

function _tri(...args) {
  return buildOsc.apply(this, args.concat('tri'));
}

function buildWvshp(type, wet, id) {
  const params = { type, wet, id, };
  const filterNode = new EventGraphNode('WAVESHAPER', `WAVESHAPER-${type}-${id}`).setParams(params);
  return _setCurrent.call(this, filterNode);
}

function _pan(panValue, id) {
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

function _samp(sampleName, attack, sustain, release, id) {
  const params = { sampleName, attack, sustain, release, };
  const samplerNode = new EventGraphNode('SAMPLER', `SAMPLER-${sampleName}-${id}`).setParams(params);
  return _setCurrent.call(this, samplerNode);
}

function _map(mapFn) {
  const params = { mapFn, };
  const messageMapNode = new EventGraphNode('MSG_MAP').setParams(params);
  return _setCurrent.call(this, messageMapNode);
}

function _filter(filterFn) {
  const params = { filterFn, };
  const messageFilterNode = new EventGraphNode('MSG_FILTER').setParams(params);
  return _setCurrent.call(this, messageFilterNode);
}

class EventGraphBuilder {
  constructor() {
    this.eventGraph = new EventGraph();
    this.currentNode;

    this.address = _address.bind(this);
    this.dac = _dac.bind(this);
    this.gain = _gain.bind(this);
    this.sin = _sin.bind(this),
    this.squ = _squ.bind(this),
    this.saw = _saw.bind(this),
    this.tri = _tri.bind(this),
    this.reverb = _reverb.bind(this);
    this.chorus = _chorus.bind(this);
    this.delay = _delay.bind(this);
    this.lp = _lp.bind(this);
    this.hp = _hp.bind(this);
    this.bp = _bp.bind(this);
    this.wvshp = {
      squ: wvshp.squ.bind(this),
      cube: wvshp.cube.bind(this),
      cheb: wvshp.cheb.bind(this),
      sig: wvshp.sig.bind(this),
      clip: wvshp.clip.bind(this),
    };
    this.samp = _samp.bind(this);
    this.map = _map.bind(this);
    this.filter = _filter.bind(this);
    this.pan = _pan.bind(this);
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

export const eventGraphApi = [
  { name: 'addr', fn: _address },
  { name: 'chorus', fn: _chorus },
  { name: 'dac', fn: _dac },
  { name: 'delay', fn: _delay },
  { name: 'filter', fn: _filter },
  { name: 'gain', fn: _gain },
  { name: 'map', fn: _map },
  { name: 'pan', fn: _pan },
  { name: 'samp', fn: _samp },
  { name: 'sin', fn: _sin },
];
