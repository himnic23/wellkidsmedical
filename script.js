function switchLanguage(lang) {
    const zhElements = document.querySelectorAll('[id$="-zh"]');
    const enElements = document.querySelectorAll('[id$="-en"]');

    if (lang === 'zh') {
        zhElements.forEach(element => element.style.display = 'block');
        enElements.forEach(element => element.style.display = 'none');
    } else {
        zhElements.forEach(element => element.style.display = 'none');
        enElements.forEach(element => element.style.display = 'block');
    }
}
