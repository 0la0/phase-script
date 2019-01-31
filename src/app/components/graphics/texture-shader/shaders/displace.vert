uniform float time;
uniform float cloudSpeed;
uniform float cloudFrequency;

varying float r;
varying float g;
varying float b;

float R_FREQUENCY = 0.4;
float G_FREQUENCY = 0.2;
float B_FREQUENCY = 0.8;

float R_SPEED = 2.0;
float G_SPEED = 1.0;
float B_SPEED = 5.0;

float R_ROTATION = 40.0;
float G_ROTATION = -35.0;
float B_ROTATION = 0.0;

float R_AMP = 2.0;
float G_AMP = 2.2;
float B_AMP = 2.0;

float FREQUENCY = 10.0;
float ROTATION = 10.0;

float osc(float param) {
  return 0.5 * sin(param) + 0.5;
}

float oscSin(float param) {
  return 0.5 * sin(param) + 0.5;
}

float oscCos(float param) {
  return 0.5 * cos(param) + 0.5;
}

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

float getOsc(vec2 position, float frequency, float rotation, float speed, float amplitude) {
  float param = frequency * rotateVector(position, rotation).x + speed * time;
  float normalVal = 0.5 * sin(param) + 0.5;
  return normalVal * amplitude;
}

float getSquaredOsc(vec2 position, float frequency, float rotation, float speed, float amplitude) {
  vec2 rotatedVec = rotateVector(position, rotation);
  float squaredPos = rotatedVec.x * rotatedVec.y;
  float param = frequency * squaredPos + speed * time;
  float normalVal = 0.5 * tan(param) + 0.5;
  return normalVal * amplitude;
}

vec2 kalid(vec2 pos) {
  return vec2(
    pos.x > 0.5 ? pos.x : (1.0 - pos.x),
    pos.y > 0.5 ? pos.y : (1.0 - pos.y)
  );
}

vec2 modulatePosition(vec3 position) {
  return vec2(
    0.5 * sin(position.x) + 0.5,
    position.y
  );
}

vec2 modX(vec2 v, float freq, float amp) {
  return vec2(
    v.x + amp * sin(v.y + time * freq),
    v.y
  );
}

vec2 modY(vec2 v, float freq, float amp) {
  return vec2(
    v.x,
    v.y + amp * sin(0.1 * v.x + time * freq)
  );
}

void main() {
  vec3 newPosition = position;
  // vec2 pos = modY(vec2(newPosition), 2.0, 2.0);
  vec2 pos = vec2(newPosition);
  // vec2 pos = kalid(normalPos);

  // float base = rotatedPosition.x + FREQUENCY * time;

  // b = 0.5 * cos(0.5 * newPosition.y * time * sin(newPosition.x)) + 0.5;

  // r = getOsc(kalid(pos), R_FREQUENCY, R_ROTATION, R_SPEED, R_AMP);
  // float normSin = oscSin(0.0001 * time);
  // float noise = pnoise(newPosition - 10.0 * time, vec3( 100.0 * oscSin(10.0 * time), 100.0 * oscSin(0.0001 * time), 200.0 * oscCos(0.1 * time) ));
  // float tur = turbulence(0.001 * normal + time * 0.001);
  // r = cloudNoise(pos);
  // g = getOsc(pos, G_FREQUENCY, G_ROTATION, G_SPEED, G_AMP);
  // b = getOsc(pos, B_FREQUENCY, B_ROTATION, B_SPEED, B_AMP);

  float cloudEffect = clouds(pos * 0.01 * cloudFrequency, time * 0.1 * cloudSpeed);
  // color = cloudEffect + vec3(.5, .8, 0.95);
  // r = clouds(pos * 0.01, 0.1 * time) + 0.5;
  // g = clouds(pos * 0.1, 0.1 * time) + 0.5;
  // b = clouds(pos * 0.05, 0.1 * time) + 0.5;
  r = cloudEffect + 0.5;
  g = cloudEffect + 0.8;
  b = cloudEffect + 0.95;

  // vec3 modPos = newPosition + normal * oscSin(pos.x * time);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
