window.myApp = {
    data: {},
    jsonInput: '',
    error: '',
    showJsonForm: true,
    groupedTips: [],
    load(){
      fetch('data/sample1.json')
        .then(r=>r.json())
        .then(d=>{ this.data = d; this.jsonInput = JSON.stringify(d, null, 2); this.groupTips(); this.renderWordCloud(); })
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
          this.renderWordCloud();
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
        this.renderWordCloud();
      }catch(e){
        this.error = 'Invalid JSON: ' + e.message;
      }
    },
    clearInput(){ this.jsonInput = ''; this.error = ''; this.groupedTips = []; },
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