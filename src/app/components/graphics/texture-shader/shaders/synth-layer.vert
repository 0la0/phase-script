uniform float time;

uniform bool generator;
uniform float generatorFrequency;
uniform float generatorSpeed;
uniform float generatorAmplitude;
uniform float generatorRotation;

uniform bool modulator;
uniform float modulatorFrequency;
uniform float modulatorSpeed;
uniform float modulatorAmplitude;
uniform float modulatorRotation;

varying float r;
varying float g;
varying float b;

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

float getOsc(float frequency, float speed, float amplitude, float rotation, vec2 position) {
  float param = frequency * rotateVector(position, rotation).x + speed * time;
  float normalVal = 0.5 * sin(param) + 0.5;
  return normalVal * amplitude;
}

vec2 modulatePosition(float frequency, float speed, float amplitude, float rotation, vec2 position) {
  vec2 rotatedVec = rotateVector(position, rotation);
  float x = rotatedVec.x + amplitude * sin(rotatedVec.y + time * frequency);
  return vec2(x, rotatedVec.y);
}

vec2 cloudModulator(vec2 position, float frequency, float speed) {
  return vec2(
    clouds(position * 0.01 * frequency, time * 0.1 * speed),
    position.y
  );
}

void main() {
  vec2 modPos = modulator ?
    modulatePosition(modulatorFrequency, modulatorSpeed, modulatorAmplitude, modulatorRotation, vec2(position)) :
    cloudModulator(vec2(position), modulatorFrequency, modulatorSpeed);
  // float outputVal = ;
  float outputVal = generator ?
    getOsc(generatorFrequency, generatorSpeed, generatorAmplitude, generatorRotation, modPos) :
    clouds(modPos * 0.01 * generatorFrequency, time * 0.1 * generatorSpeed);

  r = outputVal + 0.4;
  g = outputVal + 0.5;
  b = outputVal + 0.7;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
