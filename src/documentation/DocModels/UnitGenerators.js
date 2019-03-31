import nodeDefinitions from 'services/EventCycle/EventGraph/EventGraphFunctions/EventGraphApiDefinition';

const buildParams = definition => definition.paramDefinitions ?
  definition.paramDefinitions.map(({ paramName, type }) => ({ name: paramName, type })) : [];

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
