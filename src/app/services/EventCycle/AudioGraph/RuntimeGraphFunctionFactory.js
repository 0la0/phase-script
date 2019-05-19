import { AudioGraphNode } from './AudioGraphNode';
import DynamicParameter from './DynamicParameter';
import AudioGraphBuilder from './AudioGraphBuilder';
import { PARAM_TYPES, CONSTANTS} from './AudioGraphApiDefinition';
import { uuid } from 'services/Math';

const argumentValidationMap = {
  [PARAM_TYPES.FLOAT]: instance => typeof instance === 'number',
  [PARAM_TYPES.NUMBER]: instance => typeof instance === 'number',
  [PARAM_TYPES.FUNCTION]: instance => typeof instance === 'function',
  [PARAM_TYPES.STRING]: instance => typeof instance === 'string',
  [PARAM_TYPES.GRAPH_NODE]: instance => instance instanceof AudioGraphBuilder,
};

function getPredicateForParamDefinition(definition) {
  if (definition.enum) {
    return instance => definition.enum.includes(instance);
  }
  if (!argumentValidationMap[definition.type]) {
    throw new Error(`Invalid definition ${JSON.stringify(definition)}`);
  }
  return argumentValidationMap[definition.type];
}

function buildParameterDefinitonString(parameterDefinitions) {
  return parameterDefinitions
    .map(({ paramName, type }) => `${paramName}: ${type}`).join(', ');
}

// function typeMatchesDefinition(definition, argument) {
//   return getPredicateForParamDefinition(definition)(argument);
// }

export default function buildNodeEvaluator(dto, _setCurrent) {
  const { name, fnName, paramDefinitions = [], constantDefinitions = [] } = dto;
  const scopedFuncitonName = `_${fnName}`;
  return { [scopedFuncitonName]: function(...args) {
    let tag = '';
    let idx = 0;
    const variableParams = paramDefinitions.reduce((acc, definition) => {
      const arg = args[idx];
      const paramIsValid = getPredicateForParamDefinition(definition)(arg);
      if (definition.isOptional && !paramIsValid) {
        return acc;
      }
      if (!(arg instanceof AudioGraphBuilder) && !paramIsValid && definition.paramName !== CONSTANTS.ID) {
        console.log(`${fnName}: invalid parameter ${definition.paramName}: ${arg}\nusage: ${fnName}(${buildParameterDefinitonString(paramDefinitions)})`);  // eslint-disable-line no-console
      }
      if (definition.paramName === CONSTANTS.ID) {
        tag += (definition.value || arg || uuid());
        return acc;
      }
      let paramValue;
      if (arg instanceof AudioGraphBuilder) {
        const outputNode = arg.currentNode;
        paramValue = new DynamicParameter(outputNode.id, definition.paramName);
      } else {
        paramValue = arg;
        if (definition.isTaggable) {
          tag += arg;
        }
      }
      acc[definition.paramName] = paramValue;
      idx++;
      return acc;
    }, {});
    const constantParams = constantDefinitions.reduce((acc, definition) => {
      if (definition.isTaggable) {
        tag += definition.value;
      }
      if (definition.paramName === CONSTANTS.ID) {
        return acc;
      }
      acc[definition.paramName] = definition.value;
      return acc;
    }, {});
    const audioGraphNode = new AudioGraphNode({
      type: name,
      id: tag ? `${name}-${tag}` : undefined,
      params: Object.assign({}, variableParams, constantParams),
    });
    return _setCurrent.call(this, audioGraphNode);
  }, }[scopedFuncitonName];
}
