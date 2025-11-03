// Tunisia Lovers Club - Main JavaScript File
// Handles all interactive functionality across the website

// Global variables
let currentUser = null;
let isAuthenticated = false;
let activeSection = 'chat';

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
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('premium')) return 'premium';
    return 'index';
}

// Landing Page Initialization
function initializeLandingPage() {
    initializeHeroAnimations();
    initializeAuthModal();
    initializeCounters();
    initializeCarousels();
}

function initializeHeroAnimations() {
    // Typewriter effect for hero text
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
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Open modal functions
    function openLogin() {
        modal.classList.remove('hidden');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function openSignup() {
        modal.classList.remove('hidden');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    // Event listeners
    if (loginBtn) loginBtn.addEventListener('click', openLogin);
    if (joinBtn) joinBtn.addEventListener('click', openSignup);
    if (heroJoinBtn) heroJoinBtn.addEventListener('click', openSignup);
    if (showLogin) showLogin.addEventListener('click', openLogin);
    if (showSignup) showSignup.addEventListener('click', openSignup);
    
    // Close modal
    function closeModalFunc() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    if (closeModal) closeModal.addEventListener('click', closeModalFunc);
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModalFunc();
        });
    }
    
    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
}

function handleLogin() {
    // Simulate login process
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
    }, 2000);
}

function handleSignup() {
    // Simulate signup process
    showNotification('Creating your account...', 'info');
    
    setTimeout(() => {
        isAuthenticated = true;
        currentUser = {
            name: document.querySelector('#signupForm input[type="text"]').value || 'New Member',
            email: document.querySelector('#signupForm input[type="email"]').value,
            level: 'Beginner'
        };
        
        // Store in localStorage
        localStorage.setItem('tunisiaUser', JSON.stringify(currentUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        showNotification('Account created! Welcome to Tunisia Lovers Club!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }, 2000);
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
        
        // Start animation when element is visible
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
    // Initialize Splide carousel for destinations
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
                768: {
                    perPage: 1,
                },
                1024: {
                    perPage: 2,
                }
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
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
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
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function switchSection(sectionName) {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');
    
    // Update active nav item
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Show corresponding section
    sections.forEach(section => {
        section.classList.add('hidden');
        if (section.id === sectionName + 'Section') {
            section.classList.remove('hidden');
            activeSection = sectionName;
        }
    });
    
    // Initialize section-specific functionality
    switch(sectionName) {
        case 'map':
            initializeMap();
            break;
        case 'gallery':
            initializePhotoGallery();
            break;
        case 'events':
            initializeEvents();
            break;
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('tunisiaUser');
        localStorage.removeItem('isAuthenticated');
        currentUser = null;
        isAuthenticated = false;
        window.location.href = 'index.html';
    }
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
            
            // Simulate response
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
        
        // Add event listeners to new message
        const likeBtn = messageDiv.querySelector('.like-btn');
        const replyBtn = messageDiv.querySelector('.reply-btn');
        
        likeBtn.addEventListener('click', function() {
            const currentLikes = parseInt(this.textContent.match(/\d+/)[0]);
            this.textContent = `👍 ${currentLikes + 1}`;
        });
        
        replyBtn.addEventListener('click', function() {
            messageInput.value = `@${name.split(' ')[0]} `;
            messageInput.focus();
        });
    }
    
    function generateChatResponse(message) {
        const responses = [
            "That's fascinating! I'd love to hear more about your experience.",
            "Thanks for sharing! Have you tried the local markets too?",
            "Great tip! I'm adding this to my itinerary for my next visit.",
            "Amazing photos! What camera did you use for those shots?",
            "Welcome to the community! 🎉 Hope you're enjoying Tunisia!",
            "I completely agree! The culture there is so welcoming.",
            "Did you get to try the traditional mint tea ceremony?",
            "The architecture in that area is absolutely stunning!",
            "Make sure to visit during festival season - it's incredible!",
            "Local guides really make the difference, don't they?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') return;
    
    // Initialize Leaflet map
    const map = L.map('map').setView([34.0, 9.0], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers for Tunisia locations
    const locations = [
        { 
            lat: 36.8008, 
            lng: 10.1800, 
            name: 'Sidi Bou Said', 
            type: 'architecture', 
            description: 'Beautiful blue and white village overlooking the Mediterranean Sea. Perfect for photography and cultural exploration.'
        },
        { 
            lat: 36.8529, 
            lng: 10.3231, 
            name: 'Carthage Ruins', 
            type: 'historical', 
            description: 'Ancient Phoenician city ruins with incredible historical significance and stunning sea views.'
        },
        { 
            lat: 35.3008, 
            lng: 10.7067, 
            name: 'El Jem Amphitheater', 
            type: 'historical', 
            description: 'Magnificent Roman amphitheater, one of the best preserved in the world.'
        },
        { 
            lat: 33.8869, 
            lng: 9.5375, 
            name: 'Sahara Desert', 
            type: 'adventure', 
            description: 'Golden sand dunes stretching endlessly. Perfect for camel trekking and stargazing.'
        },
        { 
            lat: 33.8078, 
            lng: 10.8557, 
            name: 'Djerba Island', 
            type: 'beach', 
            description: 'Pristine Mediterranean beaches with rich Jewish heritage and traditional crafts.'
        },
        { 
            lat: 35.6712, 
            lng: 10.1003, 
            name: 'Kairouan', 
            type: 'historical', 
            description: 'Islamic holy city with magnificent mosques and traditional carpet weaving.'
        }
    ];
    
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`
            <div class="p-2">
                <h3 class="font-semibold text-lg mb-2">${location.name}</h3>
                <p class="text-gray-600 mb-3">${location.description}</p>
                <div class="flex items-center space-x-2">
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${location.type}</span>
                    <button onclick="addToFavorites('${location.name}')" class="text-xs text-orange-600 hover:underline">Add to Favorites</button>
                </div>
            </div>
        `);
    });
    
    // Add filter functionality
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Filter implementation would go here
            console.log('Filter changed:', this.checked);
        });
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
            simulatePhotoUpload();
        });
    }
}

