import BaseComponent from 'common/util/base-component';
import loadAudioFile from 'services/FileLoader';
import { decodeAudioData } from 'services/audio/sampleBank/SampleLoader';
import sampleBank from 'services/audio/sampleBank';
import style from './sample-loader.css';
import markup from './sample-loader.html';

export default class SampleLoader extends BaseComponent {
  static get tag() {
    return 'sample-loader';
  }

  constructor() {
    super(style, markup, []);
  }

  loadSample() {
    loadAudioFile()
      .then(decodeAudioData)
      .then(audiobuffer => sampleBank.addSample('test-name', audiobuffer))
      .catch(error => console.log(error));
  }
}
