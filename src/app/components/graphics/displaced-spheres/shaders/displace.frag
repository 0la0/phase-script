varying float noise;
varying float displacement;

void main() {
  float b = 0.4 - displacement;
  float g = 0.7 - (0.15 - displacement * 0.2);
  float r = 0.6 - displacement * 0.2;
  gl_FragColor = vec4(r, g, b, 1.0);
}
