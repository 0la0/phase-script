export function createAudioGraphDefinition(addressInputs) {
  const allNodes = addressInputs.flatMap(graph => graph.nodes);
  const uniqueNodes = allNodes.reduce((nodeMap, node) => {
    if (nodeMap[node.id]) {
      node.getInputs().forEach(input => nodeMap[node.id].addInput(input));
    } else {
      nodeMap[node.id] = node;
    }
    return nodeMap;
  }, {});
  return uniqueNodes;
}
