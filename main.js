// Tunisia Lovers Club - Main JavaScript File
// REAL SUPABASE AUTH VERSION - NO AUTO LOGIN

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
    
    // Check if user is logged in with Supabase
    checkSupabaseAuth();
}

async function checkSupabaseAuth() {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (data.session && !error) {
            currentUser = data.session.user;
            isAuthenticated = true;
            console.log('User logged in:', currentUser.email);
            updateUIForAuthState(true);
        } else {
            console.log('No user logged in');
            updateUIForAuthState(false);
        }
    } catch (error) {
        console.log('Auth check failed:', error);
        updateUIForAuthState(false);
    }
}

function updateUIForAuthState(loggedIn) {
    const loginButtons = document.querySelectorAll('#loginBtn, #joinBtn');
    if (loginButtons.length > 0) {
        if (loggedIn) {
            loginButtons.forEach(btn => {
                btn.textContent = 'Dashboard';
                btn.onclick = () => window.location.href = 'dashboard.html';
            });
        } else {
            loginButtons.forEach(btn => {
                if (btn.id === 'loginBtn') {
                    btn.textContent = 'Login';
                    btn.onclick = () => openAuthModal('login');
                } else if (btn.id === 'joinBtn') {
                    btn.textContent = 'Join Club';
                    btn.onclick = () => openAuthModal('signup');
                }
            });
        }
    }
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
    
    function openAuthModal(type) {
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            if (type === 'login') {
                document.getElementById('loginForm').classList.remove('hidden');
                document.getElementById('signupForm').classList.add('hidden');
            } else {
                document.getElementById('signupForm').classList.remove('hidden');
                document.getElementById('loginForm').classList.add('hidden');
            }
        }
    }
    
    function openLogin() { openAuthModal('login'); }
    function openSignup() { openAuthModal('signup'); }
    
    // Event listeners
    if (loginBtn) loginBtn.addEventListener('click', openLogin);
    if (joinBtn) joinBtn.addEventListener('click', openSignup);
    if (heroJoinBtn) heroJoinBtn.addEventListener('click', openSignup);
    if (showLogin) showLogin.addEventListener('click', openLogin);
    if (showSignup) showSignup.addEventListener('click', openSignup);
    
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
    
    // REAL FORM SUBMISSIONS - REQUIRE EMAIL/PASSWORD
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        const loginButton = loginForm.querySelector('button');
        if (loginButton) {
            loginButton.addEventListener('click', async function(e) {
                e.preventDefault();
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
                
                if (!email || !password) {
                    showNotification('Please enter both email and password', 'error');
                    return;
                }
                
                await handleSupabaseLogin(email, password);
            });
        }
    }
    
    if (signupForm) {
        const signupButton = signupForm.querySelector('button');
        if (signupButton) {
            signupButton.addEventListener('click', async function(e) {
                e.preventDefault();
                const email = signupForm.querySelector('input[type="email"]').value;
                const password = signupForm.querySelector('input[type="password"]').value;
                const fullName = signupForm.querySelector('input[type="text"]').value;
                const experienceLevel = signupForm.querySelector('select').value;
                
                if (!email || !password || !fullName) {
                    showNotification('Please fill all required fields', 'error');
                    return;
                }
                
                await handleSupabaseSignup(email, password, fullName, experienceLevel);
            });
        }
    }
}

// REAL SUPABASE AUTH FUNCTIONS
async function handleSupabaseLogin(email, password) {
    showNotification('Logging in...', 'info');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            showNotification('Login failed: ' + error.message, 'error');
            return false;
        }
        
        currentUser = data.user;
        isAuthenticated = true;
        
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
        return true;
    } catch (error) {
        showNotification('Login error: ' + error.message, 'error');
        return false;
    }
}

async function handleSupabaseSignup(email, password, fullName, experienceLevel) {
    showNotification('Creating your account...', 'info');
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    experience_level: experienceLevel
                }
            }
        });
        
        if (error) {
            showNotification('Signup failed: ' + error.message, 'error');
            return false;
        }
        
        if (data.user) {
            showNotification('Account created! Please check your email for verification.', 'success');
            
            // Close modal
            document.getElementById('authModal').classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Clear form
            document.querySelector('#signupForm input[type="email"]').value = '';
            document.querySelector('#signupForm input[type="password"]').value = '';
            document.querySelector('#signupForm input[type="text"]').value = '';
        }
        
        return true;
    } catch (error) {
        showNotification('Signup error: ' + error.message, 'error');
        return false;
    }
}

async function handleSupabaseLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showNotification('Logout failed: ' + error.message, 'error');
            return;
        }
        
        currentUser = null;
        isAuthenticated = false;
        showNotification('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        showNotification('Logout error: ' + error.message, 'error');
    }
}

// ... [KEEP ALL YOUR OTHER FUNCTIONS THE SAME - counters, carousels, etc.]

// Dashboard Initialization - UPDATED FOR REAL AUTH
function initializeDashboard() {
    checkDashboardAuth();
    initializeSidebar();
    initializeChat();
    initializeMap();
    initializePhotoGallery();
    initializeEvents();
}

async function checkDashboardAuth() {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (!data.session || error) {
            showNotification('Please login to access dashboard', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        currentUser = data.session.user;
        isAuthenticated = true;
        
        // Update dashboard with user info
        updateDashboardUserInfo();
    } catch (error) {
        showNotification('Authentication error', 'error');
        window.location.href = 'index.html';
    }
}

function updateDashboardUserInfo() {
    const userNameElement = document.querySelector('.user-avatar + div .font-semibold');
    const userInitialsElement = document.querySelector('.user-avatar span');
    
    if (currentUser) {
        const fullName = currentUser.user_metadata?.full_name || 'Tunisia Explorer';
        const initials = getInitials(fullName);
        
        if (userNameElement) userNameElement.textContent = fullName;
        if (userInitialsElement) userInitialsElement.textContent = initials;
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
    
    // Logout functionality - UPDATED FOR SUPABASE
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleSupabaseLogout);
    }
}

// ... [KEEP ALL YOUR OTHER ORIGINAL FUNCTIONS EXACTLY THE SAME]

// EMERGENCY BUTTON FIXES - UPDATED TO REQUIRE AUTH
document.addEventListener('click', function(e) {
    const target = e.target;
    
    // COMMUNITY BUTTON
    if (target.id === 'communityBtn' || target.textContent.includes('Explore Community')) {
        e.preventDefault();
        if (isAuthenticated) {
            window.location.href = 'dashboard.html';
        } else {
            showNotification('Please login to access the community dashboard', 'info');
            openAuthModal('signup');
        }
        return;
    }
    
    // CULTURE/PREMIUM BUTTON
    if (target.id === 'cultureBtn' || target.textContent.includes('Explore Premium')) {
        e.preventDefault();
        if (isAuthenticated) {
            window.location.href = 'premium.html';
        } else {
            showNotification('Please login to access premium content', 'info');
            openAuthModal('signup');
        }
        return;
    }
    
    // EXPLORE BUTTON
    if (target.id === 'heroExploreBtn' || target.textContent.includes('Explore Tunisia')) {
        e.preventDefault();
        document.querySelector('#destinations').scrollIntoView({ behavior: 'smooth' });
        return;
    }
});

// Utility Functions (keep the same)
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
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
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ... [KEEP ALL YOUR OTHER ORIGINAL FUNCTIONS EXACTLY THE SAME]

// Export functions for global access
window.TunisiaLoversClub = {
    showNotification,
    currentUser,
    isAuthenticated
};