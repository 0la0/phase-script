// note: https://github.com/Starcounter-Jack/JSON-Patch
// diff two asts, then only traverse dom where necessary ...
// use lodash for path traversal

function visitNode(astNode, domNode) {
  if (!astNode) {
    // remove domNode subtree
  }
  if (!domNode) {
    // create domNode subtree
  }
  if (astNode.tagName === domNode.tagName) {
    // update attributes
  } else {
    // remove domNode, replace with astNode subtree, exit
  }  
}

function bruteForceDomBuilder(astNode) {
  const ele = document.createElement(astNode.tagName);
  // create children
  astNode.children
    .map(node => bruteForceDomBuilder(node))
    .forEach(child => ele.appendChild(child));
  // set attributes
  Object.keys(astNode.attributes).forEach(attr => ele.setAttribute(attr, astNode.attributes[attr]));
  return ele;
}

export default function astToDom(astRoot, domRoot, rootNode) {
  const domNode = bruteForceDomBuilder(astRoot);
  [ ...domRoot.children].forEach(child => domRoot.removeChild(child));
  [ ...domNode.children].forEach(child => domRoot.appendChild(child));
}