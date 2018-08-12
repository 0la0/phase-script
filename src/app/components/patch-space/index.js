import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import DraggableWrapper from './draggable';
import { uuid } from 'components/_util/math';

const COMPONENT_NAME = 'patch-space';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  container: 'container',
  svgContainer: 'svgContainer'
};

class PatchSpace extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.onRender = this.render.bind(this);
    this.nodes = [];
  }

  render() {
    this.nodes.forEach(node => node.render());
  }

  handleAdd() {
    const draggable = new DraggableWrapper.element({
      id: uuid(),
      onRender: this.onRender,
      svgContainer: this.dom.svgContainer,
    });
    draggable.setOnRemoveCallback(() => this.handleRemove(draggable));
    this.dom.container.appendChild(draggable);
    this.nodes.push(draggable);
  }

  handleRemove(node) {
    this.nodes.forEach(_node => _node.detach(node));
    this.nodes = this.nodes.filter(_node => _node !== node);
    this.dom.container.removeChild(node);
  }
}

export default new Component(COMPONENT_NAME, PatchSpace);
