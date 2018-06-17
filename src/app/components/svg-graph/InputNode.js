import BaseNode from './BaseNode';

// TODO: MOVE TO EVENT NETWORK
export default class InputNode extends BaseNode {
  constructor(x, y, parentElement, getAllNodes, openMenu) {
    super(x, y, 'SQUARE', parentElement, getAllNodes, openMenu);
  }

  activate(tickNumber, time) {
    this.edges.map(edge => edge.getEndNode())
      .forEach(outputNode => outputNode.activate(tickNumber, time));
  }

  render(tickNumber, lastTickNumber) {
    this.svgNode.renderActivation();
  }
}
