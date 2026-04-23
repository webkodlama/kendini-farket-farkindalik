/**
 * HAYAT - FARKINDALIK SİTESİ
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initLoading();
    initNavbar();
    initSmoothScroll();
    initAnimations();
    initCounter();
    initTestimonialsSlider();
    initMeditationTimer();
    initBackToTop();
    initNewsletter();
    initBreathingModal();
});

// ========================================
// Loading Screen
// ========================================
function initLoading() {
    const loading = document.getElementById('loading');
    
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 2000);
}

// ========================================
// Navbar Scroll Effect & Mobile Menu
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Scroll Animations (AOS-like)
// ========================================
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// Counter Animation
// ========================================
function initCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString() + '+';
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ========================================
// Testimonials Slider
// ========================================
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const cards = track.querySelectorAll('.testimonial-card');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 30; // Including gap
    const maxIndex = cards.length - getVisibleCards();
    
    function getVisibleCards() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateSlider();
    });
    
    // Auto-play
    let autoPlay = setInterval(() => {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }, 5000);
    
    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        currentIndex = Math.min(currentIndex, cards.length - getVisibleCards());
        updateSlider();
    });
}

// ========================================
// Meditation Timer
// ========================================
let timerInterval;
let timeLeft;
let totalTime;
let isRunning = false;
let soundEnabled = true;

function initMeditationTimer() {
    const timerTime = document.getElementById('timerTime');
    const timerLabel = document.getElementById('timerLabel');
    const playBtn = document.getElementById('playBtn');
    const resetBtn = document.getElementById('resetBtn');
    const soundBtn = document.getElementById('soundBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const timerProgress = document.querySelector('.timer-progress');
    const tips = document.getElementById('meditationTips');
    
    // Preset times
    const times = {
        3: 3 * 60,
        5: 5 * 60,
        10: 10 * 60,
        20: 20 * 60
    };
    
    let currentPreset = 5;
    totalTime = times[currentPreset];
    timeLeft = totalTime;
    
    // Update display
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress circle
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (timeLeft / totalTime) * circumference;
        timerProgress.style.strokeDashoffset = offset;
    }
    
    // Start/Pause timer
    playBtn.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    function startTimer() {
        isRunning = true;
        playBtn.innerHTML = '<span>⏸</span>';
        timerLabel.textContent = 'Meditasyon yapılıyor...';
        tips.style.opacity = '0.5';
        
        // Play start sound
        if (soundEnabled) playBellSound();
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                completeTimer();
            }
        }, 1000);
    }
    
    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        playBtn.innerHTML = '<span>▶</span>';
        timerLabel.textContent = 'Duraklatıldı';
        tips.style.opacity = '1';
    }
    
    function completeTimer() {
        pauseTimer();
        timerLabel.textContent = 'Tamamlandı! 🙏';
        if (soundEnabled) playBellSound();
        
        // Celebration animation
        createConfetti();
    }
    
    // Reset timer
    resetBtn.addEventListener('click', () => {
        pauseTimer();
        timeLeft = totalTime;
        timerLabel.textContent = 'Hazır';
        updateDisplay();
    });
    
    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentPreset = parseInt(btn.dataset.time);
            totalTime = times[currentPreset];
            timeLeft = totalTime;
            
            pauseTimer();
            timerLabel.textContent = 'Hazır';
            updateDisplay();
        });
    });
    
    // Sound toggle
    soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundBtn.innerHTML = soundEnabled ? '<span>🔔</span>' : '<span>🔕</span>';
    });
    
    updateDisplay();
}

// Bell sound using Web Audio API
function playBellSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator for bell sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Bell-like frequency
    oscillator.frequency.value = 528; // Love frequency
    oscillator.type = 'sine';
    
    // Envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 3);
    
    // Add harmonics for richer sound
    const harmonic = audioContext.createOscillator();
    const harmonicGain = audioContext.createGain();
    
    harmonic.connect(harmonicGain);
    harmonicGain.connect(audioContext.destination);
    
    harmonic.frequency.value = 1056;
    harmonic.type = 'sine';
    
    harmonicGain.gain.setValueAtTime(0, audioContext.currentTime);
    harmonicGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    harmonicGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    harmonic.start(audioContext.currentTime);
    harmonic.stop(audioContext.currentTime + 2);
}

// Confetti effect
function createConfetti() {
    const colors = ['#4A7C59', '#E8B86D', '#7C9A92', '#FFFFFF'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: 50%;
            top: 50%;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 5;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        const animate = () => {
            x += vx;
            y += vy + 0.5;
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${x}px, ${y}px)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ========================================
// Back to Top Button
// ========================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Newsletter Form
// ========================================
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input').value;
        
        // Show success message
        showNotification('✨ Günlük ilham için kaydoldunuz!');
        form.reset();
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--primary);
        color: white;
        padding: 16px 32px;
        border-radius: 50px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// Breathing Modal
// ========================================
function initBreathingModal() {
    const modal = document.getElementById('breathingModal');
    const closeBtn = document.getElementById('closeBreathingModal');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        stopBreathingExercise();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            stopBreathingExercise();
        }
    });
}

let breathingInterval;

function startBreathing(type) {
    const modal = document.getElementById('breathingModal');
    const orb = document.getElementById('breathOrb');
    const text = document.getElementById('breathingText');
    const timer = document.getElementById('breathingTimer');
    const ripples = document.querySelectorAll('.breath-ripples span');
    
    modal.classList.add('active');
    
    let step = 0;
    let count = 4;
    
    // 4-7-8 pattern
    const patterns = {
        '478': [
            { text: 'Nefes Al', duration: 4, scale: 1.5 },
            { text: 'Tut', duration: 7, scale: 1.5 },
            { text: 'Nefes Ver', duration: 8, scale: 1 }
        ]
    };
    
    const pattern = patterns[type] || patterns['478'];
    
    function runStep() {
        const current = pattern[step];
        text.textContent = current.text;
        count = current.duration;
        timer.textContent = count;
        
        // Animate orb
        orb.style.transition = `transform ${current.duration}s ease-in-out`;
        orb.style.transform = `scale(${current.scale})`;
        
        // Animate ripples
        ripples.forEach((ripple, i) => {
            setTimeout(() => {
                ripple.style.animation = 'none';
                ripple.offsetHeight; // Trigger reflow
                ripple.style.animation = `ripple ${current.duration}s ease-out`;
            }, i * 300);
        });
        
        // Countdown
        const countdown = setInterval(() => {
            count--;
            timer.textContent = count;
            
            if (count <= 0) {
                clearInterval(countdown);
                step = (step + 1) % pattern.length;
                runStep();
            }
        }, 1000);
        
        breathingInterval = countdown;
    }
    
    runStep();
}

function stopBreathingExercise() {
    if (breathingInterval) {
        clearInterval(breathingInterval);
    }
}

function startBodyScan() {
    showNotification('🧘 Beden taraması için sessiz bir yer bulun ve yatın');
}

function startSenseTechnique() {
    showNotification('👁️ Şu an etrafınızda 5 şey görmeye çalışın');
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========================================
// Keyboard Shortcuts
// ========================================
document.addEventListener('keydown', (e) => {
    // Space to start/pause timer when on meditation section
    if (e.code === 'Space' && document.querySelector('#basla:hover')) {
        e.preventDefault();
        document.getElementById('playBtn').click();
    }
    
    // ESC to close modal
    if (e.code === 'Escape') {
        document.getElementById('breathingModal').classList.remove('active');
        stopBreathingExercise();
    }
});

// ========================================
// Service Worker Registration (PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
