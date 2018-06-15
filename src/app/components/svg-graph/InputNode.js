import BaseNode from './BaseNode';
import SvgSquareNode from './SvgSquareNode';
import { NODE_RADIUS } from './Constants';

// TODO: MOVE TO EVENT NETWORK
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
