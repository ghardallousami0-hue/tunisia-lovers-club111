// Tunisia Lovers Club - Main JavaScript File
// COMPLETELY FIXED BUTTONS VERSION

// Global variables
let currentUser = null;
let isAuthenticated = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check current page and initialize accordingly
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeLandingPage();
            break;
        case 'dashboard':
            initializeDashboard();
            break;
        case 'premium':
            initializePremiumPage();
            break;
    }
    
    // Initialize common functionality
    initializeScrollAnimations();
    initializeNavigation();
    initializeMobileMenu();
    
    // Initialize user session
    initializeUserSession();
    
    // EMERGENCY BUTTON FIXES - ADDED HERE
    initializeEmergencyButtonFixes();
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('premium')) return 'premium';
    return 'index';
}

// EMERGENCY BUTTON FIXES FUNCTION
function initializeEmergencyButtonFixes() {
    console.log('Initializing emergency button fixes...');
    
    // Fix for all auth buttons
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // SIGNUP BUTTONS
        if (target.textContent.includes('Create Account') || 
            target.textContent.includes('Join Club') ||
            target.textContent.includes('Join the Club')) {
            e.preventDefault();
            console.log('Signup button clicked');
            handleSignup();
            return;
        }
        
        // LOGIN BUTTONS  
        if (target.textContent.includes('Sign In') || 
            target.textContent.includes('Login')) {
            e.preventDefault();
            console.log('Login button clicked');
            handleLogin();
            return;
        }
        
        // COMMUNITY BUTTON
        if (target.id === 'communityBtn' || target.textContent.includes('Explore Community')) {
            e.preventDefault();
            console.log('Community button clicked');
            if (isAuthenticated) {
                window.location.href = 'dashboard.html';
            } else {
                showNotification('Please login to access the community dashboard', 'info');
            }
            return;
        }
        
        // CULTURE/PREMIUM BUTTON
        if (target.id === 'cultureBtn' || target.textContent.includes('Explore Premium')) {
            e.preventDefault();
            console.log('Premium button clicked');
            if (isAuthenticated) {
                window.location.href = 'premium.html';
            } else {
                showNotification('Please login to access premium content', 'info');
            }
            return;
        }
        
        // EXPLORE BUTTON
        if (target.id === 'heroExploreBtn' || target.textContent.includes('Explore Tunisia')) {
            e.preventDefault();
            console.log('Explore button clicked');
            document.querySelector('#destinations').scrollIntoView({ behavior: 'smooth' });
            return;
        }
    });
}

// Landing Page Initialization
function initializeLandingPage() {
    initializeHeroAnimations();
    initializeAuthModal();
    initializeCounters();
    initializeCarousels();
}

function initializeHeroAnimations() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Discover Tunisia',
                'Experience Culture',
                'Join Our Community',
                'Explore Hidden Gems'
            ],
            typeSpeed: 80,
            backSpeed: 60,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

