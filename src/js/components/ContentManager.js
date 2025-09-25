// src/js/components/ContentManager.js

export class ContentManager {
    constructor(container) {
        this.container = container;
        this.sections = {};
        this.currentSection = null;

        this.init();
    }

    init() {
        this.createSections();
        this.initPortfolioEffects();
    }

    createSections() {
        const contentData = {
            about: `
                <h2>About Dr.k</h2>
                <p>A digital artisan operating at the intersection of technology and creativity. My work explores the boundaries of interaction, generative art, and complex systems. I build not just websites, but experiences.</p>
                <h3>Core Disciplines:</h3>
                <ul>
                    <li>Generative Art & WebGL</li>
                    <li>Interactive Physics Simulations</li>
                    <li>Modern Web Architecture</li>
                    <li>Cybersecurity & Automation</li>
                </ul>
            `,
            portfolio: `
                <h2>Digital Artifacts</h2>
                <div class="portfolio-grid">
                    <div class="portfolio-item" data-img1="https://picsum.photos/seed/tech1/600/400" data-img2="https://picsum.photos/seed/tech2/600/400"><h3>Project One</h3></div>
                    <div class="portfolio-item" data-img1="https://picsum.photos/seed/tech3/600/400" data-img2="https://picsum.photos/seed/tech4/600/400"><h3>Project Two</h3></div>
                    <div class="portfolio-item" data-img1="https://picsum.photos/seed/tech5/600/400" data-img2="https://picsum.photos/seed/tech6/600/400"><h3>Project Three</h3></div>
                </div>
            `,
            contact: `
                <h2>Establish Connection</h2>
                <form>
                    <input type="text" placeholder="Your Identifier">
                    <input type="email" placeholder="Your Comms Channel">
                    <textarea placeholder="Your Message Transmission"></textarea>
                    <button type="submit">Transmit</button>
                </form>
            `
        };

        for (const [key, value] of Object.entries(contentData)) {
            const sectionEl = document.createElement('section');
            sectionEl.id = key;
            sectionEl.className = 'content-section';
            sectionEl.innerHTML = value;
            this.container.appendChild(sectionEl);
            this.sections[key] = sectionEl;
        }
    }

    showSection(id) {
        if (this.currentSection) {
            this.sections[this.currentSection].classList.remove('active');
        }
        if (this.sections[id]) {
            this.sections[id].classList.add('active');
            this.currentSection = id;
        }
    }

    initPortfolioEffects() {
        const portfolioItems = this.container.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            new window.hoverEffect({
                parent: item,
                intensity: 0.3,
                image1: item.dataset.img1,
                image2: item.dataset.img2,
                displacementImage: 'https://cdn.jsdelivr.net/gh/robin-dela/hover-effect/images/heightMap.png',
                imagesRatio: 400/600
            });
        });
    }
}