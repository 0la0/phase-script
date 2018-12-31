import { getCycleForTime } from 'services/EventCycle/Evaluator';
import parseToken from 'services/EventCycle/Tokenizer';
import AudioEvent from 'services/EventBus/AudioEvent';
// import functionManager from 'services/EventCycle/Pattern/FunctionManager';
import { evaluate } from 'services/EventCycle/Evaluator2';

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

export default class CycleManager {
  constructor() {
    this.patternHandlers = [];
    this.cycleCounter = 0;
    this.setCycleString('');
  }

  // empty line means new cycle
  // option to begin each cycle with an identifier
  // MAKE THIS WORK
  /**
    $ [ a [ a a ] ]
    every 2 $ [ a a ] $ [ a a a ]

    b b b
  **/

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

    let cycleResult;
    try {
      const result = evaluate(cycleString);
      cycleResult = Array.isArray(result) ? result : [ result ];
      console.log('result:', result);
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

    this._isValid = cycleResult.every(cycle => cycle.isValid());
    if (this._isValid) {
      this.patternHandlers = cycleResult;
    }
  }

  isValid() {
    return this._isValid;
  }

  getAudioEventsAndIncrement(audioCycleDuration, time) {
    const cycleIndex = this.cycleCounter % this.patternHandlers.length;
    if (this.patternHandlers[cycleIndex]) {
      const pattern = this.patternHandlers[cycleIndex].execute();
      if (this.patternHandlers[cycleIndex].isDone()) {
        this.patternHandlers[cycleIndex].reset();
        this.cycleCounter++;
      }
      const schedulables = getCycleForTime(pattern, time, audioCycleDuration);
      return schedulables.map(({ element, timeObj}) => {
        const { address, note } = parseToken(element);
        return new AudioEvent(address, note, timeObj);
      });
    }
    this.cycleCounter++;
  }

  resetCounter() {
    this.cycleCounter = 0;
  }
}
