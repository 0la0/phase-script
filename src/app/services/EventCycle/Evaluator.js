import { AUDIO_TICK_MULTIPLIER } from 'services/midi/util';

// TODO: remove tick length
export default function evaluateCycle(time, tickLength, cycle, cycleDuration) {
  console.log('duration length:', cycleDuration, cycle.length);
  if (!Array.isArray(cycle)) {
    throw new Error('Cycle must be an array');
  }
  const elementDuration = cycleDuration / cycle.length;
  return cycle.map((cycleElement, index) => {
    const timeObj = {
      audio: time.audio + (index * elementDuration),
      midi: time.midi + (index * elementDuration * AUDIO_TICK_MULTIPLIER),
    };
    // const scheduledTime = time + (index * cycleDuration);
    if (Array.isArray(cycleElement)) {
      return evaluateCycle(timeObj, tickLength, cycleElement, elementDuration);
    }
    return {
      token: cycleElement,
      time: timeObj,
      tickLength
    };
  })
  .flat();
  // TODO: determine if recursive shallow is equivalent to Num.Max
  // .flat(Number.MAX_SAFE_INTEGER);
}