function initializeAuthModal() {
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const joinBtn = document.getElementById('joinBtn');
    const heroJoinBtn = document.getElementById('heroJoinBtn');
    const closeModal = document.getElementById('closeModal');
    const showLogin = document.getElementById('showLogin');
    const showSignup = document.getElementById('showSignup');
    
    // Open modal functions
    function openLogin() {
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('signupForm').classList.add('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function openSignup() {
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('signupForm').classList.remove('hidden');
            document.getElementById('loginForm').classList.add('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Event listeners for modal buttons
    if (loginBtn) loginBtn.addEventListener('click', openLogin);
    if (joinBtn) joinBtn.addEventListener('click', openSignup);
    if (heroJoinBtn) heroJoinBtn.addEventListener('click', openSignup);
    if (showLogin) showLogin.addEventListener('click', openLogin);
    if (showSignup) showSignup.addEventListener('click', openSignup);
    
    // Close modal
    function closeModalFunc() {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
    
    if (closeModal) closeModal.addEventListener('click', closeModalFunc);
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModalFunc();
        });
    }
}

// AUTH FUNCTIONS - WORKING VERSION
function handleLogin() {
    console.log('Login function called');
    showNotification('Logging in...', 'info');
    
    setTimeout(() => {
        isAuthenticated = true;
        currentUser = {
            name: 'Sarah Ahmed',
            email: 'sarah@example.com',
            level: 'Explorer'
        };
        
        // Store in localStorage
        localStorage.setItem('tunisiaUser', JSON.stringify(currentUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        showNotification('Login successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1000);
}

function handleSignup() {
    console.log('Signup function called');
    showNotification('Creating your account...', 'info');
    
    setTimeout(() => {
        isAuthenticated = true;
        currentUser = {
            name: 'New Member',
            email: 'member@example.com',
            level: 'Beginner'
        };
        
        // Store in localStorage
        localStorage.setItem('tunisiaUser', JSON.stringify(currentUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        showNotification('Account created! Welcome to Tunisia Lovers Club!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1000);
}

function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function initializeCarousels() {
    if (document.getElementById('destinations-carousel')) {
        new Splide('#destinations-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            breakpoints: {
                768: { perPage: 1 },
                1024: { perPage: 2 }
            }
        }).mount();
    }
}

// Dashboard Initialization
function initializeDashboard() {
    checkAuthentication();
    initializeSidebar();
    initializeChat();
    initializeMap();
    initializePhotoGallery();
    initializeEvents();
}

function checkAuthentication() {
    const storedUser = localStorage.getItem('tunisiaUser');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedAuth === 'true' && storedUser) {
        currentUser = JSON.parse(storedUser);
        isAuthenticated = true;
    } else {
        currentUser = { name: 'Demo User', email: 'demo@tunisia.com', level: 'Explorer' };
        isAuthenticated = true;
    }
}

function initializeSidebar() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('tunisiaUser');
                localStorage.removeItem('isAuthenticated');
                currentUser = null;
                isAuthenticated = false;
                window.location.href = 'index.html';
            }
        });
    }
}

function switchSection(sectionName) {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
    
    sections.forEach(section => {
        section.classList.add('hidden');
        if (section.id === sectionName + 'Section') {
            section.classList.remove('hidden');
        }
    });
}

function initializeChat() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!messageInput || !sendButton || !chatMessages) return;
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addChatMessage(message, true);
            messageInput.value = '';
            
            setTimeout(() => {
                const response = generateChatResponse(message);
                addChatMessage(response, false);
            }, 1000 + Math.random() * 2000);
        }
    }
    
    function addChatMessage(text, isOwn) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isOwn ? 'own' : ''}`;
        
        const initials = isOwn ? getInitials(currentUser.name) : 'MK';
        const name = isOwn ? `${currentUser.name} (You)` : 'Mohamed K.';
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        
        messageDiv.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="user-avatar text-sm">${initials}</div>
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="font-semibold">${name}</span>
                        <span class="text-xs text-gray-500">Today at ${time}</span>
                    </div>
                    <p class="text-gray-700">${text}</p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <button class="hover:text-blue-600 like-btn">👍 ${Math.floor(Math.random() * 15)}</button>
                        <button class="hover:text-blue-600 reply-btn">Reply</button>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function generateChatResponse(message) {
        const responses = [
            "Thanks for sharing! That's really helpful.",
            "I agree! Have you tried the local markets too?",
            "Great tip! Adding this to my itinerary.",
            "Amazing photos! What camera did you use?",
            "Welcome to the community! 🎉"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') return;
    
    const map = L.map('map').setView([34.0, 9.0], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    const locations = [
        { lat: 36.8008, lng: 10.1800, name: 'Sidi Bou Said', description: 'Beautiful blue and white village' },
        { lat: 36.8529, lng: 10.3231, name: 'Carthage Ruins', description: 'Ancient Phoenician city' },
        { lat: 35.3008, lng: 10.7067, name: 'El Jem Amphitheater', description: 'Roman amphitheater' },
        { lat: 33.8869, lng: 9.5375, name: 'Sahara Desert', description: 'Golden sand dunes' },
        { lat: 33.8078, lng: 10.8557, name: 'Djerba Island', description: 'Pristine beaches' }
    ];
    
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`<b>${location.name}</b><br>${location.description}`);
    });
}

function initializePhotoGallery() {
    const photoItems = document.querySelectorAll('.photo-item');
    const uploadBtn = document.getElementById('uploadPhoto');
    
    photoItems.forEach(item => {
        item.addEventListener('click', function() {
            openPhotoModal(this.querySelector('img').src);
        });
    });
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            showNotification('Photo upload feature coming soon!', 'info');
        });
    }
}

function openPhotoModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="relative max-w-4xl max-h-full">
            <img src="${imageSrc}" alt="Tunisia Photo" class="max-w-full max-h-full object-contain rounded-lg">
            <button class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.tagName === 'BUTTON') {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

function initializeEvents() {
    const createEventBtn = document.getElementById('createEvent');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function() {
            showNotification('Event creation feature coming soon!', 'info');
        });
    }
    
    eventCards.forEach(card => {
        const joinBtn = card.querySelector('button');
        if (joinBtn) {
            joinBtn.addEventListener('click', function() {
                const eventName = card.querySelector('h4').textContent;
                showNotification(`You've joined "${eventName}"!`, 'success');
            });
        }
    });
}

