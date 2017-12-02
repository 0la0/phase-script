function getPosNeg() {
  return Math.random() < 0.5 ? -1 : 1;
}

function IntArray(length) {
  return new Array(length).fill(null).map((nullVal, index) => index);
}

export { getPosNeg, IntArray };
