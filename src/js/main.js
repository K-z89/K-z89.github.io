// Absurdist Masterpiece - Main Application Entry Point
import { renderer } from './core/Renderer.js';
import { webgl } from './core/WebGLManager.js';
import { HeroBlob } from './components/HeroBlob.js';
import { PhysicsNav } from './components/PhysicsNav.js';
import { ContentManager } from './components/ContentManager.js';
import { ThemeToggle } from './components/ThemeToggle.js';

class App {
    constructor() {
        console.log('Initializing the Absurdist Masterpiece...');
        this.appContainer = document.getElementById('app-container');
        this.init();
    }

    init() {
        // Core Systems
        renderer.add(webgl);
        renderer.start();

        // Components
        this.heroBlob = new HeroBlob();
        renderer.add(this.heroBlob);

        this.physicsNav = new PhysicsNav(this.appContainer);

        this.contentManager = new ContentManager(this.appContainer);

        this.themeToggle = new ThemeToggle(this.appContainer);

        // Event Listeners
        this.addEventListeners();

        console.log('Application initialized. All systems are go. Chaos is imminent.');
    }

    addEventListeners() {
        // Connect Physics Nav to Content Manager
        this.physicsNav.domElements.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = e.target.hash.substring(1);
                this.contentManager.showSection(sectionId);
            });
        });

        // Add a listener to close content sections
        this.appContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('content-section')) {
                this.contentManager.showSection(null); // Hide current section
            }
        });

        // Connect Theme Toggle to Blob
        this.themeToggle.button.addEventListener('click', () => {
            const isLightMode = document.body.classList.contains('light-mode');
            this.heroBlob.updateTheme(isLightMode);
        });
    }
}

// Let the madness begin.
new App();