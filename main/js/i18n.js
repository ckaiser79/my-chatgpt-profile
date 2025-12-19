(function(){
  const MESSAGES = {};
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en','de'];
  let currentLang = DEFAULT_LANG;

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

  function fetchMessages(lang){
    const l = SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
    if(MESSAGES[l]) return Promise.resolve(MESSAGES[l]);
    return fetch(`i18n/${l}.json`).then(r=>{
      if(!r.ok) throw new Error('i18n load failed');
      return r.json();
    }).then(json=>{ MESSAGES[l] = json; return json; });
  }

  function t(key){
    const dict = MESSAGES[currentLang] || {};
    const val = key.split('.').reduce((acc,k)=> (acc && acc[k] != null) ? acc[k] : undefined, dict);
    return (val == null) ? key : String(val);
  }

  function apply(root){
    const scope = root || document;
    // text content
    scope.querySelectorAll('[data-i18n]')?.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(key) el.textContent = t(key);
    });
    // attribute mapping: data-i18n-attr="title=foo,placeholder=bar"
    scope.querySelectorAll('[data-i18n-attr]')?.forEach(el => {
      const map = el.getAttribute('data-i18n-attr');
      if(!map) return;
      map.split(',').forEach(pair => {
        const [attr, key] = pair.split('=');
        if(attr && key) el.setAttribute(attr.trim(), t(key.trim()));
      });
    });
  }

  function setLang(lang){
    currentLang = SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
    document.documentElement.setAttribute('lang', currentLang);
    apply(document);
  }

  function init(){
    const cookieLang = (getCookie('ui_lang') || '').toLowerCase();
    currentLang = SUPPORTED.includes(cookieLang) ? cookieLang : DEFAULT_LANG;
    document.documentElement.setAttribute('lang', currentLang);
    return fetchMessages(currentLang).then(()=>{
      apply(document);
      // prefetch the other language to make toggles instant
      const other = currentLang === 'en' ? 'de' : 'en';
      fetchMessages(other).catch(()=>{});
      // listen for myApp language events if present
      try{
        if(window.myApp && typeof window.myApp.on === 'function'){
          window.myApp.on('languageChanged', (lang)=>{
            fetchMessages(lang).then(()=> setLang(lang));
          });
        }
      }catch(_){/* noop */}
    });
  }

  window.I18n = { init, setLang, t };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ init().catch(()=>{}); });
  } else {
    init().catch(()=>{});
  }
})();
