// 多語言系統
const translations = {
  zh: {
    clinic_name: "允翹兒科中心",
    home: "首頁",
    services: "服務項目",
    doctors: "醫療團隊",
    contact: "聯絡我們",
    hero_title: "專業兒科醫療照護",
    hero_subtitle: "守護兒童健康成長的值得信賴夥伴",
    contact_info: "聯絡資訊"
  },
  en: {
    clinic_name: "Well Kids Medical Centre",
    home: "Home",
    services: "Services",
    doctors: "Medical Team",
    contact: "Contact",
    hero_title: "Professional Pediatric Care",
    hero_subtitle: "Your Trusted Partner in Child Health",
    contact_info: "Contact Information"
  }
};

// 語言切換功能
function switchLanguage(lang) {
  // 更新按鈕狀態
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if(btn.dataset.lang === lang) btn.classList.add('active');
  });

  // 切換地址顯示
  document.querySelectorAll('.address').forEach(addr => {
    addr.classList.remove('active');
  });
  document.querySelector(`.${lang}-address`).classList.add('active');

  // 更新文字內容
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    element.textContent = translations[lang][key];
  });

  // 儲存語言偏好
  localStorage.setItem('lang', lang);
}

// 初始化語言
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'zh';
  switchLanguage(savedLang);
  
  // 綁定按鈕事件
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });
});
