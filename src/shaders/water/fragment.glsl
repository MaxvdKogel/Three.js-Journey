uniform vec3 uDepth;
uniform vec3 uSurface;
uniform float uMultiplier;
uniform float uOffset;

varying float vElevation;

void main() {
    float mixStrength = (vElevation + uOffset) * uMultiplier;
    vec3 color = mix(uDepth, uSurface, mixStrength);
    gl_FragColor = vec4(color, 1.0);
}