import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import ResFilter from 'services/audio/resFilter';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import FilterCurveRenderer from './curveRenderer';
import audioGraph from 'services/audio/graph';
import PatchParam from 'components/patch-param';

const COMPONENT_NAME = 'resonance-filter';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const CANVAS_WIDTH = 120;
const CANVAS_HEIGHT = 40;

class ResonanceFilter extends BaseComponent {
  constructor() {
    super(style, markup, ['canvas']);
    this.filter = {
      cutoff: 0,
      resonance: 0,
    };
    this.resFilter = new ResFilter();
    this.audioModel = new PatchAudioModel('ResFilter', this.resFilter, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    this.buildCanvas();
    this.buildParams();
  }

  buildCanvas() {
    const graphicsContext = this.dom.canvas.getContext('2d');
    this.dom.canvas.width = CANVAS_WIDTH;
    this.dom.canvas.height = CANVAS_HEIGHT;
    graphicsContext.width = CANVAS_WIDTH;
    graphicsContext.height = CANVAS_HEIGHT;
    this.curveRenderer = new FilterCurveRenderer(graphicsContext, CANVAS_WIDTH, CANVAS_HEIGHT, this.resFilter);
  }

  buildParams() {
    const cutoffModel = {
      label: 'Cutoff',
      defaultValue: 0.5,
      setValue: this.onCutoffUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onCutoffUpdate(normalValue, message.time.audio);
      },
    };
    const resonanceModel = {
      label: 'Resonance',
      defaultValue: 0.1,
      setValue: this.onResonanceUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onResonanceUpdate(normalValue, message.time.audio);
      },
    };
    this.cutoffParam = new PatchParam.element(cutoffModel);
    this.resonanceParam = new PatchParam.element(resonanceModel);
    this.shadowRoot.appendChild(this.cutoffParam);
    this.shadowRoot.appendChild(this.resonanceParam);
  }

  renderCurve() {
    this.curveRenderer.render();
  }

  handleFilterTypeChange(event) {
    this.resFilter.setType(event.target.value);
    this.renderCurve();
  }

  onCutoffUpdate(value, scheduledTime = 0) {
    const nyquist = audioGraph.getSampleRate() * 0.5;
    const numOctaves = Math.log(nyquist / 10.0) / Math.LN2;
    const val = Math.pow(2.0, numOctaves * (value - 1.0));
    const cutoff = val * nyquist;
    this.filter.cutoff = cutoff;
    this.resFilter.setFrequency(cutoff, scheduledTime);
    this.renderCurve();
  }

  onResonanceUpdate(value, scheduledTime = 0) {
    const val = value * 20;
    this.resFilter.setResonance(val, scheduledTime);
    this.renderCurve();
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, ResonanceFilter);
