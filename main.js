/**
 * ADARSH ELECTRICALS - DYNAMIC USER INTERFACE ACTIONS
 * Implements Theme Switching, Responsive Gestures, Filterable Showroom, Lightboxes, Form Auditing, and Scrolled Reveals.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. PERSISTENT THEME SWITCHER (LIGHT/DARK)
       ========================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check existing stored preferences, default to system preference if none exist
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-theme', initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    });


    /* ==========================================
       2. RESPONSIVE MOBILE NAVIGATION MENU
       ========================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when any individual link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================
       3. STICKY HEADER & SCROLL SPY
       ========================================== */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');

    const handleScrollEffects = () => {
        // Sticky Menu Ingress
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active State Scroll Spy
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 150; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Trigger once on load


    /* ==========================================
       4. SCROLL REVEAL ANIMATIONS
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* ==========================================
       5. COUNTER STATS ANIMATION
       ========================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out quadratic
                const easeValue = progress * (2 - progress);
                const currentValue = Math.floor(easeValue * target);

                stat.textContent = currentValue + (target === 100 || target === 24 ? '%' : '+');

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + (target === 100 ? '%' : target === 24 ? ' ISO' : '+');
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    // Watch stats section specifically
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }


    /* ==========================================
       6. SHOWCASE PRODUCT GALLERY FILTERS
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Swap active buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                    // Trigger reflow for fade-in animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // Wait for transition duration
                }
            });
        });
    });


    /* ==========================================
       7. PREMIUM IMAGE LIGHTBOX PREVIEW
       ========================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = trigger.getAttribute('data-image');
            const imgTitle = trigger.getAttribute('data-title');
            const imgDesc = trigger.getAttribute('data-desc');

            lightboxImage.setAttribute('src', imgSrc);
            lightboxImage.setAttribute('alt', imgTitle);
            lightboxCaption.textContent = imgTitle;
            lightboxDesc.textContent = imgDesc;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
        setTimeout(() => {
            lightboxImage.setAttribute('src', ''); // Clear source
        }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on clicking outside content area
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });


    /* ==========================================
       8. CONTACT FORM SPECIFICATION VALIDATOR
       ========================================== */
    const quoteForm = document.getElementById('quote-form');
    const successOverlay = document.getElementById('success-overlay');
    const btnSuccessClose = document.getElementById('btn-success-close');

    // Helper: Mark validation error state
    const setFieldError = (inputElement, hasError) => {
        if (hasError) {
            inputElement.classList.add('error');
        } else {
            inputElement.classList.remove('error');
        }
    };

    // Realtime input clean-up
    quoteForm.querySelectorAll('.form-control').forEach(control => {
        control.addEventListener('input', () => {
            if (control.value.trim() !== '') {
                setFieldError(control, false);
            }
        });
        
        control.addEventListener('change', () => {
            if (control.value !== '') {
                setFieldError(control, false);
            }
        });
    });

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const phoneInput = document.getElementById('form-phone');
        const typeSelect = document.getElementById('form-type');
        const descInput = document.getElementById('form-desc');

        // 1. Name Check
        if (nameInput.value.trim() === '') {
            setFieldError(nameInput, true);
            isFormValid = false;
        } else {
            setFieldError(nameInput, false);
        }

        // 2. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            setFieldError(emailInput, true);
            isFormValid = false;
        } else {
            setFieldError(emailInput, false);
        }

        // 3. Phone Format Check (10-digit number)
        const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            setFieldError(phoneInput, true);
            isFormValid = false;
        } else {
            setFieldError(phoneInput, false);
        }

        // 4. Panel Type Selection Check
        if (typeSelect.value === '') {
            setFieldError(typeSelect, true);
            isFormValid = false;
        } else {
            setFieldError(typeSelect, false);
        }

        // 5. Specification Description Check
        if (descInput.value.trim().length < 10) {
            setFieldError(descInput, true);
            isFormValid = false;
        } else {
            setFieldError(descInput, false);
        }

        if (isFormValid) {
            // Display visual success overlay
            successOverlay.classList.add('active');
            
            // Persist the lead in localstorage for testing (mock server endpoint)
            const submissionData = {
                name: nameInput.value,
                company: document.getElementById('form-company').value,
                email: emailInput.value,
                phone: phoneInput.value,
                panelType: typeSelect.value,
                description: descInput.value,
                timestamp: new Date().toISOString()
            };
            
            const leads = JSON.parse(localStorage.getItem('adarsh_leads') || '[]');
            leads.push(submissionData);
            localStorage.setItem('adarsh_leads', JSON.stringify(leads));
        }
    });

    btnSuccessClose.addEventListener('click', () => {
        // Reset form controls and fade overlay
        quoteForm.reset();
        successOverlay.classList.remove('active');
    });
});
