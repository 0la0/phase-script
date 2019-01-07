function buildHof(tag) {
  function hof(param) {
    if (typeof param === 'string') {
      return ` ${tag} ${param}`;
    }
    if (typeof param === 'function') {
      return arg => {
        const result = param(arg);
        if (typeof result === 'string') {
          return ` ${tag} ${result}`;
        }
        return hof(result);
      };
    }
    throw new TypeError(`Invalid type: ${param}`);
  }
  return hof;
}

function a(tag) {
  return buildHof(tag)
}

function b(tag) {
  return buildHof(tag);
}

function c(tag) {
  return tag;
}

const result = a('A') (a('A.2')) (a('A.3')) (a('A.4')) (a('A.5')) (b('B')) (b('B.1')) (c('C'));
console.log('result', result);
