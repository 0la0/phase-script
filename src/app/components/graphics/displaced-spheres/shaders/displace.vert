uniform float time;
uniform float magnitude;
varying float displacement;

float turbulence( vec3 p ) {
  float t = -0.5;
  for (float f = 1.0 ; f <= 10.0 ; f++ ){
    float power = pow( 2.0, f );
    t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
  }
  return t;
}

void main() {
  float noiseBuffer = 4.0 * pnoise( 0.09 * position + vec3( 2.0 * time ), vec3( 100.0 ) );
  float noise = 3.0 * turbulence( 0.75 * normal + time );
  displacement = (noise + noiseBuffer) * magnitude;
  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
