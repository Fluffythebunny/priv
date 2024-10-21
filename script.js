document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const particlesContainer = document.querySelector('.particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'white';
        particle.style.position = 'absolute';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 5 + 5}s linear infinite`;
        particlesContainer.appendChild(particle);
    }

    const revealElements = document.querySelectorAll('.reveal');
    const revealElementsOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealElementsOnScroll);
    revealElementsOnScroll();

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        header.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = (y - centerY) / 10;
            const tiltY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    const scrambleText = (element, originalText) => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let iteration = 0;
        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join('');
            if (iteration >= originalText.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 30);
    };

    const h1 = document.querySelector('h1');
    const originalText = h1.innerText;
    h1.addEventListener('mouseover', () => scrambleText(h1, originalText));

    const updateRedirectButtons = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/ZYPHERStudios/assets/refs/heads/main/dG9ydGlsbGFjYW52YXNoZWxwZXJ1cmwocyk');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const base64Data = await response.text();
            const decodedData = atob(base64Data);
            const tortillaUrls = JSON.parse(decodedData);
            
            if (tortillaUrls) {
                const redirectButtons = document.querySelectorAll('.redirect-button');
                redirectButtons.forEach((button, index) => {
                    if (tortillaUrls[`tortilla${index + 1}`]) {
                        button.setAttribute('data-url', tortillaUrls[`tortilla${index + 1}`]);
                    }
                });
            }
        } catch (error) {
            console.error('There was a problem fetching or decoding the URLs:', error);
        }
    };

    updateRedirectButtons();

    const redirectButtons = document.querySelectorAll('.redirect-button');
    redirectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const url = button.getAttribute('data-url');
            button.classList.add('clicked');
            
            button.textContent = 'Redirecting...';
            
            document.querySelectorAll('body > *:not(script)').forEach(element => {
                if (element !== button.closest('section')) {
                    element.style.transition = 'opacity 0.5s ease';
                    element.style.opacity = '0';
                }
            });
            
            const newWindow = window.open('about:blank', '_blank');
            
            newWindow.document.write(`
                <html>
                <head>
                    <title>Loading...</title>
                    <style>
                        body, html {
                            margin: 0;
                            padding: 0;
                            height: 100%;
                            overflow: hidden;
                        }
                        iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                        }
                    </style>
                </head>
                <body>
                    <iframe src="${url}" allowfullscreen></iframe>
                </body>
                </html>
            `);
            newWindow.document.close();

            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 1000);
        });
    });
});