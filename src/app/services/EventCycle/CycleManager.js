import { getCycleForTime } from 'services/EventCycle/Evaluator';
import parseToken from 'services/EventCycle/Tokenizer';
import { audioEventBus } from 'services/EventBus';
import AudioEvent from 'services/EventBus/AudioEvent';
// import functionManager from 'services/EventCycle/Pattern/FunctionManager';
import { evaluate } from 'services/EventCycle/Evaluator2';
import metronomeManager from 'services/metronome/metronomeManager';

// const LINE_BREAK = /\n/;

// class LineHelper {
//
// }
//
// function test(str) {
//   return str.split(LINE_BREAK).map(line => line.trim()).reduce((all, curr) => {}, []);
// }

// function pattern(str) {
//   if (typeof str !== 'string') {
//     throw new Error(`pattern input error, input not string: ${str}`);
//   }
//   return functionManager.classify(str);
// }
//
// // function seq(arr) {
// //   return arr;
// // }
//
// // function continue() {}
//
// function evaluate(str) {
//   console.log('cool guy string', str);
//   // const evaluationString = `
//   //   'use strict';
//   //   return function(pattern) {return ${str}};
//   // `;
//   const evaluationString = `return function(pattern) {return ${str}};`;
//   try {
//     // return new Function(evaluationString)()(pattern);
//     return eval(str);
//
//     // return {
//     //   // fn: new Function(evaluationString)()(pattern),
//     //   ev: eval(str),
//     // };
//   } catch(error) {
//     console.log('pattern eval error', error);
//     throw new Error(error);
//   }
// }

class CycleHandler {
  constructor(patternHandlers) {
    this.patternHandlers = patternHandlers;
    this.cycleCounter = 0;
    this.cycleIndex = 0;
  }

  handleTick(time) {
    const activeCycle = this.patternHandlers[this.cycleIndex];
    if (!activeCycle) { return; }
    const pattern = activeCycle.tick();
    if (pattern) {
      const { relativeCycle, numTicks } = pattern;
      console.log(numTicks, relativeCycle)
      const audioCycleDuration = metronomeManager.getMetronome().getTickLength() * numTicks;
      // TODO: return schedulabes so this can be testable
      const schedulables = getCycleForTime(relativeCycle, time, audioCycleDuration);
      schedulables.forEach(({ element, timeObj}) => {
        const { address, note } = parseToken(element);
        audioEventBus.publish(new AudioEvent(address, note, timeObj));
      });
    }
    if (activeCycle.isDone()) {
      activeCycle.reset();
      this.cycleIndex = (this.cycleIndex + 1) % this.patternHandlers.length;
    }
  }

  // TODO: remove
  increment(time) {
    const cycleIndex = this.cycleCounter % this.patternHandlers.length;
    if (this.patternHandlers[cycleIndex]) {
      const pattern = this.patternHandlers[cycleIndex].execute();
      if (this.patternHandlers[cycleIndex].isDone()) {
        this.patternHandlers[cycleIndex].reset();
        this.cycleCounter++;
      }
      const cycleLength = 16; // TODO: implement on a per pattern basis
      const audioCycleDuration = metronomeManager.getMetronome().getTickLength() * cycleLength;
      const schedulables = getCycleForTime(pattern, time, audioCycleDuration);
      return schedulables.map(({ element, timeObj}) => {
        const { address, note } = parseToken(element);
        return new AudioEvent(address, note, timeObj);
      });
    }
    this.cycleCounter++;
    return [];
  }
}

export default class CycleManager {
  constructor() {
    this.cycleHandlers = [];
    this.cycleCounter = 0;
    this.setCycleString('');
  }

  setCycleString(cycleString) {
    console.log('setCycleString', cycleString)
    if (typeof cycleString !== 'string') {
      throw new Error('Input must be string');
    }
    if (!cycleString) {
      return;
    }

    // const statements = cycleString.split((/;\s/)); // ; followed by whitespace
    // const result = statements.map(statement => evaluate(statement));

    let cycleResults;
    try {
      const result = evaluate(cycleString);
      // cycleResult = Array.isArray(result) ? result : [ result ];
      console.log('result:', result);
      cycleResults = result;
    } catch(error) {
      // TODO: render error message
      console.log('result error', error.message);
      console.log('result error', error);
      this._isValid = false;
      return;
    }
    // console.log('cycleResult', cycleResult)
    // if (!cycleResult) {
    //   this._isValid = false;
    //   return;
    // }


    // const patternHandlers = cycleString.split(LINE_BREAK)
    //   .map(line => line.trim())
    //   .filter(line => !!line)
    //   .map(line => functionManager.classify(line));
    //
    // this._isValid = patternHandlers.every(cycle => cycle.isValid());
    // if (this._isValid) {
    //   this.patternHandlers = patternHandlers;
    // }

    this._isValid = cycleResults.every(cycleResult => cycleResult.every(cycle => cycle.isValid()));
    if (this._isValid) {
      this.cycleHandlers = cycleResults.map(cycleResult => new CycleHandler(cycleResult));
    }
  }

  isValid() {
    return this._isValid;
  }

  // TODO: set arbitrary [16, 30, 32] cycle lengths (see UNTITLED file)
  getAudioEventsAndIncrement(time) {
    // const cycleIndex = this.cycleCounter % this.patternHandlers.length;
    // if (this.patternHandlers[cycleIndex]) {
    //   const pattern = this.patternHandlers[cycleIndex].execute();
    //   if (this.patternHandlers[cycleIndex].isDone()) {
    //     this.patternHandlers[cycleIndex].reset();
    //     this.cycleCounter++;
    //   }
    //   const schedulables = getCycleForTime(pattern, time, audioCycleDuration);
    //   return schedulables.map(({ element, timeObj}) => {
    //     const { address, note } = parseToken(element);
    //     return new AudioEvent(address, note, timeObj);
    //   });
    // }
    // this.cycleCounter++;
    // this.cycleHandlers.forEach(cycleHandler => cycleHandler.increment(audioCycleDuration, time));

    // const audioCycleDuration = metronomeManager.getMetronome().getTickLength() * this.cycleLength;
    // const audioEvents =  this.cycleHandlers.flatMap(cycleHandler => cycleHandler.increment(time));
    // audioEvents.forEach(audioEvent => audioEventBus.publish(audioEvent));
    this.cycleHandlers.forEach(cycleHandler => cycleHandler.handleTick(time))

    // return this.cycleHandlers
    //   .map(cycleHandler => cycleHandler.increment(audioCycleDuration, time))
    //   .flatMap();
  }

  // resetCounter() {
  //   this.cycleCounter = 0;
  // }
}
