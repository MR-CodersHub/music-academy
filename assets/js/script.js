// Initialize animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.id === 'about') {
                setTimeout(() => animateCounter(40, 'students-count'), 50);
                setTimeout(() => animateCounter(5, 'instructors-count'), 75);
                setTimeout(() => animateCounter(2, 'years-count'), 100);
            }
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const sections = ['hero', 'about', 'courses', 'testimonials', 'contact'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
});

function animateCounter(target, elementId, duration = 300) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const increment = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 16);
}

// Parallax effect (Simplified)
let scrollY = 0;
let ticking = false;
window.addEventListener('scroll', function () {
    scrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// --- Custom Success Modal Logic ---
function showSuccessModal(message) {
    let modalOverlay = document.querySelector('.success-modal-overlay');

    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'success-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="success-modal">
                <div class="success-icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3 class="success-title">Success!</h3>
                <p class="success-message"></p>
                <button class="success-close-btn" onclick="hideSuccessModal()">Continue</button>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) hideSuccessModal();
        });
    }

    modalOverlay.querySelector('.success-message').textContent = message;

    requestAnimationFrame(() => {
        modalOverlay.classList.add('active');
    });
}

function hideSuccessModal() {
    const modalOverlay = document.querySelector('.success-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            // Keep overlay in DOM for reuse
        }, 300);
    }
}
window.hideSuccessModal = hideSuccessModal;

// --- Web3Forms Handler ---
async function setupFormSubmission(formId, accessKey, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';

        try {
            const formData = new FormData(form);
            const object = { access_key: accessKey };
            formData.forEach((value, key) => object[key] = value);
            const json = JSON.stringify(object);

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            });

            const result = await response.json();

            if (result.success) {
                showSuccessModal(successMessage);
                form.reset();
            } else {
                console.error(result);
                alert('Something went wrong. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Connection failed. Please check internet.');
        } finally {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    });
}

// Initialize Forms
setupFormSubmission('contact-form', 'adb2628c-070d-4dd4-81d4-3feb7b03822c', 'Message sent successfully! We will get back to you shortly.');
setupFormSubmission('enroll-form', '6934d112-090c-4be0-92f8-a3e7e19d2a96', 'Application submitted! Welcome to Pianist.');


// Smooth scroll for nav links & Active Link Highlighting
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Set Active Nav Link based on Current Page URL
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // If the href matches the current file name, set it as active
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else {
            // Unset active for all others, overriding hardcoded HTML classes if incorrect
            link.classList.remove('active');
        }
    });
});

// Fade in animations
const fadeElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.visibility = 'visible';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    fadeObserver.observe(element);
});

// Initial log
console.log('%c🎹 Welcome to Pianist!', 'color: #6366f1; font-size: 20px; font-weight: bold;');

// Mobile Menu Logic (Slide-in)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const closeMenuBtn = document.querySelector('.close-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function openMenu() {
    if (mobileMenuPanel) {
        mobileMenuPanel.classList.add('active');
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeMenu() {
    if (mobileMenuPanel) {
        mobileMenuPanel.classList.remove('active');
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
    }
    document.body.style.overflow = ''; // Restore scroll
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMenu);
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
}

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMenu);
}

mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Touch swipe to close (Optional but premium)
let touchStartX = 0;
if (mobileMenuPanel) {
    mobileMenuPanel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mobileMenuPanel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX - touchStartX > 50) { // Swipe right to close
            closeMenu();
        }
    }, { passive: true });
}

// ===== PASSWORD VISIBILITY TOGGLE =====
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const wrapper = field.closest('.password-field-wrapper');
    if (!wrapper) return;
    
    const btn = wrapper.querySelector('.toggle-password-btn');
    if (!btn) return;
    
    if (field.type === 'password') {
        field.type = 'text';
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        field.type = 'password';
        btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}

// ===== AUTHENTICATION SYSTEM =====
const ADMIN_CREDENTIALS = {
    email: 'admin@gmail.com',
    password: 'admin123'
};

