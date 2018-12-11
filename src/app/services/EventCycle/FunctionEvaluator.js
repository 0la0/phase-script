// > repeat 4 @ speed 0.5 @ every 2 reverse @ a b [ c b ]
// rep 4 @ every 4

const ARGUMENT_TYPE = {
  INT: 'INT',
  CYCLE: 'CYCLE',
};

const FUNCTION = {
  repeat: 'repeat',
  every: 'every',
  rest: 'rest',
};

const CYCLE_FUNCTION = {
  rev: {
    numArgs: 1,
    argTypes: [ ARGUMENT_TYPE.CYCLE ]
  }
};

export function splitOnParens(str) {
  const open = [];
  const closed = [];
  str.split('').forEach((char, index) => {
    if (char === '(') {
      open.push(index);
    } else if (char === ')') {
      closed.push(index);
    }
  });
  if (open.length !== closed.length) {
    throw new Error('Unbalanced parenthesis');
  }

}
