document.addEventListener('DOMContentLoaded', () => {

    // 3D Background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x888888
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        particleSystem.rotation.x += 0.0001;
        particleSystem.rotation.y += 0.0001;

        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');

    const dotX = gsap.quickTo(cursorDot, "x", { duration: 0.2, ease: "power3" });
    const dotY = gsap.quickTo(cursorDot, "y", { duration: 0.2, ease: "power3" });
    const followerX = gsap.quickTo(cursorFollower, "x", { duration: 0.6, ease: "power3" });
    const followerY = gsap.quickTo(cursorFollower, "y", { duration: 0.6, ease: "power3" });

    window.addEventListener('mousemove', e => {
        dotX(e.clientX);
        dotY(e.clientY);
        followerX(e.clientX);
        followerY(e.clientY);
    });

    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorFollower, { scale: 1.5, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorFollower, { scale: 1, duration: 0.3 });
        });
    });


    // Magnetic Buttons & Links
    const magneticElements = document.querySelectorAll('.btn, header a, #theme-toggle');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(this, {
                x: x * 0.2,
                y: y * 0.4,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        el.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.75)'
            });
        });
    });


    // Theme Toggler
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        const isDarkMode = body.classList.contains('dark-mode');

        // Update particle color
        const newColor = isDarkMode ? new THREE.Color(0x555555) : new THREE.Color(0x888888);
        gsap.to(particleMaterial.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
            duration: 1,
            ease: 'power3.inOut'
        });

        // Optional: Save theme preference to localStorage
        if (isDarkMode) {
            localStorage.setItem('theme', 'dark-mode');
        } else {
            localStorage.removeItem('theme');
        }
    });

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark-mode') {
        body.classList.add('dark-mode');
    }

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Advanced Hero Section Animation
    const heroTitle = new SplitType('.hero-content h1', { types: 'chars' });
    gsap.from(heroTitle.chars, {
        y: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.hero-content p', { duration: 1, y: 50, opacity: 0, delay: 0.5, ease: 'power3.out' });
    gsap.from('.hero-content .btn', { duration: 1, y: 50, opacity: 0, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero-image', { duration: 1.5, scale: 0.8, opacity: 0, delay: 1, ease: 'elastic.out(1, 0.5)' });

    // 3D Parallax effect for hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroImage.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            gsap.to('.hero-image img', {
                rotationY: x * 20,
                rotationX: -y * 20,
                transformPerspective: 500,
                ease: 'power1.out'
            });
        });
        heroImage.addEventListener('mouseleave', () => {
            gsap.to('.hero-image img', {
                rotationY: 0,
                rotationX: 0,
                ease: 'power1.out'
            });
        });
    }


    // Advanced Scroll-triggered animations
    document.querySelectorAll('section:not(#hero)').forEach(section => {
        // Animate section titles
        const title = section.querySelector('h2');
        if (title) {
            const splitTitle = new SplitType(title, { types: 'chars' });
            gsap.from(splitTitle.chars, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 90%',
                },
                y: 50,
                opacity: 0,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        // Animate content inside .about-content
        const aboutContent = section.querySelectorAll('.about-content > *');
        if (aboutContent.length > 0) {
            gsap.from(aboutContent, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                },
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        // Animate portfolio items
        const portfolioItems = section.querySelectorAll('.portfolio-item');
        if (portfolioItems.length > 0) {
            portfolioItems.forEach(item => {
                const imgContainer = item.querySelector('.img-container');
                const info = item.querySelector('.portfolio-info');
                
                // WebGL Hover Effect
                const hoverImg = new hoverEffect({
                    parent: imgContainer,
                    intensity: 0.3,
                    image1: imgContainer.querySelector('img').src,
                    image2: imgContainer.querySelector('img').src, // can be a different image
                    displacementImage: 'https://cdn.jsdelivr.net/gh/robin-dela/hover-effect/images/heightMap.png',
                    imagesRatio: 400/600
                });

                gsap.from(imgContainer, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                    },
                    clipPath: 'inset(0 100% 0 0)',
                    duration: 1,
                    ease: 'power3.inOut'
                });

                gsap.from(info.children, {
                     scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                    },
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    delay: 0.5,
                    duration: 0.8,
                    ease: 'power3.out'
                });

                // Parallax text on hover
                item.addEventListener('mousemove', (e) => {
                    const rect = item.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    gsap.to(info.querySelector('h3'), {
                        x: (x - rect.width/2) * 0.05,
                        y: (y - rect.height/2) * 0.05,
                        ease: 'power2.out'
                    });
                     gsap.to(info.querySelector('p'), {
                        x: (x - rect.width/2) * 0.03,
                        y: (y - rect.height/2) * 0.03,
                        ease: 'power2.out'
                    });
                });

                 item.addEventListener('mouseleave', () => {
                     gsap.to(info.querySelectorAll('h3, p'), {
                        x: 0,
                        y: 0,
                        ease: 'power2.out'
                    });
                });
            });
        }

        // Animate contact form
        const formElements = section.querySelectorAll('#contact-form > *');
         if (formElements.length > 0) {
            gsap.from(formElements, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                },
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out'
            });
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const subject = this.querySelector('input[name="subject"]').value;
            const message = this.querySelector('textarea[name="message"]').value;

            const mailtoLink = `mailto:Drkianheydari@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            window.location.href = mailtoLink;
        });
    }

});