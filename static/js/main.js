document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Custom Cursor Logic ---
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const lagAmount = 0.15; // Lower = more lag

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate dot update
        if (dot) {
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        }
    });

    const animateCursor = () => {
        // Lagged outline update using linear interpolation
        outlineX += (mouseX - outlineX) * lagAmount;
        outlineY += (mouseY - outlineY) * lagAmount;

        if (outline) {
            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';
        }

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover effect for interactive elements
    const hoverElements = 'a, button, .btn, .project-card, .cert-item, input, textarea, .mobile-menu-btn';
    document.querySelectorAll(hoverElements).forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        if (dot) dot.style.opacity = '0';
        if (outline) outline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        if (dot) dot.style.opacity = '1';
        if (outline) outline.style.opacity = '1';
    });

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

    // --- 3. Scroll Reveal Animation ---
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
    const dotsContainer = document.getElementById('dots-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (badgeTrack && dotsContainer) {
        const badges = document.querySelectorAll('.badge-item');
        const originalCount = badges.length / 2;

        // Helper to jump to a specific index
        const jumpTo = (index) => {
            // Validate bounds
            if (index < 0) index = originalCount - 1;
            if (index >= originalCount) index = 0;

            // Update active dot
            document.querySelectorAll('.badge-dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });

            // Calculate delay for CSS animation based on index
            const totalDuration = 30;
            const timePerItem = totalDuration / originalCount;
            const delay = index * timePerItem;

            // Reset Animation to correct position
            badgeTrack.style.animation = 'none';
            badgeTrack.offsetHeight; // force reflow
            badgeTrack.style.animation = `scroll ${totalDuration}s linear infinite`;
            badgeTrack.style.animationDelay = `-${delay}s`;

            // Pause for viewing
            badgeTrack.style.animationPlayState = 'paused';

            // Auto resume
            setTimeout(() => {
                badgeTrack.style.animationPlayState = 'running';
            }, 4000);

            return index;
        }

        let currentIndex = 0;

        // Generate Dots
        for (let i = 0; i < originalCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('badge-dot');
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                currentIndex = jumpTo(i);
            });

            dotsContainer.appendChild(dot);
        }

        // Next/Prev Buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = jumpTo(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = jumpTo(currentIndex + 1);
            });
        }
    }
});
