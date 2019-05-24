import { PatternTransform } from 'services/EventCycle/PatternFunctions/PatternTransformer';
// import scales from '../../scale/scales';

const countPredicateFn = () => true;

let tempStep = 1;
let tempDistance = 4;

export default function arpeggiate(arpStyle, distance, rate, repeat) {
  const transformFn = _pattern => {
    const cycleElements = _pattern.getRelativeCycle();
    const extraElements = [];
    const relativeStepDuration = tempStep / _pattern.getNumTicks();
    cycleElements.forEach((cycleElement, index) => {
      const nextCycleElement = cycleElements[index + 1];
      const nextElementTime = nextCycleElement ? nextCycleElement.getTime() : 1;
      let arpTime = cycleElement.getTime();

      let arpNote = cycleElement.getElement().getNote();
      while (arpTime < nextElementTime) {
        const arpCycleElement = cycleElement.clone();
        arpNote += tempDistance;

        arpCycleElement.getElement().setNote(arpNote);
        extraElements.push(arpCycleElement.setTime(arpTime));
        arpTime += relativeStepDuration;
      }
    });
    const transformedCycle = cycleElements.concat(extraElements).sort((a, b) => a.getTime() - b.getTime());
    return _pattern.setRelativeCycle(transformedCycle);
  };
  return new PatternTransform(countPredicateFn, transformFn);
}
