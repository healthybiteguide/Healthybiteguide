// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

// Initialize Application
function initializeApp() {
    hideLoadingScreen();
    loadSavedPlan();
    setupEventListeners();
    setupIntersectionObserver();
    setupPlanSelection();
    setupBenefitInteractions();
    addScrollEffects();
}

// Load previously selected plan from localStorage
function loadSavedPlan() {
    const savedPlan = localStorage.getItem('selectedNutritionPlan');
    if (savedPlan) {
        try {
            selectedPlan = JSON.parse(savedPlan);
            
            // Find and select the saved plan
            const planElement = document.querySelector(`[data-plan="${selectedPlan.type}"]`);
            if (planElement) {
                planElement.classList.add('selected');
                
                // Update button text
                const bookBtn = document.getElementById('bookNowBtn');
                if (bookBtn) {
                    bookBtn.innerHTML = `📱 Book ${selectedPlan.name} Plan — Message on Instagram`;
                    bookBtn.setAttribute('data-plan-selected', selectedPlan.name);
                }
            }
        } catch (e) {
            // Clear invalid data
            localStorage.removeItem('selectedNutritionPlan');
        }
    }
}

// Hide Loading Screen
function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Book Now Button
    const bookNowBtn = document.getElementById('bookNowBtn');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', handleBookNow);
    }



    // Plan hover effects
    const plans = document.querySelectorAll('.plan');
    plans.forEach(plan => {
        plan.addEventListener('mouseenter', handlePlanHover);
        plan.addEventListener('mouseleave', handlePlanLeave);
        plan.addEventListener('click', handlePlanClick);
    });

    // Benefit items interactions
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach(item => {
        item.addEventListener('click', handleBenefitClick);
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

// Global variable to store selected plan
let selectedPlan = null;

// Handle Book Now Click
function handleBookNow(e) {
    e.preventDefault();
    
    // Add click animation
    const btn = e.target;
    btn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        btn.style.transform = '';
        
        // Create Instagram message with selected plan
        const instagramMessage = createInstagramMessage();
        
        // Copy message to clipboard
        copyToClipboard(instagramMessage);
        
        // Open Instagram
        window.open('https://www.instagram.com/healthybite.guide099', '_blank');
        
        // Show success message with plan info
        const planInfo = selectedPlan ? ` (${selectedPlan.name} - ${selectedPlan.price})` : '';
        showNotification(`Message copied to clipboard! Plan selected${planInfo}`, 'success', 4000);
    }, 150);
}

// Create Instagram message with plan details
function createInstagramMessage() {
    const baseMessage = `Hi Sana! 👋

I'm interested in booking a nutrition consultation with you.`;

    if (selectedPlan) {
        return `${baseMessage}

📋 Selected Plan: ${selectedPlan.name}
💰 Price: ${selectedPlan.price}
📝 Features: ${selectedPlan.features.join(', ')}

I would like to know more about this plan and discuss my health goals with you.

Looking forward to hearing from you! 🌟`;
    } else {
        return `${baseMessage}

I would like to learn more about your nutrition plans and discuss my health goals.

Could you please help me choose the right plan for my needs?

Looking forward to hearing from you! 🌟`;
    }
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}



// Handle Plan Interactions
function handlePlanHover(e) {
    const plan = e.target.closest('.plan');
    plan.style.transform = 'translateY(-8px) scale(1.02)';
    
    // Add glow effect
    plan.style.boxShadow = '0 20px 40px rgba(122, 194, 122, 0.2)';
}

function handlePlanLeave(e) {
    const plan = e.target.closest('.plan');
    plan.style.transform = '';
    plan.style.boxShadow = '';
}

function handlePlanClick(e) {
    const plan = e.target.closest('.plan');
    const planType = plan.dataset.plan;
    
    // Store selected plan details
    selectedPlan = {
        name: plan.querySelector('h3').textContent,
        price: plan.querySelector('.price').textContent,
        features: Array.from(plan.querySelectorAll('.plan-features li')).map(li => li.textContent),
        type: planType
    };
    
    // Remove previous selections
    document.querySelectorAll('.plan').forEach(p => {
        p.classList.remove('selected');
    });
    
    // Add selection
    plan.classList.add('selected');
    
    // Add pulse animation
    plan.style.animation = 'pulse 0.6s ease-in-out';
    setTimeout(() => {
        plan.style.animation = '';
    }, 600);
    
    // Update CTA button text
    const bookBtn = document.getElementById('bookNowBtn');
    if (bookBtn) {
        bookBtn.innerHTML = `📱 Book ${selectedPlan.name} Plan — Message on Instagram`;
        bookBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
        
        // Add plan indicator
        bookBtn.setAttribute('data-plan-selected', selectedPlan.name);
        
        setTimeout(() => {
            bookBtn.style.background = '';
        }, 2000);
    }
    
    // Show notification with plan details
    showNotification(`${selectedPlan.name} plan selected! (${selectedPlan.price}) 🎯`, 'success', 3000);
    
    // Store in localStorage for persistence
    localStorage.setItem('selectedNutritionPlan', JSON.stringify(selectedPlan));
}

