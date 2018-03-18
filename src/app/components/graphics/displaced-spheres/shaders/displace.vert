uniform float displaceList[5];

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float getPosNeg(vec2 co) {
  if (rand(co) > 0.5) {
    return -1.0;
  }
  return 1.0;
}

void main() {
  vec2 pos = position.xy;
  float x = position.x + 5.0 * getPosNeg(pos) * rand(pos);
  float y = position.y + 5.0 * getPosNeg(pos) * rand(pos);
  float z = position.z + 5.0 * getPosNeg(pos) * rand(pos);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
}
