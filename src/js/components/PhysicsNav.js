// src/js/components/PhysicsNav.js
import { renderer } from '../core/Renderer.js';

const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse, Composite } = window.Matter;
const GSAP = window.gsap;

export class PhysicsNav {
    constructor(container) {
        this.container = container;
        this.links = ['About', 'Portfolio', 'Contact'];
        this.bodies = [];
        this.domElements = [];

        this.init();
    }

    init() {
        // Create the DOM container for our nav
        this.navContainer = document.createElement('div');
        this.navContainer.id = 'physics-nav-container';
        this.container.appendChild(this.navContainer);

        // Create the physics engine
        this.engine = Engine.create({
            gravity: { x: 0, y: 0.1 } // A little bit of gravity for fun
        });

        // Create the nav items
        this.createNavItems();

        // Create boundaries
        this.createBoundaries();

        // Add mouse control
        this.addMouseControl();

        // Add this component to the main renderer
        renderer.add(this);

        // Add some initial chaos
        this.applyInitialForce();
    }

    createNavItems() {
        this.links.forEach(linkText => {
            const domElement = document.createElement('a');
            domElement.href = `#${linkText.toLowerCase()}`;
            domElement.innerText = linkText;
            domElement.className = 'physics-nav-item';
            this.navContainer.appendChild(domElement);
            this.domElements.push(domElement);

            const rect = domElement.getBoundingClientRect();
            const body = Bodies.rectangle(
                Math.random() * this.navContainer.clientWidth,
                Math.random() * this.navContainer.clientHeight,
                rect.width,
                rect.height,
                { restitution: 0.8, friction: 0.1 }
            );
            this.bodies.push(body);
        });

        World.add(this.engine.world, this.bodies);
    }

    createBoundaries() {
        const w = this.navContainer.clientWidth;
        const h = this.navContainer.clientHeight;
        const thickness = 100;

        World.add(this.engine.world, [
            Bodies.rectangle(w / 2, -thickness / 2, w, thickness, { isStatic: true }), // top
            Bodies.rectangle(w / 2, h + thickness / 2, w, thickness, { isStatic: true }), // bottom
            Bodies.rectangle(-thickness / 2, h / 2, thickness, h, { isStatic: true }), // left
            Bodies.rectangle(w + thickness / 2, h / 2, thickness, h, { isStatic: true })  // right
        ]);
    }

    addMouseControl() {
        const mouse = Mouse.create(this.navContainer);
        const mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false // We don't want matter.js to draw the constraint
                }
            }
        });

        World.add(this.engine.world, mouseConstraint);
    }

    applyInitialForce() {
        this.bodies.forEach(body => {
            Matter.Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1
            });
        });
    }

    update() {
        Engine.update(this.engine, 1000 / 60);

        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i];
            const domElement = this.domElements[i];

            domElement.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
        }
    }
}