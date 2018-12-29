import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';
import RepeatHandler from 'services/EventCycle/Pattern/RepeatHandler';
import ReverseHandler from 'services/EventCycle/Pattern/ReverseHandler';
import OffsetHandler from 'services/EventCycle/Pattern/OffsetHandler';
import RotateHandler from 'services/EventCycle/Pattern/RotateHandler';
import BreakHandler from 'services/EventCycle/Pattern/BreakHandler';
import SpeedHandler from 'services/EventCycle/Pattern/SpeedHandler';

const WHITESPACE = /(\s+)/;

const MATCH = {
  WHITESPACE: '(\\s+)',
  INT: '(\\d+)',
  FLOAT: '(\\d*\\.\\d+)',
  PATTERN: '(.+)'
};

class Repeater {
  constructor() {
    this.symbol = 'rep';
    this.symbolMatch = `(${this.symbol})`;
    this.matcher = `${this.symbolMatch}${MATCH.WHITESPACE}${MATCH.INT}${MATCH.WHITESPACE}${MATCH.PATTERN}`;
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
}

class Reverse {
  constructor() {
    this.symbol = 'rev';
    this.symbolMatch = `(${this.symbol})`;
    this.matcher = `${this.symbolMatch}${MATCH.WHITESPACE}${MATCH.PATTERN}`;
  }

  validate(line) {
    const result = line.match(this.matcher);
    if (!result) {
      return false;
    }
    const pattern = result[3];
    return new ReverseHandler(pattern);
  }
}

class Offset {
  constructor() {
    this.symbol = 'offset';
    this.symbolMatch = `(${this.symbol})`;
    this.matcher = `${this.symbolMatch}${MATCH.WHITESPACE}${MATCH.FLOAT}${MATCH.WHITESPACE}${MATCH.PATTERN}`;
  }

  validate(line) {
    const result = line.match(this.matcher);
    if (!result) {
      return false;
    }
    const offset = parseFloat(result[3], 10);
    const pattern = result[5];
    return new OffsetHandler(offset, pattern);
  }
}

class Rotate {
  constructor() {
    this.symbol = 'rotate';
    this.symbolMatch = `(${this.symbol})`;
    this.matcher = `${this.symbolMatch}${MATCH.WHITESPACE}${MATCH.FLOAT}${MATCH.WHITESPACE}${MATCH.PATTERN}`;
  }

  validate(line) {
    const result = line.match(this.matcher);
    if (!result) {
      return false;
    }
    const rotation = parseFloat(result[3], 10);
    const pattern = result[5];
    return new RotateHandler(rotation, pattern);
  }
}

class Break {
  constructor() {
    this.symbol = 'break';
    this.symbolMatch = `(${this.symbol})`;
    this.matcher = `${this.symbolMatch}${MATCH.WHITESPACE}${MATCH.PATTERN}`;
  }

  validate(line) {
    const result = line.match(this.matcher);
    if (!result) {
      return false;
    }
    const pattern = result[3];
    return new BreakHandler(pattern);
  }
}

class Speed {
  constructor() {
    this.symbol = 'speed';
    this.symbolMatch = `(${this.symbol})`;
    this.matcher = `${this.symbolMatch}${MATCH.WHITESPACE}${MATCH.FLOAT}${MATCH.WHITESPACE}${MATCH.PATTERN}`;
  }

  validate(line) {
    const result = line.match(this.matcher);
    if (!result) {
      return false;
    }
    const speed = parseFloat(result[3], 10);
    const pattern = result[5];
    return new SpeedHandler(speed, pattern);
  }
}

class ErrorHandler {
  isValid() {
    return false;
  }
}

class FunctionManager {
  constructor() {
    this.fnMap = [ Repeater, Reverse, Offset, Rotate, Break, Speed ]
      .reduce((fnMap, Clazz) => {
        const instance = new Clazz();
        fnMap.set(instance.symbol, instance);
        return fnMap;
      }, new Map());
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
