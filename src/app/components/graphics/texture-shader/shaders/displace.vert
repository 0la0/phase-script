uniform float time;
varying float x;
varying float y;
varying float r;
varying float g;
varying float b;

// void main() {
//   vec3 newPosition = position;
//   x = 0.5 * sin(0.1 * cos(newPosition.x) * newPosition.y * sin(time)) + 0.5;
//   y = 0.5 * cos(0.5 * newPosition.y * time * sin(newPosition.x)) + 0.5;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
// }

float R_FREQUENCY = 0.4;
float G_FREQUENCY = 0.2;
float B_FREQUENCY = 0.8;

float R_SPEED = 10.0;
float G_SPEED = 1.0;
float B_SPEED = 5.0;

float R_ROTATION = 45.0;
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

void main() {
  vec3 newPosition = position;
  vec2 pos = vec2(newPosition);
  // vec2 pos = kalid(normalPos);

  // float base = rotatedPosition.x + FREQUENCY * time;
  // x = osc(base);
  // vUv = uv;
  // b = 0.5 * cos(0.5 * newPosition.y * time * sin(newPosition.x)) + 0.5;

  r = getSquaredOsc(pos, R_FREQUENCY, R_ROTATION, R_SPEED, R_AMP);
  g = getSquaredOsc(pos, G_FREQUENCY, G_ROTATION, G_SPEED, G_AMP);
  b = getSquaredOsc(pos, B_FREQUENCY, B_ROTATION, B_SPEED, B_AMP);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
