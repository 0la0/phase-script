import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';

const countPredicateFn = () => true;

function buildNotesBetweenSteps(cycleElement, nextElementTime, arpNoteDuration, step, distance, repeat) {
  let arpElements = [];
  let arpTime = cycleElement.getTime();
  let baseNote = cycleElement.getElement().getNote();
  let arpNote = baseNote;
  let shouldExit = arpTime >= nextElementTime;
  let cycleCount = 0;

  while (arpTime < nextElementTime && !shouldExit) {
    const arpCycleElement = cycleElement.clone();
    arpNote += step;
    arpCycleElement.getElement().setNote(arpNote);
    arpElements.push(arpCycleElement.setTime(arpTime));
    arpTime += arpNoteDuration;
    if (Math.abs(arpNote - baseNote) > distance) {
      cycleCount++;
      arpNote = baseNote;
    }
    shouldExit = cycleCount >= repeat;
  }
  return arpElements;
}

// TODO: arpStyles
export default function arpeggiate(arpStyle, step, distance, rate, repeat) {
  const transformFn = _pattern => {
    const cycleElements = _pattern.getRelativeCycle();
    const extraElements = [];
    const relativeStepDuration = rate / _pattern.getNumTicks();
    cycleElements.forEach((cycleElement, index) => {
      const nextCycleElement = cycleElements[index + 1];
      const nextElementTime = nextCycleElement ? nextCycleElement.getTime() : 1;
      const stepElements = buildNotesBetweenSteps(cycleElement, nextElementTime, relativeStepDuration, step, distance, repeat);
      extraElements.push(...stepElements);
    });
    const transformedCycle = cycleElements.concat(extraElements).sort((a, b) => a.getTime() - b.getTime());
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
