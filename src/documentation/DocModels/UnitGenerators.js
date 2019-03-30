import Types from './Types';
// import EventGraphApiDefinition from
import nodeDefinitions from 'services/EventCycle/EventGraph/EventGraphFunctions/EventGraphApiDefinition';
console.log('nodeDefinition?', nodeDefinitions);

const unitGeneratorDefinitions = nodeDefinitions
  .map(definition => {
    // const constantParams =
    const params = definition.paramDefinitions ?
      definition.paramDefinitions.map(({ paramName, type }) => ({ name: paramName, type })) : [];

    return {
      id: definition.fnName,
      fn: definition.fnName,
      description: 'TODO',
      returnType: 'Ugen Builder',
      params,
    };
  })
  .reduce((acc, definition) => Object.assign(acc, { [definition.id]: definition }), {});


// pattern: {
//   fn: 'p',
//   description: 'Create a pattern',
//   returnType: 'pattern',
//   params: [
//     {
//       name: 'patternString',
//       type: Types.STRING,
//     },
//   ]
// },

export default unitGeneratorDefinitions;
