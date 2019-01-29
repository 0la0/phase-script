uniform float time;
varying float x;
varying float y;
varying float r;
varying float g;
varying float b;
// varying vec2 vUv;



void main() {
  // float r = 0.2 * sin(4.0 * time) + 0.5;
  // float r = x;
  // float g = x;
  // float b = x;

  // vec2 sample_pos = vUv;
  // if (sample_pos.x > 0.5) {
  //   sample_pos.x = 1.0 - sample_pos.x;
  // }
  // if (sample_pos.y > 0.5) {
  //   sample_pos.y = 1.0 - sample_pos.y;
  // }
  // if (sample_pos.y > sample_pos.x) {
  //   float temp = sample_pos.x;
  //   sample_pos.x = sample_pos.y;
  //   sample_pos.y = temp;
  // }


  gl_FragColor = vec4(r, g, b, 1.0);
}
