window.myApp = {
    data: {},
    jsonInput: '',
    error: '',
    showJsonForm: false,
    load(){
      fetch('data/sample1.json')
        .then(r=>r.json())
        .then(d=>{ this.data = d; this.jsonInput = JSON.stringify(d, null, 2); this.renderWordCloud(); })
        .catch(e=>console.warn('load failed',e))
    },
    loadSample(){
      fetch('data/sample1.json')
        .then(r=>r.json())
        .then(d=>{
          this.jsonInput = JSON.stringify(d, null, 2);
          this.error = '';
          this.data = d;
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
        this.renderWordCloud();
      }catch(e){
        this.error = 'Invalid JSON: ' + e.message;
      }
    },
    clearInput(){ this.jsonInput = ''; this.error = '' },
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