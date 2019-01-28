import { uuid } from 'services/Math';
import eventNodeWrapper from './EventNodeWrapper';
import EventGraphNode from './EventGraphNode';
import EventGraph from './EventGraph';

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
    const gain = new EventGraphNode('GAIN', id).setParams({ gainValue });
    return graph.addNode(gain);
  });
}

function dac() {
  const dac = new EventGraphNode('DAC', 'DAC_ID');
  return new EventGraph().addNode(dac);
}

function _address(address, addGraphCallback) {
  const id = uuid();
  return eventNodeWrapper((graph) => {
    const addressNode = new EventGraphNode('ADDRESS', id).setParams({ address });
    graph.addNode(addressNode);
    addGraphCallback(graph);
    return graph;
  });
}

export const eventGraphApi = [ _address, dac, gain, osc, reverb, ];