// Setup auth forms when DOM is ready
function setupAuthForms() {
    // Setup Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Setup Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Handle login submission
function handleLogin(e) {
    e.preventDefault();
    
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    
    if (!emailEl || !passwordEl) {
        alert('Error: Form elements not found');
        console.error('Login form elements missing');
        return false;
    }
    
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();
    
    // Validate inputs
    if (!email || !password) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email');
        return false;
    }
    
    // Check admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', 'admin');
        alert('Admin login successful! Redirecting...');
        window.location.href = 'admin-dashboard.html';
        return false;
    }
    
    // Check user credentials
    const usersJSON = localStorage.getItem('users');
    const users = usersJSON ? JSON.parse(usersJSON) : {};
    
    if (users[email] && users[email].password === password) {
        localStorage.setItem('currentUser', email);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', 'user');
        alert('Login successful! Redirecting...');
        window.location.href = 'user-dashboard.html';
        return false;
    }
    
    alert('Invalid email or password');
    return false;
}

// Handle signup submission
function handleSignup(e) {
    e.preventDefault();
    
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const confirmEl = document.getElementById('confirm-password');
    
    if (!nameEl || !emailEl || !passwordEl || !confirmEl) {
        alert('Error: Form elements not found');
        console.error('Signup form elements missing');
        return false;
    }
    
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();
    const confirm = confirmEl.value.trim();
    
    // Validate
    if (!name || !email || !password || !confirm) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (name.length < 2) {
        alert('Name must be at least 2 characters');
        return false;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email');
        return false;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return false;
    }
    
    if (password !== confirm) {
        alert('Passwords do not match');
        return false;
    }
    
    if (email === ADMIN_CREDENTIALS.email) {
        alert('This email cannot be used');
        return false;
    }
    
    // Check if email exists
    const usersJSON = localStorage.getItem('users');
    const users = usersJSON ? JSON.parse(usersJSON) : {};
    
    if (users[email]) {
        alert('Email already registered');
        return false;
    }
    
    // Create account
    users[email] = {
        name: name,
        email: email,
        password: password
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', email);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', 'user');
    
    alert('Account created successfully! Redirecting...');
    window.location.href = 'user-dashboard.html';
    return false;
}

// Check page protection - Removed to allow anyone to access dashboards
function checkPageProtection() {
    // Page protection disabled - anyone can access admin-dashboard and user-dashboard
    console.log('Page protection disabled - dashboards accessible to all');
}