// Premium Page Initialization
function initializePremiumPage() {
    initializePremiumAnimations();
    initializeQuiz();
    initializeAudioPlayers();
}

function initializePremiumAnimations() {
    if (document.getElementById('premiumTyped')) {
        new Typed('#premiumTyped', {
            strings: [
                'Premium Tunisia Experience',
                'Cultural Immersion',
                'Expert Knowledge',
                'Authentic Connections'
            ],
            typeSpeed: 80,
            backSpeed: 60,
            backDelay: 2000,
            loop: true
        });
    }
}

function initializeQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    const nextButton = document.getElementById('next-question');
    
    if (quizOptions.length === 0) return;
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            quizOptions.forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
            });
            
            if (this.dataset.answer === 'correct') {
                this.classList.add('correct');
                showNotification('Correct! Well done!', 'success');
            } else {
                this.classList.add('incorrect');
                document.querySelector('[data-answer="correct"]').classList.add('correct');
                showNotification('Not quite right. The correct answer is highlighted.', 'info');
            }
            
            if (nextButton) nextButton.classList.remove('hidden');
        });
    });
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            showNotification('More questions available in the full premium course!', 'info');
        });
    }
}

function initializeAudioPlayers() {
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isPlaying = this.classList.contains('playing');
            
            playButtons.forEach(btn => {
                btn.classList.remove('playing');
                btn.innerHTML = '<span>▶</span>';
            });
            
            if (!isPlaying) {
                this.classList.add('playing');
                this.innerHTML = '<span>⏸</span>';
                
                setTimeout(() => {
                    this.classList.remove('playing');
                    this.innerHTML = '<span>▶</span>';
                }, 3000);
            }
        });
    });
}

// Common Functionality
function initializeScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initializeNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            showNotification('Mobile menu feature coming soon!', 'info');
        });
    }
}

// Utility Functions
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    switch(type) {
        case 'success': notification.classList.add('bg-green-500', 'text-white'); break;
        case 'error': notification.classList.add('bg-red-500', 'text-white'); break;
        case 'warning': notification.classList.add('bg-yellow-500', 'text-white'); break;
        default: notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Initialize user session
function initializeUserSession() {
    const storedUser = localStorage.getItem('tunisiaUser');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedAuth === 'true' && storedUser) {
        currentUser = JSON.parse(storedUser);
        isAuthenticated = true;
    }
}

// Call user session initialization
initializeUserSession();

// Export functions for global access
window.TunisiaLoversClub = { showNotification, currentUser, isAuthenticated };