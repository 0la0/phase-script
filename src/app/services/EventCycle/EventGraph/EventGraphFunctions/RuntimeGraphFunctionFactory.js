import { EventGraphNode } from './EventGraphNode';
import DynamicParameter from './DynamicParameter';
import EventGraphBuilder from './EventGraphBuilder';
import { PARAM_TYPES, CONSTANTS} from './EventGraphApiDefinition';

const argumentValidationMap = {
  [PARAM_TYPES.FLOAT]: instance => typeof instance === 'number',
  [PARAM_TYPES.NUMBER]: instance => typeof instance === 'number',
  [PARAM_TYPES.FUNCTION]: instance => typeof instance === 'function',
  [PARAM_TYPES.STRING]: instance => typeof instance === 'string',
  [PARAM_TYPES.GRAPH_NODE]: instance => instance instanceof EventGraphBuilder,
};

function typeMatchesDefinition(definition, argument) {
  if (!definition.type) {
    console.log('TODO: add definition type:', definition);
    return true;
  }
  const predicate = argumentValidationMap[definition.type];
  if (!predicate) {
    throw new Error(`Invalid definition ${definition.type}`);
  }
  return predicate(argument);
}

export default function buildNodeEvaluator(dto, _setCurrent) {
  const { name, fnName, paramDefinitions = [], constantDefinitions = [] } = dto;
  const scopedFuncitonName = `_${fnName}`;
  return { [scopedFuncitonName]: function(...args) {
    let tag = '';
    let idx = 0;
    const variableParams = paramDefinitions.reduce((acc, definition) => {
      const arg = args[idx];
      const paramIsValid = typeMatchesDefinition(definition, arg);
      if (definition.isOptional && !paramIsValid) {
        return acc;
      }
      if (!(arg instanceof EventGraphBuilder) && !paramIsValid) {
        console.log(`fn: ${fnName}, invalid parameter ${definition.paramName}:`, arg);
        // throw new Error(`Invalid parameter ${definition.paramName}: ${arg}`);
      }

      if (definition.paramName === CONSTANTS.ID) {
        tag += (definition.value || arg);
        return acc;
      }
      let paramValue;
      if (arg instanceof EventGraphBuilder) {
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
    const eventGraphNode = new EventGraphNode({
      type: name,
      id: tag ? `${name}-${tag}` : undefined,
      params: Object.assign({}, variableParams, constantParams),
    });
    return _setCurrent.call(this, eventGraphNode);
  }, }[scopedFuncitonName];
}
