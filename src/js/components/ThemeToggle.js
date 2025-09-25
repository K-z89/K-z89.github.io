// src/js/components/ThemeToggle.js

export class ThemeToggle {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.button = document.createElement('button');
        this.button.id = 'theme-toggle';
        this.button.innerText = 'Switch Theme';
        this.container.appendChild(this.button);

        this.addEventListeners();
    }

    addEventListeners() {
        this.button.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });
    }
}