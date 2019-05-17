// uniform float time;
// varying float _time;

// uniform int generatorType;
//
// uniform int modulatorType;

void main() {
  // _time = time;

  // vec2 modPos = (modulatorType == 1) ?
  //   cloudModulator(vec2(position), modulatorFrequency, modulatorSpeed) :
  //   modulatePosition(modulatorType, modulatorFrequency, modulatorSpeed, modulatorAmplitude, modulatorRotation, vec2(position));

  gl_Position = vec4(position, 1.0);
}
