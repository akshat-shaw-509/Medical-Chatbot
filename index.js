document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle functionality
    const nav = document.querySelector('nav ul');
    const header = document.querySelector('header');
    
    // Create mobile menu button
    function createMobileMenu() {
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '☰';
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.style.display = 'none';
        menuBtn.style.background = 'none';
        menuBtn.style.border = 'none';
        menuBtn.style.fontSize = '1.5rem';
        menuBtn.style.cursor = 'pointer';
        menuBtn.style.color = '#2c3e50';
        
        const headerContainer = document.querySelector('.header-container');
        headerContainer.appendChild(menuBtn);
        
        return menuBtn;
    }
    
    const mobileMenuBtn = createMobileMenu();
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        if (nav.style.display === 'none' || nav.style.display === '') {
            nav.style.display = 'flex';
            this.innerHTML = '✕';
        } else {
            nav.style.display = 'none';
            this.innerHTML = '☰';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 480) {
            mobileMenuBtn.style.display = 'block';
            nav.style.display = 'none';
            mobileMenuBtn.innerHTML = '☰';
        } else {
            mobileMenuBtn.style.display = 'none';
            nav.style.display = 'flex';
        }
    });
    
    // Initial check for mobile
    if (window.innerWidth <= 480) {
        mobileMenuBtn.style.display = 'block';
        nav.style.display = 'none';
    }
    
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Emergency notice animation
    const emergencyNotice = document.querySelector('.emergency-notice');
    if (emergencyNotice) {
        emergencyNotice.style.opacity = '0';
        emergencyNotice.style.transform = 'translateY(-20px)';
        
        setTimeout(function() {
            emergencyNotice.style.transition = 'all 0.5s ease';
            emergencyNotice.style.opacity = '1';
            emergencyNotice.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Hero section fade in animation
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const heroElements = heroSection.querySelectorAll('h1, p, .button-link');
        
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(function() {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 400 + (index * 200));
        });
    }
    
    // Button hover effects
    const buttonLink = document.querySelector('.button-link');
    if (buttonLink) {
        buttonLink.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        buttonLink.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Navbar background change on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#ffffff';
            header.style.backdropFilter = 'none';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Form validation helper (for future forms)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Loading animation for buttons
    function showLoading(button, originalText) {
        button.innerHTML = 'Loading...';
        button.disabled = true;
        button.style.opacity = '0.7';
        
        setTimeout(function() {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.opacity = '1';
        }, 2000);
    }
    
    // Local storage helpers
    const storage = {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.log('Storage not available');
            }
        },
        
        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.log('Storage not available');
                return null;
            }
        }
    };
    
    // Simple analytics tracking
    function trackEvent(eventName, data) {
        console.log('Event tracked:', eventName, data);
        // This would typically send to analytics service
    }
    
    // Track button clicks
    const trackableButtons = document.querySelectorAll('.button-link, nav a');
    trackableButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('button_click', {
                text: this.textContent,
                href: this.href
            });
        });
    });
    
    // Simple notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#f8d7da' : '#d4edda'};
            color: ${type === 'error' ? '#721c24' : '#155724'};
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            transition: all 0.3s ease;
            transform: translateX(100%);
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Check for browser compatibility
    function checkCompatibility() {
        if (!window.localStorage) {
            showNotification('Your browser may not support all features', 'error');
        }
    }
    
    checkCompatibility();
    
    // Page load performance tracking
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log('Page loaded in:', Math.round(loadTime), 'ms');
        
        if (loadTime > 3000) {
            console.warn('Page load time is slow');
        }
    });
    
});

// Global utility functions
window.medicalChatbot = {
    showNotification: function(message, type) {
        // Re-expose notification function globally
        const event = new CustomEvent('showNotification', {
            detail: { message: message, type: type }
        });
        document.dispatchEvent(event);
    },
    
    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};