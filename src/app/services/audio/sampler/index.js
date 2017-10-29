import Http from 'services/util/http';
import audioGraph from 'services/audio/graph';
import eventBus from 'services/EventBus';

const samples = {};
const BASE_PATH = 'assets/audio/';

function loadSample(sampleKey, sampleUrl) {
  Http.getAudioBuffer(sampleUrl)
    .then(compressedBuffer => audioGraph.getAudioContext().decodeAudioData(compressedBuffer))
    .then(sampleBuffer => {
      samples[sampleKey] = sampleBuffer;
    })
    .catch(error => console.log('error', error));
}

function playSample(audioContext, audioBuffer, scheduledTime) {
  const sampler = audioContext.createBufferSource();
  sampler.buffer = audioBuffer;
  //sampler.playbackRate.value = 1;
  sampler.connect(audioGraph.getOutput());
  sampler.start(scheduledTime);
}

function play(sampleKey, scheduledTime) {
  playSample(audioGraph.getAudioContext(), samples[sampleKey], scheduledTime);
}

function getSampleKeys() {
  return Object.keys(this.samples);
}

function loadSamples() {
  loadSample('hat', `${BASE_PATH}hat_loFi.wav`);
  loadSample('snare', `${BASE_PATH}snare_gb03.wav`);
  loadSample('kick', `${BASE_PATH}eKick1.wav`);
  loadSample('high_pluck', `${BASE_PATH}cogs4.wav`);
  loadSample('lo_fi_bright', `${BASE_PATH}snare_loFi_bright.wav`);
  loadSample('lo_fi_muff', `${BASE_PATH}snare_loFi_muff.wav`);
  loadSample('click', `${BASE_PATH}spatialized6.wav`);
  loadSample('pop', `${BASE_PATH}vinyl9.wav`);
  loadSample('metal', `${BASE_PATH}woodClog51.wav`);
  loadSample('metal', `${BASE_PATH}woodClog51.wav`);
  loadSample('tom_pop', `${BASE_PATH}woodClog60.wav`);
}

function registerEvents() {
  eventBus.subscribe({
    address: 'SAMPLER',
    onNext: message => {
      play(message.note, message.time);
    }
  });
}

function initSampler() {
  loadSamples();
  registerEvents();
}

export {initSampler, getSampleKeys};