// Handle Benefit Item Clicks
function handleBenefitClick(e) {
    const benefitItem = e.target.closest('.benefit-item');
    
    // Add special animation
    benefitItem.style.transform = 'translateX(12px) scale(1.02)';
    benefitItem.style.background = 'linear-gradient(135deg, #e6f8e9, #f0fff0)';
    
    setTimeout(() => {
        benefitItem.style.transform = '';
        benefitItem.style.background = '';
    }, 400);
    
    // Show success message
    showNotification('Great choice! This benefit is included in all plans 🌟', 'success', 2000);
}

// Setup Plan Selection System
function setupPlanSelection() {
    // Add CSS for selected state
    const style = document.createElement('style');
    style.textContent = `
        .plan.selected {
            border-color: #ff6b6b !important;
            background: linear-gradient(135deg, #fff5f5, #ffe6e6) !important;
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 0 16px 40px rgba(255, 107, 107, 0.3) !important;
        }
        
        .plan.selected::before {
            transform: scaleX(1) !important;
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e) !important;
        }
        
        .plan.selected::after {
            content: '✓ Selected';
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        @keyframes pulse {
            0%, 100% { transform: translateY(-8px) scale(1.02); }
            50% { transform: translateY(-8px) scale(1.08); }
        }
    `;
    document.head.appendChild(style);
}

// Setup Benefit Interactions
function setupBenefitInteractions() {
    const benefitItems = document.querySelectorAll('.benefit-item');
    
    benefitItems.forEach((item, index) => {
        // Stagger animation delays
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover sound effect (visual feedback)
        item.addEventListener('mouseenter', () => {
            item.style.background = 'linear-gradient(135deg, #f8fff8, #e6f8e9)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = '';
        });
    });
}

// Setup Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for different elements
                if (entry.target.classList.contains('benefit-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.card, .benefit-item, .plan, .testimonial').forEach(el => {
        observer.observe(el);
    });
}

// Add Scroll Effects
function addScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for header
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = `translateY(${rate * 0.1}px)`;
        }
        
        // Fade effect for elements
        const elements = document.querySelectorAll('.card');
        elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const opacity = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));
                el.style.opacity = opacity;
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Handle Smooth Scrolling
function handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Notification System
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Type-specific styles
    const typeStyles = {
        success: { background: 'linear-gradient(135deg, #7ac27a, #5fb85f)' },
        error: { background: 'linear-gradient(135deg, #ff6b6b, #ff5252)' },
        info: { background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)' },
        warning: { background: 'linear-gradient(135deg, #ffb74d, #ffa726)' }
    };
    
    Object.assign(notification.style, typeStyles[type] || typeStyles.info);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance Optimization
function optimizePerformance() {
    // Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Add CSS animations dynamically
const additionalStyles = `
    .animate-in {
        animation: slideUpFade 0.6s ease-out forwards;
    }
    
    @keyframes slideUpFade {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        backdrop-filter: blur(10px);
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Clear plan selection function
function clearPlanSelection() {
    selectedPlan = null;
    localStorage.removeItem('selectedNutritionPlan');
    
    // Remove visual selection
    document.querySelectorAll('.plan').forEach(p => {
        p.classList.remove('selected');
    });
    
    // Reset button text
    const bookBtn = document.getElementById('bookNowBtn');
    if (bookBtn) {
        bookBtn.innerHTML = '📱 Book Now — Message on Instagram';
        bookBtn.removeAttribute('data-plan-selected');
    }
    
    showNotification('Plan selection cleared', 'info', 2000);
}

// Add double-click to clear selection
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.plan').forEach(plan => {
        plan.addEventListener('dblclick', function(e) {
            e.preventDefault();
            if (this.classList.contains('selected')) {
                clearPlanSelection();
            }
        });
    });
});