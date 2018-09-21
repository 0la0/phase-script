import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import ResFilter from 'services/audio/resFilter';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import FilterCurveRenderer from './curveRenderer';
import audioGraph from 'services/audio/graph';

const COMPONENT_NAME = 'patch-filter';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const MIN_RESONANCE = -3.4;
const CANVAS_WIDTH = 120;
const CANVAS_HEIGHT = 40;

const domMap = {
  canvas: 'canvas',
};

class PatchFilter extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.filter = {
      cutoff: 0,
      resonance: 0,
    };
    this.resFilter = new ResFilter();
    this.audioModel = new PatchAudioModel('ResFilter', this.resFilter, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    this.dom.canvas.width = CANVAS_WIDTH;
    this.dom.canvas.height = CANVAS_HEIGHT;
    const graphicsContext = this.dom.canvas.getContext('2d');
    graphicsContext.width = CANVAS_WIDTH;
    graphicsContext.height = CANVAS_HEIGHT;
    this.curveRenderer = new FilterCurveRenderer(graphicsContext, CANVAS_WIDTH, CANVAS_HEIGHT, this.resFilter);
  }

  renderCurve() {
    this.curveRenderer.render();
  }

  onFilterTypeChange(type) {
    this.resFilter.setType(type);
    this.renderCurve();
  }

  onCutoffUpdate(value) {
    const nyquist = audioGraph.getSampleRate() * 0.5;
    const numOctaves = Math.log(nyquist / 10.0) / Math.LN2;
    const val = Math.pow(2.0, numOctaves * (value - 1.0));
    const cutoff = val * nyquist;
    this.filter.cutoff = cutoff;
    this.resFilter.setLowpassFrequency(cutoff);
    this.renderCurve();
  }

  onResonanceUpdate(value) {
    const val = value * 20;
    this.resFilter.setResonance(val);
    this.renderCurve();
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchFilter);
