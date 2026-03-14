// Get the current language from localStorage or default to Chinese
let currentLang = localStorage.getItem('language') || 'zh';

// Function to get nested translations using dot notation
function getTranslation(key) {
    const translation = key.split('.').reduce((obj, k) => obj && obj[k], translations[currentLang]);
    return translation || key;
}

function setLanguage(lang) {
    currentLang = lang;
    updateContent();
    localStorage.setItem('language', lang);
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
        button.style.opacity = targetLang === currentLang ? '0.55' : '1';
    });
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

function ensureMobileQuickBar() {
    if (document.querySelector('.mobile-quick-bar')) return;

    const quickBar = document.createElement('div');
    quickBar.className = 'mobile-quick-bar';
    quickBar.innerHTML = `
        <a class="mobile-quick-link mobile-quick-call" href="tel:+85223213318" data-i18n="nav.cta_call">Call Clinic</a>
        <a class="mobile-quick-link mobile-quick-whatsapp" href="https://wa.me/85223213318" target="_blank" rel="noopener noreferrer" data-i18n="nav.cta_whatsapp">WhatsApp Enquiry</a>
    `;

    document.body.appendChild(quickBar);
}

function ensureMobileLanguageInline() {
    const navLinks = document.getElementById('navLinks');

    if (!navLinks || navLinks.querySelector('.mobile-language-inline')) return;

    const languageGroup = document.createElement('div');
    languageGroup.className = 'mobile-language-inline';
    languageGroup.innerHTML = `
        <button type="button" onclick="setLanguage('en')" data-lang-button="en">English</button>
        <button type="button" onclick="setLanguage('zh')" data-lang-button="zh">中文</button>
    `;

    navLinks.insertBefore(languageGroup, navLinks.firstChild);
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
    ensureMobileLanguageInline();
    setLanguage(currentLang);
    updateLanguageButton();

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
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});
