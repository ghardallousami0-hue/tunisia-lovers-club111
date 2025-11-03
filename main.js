// Simple Tunisia Lovers Club - Working Version
console.log("Tunisia Lovers Club loaded!");

// Check if user is logged in
function checkLogin() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        console.log("User is logged in:", JSON.parse(user));
        return true;
    }
    return false;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded!");
    
    // Check current page
    const isDashboard = window.location.pathname.includes('dashboard');
    const isPremium = window.location.pathname.includes('premium');
    
    // If on dashboard or premium, check login
    if ((isDashboard || isPremium) && !checkLogin()) {
        showNotification('Please login first!', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    // Initialize based on page
    if (isDashboard) {
        initializeDashboard();
    } else if (isPremium) {
        initializePremium();
    } else {
        initializeHomepage();
    }
});

// Homepage functions
function initializeHomepage() {
    console.log("Initializing homepage...");
    
    // Typewriter effect
    if (document.getElementById('typed-text')) {
        try {
            new Typed('#typed-text', {
                strings: ['Discover Tunisia', 'Experience Culture', 'Join Our Community'],
                typeSpeed: 80,
                backSpeed: 60,
                loop: true
            });
        } catch (e) {
            console.log("Typed.js not loaded");
        }
    }

    // Initialize carousel
    if (document.getElementById('destinations-carousel')) {
        try {
            new Splide('#destinations-carousel', {
                type: 'loop',
                perPage: 3,
                gap: '2rem',
                breakpoints: {
                    768: { perPage: 1 },
                    1024: { perPage: 2 }
                }
            }).mount();
        } catch (e) {
            console.log("Splide not loaded");
        }
    }

    // Animate counters
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 50);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });

    // Setup authentication
    setupAuth();
}

// Authentication functions
function setupAuth() {
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const joinBtn = document.getElementById('joinBtn');
    const heroJoinBtn = document.getElementById('heroJoinBtn');
    const closeModal = document.getElementById('closeModal');
    const showLogin = document.getElementById('showLogin');
    const showSignup = document.getElementById('showSignup');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const submitLogin = document.getElementById('submitLogin');
    const submitSignup = document.getElementById('submitSignup');

    // Open modal functions
    function openModal() {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function openLogin() {
        openModal();
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }

    function openSignup() {
        openModal();
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }

    // Close modal
    function closeModalFunc() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Event listeners
    if (loginBtn) loginBtn.addEventListener('click', openLogin);
    if (joinBtn) joinBtn.addEventListener('click', openSignup);
    if (heroJoinBtn) heroJoinBtn.addEventListener('click', openSignup);
    if (closeModal) closeModal.addEventListener('click', closeModalFunc);
    
    // Switch between login/signup
    if (showLogin) showLogin.addEventListener('click', openLogin);
    if (showSignup) showSignup.addEventListener('click', openSignup);

    // Form submissions
    if (submitLogin) {
        submitLogin.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    if (submitSignup) {
        submitSignup.addEventListener('click', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModalFunc();
        });
    }
}

// Handle login
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    showNotification('Logging in...', 'info');

    try {
        // Try Supabase login first
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // Success - get user profile
        const { data: profile, error: profileError } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        // Store user data
        const userData = {
            id: data.user.id,
            email: data.user.email,
            name: profile.full_name || data.user.email,
            experience_level: profile.experience_level,
            is_premium: profile.is_premium
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showNotification('Login successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please check your credentials.', 'error');
    }
}

// Handle signup
async function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const experienceLevel = document.getElementById('experienceLevel').value;

    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    showNotification('Creating your account...', 'info');

    try {
        // Create auth user
        const { data, error } = await window.supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) throw error;

        // Create profile
        const { error: profileError } = await window.supabase
            .from('profiles')
            .insert([
                { 
                    id: data.user.id,
                    full_name: name,
                    username: email.split('@')[0],
                    experience_level: experienceLevel,
                    is_premium: false
                }
            ]);

        if (profileError) throw profileError;

        // Store user data
        const userData = {
            id: data.user.id,
            email: data.user.email,
            name: name,
            experience_level: experienceLevel,
            is_premium: false
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showNotification('Account created successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Signup failed. Please try again.', 'error');
    }
}

// Dashboard functions
function initializeDashboard() {
    console.log("Initializing dashboard...");
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        // Update user info in sidebar
        const userName = document.getElementById('userName');
        const userLevel = document.getElementById('userLevel');
        const userInitials = document.getElementById('userInitials');
        
        if (userName) userName.textContent = user.name;
        if (userLevel) userLevel.textContent = user.experience_level;
        if (userInitials) userInitials.textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show section
            sections.forEach(sec => sec.classList.add('hidden'));
            document.getElementById(section + 'Section').classList.remove('hidden');
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            showNotification('Logged out successfully', 'info');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }

    // Chat functionality
    setupChat();
}

// Chat functions
function setupChat() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    if (!messageInput || !sendButton || !chatMessages) return;

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            
            // Add message to chat
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message own';
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-3">
                    <div class="user-avatar text-sm">${user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="font-semibold">${user.name} (You)</span>
                            <span class="text-xs text-gray-500">Just now</span>
                        </div>
                        <p class="text-gray-700">${message}</p>
                    </div>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
            messageInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate response
            setTimeout(() => {
                const responses = [
                    "That's amazing! I'd love to visit there too!",
                    "Thanks for sharing your experience!",
                    "Welcome to our community! 🎉",
                    "The culture there is truly beautiful!",
                    "Have you tried the local cuisine?"
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                
                const responseDiv = document.createElement('div');
                responseDiv.className = 'message';
                responseDiv.innerHTML = `
                    <div class="flex items-start space-x-3">
                        <div class="user-avatar text-sm">TA</div>
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="font-semibold">Tunisia Ambassador</span>
                                <span class="text-xs text-gray-500">Just now</span>
                            </div>
                            <p class="text-gray-700">${response}</p>
                        </div>
                    </div>
                `;
                
                chatMessages.appendChild(responseDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

// Premium page functions
function initializePremium() {
    console.log("Initializing premium page...");
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user.is_premium) {
        showNotification('Upgrade to premium to access all content!', 'info');
    }

    // Typewriter effect
    if (document.getElementById('premiumTyped')) {
        try {
            new Typed('#premiumTyped', {
                strings: ['Premium Content', 'Cultural Immersion', 'Expert Knowledge'],
                typeSpeed: 80,
                backSpeed: 60,
                loop: true
            });
        } catch (e) {
            console.log("Typed.js not loaded");
        }
    }

    // Back to dashboard
    const backBtn = document.getElementById('backToDashboard');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }

    // Upgrade to premium
    const upgradeBtn = document.getElementById('upgradePremium');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            showNotification('Premium upgrade feature coming soon!', 'info');
        });
    }
}

// Button handlers for navigation
document.addEventListener('click', function(e) {
    if (e.target.id === 'communityBtn' || e.target.id === 'cultureBtn') {
        if (checkLogin()) {
            window.location.href = 'dashboard.html';
        } else {
            showNotification('Please login to access the community', 'info');
            document.getElementById('loginBtn').click();
        }
    }
    
    if (e.target.id === 'heroExploreBtn') {
        document.querySelector('#destinations').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
});

// Fade in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});