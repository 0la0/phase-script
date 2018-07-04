import BaseComponent from 'components/_util/base-component';

const VIEWBOX_SIZE = 100;
const elementScale = 4;

function getCoordinatesFromEvent(clientX, clientY, parentElement) {
  const parentBoundingBox = parentElement.getBoundingClientRect();
  const normalX = (clientX - parentBoundingBox.left) / parentBoundingBox.width;
  const normalY = (clientY - parentBoundingBox.top) / parentBoundingBox.height;
  return {
    x: normalX * VIEWBOX_SIZE,
    y: normalY * VIEWBOX_SIZE
  };
}

export default class AbstractGraph extends BaseComponent {

  constructor(style, markup, domMap) {
    super(style, markup, domMap);
    this.nodes = [];
    this.inputNodes = [];
    this.getAllNodes = () => this.nodes;
    this.getAllInputNodes = () => [...this.inputNodes, ...this.nodes];
    this.menuNode = null;
  }

  connectedCallback() {
    this.dom.svgContainer.addEventListener('contextmenu', this.onRightClick.bind(this));
    this.dom.svgContainer.addEventListener('mousedown', this.onMouseDown.bind(this));

    setTimeout(() => {
      this.dom.containerMenu.setEventDelegate({
        addNode: this.addNode.bind(this),
        addInput: this.addInput.bind(this)
      });
    });
  }

  addNode(event, NodeClass) {
    const coords = getCoordinatesFromEvent(event.clientX, event.clientY, this.dom.svgContainer);
    const node = new NodeClass(coords.x, coords.y, this.dom.svgContainer, this.getAllInputNodes, this.openPropertyMenu.bind(this));
    this.nodes.push(node);
    this.showContainerMenu(false);
    this.openPropertyMenu(false);
  }

  addInput(event, NodeClass) {
    const coords = getCoordinatesFromEvent(event.clientX, event.clientY, this.dom.svgContainer);
    const node = new NodeClass(coords.x, coords.y, this.dom.svgContainer, this.getAllInputNodes, this.openPropertyMenu.bind(this));
    this.inputNodes.push(node);
    this.showContainerMenu(false);
    this.showContainerMenu(false);
  }

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }

  onRightClick(event) {
    event.preventDefault();
    this.showContainerMenu(true, event.clientX, event.clientY);
    this.openPropertyMenu(false);
  }

  onMouseDown(event) {
    this.showContainerMenu(false);
    this.openPropertyMenu(false);
  }

  showContainerMenu(isActive, clientX, clientY) {
    if (isActive) {
      const coords = getCoordinatesFromEvent(clientX, clientY, this.dom.svgContainer);
      const x = coords.x * elementScale;
      const y = coords.y * elementScale;
      this.dom.containerMenu.show(x, y);
    }
    else {
      this.dom.containerMenu.hide();
    }
  }

  openPropertyMenu(isActive, event, node) {
    console.log('Deprecate: AbstractGraph.openPropertyMenu')
  }

  deleteNode(node) {
    if (!node) { return; }
    this.nodes.forEach(_node => _node.detachFromNode(node));
    this.inputNodes.forEach(_node => _node.detachFromNode(node));
    this.nodes = this.nodes.filter(_node => _node !== node);
    this.inputNodes = this.inputNodes.filter(_node => _node !== node);
    this.menuNode = null;
    this.openPropertyMenu(false);
  }
}
