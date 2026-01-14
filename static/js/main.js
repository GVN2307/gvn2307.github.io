document.addEventListener('DOMContentLoaded', () => {

    // Matrix Rain Effect
    const canvas = document.getElementById('matrix-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Set canvas width and height
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Matrix characters (Binary + Matrix-like symbols)
        const chars = '01';
        const fontSize = 24; // Bigger text
        const columns = canvas.width / fontSize;
        const drops = [];

        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const drawMatrix = () => {
            // Darker trail for higher contrast
            ctx.fillStyle = 'rgba(10, 10, 18, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `bold ${fontSize}px monospace`; // Bold for visibility

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));

                // High contrast colors: Bright White vs Neon Green
                const isBright = Math.random() > 0.9;
                ctx.fillStyle = isBright ? '#ffffff' : '#00ff41';

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Sending the drop back to the top randomly after it has crossed the screen
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(drawMatrix, 33);
    }

    // Typing Effect
    const texts = [
        "Cybersecurity Analyst",
        "Penetration Tester",
        "Python Developer",
        "Network Sentinel"
    ];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;

    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        const typingElement = document.getElementById('typing-text');
        if (typingElement) {
            typingElement.textContent = letter;
        }

        let typeSpeed = 100;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    })();

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile Menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            const responseDiv = document.getElementById('form-response');

            // Visual feedback
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "ENCRYPTING & SENDING...";
            submitBtn.disabled = true;

            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                responseDiv.classList.remove('hidden');
                if (response.ok) {
                    responseDiv.innerHTML = `<p style="color: var(--accent-green)">[SUCCESS]: ${result.message}</p>`;
                    contactForm.reset();
                } else {
                    responseDiv.innerHTML = `<p style="color: #ff5f56">[ERROR]: ${result.message}</p>`;
                }
            } catch (error) {
                responseDiv.innerHTML = `<p style="color: #ff5f56">[FATAL]: Network transmission failed.</p>`;
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                setTimeout(() => {
                    responseDiv.innerHTML = '';
                    responseDiv.classList.add('hidden');
                }, 5000);
            }
        });
    }
});
