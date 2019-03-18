import { EventGraphNode } from './EventGraphNode';
import DynamicParameter from './DynamicParameter';
import EventGraphBuilder from './EventGraphBuilder';
import { PARAM_TYPES, CONSTANTS} from './EventGraphApiDefinition';

export default function buildNodeEvaluator(dto, _setCurrent) {
  const { name, fnName, paramDefinitions = [], constantDefinitions = [] } = dto;
  const scopedFuncitonName = `_${fnName}`;
  return { [scopedFuncitonName]: function(...args) {
    let tag = '';
    const variableParams = paramDefinitions.reduce((acc, definition, index) => {
      const arg = args[index];
      // TODO: if definition.isOptional && validateType(arg, definition.type) === false
      if (definition.type === PARAM_TYPES.GRAPH_NODE && (!(arg instanceof EventGraphBuilder))) {
        return acc;
      }

      if (definition.paramName === CONSTANTS.ID) {
        tag += (definition.value || arg);
        return acc;
      }
      let paramValue;
      if (arg instanceof EventGraphBuilder) {
        const outputNode = arg.currentNode;
        paramValue = new DynamicParameter(outputNode.id);
      } else {
        paramValue = arg;
        if (definition.isTaggable) {
          tag += arg;
        }
      }
      acc[definition.paramName] = paramValue;
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
