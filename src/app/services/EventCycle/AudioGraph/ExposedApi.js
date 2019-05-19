import AudioGraphBuilder from './AudioGraphBuilder';
import audioNodeApiDefinitions from './AudioGraphApiDefinition';
import buildNodeEvaluator from './RuntimeGraphFunctionFactory';

const eventGraphNodes = audioNodeApiDefinitions.reduce((acc, audioNodeApiDefinition) =>
  Object.assign(acc, {
    [audioNodeApiDefinition.fnName]: buildNodeEvaluator(audioNodeApiDefinition, _setCurrent)
  }), {});

const eventGraphApi = Object.keys(eventGraphNodes)
  .map(key => ({ name: key, fn: eventGraphNodes[key] }));

function _setCurrent(node) {
  if (this instanceof AudioGraphBuilder) {
    return this._setCurrent(node);
  }
  return new AudioGraphBuilder(eventGraphNodes)._setCurrent(node);
}

export default eventGraphApi;
