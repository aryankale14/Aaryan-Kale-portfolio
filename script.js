document.addEventListener("DOMContentLoaded", () => {
    // Custom Cursor
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    if (cursor && follower) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";

            // Add a small delay for follower
            setTimeout(() => {
                follower.style.left = e.clientX + "px";
                follower.style.top = e.clientY + "px";
            }, 100);
        });

        // Add hover effect for links and buttons
        const hoverables = document.querySelectorAll("a, button, .glass-card, .menu-toggle");
        hoverables.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
                follower.style.transform = "translate(-50%, -50%) scale(1.5)";
                cursor.style.mixBlendMode = "normal";
            });
            el.addEventListener("mouseleave", () => {
                cursor.style.transform = "translate(-50%, -50%) scale(1)";
                follower.style.transform = "translate(-50%, -50%) scale(1)";
                cursor.style.mixBlendMode = "difference";
            });
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            // Toggle icon shape if needed
            const icon = menuToggle.querySelector("ion-icon");
            if (icon) {
                icon.setAttribute("name", navLinks.classList.contains("active") ? "close-outline" : "menu-outline");
            }
        });
    }

    // Close mobile menu when clicking a link
    if (navLinks) {
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                const icon = menuToggle?.querySelector("ion-icon");
                if (icon) icon.setAttribute("name", "menu-outline");
            });
        });
    }

    // Typing Effect
    const typingText = document.querySelector(".typing-text");
    if (typingText) {
        const roles = ["AI Engineer", "Web Developer", "Cloud Architect", "Data Enthusiast"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing next
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // Particle Network Animation
    const canvas = document.getElementById("hero-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = "#00f2ea"; // Primary color
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            // Optimize for mobile: fewer particles
            let divider = window.innerWidth < 768 ? 15000 : 9000;
            let numberOfParticles = (canvas.height * canvas.width) / divider;

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 2) - 1; // Speed x
                let directionY = (Math.random() * 2) - 1; // Speed y
                let color = '#00f2ea';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        function connect() {
            let opacityValue = 1;
            // Reduce connection distance on mobile for performance
            let connectionDist = window.innerWidth < 768 ? (canvas.width / 9) * (canvas.height / 9) : (canvas.width / 7) * (canvas.height / 7);

            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < connectionDist) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(0, 242, 234,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            // mouse.radius = ((canvas.height / 80) * (canvas.height / 80)); // Unused?
            init();
        });

        // Mouse interaction
        let mouse = {
            x: null,
            y: null,
            radius: (canvas.height / 80) * (canvas.width / 80)
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Add touch interaction
        window.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                mouse.x = event.touches[0].clientX;
                mouse.y = event.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchstart', (event) => {
            if (event.touches.length > 0) {
                mouse.x = event.touches[0].clientX;
                mouse.y = event.touches[0].clientY;
            }
        }, { passive: true });

        init();
        animate();
    }

    // Scroll Reveal Animation (existing code...)
    const revealElements = document.querySelectorAll(".glass-card, .section-title");

    function reveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach((el) => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add("active");
                // Check if specific class like 'reveal' is missing and add transition style if not in CSS
                if (!el.classList.contains('reveal')) {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }
            }
        });
    }

    // Add initial styles for reveal if not in CSS
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.style.opacity = "0";
            el.style.transform = "translateY(50px)";
            el.style.transition = "all 0.8s ease";
        }
    });

    window.addEventListener("scroll", reveal);
    reveal(); // Trigger once on load
});
