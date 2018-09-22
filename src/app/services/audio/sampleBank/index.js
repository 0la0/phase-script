import Http from 'services/util/http';
import audioGraph from 'services/audio/graph';

const samples = {};
const BASE_PATH = 'assets/audio/';

const fileMap = {
  'hat': `${BASE_PATH}hat_loFi.wav`,
  'snare': `${BASE_PATH}snare_gb03.wav`,
  'kick': `${BASE_PATH}eKick1.wav`,
  'high_pluck': `${BASE_PATH}cogs4.wav`,
  'lo_fi_bright': `${BASE_PATH}snare_loFi_bright.wav`,
  'lo_fi_muff': `${BASE_PATH}snare_loFi_muff.wav`,
  'click': `${BASE_PATH}spatialized6.wav`,
  'pop': `${BASE_PATH}vinyl9.wav`,
  'metal': `${BASE_PATH}woodClog51.wav`,
  'metal': `${BASE_PATH}woodClog51.wav`,
  'tom_pop': `${BASE_PATH}woodClog60.wav`,
  'drake': `${BASE_PATH}drakeVoice.wav`
};

function decodeAudioData(compressedBuffer) {
  try {
    return audioGraph.getAudioContext().decodeAudioData(compressedBuffer)
  } catch(error) {
    if (error instanceof TypeError && error.message === 'Not enough arguments') {
      // use safari syntax
      return new Promise((resolve, reject) => {
        audioGraph.getAudioContext().decodeAudioData(
          compressedBuffer,
          compressedBuffer => resolve(compressedBuffer),
          error => reject(error)
        );
      });
    } else {
      throw error;
    }
  }
}

function loadSample(sampleKey, sampleUrl) {
  return Http.getAudioBuffer(sampleUrl)
    .then(decodeAudioData)
    .then(sampleBuffer => samples[sampleKey] = sampleBuffer)
    .catch(error => console.log('error...', error));
}

function getSampleKeys() {
  return Object.keys(fileMap);
}

function getAudioBuffer(sampleKey) {
  return samples[sampleKey];
}

function loadSamples() {
  const loadSamplePromises = Object.keys(fileMap)
    .map(key => loadSample(key, fileMap[key]));
  return Promise.all(loadSamplePromises);
}


export { loadSamples, getSampleKeys, getAudioBuffer };
