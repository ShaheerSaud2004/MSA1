// Community JavaScript Functionality

// Auth Tab Switching
document.addEventListener('DOMContentLoaded', function() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            document.getElementById(targetTab + 'Form').classList.add('active');
        });
    });

    // Login Form Handler
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup Form Handler
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Check if user is logged in on all pages
    checkAuthStatus();

    // Logout handler (for all pages)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Check auth on dashboard pages
    const dashboardPages = ['dashboard.html', 'feed.html', 'events.html', 'messages.html', 
                           'groups.html', 'friends.html', 'directory.html', 'resources.html', 'study-groups.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (dashboardPages.includes(currentPage)) {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
        }
    }
});

// Get API base URL - handles both local and production
function getApiUrl(endpoint) {
    // Try multiple path strategies
    const paths = [];
    
    // Strategy 1: If in community folder, go up one level
    if (window.location.pathname.includes('/community/')) {
        paths.push(`../api/${endpoint}`);
    }
    
    // Strategy 2: Absolute path from root
    paths.push(`/api/${endpoint}`);
    
    // Strategy 3: Relative to current location
    paths.push(`api/${endpoint}`);
    
    // Return the first path (we'll try them in order if needed)
    return paths[0];
}

// Try multiple API paths if first one fails
async function fetchWithFallback(urls, options) {
    for (const url of urls) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            }
        } catch (error) {
            console.log(`Failed to fetch ${url}, trying next...`);
            continue;
        }
    }
    throw new Error('All API endpoints failed');
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    messageDiv.textContent = '';
    messageDiv.className = 'auth-message';

    try {
        // Use absolute path - Vercel API routes must be absolute from root
        const apiUrl = '/api/auth/login';
        console.log('Calling API:', apiUrl); // Debug log
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Response status:', response.status); // Debug log

        // Check if response is ok
        if (!response.ok) {
            // Try to get error message from response
            let errorData;
            try {
                errorData = await response.clone().json();
            } catch {
                const text = await response.clone().text();
                errorData = { error: text || `HTTP ${response.status}: ${response.statusText}` };
            }
            
            // Special handling for 405
            if (response.status === 405) {
                throw new Error('API endpoint not found or method not allowed. Make sure you are running "vercel dev" and the API routes are accessible.');
            }
            
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();
        console.log('Login response:', data); // Debug log

        if (data.success) {
            // Store user session
            localStorage.setItem('msa_user', JSON.stringify({
                ...data.user,
                token: data.token,
                expiresAt: data.expiresAt,
                loggedIn: true,
                timestamp: Date.now()
            }));

            messageDiv.textContent = 'Login successful! Redirecting...';
            messageDiv.className = 'auth-message success';
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            messageDiv.textContent = data.error || 'Invalid email or password. Please try again.';
            messageDiv.className = 'auth-message error';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Network error. Please check your connection and try again.';
        
        // More specific error messages
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Cannot connect to server. Make sure you are running "vercel dev" in the terminal.';
        } else if (error.message.includes('405') || error.message.includes('Method not allowed')) {
            errorMessage = 'API endpoint error. Make sure "vercel dev" is running and API routes are accessible at /api/auth/login';
        } else if (error.message.includes('HTTP error')) {
            errorMessage = error.message || 'Server error. Please try again later.';
        } else {
            errorMessage = error.message || errorMessage;
        }
        
        messageDiv.textContent = errorMessage;
        messageDiv.className = 'auth-message error';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    const formData = {
        firstName: document.getElementById('signupFirstName').value,
        lastName: document.getElementById('signupLastName').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value,
        year: document.getElementById('signupYear').value,
        major: document.getElementById('signupMajor').value
    };
    const messageDiv = document.getElementById('signupMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    messageDiv.textContent = '';
    messageDiv.className = 'auth-message';

    try {
        // Use absolute path - Vercel API routes must be absolute from root
        const apiUrl = '/api/auth/signup';
        console.log('Calling API:', apiUrl); // Debug log
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Response status:', response.status); // Debug log

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();
        console.log('Signup response:', data); // Debug log

        if (data.success) {
            // Store user session
            localStorage.setItem('msa_user', JSON.stringify({
                ...data.user,
                token: data.token,
                expiresAt: data.expiresAt,
                loggedIn: true,
                timestamp: Date.now()
            }));

            // Send welcome email via Formspree
            const emailContent = `Congratulations ${formData.firstName}! You've discovered our secret community section! 🎉

We haven't even shown this to the public yet - you're one of the first!

This is where we will (inshallah) have our community page:
- Group Chats (GC)
- Info Sections
- One-stop hub for everything MSA related
- Event RSVPs
- Member connections
- And much more!

Stay tuned for exciting updates as we build this out. You're part of something special!

Barakallahu feekum,
Rutgers MSA Team`;

            try {
                await fetch('https://formspree.io/f/meorpqjz', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        message: emailContent,
                        _subject: `🎉 Welcome to the Secret MSA Community Section!`,
                        _replyto: formData.email,
                        _autoresponse: emailContent
                    })
                });
                console.log('✅ Welcome email sent via Formspree');
            } catch (emailError) {
                console.error('⚠️ Failed to send welcome email:', emailError);
                // Continue anyway - signup is successful
            }

            // Show special message about secret community
            showSecretCommunityMessage(formData.firstName);
        } else {
            messageDiv.textContent = data.error || 'Error creating account. Please try again.';
            messageDiv.className = 'auth-message error';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        }
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Network error. Please check your connection and try again.';
        
        // More specific error messages
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Cannot connect to server. Make sure the API is running. If testing locally, ensure Vercel dev server is running.';
        } else if (error.message.includes('HTTP error')) {
            errorMessage = 'Server error. Please try again later.';
        }
        
        messageDiv.textContent = errorMessage;
        messageDiv.className = 'auth-message error';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
}

