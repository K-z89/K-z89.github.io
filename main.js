document.addEventListener('DOMContentLoaded', () => {

    // Theme Toggler
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        // Optional: Save theme preference to localStorage
        if (body.classList.contains('dark-mode')) {
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

    // Hero Section Animation
    gsap.from('.hero-content h1', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' });
    gsap.from('.hero-content p', { duration: 1, y: 50, opacity: 0, delay: 0.3, ease: 'power3.out' });
    gsap.from('.hero-content .btn', { duration: 1, y: 50, opacity: 0, delay: 0.6, ease: 'power3.out' });
    gsap.from('.hero-image', { duration: 1.5, scale: 0.8, opacity: 0, delay: 0.8, ease: 'elastic.out(1, 0.5)' });

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


    // Scroll-triggered animations for sections
    const sections = document.querySelectorAll('section:not(#hero)');

    sections.forEach(section => {
        const title = section.querySelector('h2');
        const content = section.querySelectorAll('.about-content > *, .skills-grid > *, .portfolio-grid > *, #contact-form > *');

        if (title) {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        if (content) {
            gsap.from(content, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
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