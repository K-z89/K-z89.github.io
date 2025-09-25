// src/js/core/Renderer.js

class Renderer {
    constructor() {
        this.updatables = [];
        this.lastTime = 0;
        this.isRunning = false;

        // Bind the update method to the class instance
        this.update = this.update.bind(this);
    }

    add(item) {
        if (typeof item.update !== 'function') {
            console.error('Renderer: Item must have an update method.', item);
            return;
        }
        this.updatables.push(item);
    }

    remove(item) {
        const index = this.updatables.indexOf(item);
        if (index > -1) {
            this.updatables.splice(index, 1);
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.update);
    }

    stop() {
        this.isRunning = false;
    }

    update(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000; // Delta time in seconds
        this.lastTime = currentTime;

        // Iterate over a copy of the array to allow for adding/removing during update
        [...this.updatables].forEach(item => {
            item.update({ currentTime, deltaTime });
        });

        requestAnimationFrame(this.update);
    }
}

// Export a singleton instance of the Renderer
export const renderer = new Renderer();