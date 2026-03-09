// ========================================
// AUTHENTICATION SYSTEM - LOCAL STORAGE
// ========================================

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    init() {
        console.log('🔐 Initialisation du système d\'authentification...');
        
        // Check authentication status
        this.checkAuthStatus();
        
        // Setup forms
        this.setupLoginForm();
        this.setupRegisterForm();
        this.setupForgotPassword();
        
        // Setup password strength
        this.setupPasswordStrength();
        
        console.log('✅ Système d\'authentification prêt');
    }
    
    // ========================================
    // AUTH STATUS CHECK
    // ========================================
    
    checkAuthStatus() {
        this.currentUser = this.getCurrentUser();
        const currentPage = window.location.pathname;
        
        // Redirect if already logged in
        if (this.currentUser && this.currentUser.loggedIn) {
            if (currentPage.includes('login.html')) {
                console.log('👤 Utilisateur déjà connecté, redirection...');
                window.location.href = 'dashboard.html';
                return;
            }
        }
        
        // Redirect if not logged in
        if (!this.currentUser || !this.currentUser.loggedIn) {
            if (currentPage.includes('dashboard.html')) {
                console.log('⚠️ Non authentifié, redirection vers login...');
                window.location.href = 'login.html';
                return;
            }
        }
        
        // Display user info in console
        if (this.currentUser) {
            console.log('👤 Utilisateur connecté:', this.currentUser.name);
        }
    }
    
    getCurrentUser() {
        try {
            const userData = localStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('❌ Erreur lecture utilisateur:', error);
            return null;
        }
    }
    
    // ========================================
    // LOGIN FORM
    // ========================================
    
    setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;
        
        console.log('📝 Configuration du formulaire de connexion');
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Clear previous errors
            this.clearInputErrors([emailInput, passwordInput]);
            
            // Validation
            if (!email) {
                this.showInputError(emailInput, 'L\'email est requis');
                return;
            }
            
            if (!this.validateEmail(email)) {
                this.showInputError(emailInput, 'Email invalide');
                return;
            }
            
            if (!password) {
                this.showInputError(passwordInput, 'Le mot de passe est requis');
                return;
            }
            
            if (password.length < 6) {
                this.showInputError(passwordInput, 'Minimum 6 caractères');
                return;
            }
            
            // Show loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, true);
            
            // Simulate API delay
            await this.delay(800);
            
            // Check credentials
            const users = this.getUsers();
            const user = users.find(u => 
                u.email.toLowerCase() === email.toLowerCase() && 
                u.password === this.hashPassword(password)
            );
            
            if (user) {
                console.log('✅ Connexion réussie:', user.email);
                this.loginUser(user);
            } else {
                this.setButtonLoading(submitBtn, false);
                this.showNotification('Email ou mot de passe incorrect', 'error');
                this.showInputError(passwordInput, 'Identifiants incorrects');
            }
        });
    }
    
    // ========================================
    // REGISTER FORM
    // ========================================
    
    setupRegisterForm() {
        const registerForm = document.getElementById('register-form');
        if (!registerForm) return;
        
        console.log('📝 Configuration du formulaire d\'inscription');
        
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = registerForm.querySelector('input[type="text"]');
            const emailInput = registerForm.querySelector('input[type="email"]');
            const passwordInputs = registerForm.querySelectorAll('input[type="password"]');
            const passwordInput = passwordInputs[0];
            const confirmPasswordInput = passwordInputs[1];
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            // Clear previous errors
            this.clearInputErrors([nameInput, emailInput, passwordInput, confirmPasswordInput]);
            
            // Validation
            let hasError = false;
            
            if (!name || name.length < 2) {
                this.showInputError(nameInput, 'Nom invalide (min. 2 caractères)');
                hasError = true;
            }
            
            if (!email) {
                this.showInputError(emailInput, 'L\'email est requis');
                hasError = true;
            } else if (!this.validateEmail(email)) {
                this.showInputError(emailInput, 'Email invalide');
                hasError = true;
            }
            
            if (!password) {
                this.showInputError(passwordInput, 'Le mot de passe est requis');
                hasError = true;
            } else if (password.length < 6) {
                this.showInputError(passwordInput, 'Minimum 6 caractères');
                hasError = true;
            }
            
            if (!confirmPassword) {
                this.showInputError(confirmPasswordInput, 'Confirmez le mot de passe');
                hasError = true;
            } else if (password !== confirmPassword) {
                this.showInputError(confirmPasswordInput, 'Les mots de passe ne correspondent pas');
                hasError = true;
            }
            
            if (hasError) {
                this.showNotification('Veuillez corriger les erreurs', 'error');
                return;
            }
            
            // Check if user exists
            const users = this.getUsers();
            if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                this.showInputError(emailInput, 'Cet email est déjà utilisé');
                this.showNotification('Un compte existe déjà avec cet email', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, true);
            
            // Simulate API delay
            await this.delay(1000);
            
            // Create new user
            const newUser = {
                id: this.generateId(),
                name: name,
                email: email.toLowerCase(),
                password: this.hashPassword(password),
                createdAt: new Date().toISOString()
            };
            
            // Save user
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            console.log('✅ Nouveau compte créé:', newUser.email);
            
            // Login user
            this.loginUser(newUser);
        });
    }
    
    // ========================================
    // PASSWORD STRENGTH
    // ========================================
    
    setupPasswordStrength() {
        const registerPassword = document.getElementById('register-password');
        const strengthIndicator = document.getElementById('password-strength');
        
        if (!registerPassword || !strengthIndicator) return;
        
        registerPassword.addEventListener('input', function() {
            const password = this.value;
            
            if (password.length > 0) {
                strengthIndicator.classList.add('show');
                
                let strength = 0;
                
                // Length checks
                if (password.length >= 6) strength++;
                if (password.length >= 10) strength++;
                
                // Character variety
                if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
                if (/\d/.test(password)) strength++;
                if (/[^a-zA-Z\d]/.test(password)) strength++;
                
                const fill = strengthIndicator.querySelector('.strength-fill');
                const text = strengthIndicator.querySelector('.strength-text');
                
                // Reset classes
                fill.className = 'strength-fill';
                text.className = 'strength-text';
                
                // Apply strength class
                if (strength <= 2) {
                    fill.classList.add('weak');
                    text.classList.add('weak');
                    text.textContent = 'Faible';
                } else if (strength <= 3) {
                    fill.classList.add('medium');
                    text.classList.add('medium');
                    text.textContent = 'Moyen';
                } else {
                    fill.classList.add('strong');
                    text.classList.add('strong');
                    text.textContent = 'Fort';
                }
            } else {
                strengthIndicator.classList.remove('show');
            }
        });
    }
    
    // ========================================
    // LOGIN USER
    // ========================================
    
    loginUser(user) {
        // Create session
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            loggedIn: true,
            loginTime: new Date().toISOString()
        };
        
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(session));
        this.currentUser = session;
        
        // Show success
        this.showNotification(`Bienvenue ${user.name} ! 🎉`, 'success');
        
        // Update stats
        this.updateUserStats('login');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
    
    // ========================================
    // LOGOUT
    // ========================================
    
    static logout() {
        const confirm = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
        
        if (confirm) {
            console.log('👋 Déconnexion...');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    }
    
    // ========================================
    // FORGOT PASSWORD
    // ========================================
    
    setupForgotPassword() {
        const forgotLinks = document.querySelectorAll('a[href="#forgot"]');
        
        forgotLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const email = prompt('Entrez votre adresse email :');
                
                if (!email) return;
                
                if (!this.validateEmail(email)) {
                    this.showNotification('Email invalide', 'error');
                    return;
                }
                
                const users = this.getUsers();
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                
                if (user) {
                    // In a real app, send reset email
                    this.showNotification(
                        `✅ Instructions envoyées à ${email}`,
                        'success'
                    );
                    console.log('📧 Email de réinitialisation envoyé à:', email);
                } else {
                    // Don't reveal if email exists (security)
                    this.showNotification(
                        `Si un compte existe avec ${email}, vous recevrez un email`,
                        'info'
                    );
                }
            });
        });
    }
    
    // ========================================
    // USER MANAGEMENT
    // ========================================
    
    getUsers() {
        try {
            const users = localStorage.getItem('users');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('❌ Erreur lecture utilisateurs:', error);
            return [];
        }
    }
    
    updateUserStats(action) {
        const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
        
        if (!stats[action]) {
            stats[action] = 0;
        }
        
        stats[action]++;
        stats.lastAction = new Date().toISOString();
        
        localStorage.setItem('userStats', JSON.stringify(stats));
    }
    
    // ========================================
    // VALIDATION
    // ========================================
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    hashPassword(password) {
        // Simple hash for demo (use bcrypt in production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
    
    // ========================================
    // UI HELPERS
    // ========================================
    
    showInputError(input, message) {
        // Add error class
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentElement.parentElement.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        input.parentElement.parentElement.appendChild(errorDiv);
        
        // Add error styles if not exists
        if (!document.getElementById('form-error-styles')) {
            const styles = document.createElement('style');
            styles.id = 'form-error-styles';
            styles.textContent = `
                .form-input.error {
                    border-color: #ef4444 !important;
                }
                .form-error {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    clearInputErrors(inputs) {
        inputs.forEach(input => {
            input.classList.remove('error');
            const errorDiv = input.parentElement.parentElement.querySelector('.form-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        });
    }
    
    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('btn-loading');
            button.dataset.originalHtml = button.innerHTML;
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
            if (button.dataset.originalHtml) {
                button.innerHTML = button.dataset.originalHtml;
            }
        }
    }
    
    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.auth-notification');
        existing.forEach(n => n.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `auth-notification auth-notification-${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // ========================================
    // UTILITIES
    // ========================================
    
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ========================================
// NOTIFICATION STYLES
// ========================================

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .auth-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 300px;
        max-width: 500px;
    }
    
    .auth-notification.show {
        transform: translateX(0);
    }
    
    .auth-notification-success {
        border-left: 4px solid #22c55e;
    }
    
    .auth-notification-success i {
        color: #22c55e;
        font-size: 1.5rem;
    }
    
    .auth-notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .auth-notification-error i {
        color: #ef4444;
        font-size: 1.5rem;
    }
    
    .auth-notification-info {
        border-left: 4px solid #667eea;
    }
    
    .auth-notification-info i {
        color: #667eea;
        font-size: 1.5rem;
    }
    
    .auth-notification-warning {
        border-left: 4px solid #fbbf24;
    }
    
    .auth-notification-warning i {
        color: #fbbf24;
        font-size: 1.5rem;
    }
    
    .auth-notification span {
        color: #1a202c;
        font-weight: 500;
        flex: 1;
    }
    
    @media (max-width: 768px) {
        .auth-notification {
            left: 20px;
            right: 20px;
            min-width: auto;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// INITIALIZE
// ========================================

// Create auth instance
const authSystem = new AuthSystem();

// Export for global use
window.authSystem = authSystem;
window.logout = AuthSystem.logout;

// Export for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}

console.log('✅ Auth System v1.0 - Prêt à l\'emploi');