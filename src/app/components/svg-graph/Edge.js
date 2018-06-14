import { NODE_RADIUS } from './BaseNode';

export default class Edge {
  constructor(startNode, endNode, svgLine, onRemove) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.svgLine = svgLine;
    this.onRemove = onRemove;
    this.svgLine.setRemoveCallback(this.remove.bind(this));
  }

  getStartNode() {
    return this.startNode;
  }

  getEndNode() {
    return this.endNode;
  }

  render() {
    const x1 = this.startNode.x;
    const y1 = this.startNode.y;
    const x2 = this.endNode.x;
    const y2 = this.endNode.y;
    const length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    // const normalX = (x2 - x1) / length;
    // const normalY = (y2 - y1) / length;
    // const adjustedX = x1 + normalX * (length - NODE_RADIUS);
    // const adjustedY = y1 + normalY * (length - NODE_RADIUS);
    const RAD_LENGTH = (NODE_RADIUS + 1.5) / length;
    const adjustedX = x2 - (x2 * RAD_LENGTH) + (x1 * RAD_LENGTH);
    const adjustedY = y2 - (y2 * RAD_LENGTH) + (y1 * RAD_LENGTH);
    this.svgLine.setPosition(x1, y1, adjustedX, adjustedY);
  }

  remove() {
    this.onRemove(this);
    this.svgLine.destroy();
  }
}
