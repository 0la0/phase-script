const CARRIER_FUNCTIONS = {
  square: x => Math.pow(x, 2),
  cubed: x => Math.pow(x, 3),
  chebyshev2: x => 2 * Math.pow(x, 2) - 1,
  chebyshev3: x => 4 * Math.pow(x, 3) - 3 * x,
  chebyshev4: x => 8 * Math.pow(x, 4) - 8 * Math.pow(x, 2) + 1,
  sigmoid: x => 2 / (1 + Math.exp(-4 * x)) - 1,
  sigmoid2: x => 1.5 / (1 + Math.exp(-10 * x)) - 0.75,
  sigmoidLike: (x, multiplier) =>  ( 3 + multiplier ) * x * 20 * (Math.PI / 180) / ( Math.PI + multiplier * Math.abs(x) ),
  hardClip: x =>  (1 + 0.4 * x) / (1 + Math.abs(x))
};

export const CARRIER_NAMES = {
  squ: 'square',
  cube: 'cubed',
  cheb: 'chebyshev2',
  sig: 'sigmoidLike',
  clip: 'hardClip',
};

export function getCarrierFunction(carrierName) {
  if (!CARRIER_NAMES[carrierName]) {
    throw new Error(`Cannot find carrier function for: "${carrierName}"`);
  }
  return CARRIER_FUNCTIONS[CARRIER_NAMES[carrierName]];
}
