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

// Function to update all content with translations
function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation && translation !== key) {
            if (element.tagName === 'A' && element.href) {
                element.textContent = translation;
            } else {
                element.textContent = translation;
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

function showSlides() {
    if (slides.length === 0) return; // Ensure slides are loaded

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 5000); // Change image every 5 seconds
}

function plusSlides(n) {
    slideIndex += n - 1; // Adjust slideIndex for direct jump or next/prev
    if (slideIndex < 0) { slideIndex = slides.length - 1; } // Loop back if going below 0
    else if (slideIndex >= slides.length) { slideIndex = 0; } // Loop to start if going past end

    // Stop auto-play, show current slide, then restart auto-play
    clearTimeout(showSlides.timer);
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex].style.display = "block";
    dots[slideIndex].className += " active";
    showSlides.timer = setTimeout(showSlides, 5000);
}

function currentSlide(n) {
    plusSlides(n);
}

// Initialize the page content and carousel
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    updateLanguageButton();

    // Initialize carousel elements after DOM is loaded
    slides = document.getElementsByClassName("carousel-slide");
    dots = document.getElementsByClassName("dot");
    if (slides.length > 0) {
        showSlides();
    }

    // Pop-up functionality
    const popup = document.getElementById('greetingPopup');
    
    if (popup) {
        // Show pop-up on load with fade-in
        setTimeout(() => {
            popup.classList.add('show');
        }, 500); // Small delay for smoother effect

        // Dismiss function
        const dismissPopup = () => {
            popup.classList.remove('show');
        };

        // Manual dismissal (click anywhere on overlay)
        popup.addEventListener('click', dismissPopup);

        // Automatic dismissal after 5 seconds (5000ms + 500ms delay)
        setTimeout(() => {
            if (popup.classList.contains('show')) {
                dismissPopup();
            }
        }, 5500);
    }
});
