import BaseNode from 'components/svg-graph/BaseNode';

export default class InputNode extends BaseNode {
  constructor(x, y, parentElement, getAllNodes, onDelete) {
    super(x, y, 'SQUARE', parentElement, getAllNodes, onDelete);
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
    this.onDelete(this);
  }
}
