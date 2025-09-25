// src/js/components/HeroBlob.js
import { webgl } from '../core/WebGLManager.js';

const THREE = window.THREE;
const GSAP = window.gsap;

const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec3 vNormal;
    varying vec3 vPosition;

    float simpleNoise(vec3 pos) {
        return sin(pos.x + uTime) * cos(pos.y + uTime) + sin(pos.z + uTime);
    }

    void main() {
        vNormal = normal;
        vPosition = position;
        vec3 newPosition = position;
        float noise = simpleNoise(position * 2.0) * 0.5;
        float mouseDistance = distance(vec2(position.x, position.y), uMouse);
        float mouseEffect = 1.0 - smoothstep(0.0, 0.5, mouseDistance);
        noise += mouseEffect * 0.5;
        newPosition += normal * noise;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;

const fragmentShader = `
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform vec3 uFresnelColor;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
        float lightIntensity = max(dot(vNormal, lightDirection), 0.0);
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = 1.0 - max(dot(viewDirection, vNormal), 0.0);
        fresnel = pow(fresnel, 2.0);
        vec3 color = uBaseColor + lightIntensity * 0.5;
        color += fresnel * uFresnelColor;
        color.r += sin(uTime * 0.5) * 0.1;
        color.b += cos(uTime * 0.5) * 0.1;
        gl_FragColor = vec4(color, 1.0);
    }
`;

export class HeroBlob {
    constructor() {
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        this.colors = {
            dark: {
                base: new THREE.Color('#0a0a0a'),
                fresnel: new THREE.Color('#00ff99')
            },
            light: {
                base: new THREE.Color('#e0e0e0'),
                fresnel: new THREE.Color('#ff0077')
            }
        };

        this.init();
        this.addEventListeners();
    }

    init() {
        const geometry = new THREE.SphereGeometry(1, 128, 128);
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: this.mouse },
                uBaseColor: { value: this.colors.dark.base },
                uFresnelColor: { value: this.colors.dark.fresnel }
            },
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        webgl.add(this.mesh);
    }

    addEventListeners() {
        window.addEventListener('mousemove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    update({ currentTime }) {
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        this.material.uniforms.uTime.value = currentTime * 0.001;
        this.material.uniforms.uMouse.value = this.mouse;
    }

    updateTheme(isLightMode) {
        const targetColors = isLightMode ? this.colors.light : this.colors.dark;
        GSAP.to(this.material.uniforms.uBaseColor.value, {
            r: targetColors.base.r,
            g: targetColors.base.g,
            b: targetColors.base.b,
            duration: 1.5,
            ease: 'power3.inOut'
        });
        GSAP.to(this.material.uniforms.uFresnelColor.value, {
            r: targetColors.fresnel.r,
            g: targetColors.fresnel.g,
            b: targetColors.fresnel.b,
            duration: 1.5,
            ease: 'power3.inOut'
        });
    }
}