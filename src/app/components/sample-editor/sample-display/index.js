import BaseComponent from 'common/util/base-component';
import SampleVisualizer from '../sample-visualizer';
import { playSample } from 'services/audio/sampler';
import audioGraph from 'services/audio/Graph';
import style from './sample-display.css';
import markup from './sample-display.html';

const defaultAsr = { attack: 0, sustain: 0.5, release: 0, };

export default class SampleDisplay extends BaseComponent {
  static get tag() {
    return 'sample-display';
  }

  constructor(sampleName) {
    super(style, markup, [ 'label', 'editor' ]);
    this.sampleName = sampleName;
    this.editorIsActive = false;
    this.dom.label.textContent = sampleName;
    this.dom.editor.appendChild(new SampleVisualizer(this.sampleName, defaultAsr));
  }

  playSample() {
    playSample(this.sampleName, 0, 0, 60, defaultAsr, [ audioGraph.getOutput() ]);
  }

  renderEditor() {
    this.editorIsActive ?
      this.dom.editor.classList.add('editor-active') :
      this.dom.editor.classList.remove('editor-active');
  }

  handleEditorToggle(event) {
    this.editorIsActive = event.target.isOn;
    this.renderEditor();
  }
}
