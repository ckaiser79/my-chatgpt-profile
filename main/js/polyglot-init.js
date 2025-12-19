(function () {
    /*
     Polyglot i18n bootstrap
     - Language selection: uses 'ui_lang' cookie if present; otherwise detects browser language (de/en).
     - Translation application: fills elements with data-i18n and applies attribute/text mappings from data-i18n-attr.
     - Dynamic content: re-applies translations after partials are injected via 'x-include:loaded' and via a MutationObserver watching for new nodes.
     - Conflict rule: do not combine data-i18n with Alpine's x-text on the same element; x-text controls dynamic content and should take precedence.
    */
    const translations = {};
    let polyglot = new Polyglot();

    function fetchTranslations(lang) {

        const locale = lang === 'de' ? 'de' : 'en';

        if (translations[locale]) return Promise.resolve(translations[locale]);

        return fetch(`i18n/${locale}.json`)
            .then(r => {
                if (!r.ok) throw new Error('Translation load failed');
                return r.json();
            })
            .then(json => {
                translations[locale] = json;
                return json;
            });
    }

    function detectBrowserLang() {
        try {
            const nav = navigator || {};
            const langs = (nav.languages && nav.languages.length) ? nav.languages : [nav.language || nav.userLanguage || 'en'];
            for (let l of langs) {
                if (!l) continue;
                const lc = String(l).toLowerCase();
                if (lc.startsWith('de')) return 'de';
                if (lc.startsWith('en')) return 'en';
            }
        } catch (_) {}
        return 'en';
    }

    function getCookie(name) {
        const cname = name + '=';
        const decoded = decodeURIComponent(document.cookie || '');
        const parts = decoded.split(';');
        for (let c of parts) {
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(cname) === 0) return c.substring(cname.length);
        }
        return '';
    }

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + ';' + expires + ';path=/';
    }

    function applyTranslations() {
        // Handle text content translations
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = polyglot.t(key);
            }
            else {
                console.warn('18n-missing:' + key);
                el.textContent = '<span class="i18n-missing">' + key + '</span>';
            }
        });

        // Handle attribute translations (including textContent)
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const map = el.getAttribute('data-i18n-attr');
            if (!map) return;
            map.split(',').forEach(pair => {
                const [attr, key] = pair.split('=');
                if (attr && key) {
                    const attrName = attr.trim();
                    const translatedValue = polyglot.t(key.trim());
                    if (attrName === 'textContent' || attrName === 'innerText') {
                        el.textContent = translatedValue;
                    } else {
                        el.setAttribute(attrName, translatedValue);
                    }
                }
            });
        });
    }

    function setLanguage(lang) {
        const locale = lang === 'de' ? 'de' : 'en';
        fetchTranslations(locale).then(phrases => {
            polyglot.locale(locale);
            polyglot.replace(phrases);
            applyTranslations();
            document.documentElement.setAttribute('lang', locale);
            document.body.classList.remove('lang-en', 'lang-de');
            document.body.classList.add('lang-' + locale);
            document.querySelectorAll('.lang-flag').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang') === locale);
            });
        }).catch(err => console.error('Failed to load translations:', err));
    }

    function init() {
        const savedLang = getCookie('ui_lang');
        const initialLang = savedLang || detectBrowserLang();
        setLanguage(initialLang);

        document.querySelectorAll('.lang-flag').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang') || 'en';
                setCookie('ui_lang', lang, 365);
                setLanguage(lang);
            });
        });

        // Re-apply translations after Alpine includes inject new nodes
        document.addEventListener('x-include:loaded', () => {
            applyTranslations();
        });

        // Observe DOM for dynamically injected content and re-apply translations
        let applyScheduled = false;
        const scheduleApply = () => {
            if (applyScheduled) return;
            applyScheduled = true;
            requestAnimationFrame(() => {
                applyScheduled = false;
                applyTranslations();
            });
        };
        try {
            const observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
                        scheduleApply();
                        break;
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } catch (_) { /* noop */ }
    }

    window.PolyglotI18n = { init, setLanguage, apply: applyTranslations, t: (key) => polyglot.t(key) };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
