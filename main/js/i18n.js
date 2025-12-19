(function(){
  const MESSAGES = {};
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en','de'];
  let currentLang = DEFAULT_LANG;
  let SHOW_MISSING_KEYS = false;

  function getQueryParamBool(name){
    try{
      const params = new URLSearchParams(window.location.search || '');
      if(!params.has(name)) return null;
      const v = (params.get(name) || '').toLowerCase();
      // treat empty value or common truthy tokens as true
      if(v === '' || v === '1' || v === 'true' || v === 'yes' || v === 'on') return true;
      if(v === '0' || v === 'false' || v === 'no' || v === 'off') return false;
      return true; // presence without recognized value => true
    }catch(_){
      return null;
    }
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
    // If key not found, either return the key (debug mode) or undefined to avoid changing content
    return (val == null) ? (SHOW_MISSING_KEYS ? key : undefined) : String(val);
  }

  function apply(root){
    const scope = root || document;
    // text content
    scope.querySelectorAll('[data-i18n]')?.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(!key) return;
      const value = t(key);
      if(value != null) el.textContent = value;
    });
    // attribute mapping: data-i18n-attr="title=foo,placeholder=bar"
    scope.querySelectorAll('[data-i18n-attr]')?.forEach(el => {
      const map = el.getAttribute('data-i18n-attr');
      if(!map) return;
      map.split(',').forEach(pair => {
        const [attr, key] = pair.split('=');
        if(!attr || !key) return;
        const value = t(key.trim());
        if(value != null) el.setAttribute(attr.trim(), value);
      });
    });
  }

  function setLang(lang){
    currentLang = SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
    document.documentElement.setAttribute('lang', currentLang);
    apply(document);
  }

  function setDebug(flag){
    SHOW_MISSING_KEYS = !!flag;
    apply(document);
  }

  function init(){
    const cookieLang = (getCookie('ui_lang') || '').toLowerCase();
    currentLang = SUPPORTED.includes(cookieLang) ? cookieLang : DEFAULT_LANG;
    document.documentElement.setAttribute('lang', currentLang);
    const dbg = getQueryParamBool('debug-missing-keys');
    if(dbg !== null) SHOW_MISSING_KEYS = dbg;
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

  window.I18n = { init, setLang, t, setDebug };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ init().catch(()=>{}); });
  } else {
    init().catch(()=>{});
  }
})();
