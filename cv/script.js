
// ========================================
// CV GENERATOR - JAVASCRIPT
// ========================================

// Global variables
let experienceCount = 0;
let educationCount = 0;
let projectCount = 0;
let cvPhotoBase64 = null;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 CV Generator initialized');
    
    // Check authentication
    checkAuth();
    
    // Add initial items
    addExperience();
    addEducation();
    
    // Setup listeners
    setupFormListeners();
    
    // Update preview
    updatePreview();
});

// ========================================
// AUTHENTICATION CHECK
// ========================================

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.loggedIn) {
        window.location.href = '../login.html';
    }
}

// ========================================
// FORM LISTENERS
// ========================================

function setupFormListeners() {
    // All text inputs
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    // Color picker
    document.getElementById('cv-color').addEventListener('input', updatePreview);
    
    // Photo upload
    document.getElementById('cv-photo').addEventListener('change', handlePhotoUpload);
}

// ========================================
// PHOTO HANDLING
// ========================================

function togglePhotoOptions() {
    const checkbox = document.getElementById('cv-photo-toggle');
    const photoOptions = document.getElementById('photo-options');
    
    if (checkbox.checked) {
        photoOptions.style.display = 'block';
    } else {
        photoOptions.style.display = 'none';
        cvPhotoBase64 = null;
        document.getElementById('cv-photo').value = '';
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image');
        return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 2 MB');
        return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        cvPhotoBase64 = e.target.result;
        console.log('✅ Photo chargée');
    };
    reader.readAsDataURL(file);
}

// ========================================
// EXPERIENCE MANAGEMENT
// ========================================

