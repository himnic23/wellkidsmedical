// Get the current language from localStorage or default to Chinese
let currentLang = localStorage.getItem('language') || 'zh';

// Function to get nested translations using dot notation
function getTranslation(key) {
    const translation = key.split('.').reduce((obj, k) => obj && obj[k], translations[currentLang]);
    return translation || key;
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-HK';
    updateContent();
    localStorage.setItem('language', lang);
    closeMenu();
}

// Function to toggle mobile menu
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuButton = document.querySelector('.menu-icon');

    if (!navLinks) return;

    navLinks.classList.toggle('active');

    if (menuButton) {
        menuButton.setAttribute('aria-expanded', navLinks.classList.contains('active') ? 'true' : 'false');
    }
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuButton = document.querySelector('.menu-icon');

    if (!navLinks) return;

    navLinks.classList.remove('active');

    if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'false');
    }
}

// Function to update the language button text
function updateLanguageButton() {
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = currentLang === 'en' ? '中文' : 'English';
    }
}

function updateLanguageButtons() {
    document.querySelectorAll('[data-lang-button]').forEach(button => {
        const targetLang = button.getAttribute('data-lang-button');
        button.textContent = targetLang === 'en'
            ? 'English'
            : '中文';
        button.style.display = targetLang === currentLang ? 'none' : 'inline-flex';
    });

    const mobileLangToggle = document.querySelector('.mobile-lang-toggle');
    if (mobileLangToggle) {
        mobileLangToggle.textContent = currentLang === 'en' ? '中文' : 'English';
    }
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function setTranslatedContent(element, translation) {
    const shouldPreserveLineBreaks = translation.includes('\n') || element.innerHTML.includes('<br>');

    if (shouldPreserveLineBreaks) {
        element.innerHTML = escapeHtml(translation).replace(/\n/g, '<br>');
        return;
    }

    element.textContent = translation;
}

function updateResponsiveTableLabels() {
    document.querySelectorAll('.responsive-table').forEach(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map((header) => header.textContent.trim());

        table.querySelectorAll('tbody tr').forEach((row) => {
            Array.from(row.children).forEach((cell, index) => {
                if (cell.tagName === 'TD' && headers[index]) {
                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
    });
}

function renderVaccineMobileCards() {
    const table = document.querySelector('.vaccine-table');
    const container = document.querySelector('.vaccine-mobile-cards');

    if (!table || !container) return;

    const headers = Array.from(table.querySelectorAll('thead th')).map((header) => header.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    container.innerHTML = rows.map((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        if (cells.length < 3) return '';

        const ageGroup = cells[0].innerHTML.trim();
        const governmentProgram = cells[1].innerHTML.trim() || '<span class="vaccine-empty">-</span>';
        const enhancedProgram = cells[2].innerHTML.trim() || '<span class="vaccine-empty">-</span>';

        return `
            <article class="vaccine-mobile-card">
                <h3 class="vaccine-mobile-age">${ageGroup}</h3>
                <div class="vaccine-mobile-section">
                    <p class="vaccine-mobile-label">${headers[1] || ''}</p>
                    <div class="vaccine-mobile-body">${governmentProgram}</div>
                </div>
                <div class="vaccine-mobile-section">
                    <p class="vaccine-mobile-label">${headers[2] || ''}</p>
                    <div class="vaccine-mobile-body">${enhancedProgram}</div>
                </div>
            </article>
        `;
    }).join('');
}

function ensureMobileQuickBar() {
    if (document.querySelector('.mobile-quick-bar')) return;

    const quickBar = document.createElement('div');
    quickBar.className = 'mobile-quick-bar';
    quickBar.innerHTML = `
        <a class="mobile-quick-link mobile-quick-call" href="tel:+85223213318" data-i18n="nav.cta_call">Call Clinic</a>
        <a class="mobile-quick-link mobile-quick-whatsapp" href="https://wa.me/85269704813" target="_blank" rel="noopener noreferrer" data-i18n="nav.cta_whatsapp">WhatsApp Enquiry</a>
    `;

    document.body.appendChild(quickBar);
}

function ensureMobileHeaderTools() {
    const navbar = document.querySelector('.navbar');
    const menuButton = document.querySelector('.menu-icon');

    if (!navbar || !menuButton || navbar.querySelector('.mobile-header-tools')) return;

    const tools = document.createElement('div');
    tools.className = 'mobile-header-tools';
    tools.innerHTML = `
        <button type="button" class="mobile-lang-toggle"></button>
        <button type="button" class="mobile-menu-toggle" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    `;

    const langButton = tools.querySelector('.mobile-lang-toggle');
    const mobileMenuButton = tools.querySelector('.mobile-menu-toggle');

    langButton.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'zh' : 'en');
    });

    mobileMenuButton.addEventListener('click', () => {
        toggleMenu();
    });

    navbar.appendChild(tools);
}

// Function to update all content with translations
function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation && translation !== key) {
            if (element.tagName === 'A' && element.href) {
                element.textContent = translation;
            } else {
                setTranslatedContent(element, translation);
            }
        }
    });

    updateLanguageButtons();
    updateResponsiveTableLabels();
    renderVaccineMobileCards();
}

// Carousel functionality
let slideIndex = 0;
let slides = [];
let dots = [];
let carouselTimer;

function renderSlide(index) {
    if (slides.length === 0) return;

    slideIndex = (index + slides.length) % slides.length;

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex].style.display = "block";

    if (dots[slideIndex]) {
        dots[slideIndex].className += " active";
    }
}

function scheduleNextSlide() {
    clearTimeout(carouselTimer);
    carouselTimer = setTimeout(() => {
        renderSlide(slideIndex + 1);
        scheduleNextSlide();
    }, 5000);
}

function plusSlides(n) {
    renderSlide(slideIndex + n);
    scheduleNextSlide();
}

function currentSlide(n) {
    renderSlide(n - 1);
    scheduleNextSlide();
}

// Initialize the page content and carousel
document.addEventListener('DOMContentLoaded', () => {
    ensureMobileQuickBar();
    ensureMobileHeaderTools();
    setLanguage(currentLang);
    updateLanguageButton();

    if (window.location.hash === '#menu-open' && window.innerWidth <= 768) {
        toggleMenu();
    }

    // Initialize carousel elements after DOM is loaded
    slides = document.getElementsByClassName("carousel-slide");
    dots = document.getElementsByClassName("dot");
    if (slides.length > 0) {
        renderSlide(0);
        scheduleNextSlide();
    }

    document.querySelectorAll('#navLinks a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
        updateLanguageButtons();
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});
