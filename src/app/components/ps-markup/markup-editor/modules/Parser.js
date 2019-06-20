import * as BabelParser from '@babel/parser';

const parserOptions = {
  sourceType: 'module',
  plugins: [ 'jsx' ],
};

export class AstNode {
  constructor(tagName = '', attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes;
    this.children = [];
  }
}

const transformToAstNode = (oldNode, currentNode) => {
  if (currentNode.type === 'JSXElement') {
    const name = currentNode.openingElement.name.name;
    const attributes = currentNode.openingElement.attributes.reduce((attrs, attribute) => 
      Object.assign(attrs, { [attribute.name.name]: attribute.value.value }), {});
    const element = new AstNode(name, attributes)
  
    oldNode.push(element);

    if (currentNode.children) {
      currentNode.children.forEach((childNode) => {
        if (oldNode.length) {
          transformToAstNode(element.children, childNode);
        } else {
          transformToAstNode(oldNode, childNode);
        }
      });
    }
  }
  return oldNode;
};

export default function parseToAst(content) {
  const rawAst = BabelParser.parse(content, parserOptions);
  const rootNode = rawAst.program.body[0].expression;
  return transformToAstNode([], rootNode);
};
