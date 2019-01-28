uniform float time;
varying float x;
varying float y;

void main() {
  // float r = 0.2 * sin(4.0 * time) + 0.5;
  float r = y;
  float g = y;
  float b = y;
  gl_FragColor = vec4(r, g, b, 1.0);
}
