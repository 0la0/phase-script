uniform float time;
varying float x;
varying float y;

void main() {
  vec3 newPosition = position;
  x = 0.5 * sin(0.1 * cos(newPosition.x) * newPosition.y * sin(time)) + 0.5;
  y = 0.5 * cos(0.5 * newPosition.y * time * sin(newPosition.x)) + 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
