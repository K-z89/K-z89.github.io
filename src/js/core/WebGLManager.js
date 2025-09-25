// src/js/core/WebGLManager.js

// Since three.js is loaded from a CDN, it's available globally as THREE
const THREE = window.THREE;

class WebGLManager {
    constructor() {
        if (WebGLManager.instance) {
            return WebGLManager.instance;
        }

        this.canvas = document.getElementById('webgl-canvas');
        if (!this.canvas) {
            console.error('WebGLManager: Canvas element #webgl-canvas not found.');
            return;
        }

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true // Important for transparency
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Bind methods
        this.resize = this.resize.bind(this);
        this.update = this.update.bind(this);

        // Add event listeners
        window.addEventListener('resize', this.resize);

        WebGLManager.instance = this;
    }

    add(object) {
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }
}

// Export a singleton instance of the WebGLManager
export const webgl = new WebGLManager();