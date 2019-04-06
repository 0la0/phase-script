import EventGraphBuilder from './EventGraphBuilder';
import nodeDefinitions from './EventGraphApiDefinition';
import buildNodeEvaluator from './RuntimeGraphFunctionFactory';

// TODO:
//   * update all params to use SignalParam class
//   * midi in / out
//   * leap example
//   * documentation descriptions / param descriptions
//   * parameter validation
//   * sample bank
//   * midi config editor
//   * message duplicator
//   * rand parameters for msgDelay
//   * message repeater
//   * mic in
//   * compressor node
//   * wet levels on audio effect nodes
//   * arpeggiators
//   * anonymous patterns
//   * key shortcut to generate node IDs

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
