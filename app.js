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
    navLinks.classList.toggle('active');
}

// Function to update the language button text
function updateLanguageButton() {
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = currentLang === 'en' ? '中文' : 'English';
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
    // Update button states
    const enBtn = document.getElementById('enBtn');
    const zhBtn = document.getElementById('zhBtn');
    if (enBtn) enBtn.style.opacity = currentLang === 'en' ? '0.5' : '1';
    if (zhBtn) zhBtn.style.opacity = currentLang === 'zh' ? '0.5' : '1';
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
    setLanguage(currentLang);
    updateLanguageButton();

    // Initialize carousel elements after DOM is loaded
    slides = document.getElementsByClassName("carousel-slide");
    dots = document.getElementsByClassName("dot");
    if (slides.length > 0) {
        renderSlide(0);
        scheduleNextSlide();
    }
});
