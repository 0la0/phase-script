import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';
import RepeatHandler from 'services/EventCycle/Pattern/RepeatHandler';
import ReverseHandler from 'services/EventCycle/Pattern/ReverseHandler';

const WHITESPACE = /(\s+)/;

class Repeater {
  constructor() {
    this.matcher = /(rep)(\s+)(\d+)(\s+)(.+)/; // symbol, int, pattern
  }

  validate(line) {
    const result = line.match(this.matcher);
    if (!result) {
      return false;
    }
    const numRepeats = parseInt(result[3], 10);
    const pattern = result[5];
    return new RepeatHandler(numRepeats, pattern);
  }

  static getFunctionName() {
    return 'rep';
  }
}

class Reverse {
  constructor() {
    this.matcher = /(rev)(\s+)(.+)/; // symbol, pattern
  }

  validate(line) {
    const result = line.match(this.matcher);
    if (!result) {
      return false;
    }
    const pattern = result[3];
    return new ReverseHandler(pattern);
  }

  static getFunctionName() {
    return 'rev';
  }
}

class ErrorHandler {
  isValid() {
    return false;
  }
}

class FunctionManager {
  constructor() {
    this.fnMap = new Map();
    this.fnMap.set(Repeater.getFunctionName(), new Repeater());
    this.fnMap.set(Reverse.getFunctionName(), new Reverse());
  }

  classify(line) {
    const tokens = line.split(WHITESPACE);
    if (!this.fnMap.has(tokens[0])) {
      return new PatternHandler(line);
    }
    const fn = this.fnMap.get(tokens[0]);
    const handler = fn.validate(line);
    return handler || new ErrorHandler();
  }
}

export default new FunctionManager();
