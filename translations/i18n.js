function getUserLang(supportedLangs = ['en', 'ca', 'es'], defaultLang = 'en') {
    var userLang = (navigator.language || navigator.userLanguage).toLowerCase();
    var langCode = userLang.split('-')[0];
    if (!supportedLangs.includes(langCode)) {
        langCode = defaultLang;
    }
    localStorage.setItem('siteLang', langCode);
    return langCode;
}

function translatePage(language, translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        let translation = null;

        if (translations[language] && translations[language][key]) {
            translation = translations[language][key];
        } else if (translations['ca'] && translations['ca'][key]) {
            translation = translations['ca'][key];
            console.warn(`No s'ha trobat la traducció de "${key}" en l'idioma: "${language}".`);
        } else if (translations['es'] && translations['es'][key]) {
            translation = translations['es'][key];
            console.warn(`No s'ha trobat la traducció de "${key}" en l'idioma: "${language}".`);
        } else {
            console.error(`No s'ha trobat la traducció de "${key}" en l'idioma: "${language}".`);
            translation = `[${key}]`;
        }

        el.textContent = translation;
    });
}

function initI18n(translations) {
    document.addEventListener("DOMContentLoaded", function() {
        const langCode = getUserLang();
        translatePage(langCode, translations);
    });
}
