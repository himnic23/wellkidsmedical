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

// 移除隱藏菜單功能，因為現在使用非隱藏式菜單
function toggleMenu() {
    // 此功能已不再需要，但保留函數以避免HTML中的onclick調用出錯
    return;
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

// Initialize the page content
document.addEventListener('DOMContentLoaded', () => {
    // 確保初始化時設置正確的語言
    // 不需要单独调用updateContent，因为setLanguage已经包含了这个调用
    setLanguage(currentLang);
    // 更新语言按钮
    updateLanguageButton();
});
