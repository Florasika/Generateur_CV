// ========================================
// EXCEL PARSER FOR INVOICE GENERATION
// ========================================

// This will be used in the invoice page
class ExcelParser {
    constructor() {
        this.data = null;
    }
    
    async parseFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Get first sheet
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    
                    // Convert to JSON
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                    
                    this.data = jsonData;
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
    
    validateInvoiceData(data) {
        // Required fields for invoice
        const requiredFields = [
            'client_name',
            'client_address',
            'description',
            'quantity',
            'price'
        ];
        
        const errors = [];
        
        data.forEach((row, index) => {
            requiredFields.forEach(field => {
                if (!row[field]) {
                    errors.push(`Ligne ${index + 2}: Champ "${field}" manquant`);
                }
            });
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    generateInvoicesFromData(data) {
        const invoices = [];
        
        // Group by invoice number or client
        const groupedData = this.groupByInvoice(data);
        
        groupedData.forEach(invoiceData => {
            const invoice = this.createInvoiceObject(invoiceData);
            invoices.push(invoice);
        });
        
        return invoices;
    }
    
    groupByInvoice(data) {
        const groups = {};
        
        data.forEach(row => {
            const key = row.invoice_number || row.client_name;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(row);
        });
        
        return Object.values(groups);
    }
    
    createInvoiceObject(rows) {
        const firstRow = rows[0];
        
        return {
            invoiceNumber: firstRow.invoice_number || this.generateInvoiceNumber(),
            date: firstRow.date || new Date().toISOString().split('T')[0],
            client: {
                name: firstRow.client_name,
                address: firstRow.client_address,
                zip: firstRow.client_zip || '',
                city: firstRow.client_city || ''
            },
            items: rows.map(row => ({
                type: row.type || 'Service',
                description: row.description,
                quantity: parseFloat(row.quantity) || 1,
                price: parseFloat(row.price) || 0
            })),
            notes: firstRow.notes || ''
        };
    }
    
    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000);
        return `${year}${month}-${random}`;
    }
    
    downloadTemplate() {
        // Create sample Excel template
        const templateData = [
            {
                invoice_number: '2024-001',
                date: '2024-01-15',
                client_name: 'Client Example',
                client_address: '123 Rue Example',
                client_zip: '75001',
                client_city: 'Paris',
                type: 'Service',
                description: 'Développement web',
                quantity: 10,
                price: 50,
                notes: 'Merci pour votre confiance'
            }
        ];
        
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Factures');
        
        XLSX.writeFile(wb, 'template_factures.xlsx');
    }
}

// ========================================
// EXCEL IMPORT UI
// ========================================

function createExcelImportUI() {
    return `
        <div class="excel-import-section">
            <h3>Import depuis Excel</h3>
            <p class="help-text">Générez plusieurs factures en important un fichier Excel</p>
            
            <div class="import-actions">
                <button class="btn btn-secondary" onclick="excelParser.downloadTemplate()">
                    <i class="fas fa-download"></i>
                    Télécharger le modèle
                </button>
                
                <label class="btn btn-primary" style="cursor: pointer;">
                    <i class="fas fa-file-upload"></i>
                    Importer Excel
                    <input type="file" 
                           id="excel-file-input" 
                           accept=".xlsx,.xls" 
                           style="display: none;"
                           onchange="handleExcelImport(event)">
                </label>
            </div>
            
            <div id="import-preview" style="display: none; margin-top: 2rem;">
                <h4>Aperçu des données</h4>
                <div id="preview-content"></div>
                <button class="btn btn-primary btn-large" onclick="generateAllInvoices()">
                    <i class="fas fa-file-pdf"></i>
                    Générer toutes les factures
                </button>
            </div>
        </div>
    `;
}

// Initialize parser
const excelParser = new ExcelParser();

// Handle Excel import
async function handleExcelImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        showLoading('Chargement du fichier...');
        
        const data = await excelParser.parseFile(file);
        
        // Validate data
        const validation = excelParser.validateInvoiceData(data);
        
        if (!validation.isValid) {
            hideLoading();
            alert('Erreurs dans le fichier:\n' + validation.errors.join('\n'));
            return;
        }
        
        // Show preview
        displayImportPreview(data);
        hideLoading();
        
        showNotification(`${data.length} lignes importées avec succès`, 'success');
        
    } catch (error) {
        hideLoading();
        console.error('Erreur import:', error);
        alert('Erreur lors de l\'import du fichier Excel');
    }
}

// Display preview of imported data
function displayImportPreview(data) {
    const previewSection = document.getElementById('import-preview');
    const previewContent = document.getElementById('preview-content');
    
    if (!previewSection || !previewContent) return;
    
    const invoices = excelParser.generateInvoicesFromData(data);
    
    let html = `<p><strong>${invoices.length} facture(s) à générer</strong></p>`;
    html += '<div class="invoice-preview-list">';
    
    invoices.forEach((invoice, index) => {
        html += `
            <div class="invoice-preview-item">
                <h5>Facture ${invoice.invoiceNumber}</h5>
                <p>Client: ${invoice.client.name}</p>
                <p>${invoice.items.length} article(s)</p>
            </div>
        `;
    });
    
    html += '</div>';
    
    previewContent.innerHTML = html;
    previewSection.style.display = 'block';
    
    // Store invoices for generation
    window.importedInvoices = invoices;
}

// Generate all invoices
function generateAllInvoices() {
    if (!window.importedInvoices) return;
    
    showLoading('Génération des factures...');
    
    // Generate PDFs for each invoice
    window.importedInvoices.forEach((invoice, index) => {
        setTimeout(() => {
            generateInvoicePDFFromData(invoice);
            
            if (index === window.importedInvoices.length - 1) {
                hideLoading();
                showNotification('Toutes les factures ont été générées !', 'success');
                updateStats('invoice');
            }
        }, index * 500); // Delay to avoid browser freeze
    });
}

// Loading indicator functions
function showLoading(message) {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary);"></i>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// Add loading styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    #loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .loading-content {
        background: white;
        padding: 3rem;
        border-radius: 1rem;
        text-align: center;
    }
    
    .loading-content p {
        margin-top: 1rem;
        font-weight: 600;
        color: var(--dark);
    }
    
    .invoice-preview-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .invoice-preview-item {
        background: var(--light);
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 3px solid var(--primary);
    }
    
    .invoice-preview-item h5 {
        margin-bottom: 0.5rem;
        color: var(--dark);
    }
    
    .invoice-preview-item p {
        margin: 0.25rem 0;
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    .import-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .excel-import-section {
        background: var(--light);
        padding: 2rem;
        border-radius: 1rem;
        margin-bottom: 2rem;
    }
`;
document.head.appendChild(loadingStyles);
