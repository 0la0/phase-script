class BaseHandler {
  constructor(pattern) {
    this.pattern = pattern;
    this.count = 0;
  }

  reset() {
    this.count = 0;
  }
}

class PatternHandler extends BaseHandler {
  constructor(pattern) {
    super(pattern);
  }

  execute() {
    return this.pattern;
  }

  isDone() {
    return true;
  }
}

class RepeatHandler extends BaseHandler {
  constructor(numRepeats, pattern) {
    super(pattern);
    this.numRepeats = numRepeats;
  }

  execute() {
    this.count++;
    return this.pattern;
  }

  isDone() {
    return this.count > this.numRepeats;
  }
}

class Repeater {
  constructor() {
    this.arguments = [ 'int', 'pattern' ];
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

  static getSymbol() {
    return 'rep';
  }
}

class FunctionManager {
  constructor() {
    this.fnMap = new Map();
    this.fnMap.set(Repeater.getSymbol(), new Repeater());
  }

  isFunction(str) {
    return this.fnMap.has(str);
  }

  validate(tokens, line) {
    const fn = this.fnMap.get(tokens[0]);
    const handler = fn.validate(line);
    if (!handler) {
      console.log('invalid line', line);
      return;
    }
    console.log('patternHandler', handler)
  }
}

export default new FunctionManager();
