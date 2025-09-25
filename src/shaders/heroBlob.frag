// src/shaders/heroBlob.frag

uniform float uTime;
uniform vec3 uColor; // We'll pass a base color from JS

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Basic directional lighting
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
    float lightIntensity = max(dot(vNormal, lightDirection), 0.0);

    // Fresnel effect for a nice rim-lighting / glassy look
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - max(dot(viewDirection, vNormal), 0.0);
    fresnel = pow(fresnel, 2.0);

    // Combine lighting and fresnel for the final color
    vec3 color = vec3(0.1, 0.2, 0.3) + lightIntensity * 0.5; // Base ambient color + lighting
    color += fresnel * vec3(0.0, 1.0, 0.5); // Add the fresnel highlight color

    // Add a subtle time-based color shift
    color.r += sin(uTime * 0.5) * 0.1;
    color.b += cos(uTime * 0.5) * 0.1;

    gl_FragColor = vec4(color, 1.0);
}