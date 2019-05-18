import nodeDefinitions from 'services/EventCycle/EventGraph/EventGraphFunctions/EventGraphApiDefinition';

function buildParams(definition) {
  if (!definition || !definition.paramDefinitions) {
    return [];
  }
  return definition.paramDefinitions.map((paramDefinition) => ({
    name: paramDefinition.paramName,
    type: paramDefinition.type,
    enum: paramDefinition.enum
  }));
}

const unitGeneratorDefinitions = nodeDefinitions
  .map((definition) => ({
    id: definition.fnName,
    fn: definition.fnName,
    description: 'TODO',
    returnType: 'Ugen Builder',
    params: buildParams(definition),
  }))
  .reduce((acc, definition) => Object.assign(acc, { [definition.id]: definition }), {});

export default unitGeneratorDefinitions;
