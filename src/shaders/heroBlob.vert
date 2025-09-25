// src/shaders/heroBlob.vert

uniform float uTime;
uniform vec2 uMouse;

varying vec3 vNormal;
varying vec3 vPosition;

// A simple but effective noise function using sine waves
float simpleNoise(vec3 pos) {
    return sin(pos.x + uTime) * cos(pos.y + uTime) + sin(pos.z + uTime);
}

void main() {
    vNormal = normal;
    vPosition = position;

    // Start with the base position
    vec3 newPosition = position;

    // Add noise to create the blobby shape
    float noise = simpleNoise(position * 2.0) * 0.5;

    // Add mouse interaction to the distortion
    float mouseDistance = distance(vec2(position.x, position.y), uMouse);
    float mouseEffect = 1.0 - smoothstep(0.0, 0.5, mouseDistance);
    noise += mouseEffect * 0.5;

    // Apply the distortion along the normal
    newPosition += normal * noise;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}