function openPhotoModal(imageSrc) {
    // Create modal for photo viewing
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
    
    // Close modal functionality
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.tagName === 'BUTTON') {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

function simulatePhotoUpload() {
    showNotification('Photo upload feature coming soon!', 'info');
    // In a real app, this would open a file picker
}

function initializeEvents() {
    const createEventBtn = document.getElementById('createEvent');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function() {
            showEventCreationModal();
        });
    }
    
    eventCards.forEach(card => {
        const joinBtn = card.querySelector('button');
        if (joinBtn) {
            joinBtn.addEventListener('click', function() {
                const eventName = card.querySelector('h4').textContent;
                joinEvent(eventName);
            });
        }
    });
}

function showEventCreationModal() {
    showNotification('Event creation feature coming soon!', 'info');
}

function joinEvent(eventName) {
    showNotification(`You've joined "${eventName}"! Details will be sent to your email.`, 'success');
}

// Premium Page Initialization
function initializePremiumPage() {
    initializePremiumAnimations();
    initializeQuiz();
    initializeAudioPlayers();
}

function initializePremiumAnimations() {
    // Typewriter effect for premium hero
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
            // Remove previous selections
            quizOptions.forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
            });
            
            // Mark correct/incorrect
            if (this.dataset.answer === 'correct') {
                this.classList.add('correct');
                showNotification('Correct! Well done!', 'success');
            } else {
                this.classList.add('incorrect');
                document.querySelector('[data-answer="correct"]').classList.add('correct');
                showNotification('Not quite right. The correct answer is highlighted.', 'info');
            }
            
            // Show next button
            if (nextButton) {
                nextButton.classList.remove('hidden');
            }
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
            
            // Stop all other players
            playButtons.forEach(btn => {
                btn.classList.remove('playing');
                btn.innerHTML = '<span>▶</span>';
            });
            
            if (!isPlaying) {
                this.classList.add('playing');
                this.innerHTML = '<span>⏸</span>';
                
                // Simulate audio playback
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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    // Set colors based on type
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
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
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function addToFavorites(locationName) {
    showNotification(`Added "${locationName}" to your favorites!`, 'success');
    
    // In a real app, this would save to user's profile
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(locationName)) {
        favorites.push(locationName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Button click handlers for navigation
document.addEventListener('click', function(e) {
    // Handle dashboard navigation
    if (e.target.id === 'communityBtn') {
        if (isAuthenticated) {
            window.location.href = 'dashboard.html';
        } else {
            showNotification('Please login to access the community dashboard', 'info');
        }
    }
    
    if (e.target.id === 'cultureBtn') {
        if (isAuthenticated) {
            window.location.href = 'premium.html';
        } else {
            showNotification('Please login to access premium content', 'info');
        }
    }
    
    if (e.target.id === 'heroExploreBtn') {
        document.querySelector('#destinations').scrollIntoView({ behavior: 'smooth' });
    }
});

// Initialize user session on page load
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
window.TunisiaLoversClub = {
    showNotification,
    addToFavorites,
    switchSection: switchSection || function() {},
    currentUser,
    isAuthenticated
};