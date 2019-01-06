import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';

export function repeatHandler(numRepeats) {
  return function handleRepeat(pattern) {
    console.log('cool repeat handler', numRepeats, pattern)
    const { cycle, updateCycle } = pattern.getRelativeCycle();
    const allTransformedCycles = [];
    for (let i = 0; i < numRepeats; i++) {
      const transformedCycle = cycle.map((cycleElement) => {
        const transformedTime = (i / numRepeats) + (cycleElement.time / numRepeats);
        return cycleElement.clone().setTime(transformedTime);
      });
      allTransformedCycles.push(transformedCycle);
    }
    updateCycle(allTransformedCycles.flatMap(cycle => cycle));
    pattern.setNumTicks(numRepeats * pattern.getNumTicks());
    return pattern;
  };
}

// export function repeatHandler(numRepeats, pattern) {
//   const { cycle, updateCycle } = pattern.getRelativeCycle();
//   const allTransformedCycles = [];
//   for (let i = 0; i < numRepeats; i++) {
//     const transformedCycle = cycle.map((cycleElement) => {
//       const transformedTime = (i / numRepeats) + (cycleElement.time / numRepeats);
//       return cycleElement.clone().setTime(transformedTime);
//     });
//     allTransformedCycles.push(transformedCycle);
//   }
//   updateCycle(allTransformedCycles.flatMap(cycle => cycle));
//   pattern.setNumTicks(numRepeats * pattern.getNumTicks());
//   return pattern;
// }

export default class RepeatHandler extends BaseHandler {
  constructor(numRepeats, handler) {
    super();
    this.handler = handler;
    this.numRepeats = numRepeats;

    console.log('repeater', numRepeats, handler);

    const { cycle, updateCycle } = this.handler.getRelativeCycle();

    const allTransformedCycles = [];
    for (let i = 0; i < numRepeats; i++) {
      const transformedCycle = cycle.map((cycleElement) => {
        const transformedTime = (i / numRepeats) + (cycleElement.time / numRepeats);
        return cycleElement.clone().setTime(transformedTime);
      });
      allTransformedCycles.push(transformedCycle);
    }
    updateCycle(allTransformedCycles.flatMap(cycle => cycle));
    this.handler.setNumTicks(numRepeats * this.handler.getNumTicks());
  }

  getRelativeCycle() {
    return this.handler.getRelativeCycle();
  }

  execute() {
    this.count++;
    return this.handler.execute();
  }

  tick() {
    return this.handler.tick();
  }

  getNumTicks() {
    return this.handler.getNumTicks();
  }

  setNumTicks(numTicks) {
    this.handler.setNumTicks(numTicks);
  }

  isValid() {
    return this.handler.isValid();
  }

  isDone() {
    return this.handler.isDone();
  }
  // isDone() {
  //   return this.count >= this.numRepeats;
  // }

  reset() {
    return this.handler.reset();
  }
}
