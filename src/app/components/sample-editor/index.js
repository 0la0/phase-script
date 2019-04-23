import BaseComponent from 'common/util/base-component';
import SampleDisplay from './sample-display';
import sampleBank from 'services/audio/sampleBank';
import style from './sample-editor.css';
import markup from './sample-editor.html';

export default class SampleEditor extends BaseComponent {
  static get tag() {
    return 'sample-editor';
  }

  constructor(closeCallback) {
    super(style, markup, [ 'sampleList' ]);
    this.handleClose = closeCallback;
    this._populateSampleKeys();
  }

  _populateSampleKeys() {
    const sampleKeys = sampleBank.getSampleKeys();
    [ ...this.dom.sampleList.children ].forEach(ele => this.dom.sampleList.removeChild(ele));
    sampleKeys.forEach(sampleName =>
      this.dom.sampleList.appendChild(new SampleDisplay(sampleName)));
  }
}
