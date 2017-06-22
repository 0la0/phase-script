import AudioGraph from './audioGraph';

let audioGraph;

export default function provideAudioGraph() {
  if (!audioGraph) {
    audioGraph = new AudioGraph();
  }
  return audioGraph;
}
