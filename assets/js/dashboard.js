// ========================================
// DASHBOARD INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.loggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
        userNameEl.textContent = user.name || 'Utilisateur';
    }
    
    // Load user stats (from localStorage for demo)
    loadUserStats();
    
    // Mobile menu toggle
    createMobileMenuToggle();
});

// ========================================
// LOGOUT FUNCTION
// ========================================

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// ========================================
// LOAD USER STATS
// ========================================

function loadUserStats() {
    const stats = JSON.parse(localStorage.getItem('userStats')) || {
        invoices: 0,
        cvs: 0,
        downloads: 0
    };
    
    // Update stats display
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards.length >= 3) {
        statCards[0].textContent = stats.invoices;
        statCards[1].textContent = stats.cvs;
        statCards[2].textContent = stats.downloads;
    }
}

// ========================================
// UPDATE USER STATS
// ========================================

function updateStats(type) {
    const stats = JSON.parse(localStorage.getItem('userStats')) || {
        invoices: 0,
        cvs: 0,
        downloads: 0
    };
    
    if (type === 'invoice') {
        stats.invoices++;
    } else if (type === 'cv') {
        stats.cvs++;
    }
    
    stats.downloads++;
    
    localStorage.setItem('userStats', JSON.stringify(stats));
}

// ========================================
// MOBILE MENU
// ========================================

function createMobileMenuToggle() {
    if (window.innerWidth <= 1024) {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(toggle);
        
        toggle.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Recreate toggle on resize
window.addEventListener('resize', () => {
    const existingToggle = document.querySelector('.mobile-menu-toggle');
    if (existingToggle) {
        existingToggle.remove();
    }
    createMobileMenuToggle();
});
