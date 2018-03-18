// varying float noise;
// varying float displace;

void main() {
  // float b = 0.8 - displace * abs(cos(displace * 1.3));
  // float g = (0.15 - displace * 0.2) + 0.2;
  // float r = (1.0 - displace * 0.2) * abs(sin(displace));
  gl_FragColor = vec4(0.8, 0.2, 0.2, 1.0);
}
