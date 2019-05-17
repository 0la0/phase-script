uniform float time;

uniform int generatorType;

uniform int modulatorType;

uniform float generatorFrequency;
uniform float generatorSpeed;
uniform float generatorAmplitude;
uniform float generatorRotation;

uniform float modulatorFrequency;
uniform float modulatorSpeed;
uniform float modulatorAmplitude;
uniform float modulatorRotation;

vec2 getRotation(float deg) {
  float angleInRadians = radians(deg);
  return vec2(sin(angleInRadians), cos(angleInRadians));
}

vec2 rotateVector(vec2 vec, float rotation) {
  vec2 rot = getRotation(rotation);
  float x = vec.x * rot.x + vec.y * rot.y;
  float y = vec.y * rot.x - vec.x * rot.y;
  return vec2(x, y);
}

float normOsc(float x) {
  return 0.5 * x + 0.5;
}

float squ(float x) {
  return sin(x) >= 0.0 ? 1.0 : -1.0;
}

float saw(float x) {
  return fract(x);
}

float tri(float x) {
  return abs(2.0 * x - 1.0);
}

float getOscForType(int type, float x) {
  if (type == 2) {
    return squ(x);
  }
  if (type == 3) {
    return saw(x);
  }
  if (type == 4) {
    return tri(x);
  }
  return sin(x);
}

float getOsc(int type, float frequency, float speed, float amplitude, float rotation, vec2 position) {
  float param = frequency * rotateVector(position, rotation).x + speed * time;
  float normalVal = normOsc(getOscForType(type, param));
  return normalVal * amplitude;
}

vec2 modulatePosition(int type, float frequency, float speed, float amplitude, float rotation, vec2 position) {
  vec2 rotatedVec = rotateVector(position, rotation);
  float x = rotatedVec.x + amplitude * getOscForType(type, rotatedVec.y + time * frequency);
  return vec2(x, rotatedVec.y);
}

vec2 cloudModulator(vec2 position, float frequency, float speed) {
  return vec2(
    position.x + clouds(position * 0.01 * frequency, time * 0.1 * speed),
    position.y
  );
}

void main() {
  vec4 position = gl_FragCoord;

  vec2 modPos = (modulatorType == 0) ?
    cloudModulator(vec2(position), modulatorFrequency, modulatorSpeed) :
    modulatePosition(modulatorType, modulatorFrequency, modulatorSpeed, modulatorAmplitude, modulatorRotation, vec2(position));

  float outputVal = (generatorType == 0) ?
    clouds(modPos * 0.01 * generatorFrequency, time * 0.1 * generatorSpeed) :
    getOsc(generatorType, generatorFrequency, generatorSpeed, generatorAmplitude, generatorRotation, modPos);

  gl_FragColor = vec4(outputVal, outputVal, outputVal, 1.0);
}
