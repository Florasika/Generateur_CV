// ========================================
// AUTHENTICATION
// ========================================

function switchTab(tab) {
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
