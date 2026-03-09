// ========================================
// AUTHENTICATION
// ========================================

function switchTab(event, tab) {
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Update forms
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(`${tab}-form`).classList.add('active');
}

// Login form handler
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Simulate login
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    // Store user session (simple localStorage for demo)
    localStorage.setItem('user', JSON.stringify({
        email: email,
        name: email.split('@')[0],
        loggedIn: true
    }));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});

// Register form handler
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

    // Validate passwords
    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }

    // Store user session
    localStorage.setItem('user', JSON.stringify({
        email: email,
        name: name,
        loggedIn: true
    }));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});

// Check if user is already logged in
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.loggedIn && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
});

// ========================================
// SOCIAL AUTHENTICATION (PLACEHOLDERS)
// ========================================

/**
 * Handles the redirection and storing of user data after a successful social login.
 * @param {object} userData - The user data from the social provider.
 * @param {string} userData.name - The user's name.
 * @param {string} userData.email - The user's email.
 */
function handleSocialLoginSuccess(userData) {
    localStorage.setItem('user', JSON.stringify({
        name: userData.name,
        email: userData.email,
        loggedIn: true
    }));
    window.location.href = 'dashboard.html';
}

/**
 * Placeholder for Google login.
 * This function needs to be connected to a "Login with Google" button.
 * You will need to set up a Google Cloud project and get a Client ID.
 *
 * Example HTML:
 * <button type="button" onclick="loginWithGoogle()">Login with Google</button>
 */
function loginWithGoogle() {
    // SIMULATION : Connexion Google simulée pour la démonstration
    console.log('Tentative de connexion Google...');
    
    setTimeout(() => {
        handleSocialLoginSuccess({
            name: 'Utilisateur Google',
            email: 'google.user@example.com'
        });
    }, 800);
}

/**
 * Placeholder for Facebook login.
 * This function needs to be connected to a "Login with Facebook" button.
 * You will need to set up a Facebook for Developers App and get an App ID.
 *
 * Example HTML:
 * <button type="button" onclick="loginWithFacebook()">Login with Facebook</button>
 */
function loginWithFacebook() {
    // SIMULATION : Connexion Facebook simulée pour la démonstration
    console.log('Tentative de connexion Facebook...');
    
    setTimeout(() => {
        handleSocialLoginSuccess({
            name: 'Utilisateur Facebook',
            email: 'facebook.user@example.com'
        });
    }, 800);
}
