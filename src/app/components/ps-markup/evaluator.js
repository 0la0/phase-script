import parseToAst from './Parser';

function astNodeToDomNode(astNode) {
  const ele = document.createElement(astNode.tagName);
  astToDom(astNode.children).forEach(child => {
    ele.appendChild(child);
  });
  Object.keys(astNode.attributes).forEach(attr => ele.setAttribute(attr, astNode.attributes[attr]));
  return ele;
}

function astToDom(nodeList) {
  return nodeList.map(node => astNodeToDomNode(node));
}

export default function test() {
  const input = 
  `<ps-dac>
    <ps-gain value="0.15">
      <ps-env-osc wav="sin" attack="100" sustain="0" release="500" trigger="b" />
    </ps-gain>
  </ps-dac>`;
  const output = parseToAst(input);
  const eleList = astToDom(output);
  document.body.appendChild(eleList[0]);
  console.log('output', output, eleList);
}