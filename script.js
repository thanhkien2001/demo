// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
const demoForm = document.querySelector('.demo-form');
if (demoForm) {
    demoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.phone) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Here you would typically send the data to a server
        console.log('Form data:', data);

        // Show success message
        alert('Cảm ơn bạn đã gửi yêu cầu demo! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.');

        // Reset form
        this.reset();
    });
}

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Add animation on scroll (simple fade-in effect)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.feature-card, .stat-card, .why-choose-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Packages Slider functionality
const packagesSlider = document.getElementById('packagesSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');

if (packagesSlider && prevBtn && nextBtn) {
    const cards = packagesSlider.querySelectorAll('.package-card');
    let currentIndex = 0;

    // Calculate cards per view based on screen size
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    let cardsPerView = getCardsPerView();

    // Calculate scroll distance
    function getScrollDistance() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // 2rem = 32px
        return (cardWidth + gap) * cardsPerView;
    }

    // Initialize dots
    function initDots() {
        if (!sliderDots) return;

        const totalGroups = Math.ceil(cards.length / cardsPerView);
        sliderDots.innerHTML = '';

        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            sliderDots.appendChild(dot);
        }
    }

    // Update dots
    function updateDots(index) {
        if (!sliderDots) return;
        const dots = sliderDots.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        const totalGroups = Math.ceil(cards.length / cardsPerView);
        if (index < 0) index = 0;
        if (index >= totalGroups) index = totalGroups - 1;

        currentIndex = index;
        const scrollDistance = getScrollDistance() * index;
        packagesSlider.scrollTo({
            left: scrollDistance,
            behavior: 'smooth'
        });
        updateDots(index);
    }

    // Next slide
    function nextSlide() {
        const totalGroups = Math.ceil(cards.length / cardsPerView);
        if (currentIndex < totalGroups - 1) {
            goToSlide(currentIndex + 1);
        }
    }

    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Update on scroll
    packagesSlider.addEventListener('scroll', () => {
        const scrollDistance = getScrollDistance();
        const newIndex = Math.round(packagesSlider.scrollLeft / scrollDistance);
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateDots(currentIndex);
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        initDots();
        goToSlide(0);
    });

    // Initialize
    initDots();

    // Touch/swipe support for mobile
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    packagesSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - packagesSlider.offsetLeft;
        scrollLeft = packagesSlider.scrollLeft;
    });

    packagesSlider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    packagesSlider.addEventListener('mouseup', () => {
        isDown = false;
    });

    packagesSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - packagesSlider.offsetLeft;
        const walk = (x - startX) * 2;
        packagesSlider.scrollLeft = scrollLeft - walk;
    });
}

// Animated counter for stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const suffix = element.nextElementSibling?.textContent || '';
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        if (suffix.includes('M')) {
            element.textContent = current.toFixed(1);
        } else if (suffix.includes('%')) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number[data-count]');
            statNumbers.forEach(stat => {
                if (!stat.hasAttribute('data-animated')) {
                    stat.setAttribute('data-animated', 'true');
                    animateCounter(stat);
                }
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Scroll Reveal Animation Control
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


