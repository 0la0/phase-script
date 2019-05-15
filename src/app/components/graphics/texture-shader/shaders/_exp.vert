uniform float time;
varying float _time;

uniform int generatorType;

uniform float generatorFrequency;
varying float _generatorFrequency;

uniform float generatorSpeed;
varying float _generatorSpeed;

uniform float generatorAmplitude;
varying float _generatorAmplitude;

uniform float generatorRotation;
varying float _generatorRotation;

uniform int modulatorType;

uniform float modulatorFrequency;
varying float _modulatorFrequency;

uniform float modulatorSpeed;
varying float _modulatorSpeed;

uniform float modulatorAmplitude;
varying float _modulatorAmplitude;

uniform float modulatorRotation;
varying float _modulatorRotation;

void main() {
  _time = time;

  _generatorFrequency = generatorFrequency;
  _generatorSpeed = generatorSpeed;
  _generatorAmplitude = generatorAmplitude;
  _generatorRotation = generatorRotation;

  _modulatorFrequency = modulatorFrequency;
  _modulatorSpeed = modulatorSpeed;
  _modulatorAmplitude = modulatorAmplitude;
  _modulatorRotation = modulatorRotation;

  gl_Position = vec4(position, 1.0);
}
