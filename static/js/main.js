document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Matrix Rain Effect ---
    const canvas = document.getElementById('matrix-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const chars = '01';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];
        for (let i = 0; i < columns; i++) drops[i] = 1;

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(10, 10, 18, 0.05)'; // Slower fade for better trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `bold ${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                // Random green shades
                const isBright = Math.random() > 0.95;
                ctx.fillStyle = isBright ? '#ffffff' : '#0f0';

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        setInterval(drawMatrix, 50);
    }

    // --- 2. Typing Effect ---
    const texts = ["Cybersecurity Analyst", "Penetration Tester", "Python Developer", "Network Sentinel"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;

    (function type() {
        currentText = texts[count % texts.length];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        const typingElement = document.getElementById('typing-text');
        if (typingElement) {
            typingElement.textContent = letter;
            // Add blinking cursor effect via CSS border or ::after, handled in CSS usually
        }

        let typeSpeed = 100;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    })();

    // --- 3. Smooth Scrolling & Scroll Spy ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const headerOffset = 85; // Height of fixed header + buffer

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Update URL hash without jumping
                history.pushState(null, null, targetId);

                // Close mobile menu if open
                document.querySelector('.nav-links').classList.remove('nav-active');
            }
        });
    });

    // Scroll Spy (Active Link Highlighter)
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - headerOffset - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Scroll Reveal Animation ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 5. Project Details Modal ---
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-project-name');
    const modalDesc = document.getElementById('modal-description');
    const modalTech = document.getElementById('modal-tech-stack');

    // Open Modal logic
    document.querySelectorAll('.details-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Find parent card data
            const card = btn.closest('.project-card');
            const title = card.querySelector('h4').textContent;
            const desc = card.querySelector('p').textContent;
            const techItems = Array.from(card.querySelectorAll('.card-footer li')).map(li => li.textContent);

            // Populate Modal
            modalTitle.textContent = title;
            modalDesc.textContent = desc + "\n\n[Advanced technical details, architecture diagrams, and security protocols would effectively replace this placeholder in a real deployment scenario. This modal allows for in-depth case studies without leaving the main dashboard environment.]";

            modalTech.innerHTML = '';
            techItems.forEach(tech => {
                const span = document.createElement('span');
                span.classList.add('modal-tech-tag');
                span.textContent = tech;
                modalTech.appendChild(span);
            });

            // Show Modal
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal Logic
    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    // Close on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Escape key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // --- 6. Mobile Menu ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('nav-active');
        });
    }

    // --- 7. Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            const responseDiv = document.getElementById('form-response');
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;

            submitBtn.innerText = "ENCRYPTING...";
            submitBtn.disabled = true;

            try {
                // Simulate network delay for "Hacker" feel
                await new Promise(r => setTimeout(r, 800));

                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.status === 405 || response.status === 404) throw new Error("Static Mode");

                const result = await response.json();

                responseDiv.classList.remove('hidden');
                if (response.ok) {
                    responseDiv.innerHTML = `<p style="color: var(--accent-green)">[SUCCESS]: ${result.message}</p>`;
                    contactForm.reset();
                } else {
                    responseDiv.innerHTML = `<p style="color: #ff5f56">[ERROR]: ${result.message}</p>`;
                }
            } catch (error) {
                // Fallback for static demo
                setTimeout(() => {
                    responseDiv.classList.remove('hidden');
                    responseDiv.innerHTML = `<p style="color: var(--accent-green)">[SUCCESS]: Transmission Secure (Demo Mode). ID: ${Math.floor(Math.random() * 999999)}</p>`;
                    contactForm.reset();
                }, 500);
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                setTimeout(() => {
                    responseDiv.classList.add('hidden');
                    responseDiv.innerHTML = '';
                }, 5000);
            }
        });
    }

    // --- 8. Badge Carousel Controls ---
    const badgeTrack = document.querySelector('.badge-track');
    const badgeControls = document.getElementById('badge-controls');

    if (badgeTrack && badgeControls) {
        const badges = document.querySelectorAll('.badge-item');
        // Original set (half of total because of duplication)
        const originalCount = badges.length / 2;

        // Generate Dots
        for (let i = 0; i < originalCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('badge-dot');
            if (i === 0) dot.classList.add('active'); // First one active

            dot.addEventListener('click', () => {
                // Remove active class from all
                document.querySelectorAll('.badge-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');

                // Calculate position (Width + Gap)
                // Assuming 250px width + 100px gap = 350px per item
                const itemWidth = 350;
                const scrollPos = i * itemWidth;

                // Stop Animation manually to allow view
                badgeTrack.style.animationPlayState = 'paused';

                // Translate track manually
                // We use transform directly or modify the starting keyframe logic
                // For simplicity in a pure CSS animation setup, we can't easily "jump" to a frame 
                // without complex JS. 
                // A simpler "Hack": changing offset, but that fights the keyframe.

                // BETTER APPROACH for "Manual": 
                // Restart animation from a negative offset? 

                // IMPLEMENTATION: Since it's an infinite purely-CSS scroll, "jumping" to a specific item
                // is tricky. Instead, we'll just PAUSE and highlight for now, 
                // OR we accept that "Manual" means "Scroll to view" which is hard with CSS-only marquees.

                // ALTERNATIVE: Just pause on hover (already done) and use dots to 'indicate' count?
                // Request said "move them manually". 

                // Let's restart the animation with a negative delay to "fast forward" to the spot.
                // 30s total for N items. Time per item = 30 / N.
                // -delay = (i * (30/N))

                const totalDuration = 30; // seconds
                const timePerItem = totalDuration / originalCount;
                const delay = i * timePerItem;

                // Reset animation
                badgeTrack.style.animation = 'none';
                badgeTrack.offsetHeight; /* trigger reflow */
                badgeTrack.style.animation = `scroll ${totalDuration}s linear infinite`;
                badgeTrack.style.animationDelay = `-${delay}s`;

                // Pause specifically so they can see it
                badgeTrack.style.animationPlayState = 'paused';

                // Auto-resume after 3 seconds
                setTimeout(() => {
                    badgeTrack.style.animationPlayState = 'running';
                }, 3000);
            });

            badgeControls.appendChild(dot);
        }
    }
});
