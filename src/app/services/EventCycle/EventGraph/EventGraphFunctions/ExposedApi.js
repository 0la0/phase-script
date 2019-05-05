import EventGraphBuilder from './EventGraphBuilder';
import nodeDefinitions from './EventGraphApiDefinition';
import buildNodeEvaluator from './RuntimeGraphFunctionFactory';

// TODO:
//   * remove services/midi/mappings directory
//   * wavetable synths
//   * documentation descriptions / param descriptions
//   * parameter validation
//   * message duplicator
//   * rand parameters for msgDelay
//   * message repeater
//   * mic in
//   * compressor node
//   * arpeggiators
//   * anonymous patterns
//   * key shortcuts: generate node IDs, new tab, etc
//   * better standard sample libbrary

const eventGraphNodes = nodeDefinitions.reduce((acc, nodeDefinition) =>
  Object.assign(acc, {
    [nodeDefinition.fnName]: buildNodeEvaluator(nodeDefinition, _setCurrent)
  }), {});

const eventGraphApi = Object.keys(eventGraphNodes)
  .map(key => ({ name: key, fn: eventGraphNodes[key] }));

function _setCurrent(node) {
  if (this instanceof EventGraphBuilder) {
    return this._setCurrent(node);
  }
  return new EventGraphBuilder(eventGraphNodes)._setCurrent(node);
}

export default eventGraphApi;
