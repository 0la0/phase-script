export default class DynamicParameter {
  constructor(nodeId, paramName) {
    this.nodeId = nodeId;
    this.paramName = paramName;
  }

  getNodeId() {
    return this.nodeId;
  }

  getParamName() {
    return this.paramName;
  }
}
