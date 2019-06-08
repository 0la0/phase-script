import PsDac from './ugens/ps-dac';
import PsEnvOsc from './ugens/ps-env-osc';
import PsGain from './ugens/ps-gain';

const components = [
  PsDac,
  PsEnvOsc,
  PsGain,
];

components.forEach(component => customElements.define(component.tag, component));
