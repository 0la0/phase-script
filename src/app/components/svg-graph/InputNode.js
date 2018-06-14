import BaseNode, { NODE_RADIUS } from './BaseNode';
import SvgSquareNode from './SvgSquareNode';

export default class InputNode extends BaseNode {
  constructor(x, y, parentElement, getAllNodes, openMenu) {
    super(x, y, parentElement, getAllNodes, openMenu);
    this.svgNode = new SvgSquareNode(NODE_RADIUS);
    this.init(x, y);
  }

  activate(tickNumber, time) {
    this.edges.map(edge => edge.getEndNode())
      .forEach(outputNode => outputNode.activate(tickNumber, time));
  }

  render(tickNumber, lastTickNumber) {
    this.svgNode.renderActivation();
  }
}