// Show Secret Community Message
function showSecretCommunityMessage(firstName) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'secret-community-modal';
    modal.innerHTML = `
        <div class="secret-community-content">
            <div class="secret-community-header">
                <i class="fas fa-star"></i>
                <h2>🎉 Welcome to the Secret Community Section!</h2>
            </div>
            <div class="secret-community-body">
                <p class="greeting">Assalamu Alaikum ${firstName}!</p>
                <p class="main-message">
                    You've discovered our <strong>secret community section</strong>! 
                    We haven't even shown this to the public yet - you're one of the first! 🎊
                </p>
                <div class="secret-features">
                    <p><strong>This is where we will (inshallah) have our community page:</strong></p>
                    <ul>
                        <li><i class="fas fa-comments"></i> Group Chats (GC)</li>
                        <li><i class="fas fa-info-circle"></i> Info Sections</li>
                        <li><i class="fas fa-home"></i> One-stop hub for everything MSA related</li>
                        <li><i class="fas fa-calendar-check"></i> Event RSVPs</li>
                        <li><i class="fas fa-users"></i> Member connections</li>
                        <li><i class="fas fa-plus-circle"></i> And much more!</li>
                    </ul>
                </div>
                <p class="stay-tuned">Stay tuned for exciting updates as we build this out. You're part of something special!</p>
                <p class="closing">Barakallahu feekum,<br><strong>Rutgers MSA Team</strong></p>
            </div>
            <div class="secret-community-footer">
                <button class="secret-community-btn" onclick="this.closest('.secret-community-modal').remove(); setTimeout(() => window.location.href = 'dashboard.html', 300);">
                    <i class="fas fa-arrow-right"></i> Continue to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Check Authentication Status
async function checkAuthStatus() {
    const user = localStorage.getItem('msa_user');
    if (user) {
        const userData = JSON.parse(user);
        
        // Check if session is still valid
        if (userData.expiresAt && Date.now() < userData.expiresAt && userData.loggedIn) {
            // Verify token with backend (optional - can skip for faster load)
            // If on landing page, show quick access or redirect
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname.endsWith('community/')) {
                // Show quick access or auto-redirect
                const quickAccess = document.getElementById('quickAccess');
                if (quickAccess) {
                    quickAccess.style.display = 'block';
                }
            }
            return true;
        } else {
            // Session expired
            localStorage.removeItem('msa_user');
        }
    } else {
        // Not logged in - if on any dashboard page, redirect to login
        const dashboardPages = ['dashboard.html', 'feed.html', 'events.html', 'messages.html', 
                               'groups.html', 'friends.html', 'directory.html', 'resources.html', 'study-groups.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (dashboardPages.includes(currentPage)) {
            window.location.href = 'index.html';
            return false;
        }
    }
    return false;
}

// Get current user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem('msa_user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
}

// Save post to backend (using track-click API for now)
async function savePostToBackend(postData) {
    try {
        await fetch('/api/track-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                section: 'community_feed',
                event: 'post_created',
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        });
    } catch (error) {
        console.error('Error saving post:', error);
    }
}

// Track event RSVP
async function trackEventRSVP(eventName, action) {
    try {
        await fetch('/api/track-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                section: 'events',
                event: eventName,
                album: action, // 'rsvp' or 'cancel'
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        });
    } catch (error) {
        console.error('Error tracking RSVP:', error);
    }
}

// Handle Logout
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('msa_user');
    window.location.href = 'index.html';
}

// Feed Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Like buttons
    const likeButtons = document.querySelectorAll('.action-btn');
    likeButtons.forEach(btn => {
        if (btn.innerHTML.includes('fa-heart')) {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('fas')) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                } else {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            });
        }
    });

    // RSVP buttons
    const rsvpButtons = document.querySelectorAll('.rsvp-btn');
    rsvpButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === 'RSVP') {
                this.textContent = 'RSVP\'d ✓';
                this.style.background = '#28a745';
            } else {
                this.textContent = 'RSVP';
                this.style.background = '';
            }
        });
    });

    // Add friend buttons
    const addFriendButtons = document.querySelectorAll('.add-friend-btn');
    addFriendButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === 'Add') {
                this.textContent = 'Sent';
                this.style.background = '#6c757d';
                this.disabled = true;
            }
        });
    });
});

// Search functionality
const searchInput = document.querySelector('.nav-search input');
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value;
            // TODO: Implement search
            console.log('Searching for:', query);
        }
    });
}

// Notification icon click
const notificationIcon = document.querySelector('.notifications-icon');
if (notificationIcon) {
    notificationIcon.addEventListener('click', function() {
        // TODO: Show notifications dropdown
        console.log('Show notifications');
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('dashboardSidebar');
    const toggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('mobileOverlay');
    
    if (sidebar && toggle) {
        sidebar.classList.toggle('mobile-open');
        const icon = toggle.querySelector('i');
        
        if (overlay) {
            overlay.classList.toggle('active');
        }
        
        if (icon) {
            if (sidebar.classList.contains('mobile-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
}

// Add mobile menu toggle event listener
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('mobileOverlay');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 968) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu on window resize if it becomes desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968) {
            const sidebar = document.getElementById('dashboardSidebar');
            const overlay = document.getElementById('mobileOverlay');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                if (overlay) overlay.classList.remove('active');
                const toggle = document.getElementById('mobileMenuToggle');
                if (toggle) {
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        }
    });
});

