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
        translateHead(langCode, translations);
        translatePage(langCode, translations);
    });
}

function translateHead(language, translations) {
    // Traducir el título
    if (translations[language] && translations[language]['title']) {
        document.title = translations[language]['title'];
    }

    // Traducir la meta descripción
    if (translations[language] && translations[language]['meta_description']) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', translations[language]['meta_description']);
        }
    }

    // Traducir la meta keywords
    if (translations[language] && translations[language]['meta_keywords']) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', translations[language]['meta_keywords']);
        }
    }
}

