const translations = {
  zh: {
    home: "首頁",
    services: "服務項目",
    doctors: "醫療團隊",
    contact: "聯絡我們",
    hero_title: "專業兒科醫療照護",
    hero_subtitle: "守護兒童健康成長的值得信賴夥伴",
    contact_info: "聯絡資訊"
  },
  en: {
    home: "Home",
    services: "Services",
    doctors: "Medical Team",
    contact: "Contact",
    hero_title: "Professional Pediatric Care",
    hero_subtitle: "Your Trusted Partner in Child Health",
    contact_info: "Contact Information"
  }
};

function switchLanguage(lang) {
  const titlesContainer = document.querySelector('.clinic-titles');
  
  // 更新診所名稱顯示
  document.querySelectorAll('.clinic-name').forEach(name => {
    name.classList.remove('active');
    if(name.classList.contains(`${lang}-name`)) {
      name.classList.add('active');
    }
  });

  // 更新按鈕狀態
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if(btn.dataset.lang === lang) btn.classList.add('active');
  });

  // 更新地址和其他文字
  document.querySelectorAll('.address').forEach(addr => {
    addr.classList.remove('active');
  });
  document.querySelector(`.${lang}-address`).classList.add('active');

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    element.textContent = translations[lang][key];
  });

  localStorage.setItem('lang', lang);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'zh';
  switchLanguage(savedLang);
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });
});
