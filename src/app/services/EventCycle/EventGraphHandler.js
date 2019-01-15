export function createEventGraph(addressInputs) {
  const allNodes = addressInputs.flatMap(graph => graph.nodes);
  const uniqueNodes = allNodes.reduce((nodeMap, node) => {
    if (nodeMap[node.id]) {
      Array.from(node.getInputs()).forEach(input => nodeMap[node.id].addInput(input));
    } else {
      nodeMap[node.id] = node;
    }
    return nodeMap;
  }, {});
  return uniqueNodes;
}
