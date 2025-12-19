window.myApp = {
    data: {},
    jsonInput: '',
    error: '',
    showJsonForm: false,
    groupedTips: [],
    _events: {},
    _listenersRegistered: false,
    load(){
      fetch('data/sample1.json')
        .then(r=>r.json())
        .then(d=>{ this.data = d; this.jsonInput = ''; this.groupTips(); this.registerDefaultListeners(); })
        .catch(e=>console.warn('load failed',e))
    },
    loadSample(){
      fetch('data/sample1.json')
        .then(r=>r.json())
        .then(d=>{
          this.jsonInput = JSON.stringify(d, null, 2);
          this.error = '';
          this.data = d;
          this.groupTips();
          this.registerDefaultListeners();
        })
        .catch(e=>{
          this.error = 'Could not load sample: ' + (e.message || e);
          console.warn('loadSample failed', e);
        })
    },
    applyJson(){
      try{
        this.data = JSON.parse(this.jsonInput || '{}');
        this.error = '';
        this.groupTips();
        this.registerDefaultListeners();
      }catch(e){
        this.error = 'Invalid JSON: ' + e.message;
      }
    },
    clearInput(){ this.jsonInput = ''; this.error = ''; this.groupedTips = []; },
    onBetaToggle(enabled){ this.emit(enabled ? 'betaEnabled' : 'betaDisabled'); },
    on(event, handler){
      if(!this._events[event]) this._events[event] = [];
      this._events[event].push(handler);
      return () => this.off(event, handler);
    },
    off(event, handler){
      const list = this._events[event] || [];
      const i = list.indexOf(handler);
      if(i > -1) list.splice(i,1);
    },
    emit(event, payload){
      const list = this._events[event] || [];
      list.forEach(fn => { try { fn.call(this, payload); } catch(_) {} });
    },
    registerDefaultListeners(){
      if(this._listenersRegistered) return;
      this._listenersRegistered = true;
      this._wordcloudScriptLoading = false;
      this.on('betaEnabled', () => {
        const render = () => { try { this.renderWordCloud(); } catch(_) {} };
        if (window.WordCloud) {
          render();
        } else {
          if (this._wordcloudScriptLoading) return;
          this._wordcloudScriptLoading = true;
          const s = document.createElement('script');
          s.src = 'https://cdn.bootcdn.net/ajax/libs/wordcloud2.js/1.2.3/wordcloud2.min.js';
          s.async = true;
          s.onload = () => { this._wordcloudScriptLoading = false; render(); };
          s.onerror = () => { this._wordcloudScriptLoading = false; };
          document.head.appendChild(s);
        }
      });
    },
    groupTips(){
      const tipsArr = Array.isArray(this.data?.tips) ? this.data.tips : [];
      const groupedMap = tipsArr.reduce((acc, tip) => {
        if(!tip || !tip.category) return acc;
        const key = tip.category;
        const text = tip.text || tip.tips || '';
        if(!acc[key]) acc[key] = [];
        if(text) acc[key].push(text);
        return acc;
      }, {});
      this.groupedTips = Object.entries(groupedMap).map(([category, items]) => ({ category, items }));
    },
    renderWordCloud(){
      if(!document.body.classList.contains('beta-on')) return;
      if(window.WordCloud && this.data.interactionTypes){
        const list = this.data.interactionTypes.map(item => [item.word, item.weight]);
        WordCloud(document.getElementById('wordcloud'), {
          list: list,
          gridSize: 10,
          weightFactor: 8,
          fontFamily: 'sans-serif',
          color: 'random-dark',
          rotateRatio: 0,
          backgroundColor: '#fff'
        });
      }
    }
};