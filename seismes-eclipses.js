(() => {
  'use strict';

  const FEEDS = {
    hour: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
    day: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
    week: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
    month: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
  };
  const eclipses = [
    ['🌑','Éclipse lunaire partielle','28 août 2026','https://eclipse.gsfc.nasa.gov/OH/OH2026.html'],
    ['☀️','Éclipse solaire annulaire','6 février 2027','https://eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html'],
    ['🌑','Éclipse lunaire pénombrale','20 février 2027','https://eclipse.gsfc.nasa.gov/OH/OH2027.html'],
    ['🌑','Éclipse lunaire pénombrale','18 juillet 2027','https://eclipse.gsfc.nasa.gov/OH/OH2027.html'],
    ['☀️','Éclipse solaire totale','2 août 2027','https://eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html']
  ];
  const $ = id => document.getElementById(id);
  const state = { data: [], filtered: [], timer: null };
  const dateFmt = new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium',timeStyle:'short'});
  const timeFmt = new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit'});
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function status(text,type='neutral') { const e=$('quake-status'); if(e){e.textContent=text;e.className=`status-pill status-${type}`;} }
  function parse(f){ const p=f.properties||{}, c=f.geometry?.coordinates||[]; return {mag:p.mag,place:p.place,time:p.time,url:p.url,tsunami:p.tsunami,lat:c[1],lon:c[0],depth:c[2]}; }

  function installFastMap(){
    const old=$('quake-map');
    if(!old) return null;
    const holder=old.closest('.map-section') || old.parentElement;
    const canvas=document.createElement('canvas');
    canvas.id='quake-map-canvas';
    canvas.setAttribute('aria-label','Carte mondiale légère des séismes USGS en direct');
    canvas.style.cssText='display:block;width:100%;height:360px;border-radius:16px;background:#07121d;cursor:crosshair;';
    old.replaceWith(canvas);
    const note=holder?.querySelector('.map-note');
    if(note) note.textContent='Carte rapide SNG alimentée par les données réelles USGS. Aucun fond de carte externe : chargement beaucoup plus rapide.';
    return canvas;
  }

  function drawMap(){
    const c=$('quake-map-canvas'); if(!c) return;
    const dpr=Math.min(window.devicePixelRatio||1,2), w=c.clientWidth||900, h=c.clientHeight||360;
    c.width=Math.round(w*dpr); c.height=Math.round(h*dpr);
    const x=c.getContext('2d'); x.setTransform(dpr,0,0,dpr,0,0);
    x.clearRect(0,0,w,h);
    x.fillStyle='#07121d'; x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(255,255,255,.12)'; x.lineWidth=1;
    for(let lon=-180;lon<=180;lon+=30){const px=(lon+180)/360*w;x.beginPath();x.moveTo(px,0);x.lineTo(px,h);x.stroke();}
    for(let lat=-60;lat<=60;lat+=30){const py=(90-lat)/180*h;x.beginPath();x.moveTo(0,py);x.lineTo(w,py);x.stroke();}
    // Silhouette continentale simplifiée : uniquement pour donner un repère visuel, les séismes restent les données USGS.
    const land=[[-168,72],[-145,65],[-125,50],[-110,30],[-82,15],[-65,8],[-52,25],[-65,48],[-95,60],[-120,72],[-168,72],[-80,10],[-70,-5],[-60,-25],[-52,-55],[-42,-35],[-48,-10],[-58,8],[-80,10],[-15,35],[5,45],[35,38],[60,28],[85,38],[120,55],[150,50],[165,35],[145,15],[115,5],[90,10],[65,20],[45,8],[30,-5],[15,5],[-5,20],[-15,35],[-5,-15],[15,-30],[35,-35],[50,-20],[40,0],[20,10],[0,0],[-10,-25],[-25,-35],[-40,-20],[-30,0],[-5,15]];
    x.fillStyle='rgba(86,105,91,.38)'; x.strokeStyle='rgba(170,190,175,.28)';
    x.beginPath();
    land.forEach((p,i)=>{const px=(p[0]+180)/360*w,py=(90-p[1])/180*h;i?x.lineTo(px,py):x.moveTo(px,py);});
    x.stroke(); x.fill();
    const visible=state.filtered.slice().sort((a,b)=>(b.mag||0)-(a.mag||0)).slice(0,250);
    visible.forEach(q=>{
      const px=(q.lon+180)/360*w, py=(90-q.lat)/180*h, r=Math.max(3,Math.min(10,3+(q.mag||0)*.8));
      x.beginPath(); x.arc(px,py,r,0,Math.PI*2); x.fillStyle=q.mag>=6?'#ff3b30':q.mag>=5?'#ff8a00':q.mag>=4?'#ffd43b':'#48d597'; x.globalAlpha=.9; x.fill(); x.globalAlpha=1;
    });
    x.fillStyle='#fff'; x.font='bold 13px system-ui'; x.fillText('SÉISMES USGS • temps réel',14,22);
    x.font='12px system-ui'; x.fillStyle='rgba(255,255,255,.72)'; x.fillText(`${visible.length} événements affichés`,14,42);
  }

  async function load(){
    const period=$('period-filter')?.value||'day'; status('Chargement USGS…');
    try{
      const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),10000);
      const r=await fetch(FEEDS[period],{cache:'no-store',signal:controller.signal}); clearTimeout(timeout);
      if(!r.ok) throw new Error('USGS '+r.status);
      const json=await r.json();
      state.data=(json.features||[]).map(parse).filter(q=>Number.isFinite(q.lat)&&Number.isFinite(q.lon));
      filter();
      const now=new Date(); $('last-updated').textContent=`Dernière mise à jour : ${timeFmt.format(now)}`; $('retrieved-at').textContent=dateFmt.format(now);
      status(`${state.data.length} événement(s) USGS`, 'live');
    }catch(e){ state.data=[];filter();status('USGS temporairement indisponible','error'); }
  }

  function filter(){
    const min=Number($('magnitude-filter')?.value||0), q=($('region-search')?.value||'').trim().toLowerCase();
    state.filtered=state.data.filter(e=>(!min||(Number.isFinite(e.mag)&&e.mag>=min))&&(!q||String(e.place||'').toLowerCase().includes(q)));
    render();
  }
  function render(){
    const important=state.filtered.filter(q=>Number.isFinite(q.mag)&&q.mag>=5).sort((a,b)=>b.mag-a.mag).slice(0,3);
    const box=$('important-quakes');
    if(box) box.innerHTML=important.length?important.map(q=>`<article class="quake-alert"><h3>🚨 SÉISME IMPORTANT — M${q.mag.toFixed(1)}</h3><p><strong>Région :</strong> ${esc(q.place)}</p><p><strong>Heure :</strong> ${q.time?esc(dateFmt.format(new Date(q.time))):'—'}</p>${q.tsunami===1?'<p>⚠️ Signal tsunami présent dans les données USGS.</p>':''}<a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">Vérifier sur USGS</a></article>`).join(''):'<p class="empty-state">Aucun séisme M5+ dans la période sélectionnée.</p>';
    const body=$('quake-list'); if(body) body.innerHTML=state.filtered.slice(0,50).map(q=>`<tr><td>M ${Number.isFinite(q.mag)?esc(q.mag.toFixed(1)):'—'}</td><td><a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">${esc(q.place||'Localisation inconnue')}</a></td><td>${Number.isFinite(q.depth)?esc(q.depth.toFixed(1))+' km':'—'}</td><td>${q.time?esc(dateFmt.format(new Date(q.time))):'—'}</td></tr>`).join('')||'<tr><td colspan="4">Aucun séisme trouvé.</td></tr>';
    const count=$('quake-count'); if(count) count.textContent=`${state.filtered.length} résultat(s) trouvé(s)`;
    drawMap();
  }

  function renderEclipses(){
    const future=eclipses.filter((e,i)=>i===0||true).map(e=>e);
    const card=e=>`<article class="eclipse-card"><p class="section-tag">${e[0]} événement astronomique</p><h3>${esc(e[1])}</h3><p><strong>Date :</strong> ${esc(e[2])}</p><a href="${esc(e[3])}" target="_blank" rel="noopener noreferrer">Source NASA officielle</a></article>`;
    const next=$('next-eclipse'); if(next) next.innerHTML=card(future[0]);
    const list=$('eclipse-list'); if(list) list.innerHTML=future.map(card).join('');
    const summary=$('eclipse-summary'); if(summary) summary.innerHTML=`<p>🌑 Prochaine éclipse : <strong>${esc(future[0][1])}</strong> — ${esc(future[0][2])}.</p>`;
  }

  document.addEventListener('DOMContentLoaded',()=>{
    installFastMap();
    $('period-filter')?.addEventListener('change',load);
    $('magnitude-filter')?.addEventListener('change',filter);
    $('region-search')?.addEventListener('input',()=>{clearTimeout(state.timer);state.timer=setTimeout(filter,180);});
    $('refresh-quakes')?.addEventListener('click',load);
    window.addEventListener('resize',drawMap,{passive:true});
    renderEclipses();
    load();
    setInterval(load,10*60*1000);
  });
})();
