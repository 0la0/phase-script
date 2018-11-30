import { AUDIO_TICK_MULTIPLIER } from 'services/midi/util';

export default function evaluateCycle(tickNumber, time, tickLength, cycle, cycleDuration) {
  const elementDuration = cycleDuration / cycle.length;
  return cycle.map((element, index) => {
    const timeObj = {
      audio: time.audio + (index * cycleDuration),
      midi: time.midi + (index * cycleDuration * AUDIO_TICK_MULTIPLIER),
    };
    if (Array.isArray(element)) {
      return evaluateCycle(tickNumber, timeObj, tickLength, element, elementDuration);
    }
    return {
      token: element,
      time: timeObj,
      tickLength
    };
  }).flat(Number.MAX_SAFE_INTEGER);
}