function addExperience() {
    experienceCount++;
    const container = document.getElementById('experiences-container');
    
    const expDiv = document.createElement('div');
    expDiv.className = 'experience-item';
    expDiv.id = `experience-${experienceCount}`;
    expDiv.innerHTML = `
        <div class="item-header">
            <span class="item-number">Expérience #${experienceCount}</span>
            <button type="button" class="btn-remove" onclick="removeExperience(${experienceCount})">
                <i class="fas fa-trash"></i> Supprimer
            </button>
        </div>
        
        <div class="form-group">
            <label class="form-label">Titre du poste</label>
            <input type="text" class="form-input exp-title" placeholder="Développeur Full Stack" data-exp="${experienceCount}">
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Entreprise</label>
                <input type="text" class="form-input exp-company" placeholder="TechCorp" data-exp="${experienceCount}">
            </div>
            <div class="form-group">
                <label class="form-label">Période</label>
                <input type="text" class="form-input exp-period" placeholder="Jan 2020 - Présent" data-exp="${experienceCount}">
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Description et réalisations (une par ligne, commencer par •)</label>
            <textarea class="form-textarea exp-description" rows="4" placeholder="• Développé une application web avec React et Node.js
- Amélioré les performances de 40%
- Managé une équipe de 3 développeurs" data-exp="${experienceCount}"></textarea>
        </div>
    `;
    
    container.appendChild(expDiv);
    
    // Add listeners
    expDiv.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function removeExperience(id) {
    if (confirm('Supprimer cette expérience ?')) {
        const element = document.getElementById(`experience-${id}`);
        if (element) {
            element.remove();
            updatePreview();
        }
    }
}

function getExperiences() {
    const experiences = [];
    const items = document.querySelectorAll('.experience-item');
    
    items.forEach(item => {
        const title = item.querySelector('.exp-title')?.value.trim();
        const company = item.querySelector('.exp-company')?.value.trim();
        const period = item.querySelector('.exp-period')?.value.trim();
        const description = item.querySelector('.exp-description')?.value.trim();
        
        if (title || company || period || description) {
            experiences.push({ title, company, period, description });
        }
    });
    
    return experiences;
}

// ========================================
// EDUCATION MANAGEMENT
// ========================================

function addEducation() {
    educationCount++;
    const container = document.getElementById('education-container');
    
    const eduDiv = document.createElement('div');
    eduDiv.className = 'education-item';
    eduDiv.id = `education-${educationCount}`;
    eduDiv.innerHTML = `
        <div class="item-header">
            <span class="item-number">Formation #${educationCount}</span>
            <button type="button" class="btn-remove" onclick="removeEducation(${educationCount})">
                <i class="fas fa-trash"></i> Supprimer
            </button>
        </div>
        
        <div class="form-group">
            <label class="form-label">Diplôme</label>
            <input type="text" class="form-input edu-degree" placeholder="Master en Informatique" data-edu="${educationCount}">
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">École / Université</label>
                <input type="text" class="form-input edu-school" placeholder="Université Paris-Saclay" data-edu="${educationCount}">
            </div>
            <div class="form-group">
                <label class="form-label">Période</label>
                <input type="text" class="form-input edu-period" placeholder="2018 - 2020" data-edu="${educationCount}">
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Description (optionnel)</label>
            <textarea class="form-textarea edu-description" rows="2" placeholder="Spécialisation en développement web et IA" data-edu="${educationCount}"></textarea>
        </div>
    `;
    
    container.appendChild(eduDiv);
    
    // Add listeners
    eduDiv.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function removeEducation(id) {
    if (confirm('Supprimer cette formation ?')) {
        const element = document.getElementById(`education-${id}`);
        if (element) {
            element.remove();
            updatePreview();
        }
    }
}

function getEducation() {
    const education = [];
    const items = document.querySelectorAll('.education-item');
    
    items.forEach(item => {
        const degree = item.querySelector('.edu-degree')?.value.trim();
        const school = item.querySelector('.edu-school')?.value.trim();
        const period = item.querySelector('.edu-period')?.value.trim();
        const description = item.querySelector('.edu-description')?.value.trim();
        
        if (degree || school || period) {
            education.push({ degree, school, period, description });
        }
    });
    
    return education;
}

// ========================================
// PROJECT MANAGEMENT
// ========================================

function addProject() {
    projectCount++;
    const container = document.getElementById('projects-container');
    
    const projDiv = document.createElement('div');
    projDiv.className = 'project-item';
    projDiv.id = `project-${projectCount}`;
    projDiv.innerHTML = `
        <div class="item-header">
            <span class="item-number">Projet #${projectCount}</span>
            <button type="button" class="btn-remove" onclick="removeProject(${projectCount})">
                <i class="fas fa-trash"></i> Supprimer
            </button>
        </div>
        
        <div class="form-group">
            <label class="form-label">Nom du projet</label>
            <input type="text" class="form-input proj-title" placeholder="Application E-commerce" data-proj="${projectCount}">
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Période</label>
                <input type="text" class="form-input proj-period" placeholder="Mars 2023 - Juin 2023" data-proj="${projectCount}">
            </div>
            <div class="form-group">
                <label class="form-label">Contexte</label>
                <input type="text" class="form-input proj-context" placeholder="Projet personnel / Client / Open Source" data-proj="${projectCount}">
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Technologies utilisées</label>
            <input type="text" class="form-input proj-tech" placeholder="React, Node.js, MongoDB, Docker" data-proj="${projectCount}">
        </div>
        
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea proj-description" rows="2" placeholder="Plateforme e-commerce complète avec panier, paiement et gestion des commandes" data-proj="${projectCount}"></textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">Réalisations clés (une par ligne, commencer par •)</label>
            <textarea class="form-textarea proj-achievements" rows="3" placeholder="• Développé un système de recommandation personnalisé
- Intégré plusieurs passerelles de paiement
- Optimisé pour supporter 10 000+ utilisateurs simultanés" data-proj="${projectCount}"></textarea>
        </div>
    `;
    
    container.appendChild(projDiv);
    
    // Add listeners
    projDiv.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function removeProject(id) {
    if (confirm('Supprimer ce projet ?')) {
        const element = document.getElementById(`project-${id}`);
        if (element) {
            element.remove();
            updatePreview();
        }
    }
}

function getProjects() {
    const projects = [];
    const items = document.querySelectorAll('.project-item');
    
    items.forEach(item => {
        const title = item.querySelector('.proj-title')?.value.trim();
        const period = item.querySelector('.proj-period')?.value.trim();
        const context = item.querySelector('.proj-context')?.value.trim();
        const technologies = item.querySelector('.proj-tech')?.value.trim();
        const description = item.querySelector('.proj-description')?.value.trim();
        const achievements = item.querySelector('.proj-achievements')?.value.trim();
        
        if (title) {
            projects.push({ title, period, context, technologies, description, achievements });
        }
    });
    
    return projects;
}

// ========================================
// PREVIEW UPDATE
// ========================================

function updatePreview() {
    // Get color
    const color = document.getElementById('cv-color').value;
    
    // Update CSS variables
    document.documentElement.style.setProperty('--cv-primary-color', color);
    
    // Header
    document.getElementById('preview-name').textContent = 
        document.getElementById('cv-name').value.toUpperCase() || 'VOTRE NOM';
    
    document.getElementById('preview-title').textContent = 
        document.getElementById('cv-title').value || 'Titre professionnel';
    
    document.getElementById('preview-email').textContent = 
        document.getElementById('cv-email').value;
    
    document.getElementById('preview-phone').textContent = 
        document.getElementById('cv-phone').value;
    
    document.getElementById('preview-city').textContent = 
        document.getElementById('cv-city').value;
    
    document.getElementById('preview-linkedin').textContent = 
        document.getElementById('cv-linkedin').value;
    
    document.getElementById('preview-website').textContent = 
        document.getElementById('cv-website').value;
    
    // Summary
    const summary = document.getElementById('cv-summary').value;
    const summarySection = document.getElementById('summary-section');
    if (summary) {
        document.getElementById('preview-summary').textContent = summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
    
    // Experiences
    const experiences = getExperiences();
    const expPreview = document.getElementById('preview-experiences');
    const expSection = document.getElementById('experience-section');
    
    if (experiences.length > 0) {
        expPreview.innerHTML = experiences.map(exp => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <div class="cv-item-title">${exp.title}</div>
                    <div class="cv-item-period">${exp.period}</div>
                </div>
                <div class="cv-item-subtitle">${exp.company}</div>
                <div class="cv-item-description">
                    ${formatBulletPoints(exp.description)}
                </div>
            </div>
        `).join('');
        expSection.style.display = 'block';
    } else {
        expSection.style.display = 'none';
    }
    
    // Education
    const education = getEducation();
    const eduPreview = document.getElementById('preview-education');
    const eduSection = document.getElementById('education-section');
    
    if (education.length > 0) {
        eduPreview.innerHTML = education.map(edu => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <div class="cv-item-title">${edu.degree}</div>
                    <div class="cv-item-period">${edu.period}</div>
                </div>
                <div class="cv-item-subtitle">${edu.school}</div>
                ${edu.description ? `<div class="cv-item-description">${edu.description}</div>` : ''}
            </div>
        `).join('');
        eduSection.style.display = 'block';
    } else {
        eduSection.style.display = 'none';
    }
    
    // Projects
    const projects = getProjects();
    const projPreview = document.getElementById('preview-projects');
    const projSection = document.getElementById('projects-section');
    
    if (projects.length > 0) {
        projPreview.innerHTML = projects.map(proj => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <div class="cv-item-title">${proj.title}</div>
                    <div class="cv-item-period">${proj.period}</div>
                </div>
                ${proj.context ? `<div style="color: #718096; font-size: 0.9rem; margin-bottom: 0.5rem;">${proj.context}</div>` : ''}
                ${proj.technologies ? `<div style="color: #667eea; font-weight: 600; margin-bottom: 0.5rem;">Technologies: ${proj.technologies}</div>` : ''}
                ${proj.description ? `<div class="cv-item-description">${proj.description}</div>` : ''}
                ${proj.achievements ? `<div class="cv-item-description">${formatBulletPoints(proj.achievements)}</div>` : ''}
            </div>
        `).join('');
        projSection.style.display = 'block';
    } else {
        projSection.style.display = 'none';
    }
    
    // Skills
    const skillsLanguages = document.getElementById('cv-skills-languages').value;
    const skillsFrameworks = document.getElementById('cv-skills-frameworks').value;
    const skillsTools = document.getElementById('cv-skills-tools').value;
    const skillsMethods = document.getElementById('cv-skills-methods').value;
    
    const skillsPreview = document.getElementById('preview-skills');
    const skillsSection = document.getElementById('skills-section');
    
    let skillsHTML = '<div class="skills-grid">';
    
    if (skillsLanguages) {
        skillsHTML += `<div class="skill-category"><strong>Langages:</strong> ${skillsLanguages}</div>`;
    }
    if (skillsFrameworks) {
        skillsHTML += `<div class="skill-category"><strong>Frameworks & Bibliothèques:</strong> ${skillsFrameworks}</div>`;
    }
    if (skillsTools) {
        skillsHTML += `<div class="skill-category"><strong>Outils & Technologies:</strong> ${skillsTools}</div>`;
    }
    if (skillsMethods) {
        skillsHTML += `<div class="skill-category"><strong>Méthodologies:</strong> ${skillsMethods}</div>`;
    }
    
    skillsHTML += '</div>';
    
    if (skillsLanguages || skillsFrameworks || skillsTools || skillsMethods) {
        skillsPreview.innerHTML = skillsHTML;
        skillsSection.style.display = 'block';
    } else {
        skillsSection.style.display = 'none';
    }
    
    // Languages
    const languages = document.getElementById('cv-languages').value;
    const langSection = document.getElementById('languages-section');
    if (languages) {
        document.getElementById('preview-languages').textContent = languages;
        langSection.style.display = 'block';
    } else {
        langSection.style.display = 'none';
    }
    
    // Certifications
    const certifications = document.getElementById('cv-certifications').value;
    const certSection = document.getElementById('certifications-section');
    if (certifications) {
        document.getElementById('preview-certifications').textContent = certifications;
        certSection.style.display = 'block';
    } else {
        certSection.style.display = 'none';
    }
    
    // Apply color to elements
    const colorElements = document.querySelectorAll('.cv-header h2, .cv-header, .cv-item-subtitle, .skill-category strong');
    colorElements.forEach(el => {
        if (el.classList.contains('cv-header')) {
            el.style.borderBottomColor = color;
        } else {
            el.style.color = color;
        }
    });
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function formatBulletPoints(text) {
    if (!text) return '';
    
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return '';
    
    // Check if already has bullet points
    const hasBullets = lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
    
    if (hasBullets) {
        return '<ul>' + lines.map(line => {
            const cleaned = line.trim().replace(/^[•\-]\s*/, '');
            return `<li>${cleaned}</li>`;
        }).join('') + '</ul>';
    } else {
        return text;
    }
}

// ========================================
// PREVIEW MODAL
// ========================================

function openFullPreview() {
    const modal = document.getElementById('preview-modal');
    const modalBody = document.getElementById('preview-modal-body');
    
    const previewContent = document.querySelector('.cv-preview-content').cloneNode(true);
    modalBody.innerHTML = '';
    modalBody.appendChild(previewContent);
    
    modal.classList.add('active');
}

function closeFullPreview() {
    const modal = document.getElementById('preview-modal');
    modal.classList.remove('active');
}

// Close on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFullPreview();
    }
});

// ========================================
// PDF GENERATION
// ========================================

function generateCVPDF() {
    console.log('🎨 Génération du PDF...');
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Get data
    const color = document.getElementById('cv-color').value;
    const font = document.getElementById('cv-font').value || 'Helvetica';
    const rgb = hexToRgb(color);
    
    const name = document.getElementById('cv-name').value.toUpperCase() || 'VOTRE NOM';
    const title = document.getElementById('cv-title').value || 'Titre professionnel';
    const email = document.getElementById('cv-email').value;
    const phone = document.getElementById('cv-phone').value;
    const city = document.getElementById('cv-city').value;
    const linkedin = document.getElementById('cv-linkedin').value;
    const website = document.getElementById('cv-website').value;
    const summary = document.getElementById('cv-summary').value;
    
    let yPos = 20;
    
    // Header
    doc.setFont(font, 'bold');
    doc.setFontSize(24);
    doc.setTextColor(26, 32, 44);
    doc.text(name, 105, yPos, { align: 'center' });
    yPos += 8;
    
    doc.setFontSize(14);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.text(title, 105, yPos, { align: 'center' });
    yPos += 8;
    
    // Contact
    doc.setFont(font, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(74, 85, 104);
    
    const contactInfo = [email, phone, city].filter(Boolean).join(' • ');
    if (contactInfo) {
        doc.text(contactInfo, 105, yPos, { align: 'center' });
        yPos += 5;
    }
    
    const links = [linkedin, website].filter(Boolean).join(' • ');
    if (links) {
        doc.setTextColor(rgb.r, rgb.g, rgb.b);
        doc.text(links, 105, yPos, { align: 'center' });
        yPos += 5;
    }
    
    // Line
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(1);
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    // Summary
    if (summary) {
        yPos = addSection(doc, 'RÉSUMÉ PROFESSIONNEL', yPos, font, rgb);
        doc.setFont(font, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(74, 85, 104);
        const summaryLines = doc.splitTextToSize(summary, 170);
        doc.text(summaryLines, 20, yPos);
        yPos += summaryLines.length * 5 + 5;
    }
    
    // Experience
    const experiences = getExperiences();
    if (experiences.length > 0) {
        yPos = checkPageBreak(doc, yPos, 40);
        yPos = addSection(doc, 'EXPÉRIENCE PROFESSIONNELLE', yPos, font, rgb);
        
        experiences.forEach((exp, index) => {
            yPos = checkPageBreak(doc, yPos, 30);
            
            // Title and period
            doc.setFont(font, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(26, 32, 44);
            doc.text(exp.title, 20, yPos);
            
            doc.setFont(font, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(113, 128, 150);
            doc.text(exp.period, 190, yPos, { align: 'right' });
            yPos += 5;
            
            // Company
            doc.setFont(font, 'bold');
            doc.setFontSize(10);
            doc.setTextColor(rgb.r, rgb.g, rgb.b);
            doc.text(exp.company, 20, yPos);
            yPos += 5;
            
            // Description
            if (exp.description) {
                doc.setFont(font, 'normal');
                doc.setTextColor(74, 85, 104);
                const bullets = exp.description.split('\n').filter(b => b.trim());
                bullets.forEach(bullet => {
                    yPos = checkPageBreak(doc, yPos, 10);
                    const cleaned = bullet.trim().replace(/^[•\-]\s*/, '');
                    const lines = doc.splitTextToSize('• ' + cleaned, 165);
                    doc.text(lines, 25, yPos);
                    yPos += lines.length * 5;
                });
            }
            
            yPos += 3;
        });
    }
    
    // Education
    const education = getEducation();
    if (education.length > 0) {
        yPos = checkPageBreak(doc, yPos, 40);
        yPos = addSection(doc, 'FORMATION', yPos, font, rgb);
        
        education.forEach(edu => {
            yPos = checkPageBreak(doc, yPos, 20);
            
            // Degree and period
            doc.setFont(font, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(26, 32, 44);
            doc.text(edu.degree, 20, yPos);
            
            doc.setFont(font, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(113, 128, 150);
            doc.text(edu.period, 190, yPos, { align: 'right' });
            yPos += 5;
            
            // School
            doc.setFont(font, 'bold');
            doc.setFontSize(10);
            doc.setTextColor(rgb.r, rgb.g, rgb.b);
            doc.text(edu.school, 20, yPos);
            yPos += 5;
            
            // Description
            if (edu.description) {
                doc.setFont(font, 'normal');
                doc.setTextColor(74, 85, 104);
                const lines = doc.splitTextToSize(edu.description, 170);
                doc.text(lines, 20, yPos);
                yPos += lines.length * 5;
            }
            
            yPos += 3;
        });
    }
    
    // Projects
    const projects = getProjects();
    if (projects.length > 0) {
        yPos = checkPageBreak(doc, yPos, 40);
        yPos = addSection(doc, 'PROJETS CLÉS', yPos, font, rgb);
        
        projects.forEach(proj => {
            yPos = checkPageBreak(doc, yPos, 30);
            
            // Title and period
            doc.setFont(font, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(26, 32, 44);
            doc.text(proj.title, 20, yPos);
            
            if (proj.period) {
                doc.setFont(font, 'normal');
                doc.setFontSize(10);
                doc.setTextColor(113, 128, 150);
                doc.text(proj.period, 190, yPos, { align: 'right' });
            }
            yPos += 5;
            
            // Context
            if (proj.context) {
                doc.setFont(font, 'normal');
                doc.setTextColor(113, 128, 150);
                doc.text(proj.context, 20, yPos);
                yPos += 5;
            }
            
            // Technologies
            if (proj.technologies) {
                doc.setFont(font, 'bold');
                doc.setTextColor(rgb.r, rgb.g, rgb.b);
                doc.text('Technologies: ', 20, yPos);
                doc.setFont(font, 'normal');
                doc.text(proj.technologies, 48, yPos);
                yPos += 5;
            }
            
            // Description
            if (proj.description) {
                doc.setFont(font, 'normal');
                doc.setTextColor(74, 85, 104);
                const lines = doc.splitTextToSize(proj.description, 170);
                doc.text(lines, 20, yPos);
                yPos += lines.length * 5;
            }
            
            // Achievements
            if (proj.achievements) {
                const bullets = proj.achievements.split('\n').filter(b => b.trim());
                bullets.forEach(bullet => {
                    yPos = checkPageBreak(doc, yPos, 10);
                    const cleaned = bullet.trim().replace(/^[•\-]\s*/, '');
                    const lines = doc.splitTextToSize('• ' + cleaned, 165);
                    doc.text(lines, 25, yPos);
                    yPos += lines.length * 5;
                });
            }
            
            yPos += 3;
        });
    }
    
    // Skills
    const skillsLanguages = document.getElementById('cv-skills-languages').value;
    const skillsFrameworks = document.getElementById('cv-skills-frameworks').value;
    const skillsTools = document.getElementById('cv-skills-tools').value;
    const skillsMethods = document.getElementById('cv-skills-methods').value;
    
    if (skillsLanguages || skillsFrameworks || skillsTools || skillsMethods) {
        yPos = checkPageBreak(doc, yPos, 40);
        yPos = addSection(doc, 'COMPÉTENCES TECHNIQUES', yPos, font, rgb);
        
        if (skillsLanguages) {
            doc.setFont(font, 'bold');
            doc.setTextColor(rgb.r, rgb.g, rgb.b);
            doc.text('Langages: ', 20, yPos);
            doc.setFont(font, 'normal');
            doc.setTextColor(74, 85, 104);
            doc.text(skillsLanguages, 45, yPos);
            yPos += 5;
        }
        
        if (skillsFrameworks) {
            yPos = checkPageBreak(doc, yPos, 10);
            doc.setFont(font, 'bold');
            doc.setTextColor(rgb.r, rgb.g, rgb.b);
            doc.text('Frameworks & Bibliothèques: ', 20, yPos);
            doc.setFont(font, 'normal');
            doc.setTextColor(74, 85, 104);
            doc.text(skillsFrameworks, 75, yPos);
            yPos += 5;
        }
        
        if (skillsTools) {
            yPos = checkPageBreak(doc, yPos, 10);
            doc.setFont(font, 'bold');
            doc.setTextColor(rgb.r, rgb.g, rgb.b);
            doc.text('Outils & Technologies: ', 20, yPos);
            doc.setFont(font, 'normal');
            doc.setTextColor(74, 85, 104);
            doc.text(skillsTools, 65, yPos);
            yPos += 5;
        }
        
        if (skillsMethods) {
            yPos = checkPageBreak(doc, yPos, 10);
            doc.setFont(font, 'bold');
            doc.setTextColor(rgb.r, rgb.g, rgb.b);
            doc.text('Méthodologies: ', 20, yPos);
            doc.setFont(font, 'normal');
            doc.setTextColor(74, 85, 104);
            doc.text(skillsMethods, 50, yPos);
            yPos += 5;
        }
    }
    
    // Languages
    const languages = document.getElementById('cv-languages').value;
    if (languages) {
        yPos = checkPageBreak(doc, yPos, 20);
        yPos = addSection(doc, 'LANGUES', yPos, font, rgb);
        doc.setFont(font, 'normal');
        doc.setTextColor(74, 85, 104);
        const lines = doc.splitTextToSize(languages, 170);
        doc.text(lines, 20, yPos);
        yPos += lines.length * 5;
    }
    
    // Certifications
    const certifications = document.getElementById('cv-certifications').value;
    if (certifications) {
        yPos = checkPageBreak(doc, yPos, 20);
        yPos = addSection(doc, 'CERTIFICATIONS', yPos, font, rgb);
        doc.setFont(font, 'normal');
        doc.setTextColor(74, 85, 104);
        const lines = doc.splitTextToSize(certifications, 170);
        doc.text(lines, 20, yPos);
    }
    
    // Save
    const fileName = `CV_${name.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
    doc.save(fileName);
    
    console.log('✅ PDF généré:', fileName);
    
    // Show notification
    showNotification('CV téléchargé avec succès ! 🎉', 'success');
    
    // Update stats
    updateStats('cv');
}

// ========================================
// PDF HELPERS
// ========================================

function addSection(doc, title, yPos, font, rgb) {
    doc.setFont(font, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(26, 32, 44);
    doc.text(title, 20, yPos);
    yPos += 2;
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 5;
    
    return yPos;
}

function checkPageBreak(doc, yPos, requiredSpace) {
    if (yPos + requiredSpace > 280) {
        doc.addPage();
        return 20;
    }
    return yPos;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 102, g: 126, b: 234 };
}

function updateStats(type) {
    const stats = JSON.parse(localStorage.getItem('userStats') || '{"invoices":0,"cvs":0,"downloads":0}');
    if (type === 'cv') {
        stats.cvs = (stats.cvs || 0) + 1;
    }
    stats.downloads = (stats.downloads || 0) + 1;
    localStorage.setItem('userStats', JSON.stringify(stats));
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
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
        transition: transform 0.3s ease;
    }
    .notification.show {
        transform: translateX(0);
    }
    .notification-success {
        border-left: 4px solid #22c55e;
    }
    .notification-success i {
        color: #22c55e;
        font-size: 1.5rem;
    }
`;
document.head.appendChild(notificationStyles);

console.log('✅ CV Generator ready');