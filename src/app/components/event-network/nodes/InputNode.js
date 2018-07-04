import BaseNode from 'components/svg-graph/BaseNode';

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

  onRightClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
