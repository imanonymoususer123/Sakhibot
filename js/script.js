// Mobile menu toggle with animations
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('active');
    
    if (isOpen) {
        // Close menu
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuButton.classList.remove('active');
        document.body.style.overflow = '';
        
        // Hide menu after animation
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
            mobileMenuOverlay.classList.add('hidden');
        }, 400);
    } else {
        // Open menu
        mobileMenu.classList.remove('hidden');
        mobileMenuOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        setTimeout(() => {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuButton.classList.add('active');
        }, 10);
        
        // Reinitialize icons
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }
}

mobileMenuButton.addEventListener('click', toggleMobileMenu);
mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

// Close menu when clicking on menu items
document.querySelectorAll('.mobile-menu-item').forEach(item => {
    item.addEventListener('click', () => {
        setTimeout(() => {
            toggleMobileMenu();
        }, 300);
    });
});

// Scroll animations
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Trigger initial check
reveal();

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }, mobileMenu.classList.contains('active') ? 400 : 0);
        }
    });
});

// Popup functions
function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        // Reinitialize icons after showing popup
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 10);
    }
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close popup when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('popup-overlay')) {
        e.target.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close popups first
        const openPopups = document.querySelectorAll('.popup-overlay:not(.hidden)');
        openPopups.forEach(popup => {
            popup.classList.add('hidden');
            document.body.style.overflow = '';
        });
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('full-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value.trim()
        };
        
        // Validate form
        if (!formData.fullName || !formData.email || !formData.interest || !formData.message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        
        try {
            // Send form data to FormSubmit.io
            const response = await fetch('https://formsubmit.io/send/brinoandtech@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    interest: formData.interest,
                    message: formData.message
                })
            });
            
            if (!response.ok) {
                throw new Error('Form submission failed');
            }
            
            // Show success message
            showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Scroll to form message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            // Show error message
            showFormMessage('Sorry, there was an error sending your message. Please try again later or contact us directly at brinoandtech@gmail.com', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    });
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.remove('hidden');
    
    // Remove previous type classes
    formMessage.classList.remove('bg-green-100', 'text-green-800', 'border-green-300', 
                                  'bg-red-100', 'text-red-800', 'border-red-300');
    
    // Add appropriate classes based on type
    if (type === 'success') {
        formMessage.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-300');
    } else {
        formMessage.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-300');
    }
    
    // Auto-hide message after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
}