// ===== PROFILE DROPDOWN MENU =====
function setupProfileDropdown() {
    const profileLink = document.querySelector('.profile-link');
    if (!profileLink) return;
    
    // Create dropdown container
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'profile-dropdown-container';
    dropdownContainer.style.position = 'relative';
    dropdownContainer.style.display = 'inline-block';
    
    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'profile-dropdown-menu';
    dropdownMenu.style.cssText = `
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--card, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        min-width: 160px;
        z-index: 1000;
        overflow: hidden;
    `;
    
    dropdownMenu.innerHTML = `
        <a href="admin-dashboard.html" class="dropdown-item" style="display: block; padding: 12px 16px; color: var(--foreground, #1e293b); text-decoration: none; font-size: 14px; transition: background 0.2s;">
            <span style="margin-right: 8px;">⚙️</span> Admin
        </a>
        <a href="user-dashboard.html" class="dropdown-item" style="display: block; padding: 12px 16px; color: var(--foreground, #1e293b); text-decoration: none; font-size: 14px; transition: background 0.2s;">
            <span style="margin-right: 8px;">👤</span> User
        </a>
        <a href="login.html" class="dropdown-item" style="display: block; padding: 12px 16px; color: var(--foreground, #1e293b); text-decoration: none; font-size: 14px; transition: background 0.2s; border-top: 1px solid var(--border, #e2e8f0);">
            <span style="margin-right: 8px;">🔑</span> Login
        </a>
    `;
    
    // Add hover styles via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        .dropdown-item:hover {
            background: var(--primary) !important;
            color: white !important;
        }
    `;
    document.head.appendChild(style);
    
    // Wrap the profile link in container and add dropdown
    profileLink.parentNode.insertBefore(dropdownContainer, profileLink);
    dropdownContainer.appendChild(profileLink);
    dropdownContainer.appendChild(dropdownMenu);
    
    // Toggle dropdown on click
    profileLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownContainer.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupAuthForms();
        setupProfileDropdown();
    });
} else {
    // DOM is already loaded
    setupAuthForms();
    setupProfileDropdown();
}

// Logout Function (for both admin and regular users)
function logout() {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
}

// Keep logoutAdmin as alias for backward compatibility
function logoutAdmin() {
    logout();
}

/* ==========================================================================
   Redesigned Testimonials & Animation Mode Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('testimonials');
    if (!section) return;

    const slides = Array.from(section.querySelectorAll('.testimonial-slide'));
    const dots = Array.from(section.querySelectorAll('.slider-dots .dot'));
    const prevBtn = section.querySelector('.prev-btn');
    const nextBtn = section.querySelector('.next-btn');
    const toggleCheckbox = document.getElementById('animation-mode-checkbox');
    const canvas = document.getElementById('testimonial-visualizer');
    
    let currentIndex = 0;
    let autoplayInterval = null;
    let visualizerFrameId = null;
    let noteInterval = null;

    // Helper: update slide classes (Coverflow 3D look)
    function updateSlides() {
        const total = slides.length;
        slides.forEach((slide, idx) => {
            slide.classList.remove('active', 'next', 'prev');
            
            // Coverflow classes based on relative index to currentIndex
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else if (idx === (currentIndex + 1) % total) {
                slide.classList.add('next');
            } else if (idx === (currentIndex - 1 + total) % total) {
                slide.classList.add('prev');
            }
        });

        // Update dots
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function setSlide(index) {
        const total = slides.length;
        currentIndex = (index + total) % total;
        updateSlides();
    }

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            setSlide(currentIndex - 1);
            resetAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            setSlide(currentIndex + 1);
            resetAutoplay();
        });
    }

    // Dot clicks
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            setSlide(idx);
            resetAutoplay();
        });
    });

    // Autoplay functionality
    function startAutoplay() {
        stopAutoplay();
        const duration = toggleCheckbox && toggleCheckbox.checked ? 3500 : 5000;
        autoplayInterval = setInterval(() => {
            setSlide(currentIndex + 1);
        }, duration);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function resetAutoplay() {
        if (autoplayInterval) {
            startAutoplay();
        }
    }

    // Initialize slides
    updateSlides();
    startAutoplay();

    // ----------------------------------------------------
    // Canvas Audio Waves Visualizer (Animation Mode)
    // ----------------------------------------------------
    let ctx = canvas ? canvas.getContext('2d') : null;
    let waveOffset = 0;
    
    function resizeCanvas() {
        if (canvas) {
            canvas.width = section.clientWidth;
            canvas.height = section.clientHeight;
        }
    }

    function drawVisualizer() {
        if (!ctx || !canvas) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const w = canvas.width;
        const h = canvas.height;
        const midY = h * 0.7; // Draw waves near bottom 70% of section
        
        // Draw 3 sine waves overlapping with slightly different frequencies/phases
        const waves = [
            { amplitude: 35, frequency: 0.002, speed: 0.04, color: 'rgba(99, 102, 241, 0.12)' },
            { amplitude: 25, frequency: 0.004, speed: -0.06, color: 'rgba(168, 85, 247, 0.09)' },
            { amplitude: 15, frequency: 0.006, speed: 0.08, color: 'rgba(236, 72, 153, 0.06)' }
        ];
        
        waveOffset += 0.1;
        
        waves.forEach(wave => {
            ctx.beginPath();
            ctx.moveTo(0, midY);
            
            for (let x = 0; x < w; x += 5) {
                // Sine wave calculation
                const y = midY + Math.sin(x * wave.frequency + waveOffset * wave.speed) * wave.amplitude;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fillStyle = wave.color;
            ctx.fill();
        });
        
        visualizerFrameId = requestAnimationFrame(drawVisualizer);
    }

    function startVisualizer() {
        if (canvas) {
            canvas.classList.add('active');
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
            drawVisualizer();
        }
    }

    function stopVisualizer() {
        if (canvas) {
            canvas.classList.remove('active');
            window.removeEventListener('resize', resizeCanvas);
            if (visualizerFrameId) {
                cancelAnimationFrame(visualizerFrameId);
                visualizerFrameId = null;
            }
        }
    }

    // ----------------------------------------------------
    // Floating Music Notes (Animation Mode)
    // ----------------------------------------------------
    const noteSymbols = ['♪', '♫', '♬', '♩', '𝄞', '𝄢', '𝄪'];
    
    function spawnMusicNote() {
        const activeSlide = section.querySelector('.testimonial-slide.active');
        if (!activeSlide) return;
        
        const card = activeSlide.querySelector('.testimonial-card');
        if (!card) return;
        
        const note = document.createElement('span');
        note.className = 'music-note';
        
        // Random symbol
        note.textContent = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
        
        // Spawn coordinates: randomly from bottom profiles area
        const xOffset = Math.random() * 200 - 100; // -100px to 100px from center
        const rot = Math.random() * 360;
        
        note.style.setProperty('--x-offset', `${xOffset}px`);
        note.style.setProperty('--rot', `${rot}deg`);
        
        // Set coordinates at the bottom of active card
        note.style.left = `calc(50% + ${Math.random() * 100 - 50}px)`;
        note.style.bottom = `40px`;
        
        card.appendChild(note);
        
        // Remove from DOM when animation completes
        setTimeout(() => {
            note.remove();
        }, 2500);
    }

    function startNotes() {
        stopNotes();
        noteInterval = setInterval(spawnMusicNote, 1000);
    }

    function stopNotes() {
        if (noteInterval) {
            clearInterval(noteInterval);
            noteInterval = null;
        }
        // Remove existing floating notes
        section.querySelectorAll('.music-note').forEach(n => n.remove());
    }

    // ----------------------------------------------------
    // 3D Perspective Tilt on Hover (Animation Mode)
    // ----------------------------------------------------
    function handleTilt(e) {
        if (!toggleCheckbox.checked) return;
        
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x coordinate inside element
        const y = e.clientY - rect.top;  // y coordinate inside element
        
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        
        // Calculate tilt values (-10 to 10 degrees)
        const tiltX = (midY - y) / midY * 10;
        const tiltY = (x - midX) / midX * 10;
        
        // Apply transform
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = '';
    }

    function setupTiltListeners() {
        section.querySelectorAll('.testimonial-card').forEach(card => {
            card.addEventListener('mousemove', handleTilt);
            card.addEventListener('mouseleave', resetTilt);
        });
    }

    // Remove event listeners and reset inline style
    function removeTiltListeners() {
        section.querySelectorAll('.testimonial-card').forEach(card => {
            card.removeEventListener('mousemove', handleTilt);
            card.removeEventListener('mouseleave', resetTilt);
            card.style.transform = '';
        });
    }

    // ----------------------------------------------------
    // Animation Mode Control Toggle
    // ----------------------------------------------------
    function handleModeChange() {
        if (toggleCheckbox.checked) {
            section.classList.add('animation-active');
            localStorage.setItem('testimonialsAnimationMode', 'true');
            startVisualizer();
            startNotes();
            setupTiltListeners();
        } else {
            section.classList.remove('animation-active');
            localStorage.setItem('testimonialsAnimationMode', 'false');
            stopVisualizer();
            stopNotes();
            removeTiltListeners();
        }
        // Speed up autoplay slightly when animation mode is ON
        startAutoplay();
    }

    if (toggleCheckbox) {
        toggleCheckbox.addEventListener('change', handleModeChange);
        
        // Restore previous preference if set
        const savedPreference = localStorage.getItem('testimonialsAnimationMode');
        if (savedPreference === 'true') {
            toggleCheckbox.checked = true;
            handleModeChange();
        } else if (savedPreference === 'false') {
            toggleCheckbox.checked = false;
            handleModeChange();
        } else {
            // Default to checked (ON) on high-end desktop, unchecked otherwise
            const isDesktop = window.innerWidth > 1024;
            toggleCheckbox.checked = isDesktop;
            handleModeChange();
        }
    }
});

