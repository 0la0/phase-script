import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';

const countPredicateFn = () => true;

function arpUp(cycleElement, nextElementTime, arpNoteDuration, step, distance, repeat) {
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

function arpUpDown(cycleElement, nextElementTime, arpNoteDuration, step, distance, repeat) {
  let arpElements = [];
  let arpTime = cycleElement.getTime();
  let baseNote = cycleElement.getElement().getNote();
  let arpNote = baseNote;
  let shouldExit = arpTime >= nextElementTime;
  let cycleCount = 0;
  let direction = 1;

  while (arpTime < nextElementTime && !shouldExit) {
    const arpCycleElement = cycleElement.clone();
    arpNote += (step * direction);
    arpCycleElement.getElement().setNote(arpNote);
    arpElements.push(arpCycleElement.setTime(arpTime));
    arpTime += arpNoteDuration;
    if (direction === 1) {
      if (Math.abs(arpNote - baseNote) > distance) {
        direction = -1;
      }
    } else {
      const positiveTerminal = step > 0 && arpNote <= baseNote;
      const negativeTerminal = step < 0 && arpNote >= baseNote;
      if (positiveTerminal || negativeTerminal) {
        cycleCount++;
        arpNote = baseNote;
        direction = 1;
      }
    }
    
    shouldExit = cycleCount >= repeat;
  }
  return arpElements;
}

const arpStyleStrategy = {
  up: arpUp,
  updown: arpUpDown,
};

export default function arpeggiate(arpStyle, step, distance, rate, repeat) {
  const arpStrategy = arpStyleStrategy[arpStyle];
  if (!arpStrategy) {
    throw new Error(`Arpeggiator, unrecognized style: ${arpStyle}`);
  }
  const transformFn = _pattern => {
    const cycleElements = _pattern.getRelativeCycle();
    const extraElements = [];
    const relativeStepDuration = rate / _pattern.getNumTicks();
    cycleElements.forEach((cycleElement, index) => {
      const nextCycleElement = cycleElements[index + 1];
      const nextElementTime = nextCycleElement ? nextCycleElement.getTime() : 1;
      const stepElements = arpStrategy(cycleElement, nextElementTime, relativeStepDuration, step, distance, repeat);
      extraElements.push(...stepElements);
    });
    const transformedCycle = cycleElements.concat(extraElements).sort((a, b) => a.getTime() - b.getTime());
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
