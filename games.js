/* Music Hub games: Note Slide, Key Finder, Note Values, Fill the Bar, Tap the Rhythm, Major or Minor, plus the ear and reading games. No scores are kept. */
'use strict';
S.games={tab:'slide'};
const GAMES=[['slide','Note Slide'],['keys','Key Finder'],['reader','Name the note'],['values','Note values'],['fill','Fill the bar'],['tap','Tap the rhythm'],['rhythm','Rhythm ears'],['pitch','Pitch ears'],['chord','Major or minor']];
A.gtab=el=>{stopAll();S.games.tab=el.dataset.t;render();};
function vGames(){
  const t=S.games.tab;
  return `<div><span class="eyebrow">Games</span><h2>Play to learn</h2></div><div class="row">${GAMES.map(x=>chip(x[1],'gtab',x[0]===t,`data-t="${x[0]}"`)).join('')}</div>
  <section class="card">${({slide:gSlide,keys:gKeys,reader:tReader,values:gValues,fill:gFill,tap:gTap,rhythm:tRhythm,pitch:tPitch,chord:gChord})[t]()}</section>`;
}
function say(id,ok,text){const fb=$('#'+id); if(!fb) return; fb.className='fb'; void fb.offsetWidth; fb.className='fb '+(ok?'good':'bad'); fb.textContent=text;}
const miniStaff=n=>`<div class="paper mini" style="max-width:300px">${staffSvg({t:'one note',mel:n+':4',meter:4,pickup:0}).replace('viewBox="0 0 700','viewBox="0 0 230').replace(/x2="696"/g,'x2="226"')}</div>`;
const PCHEX={C:'#D93A40',D:'#E8731A',E:'#E0B400',F:'#2F9E44',G:'#0C8F88',A:'#3B5BDB',B:'#A33FB5'};

/* ================= Note Slide ================= */
const NS={clef:'treble',lvl:1,input:'letters',colors:false,run:false,notes:[],tempo:0,streak:0,last:0,raf:0,cv:null};
const TEMPI=[['Largo',10],['Adagio',8.5],['Andante',7.2],['Moderato',6.2],['Allegretto',5.3],['Allegro',4.5],['Vivace',3.8],['Presto',3.2]];
const NSPOOL={treble:{1:['E4','F4','G4','A4','B4','C5','D5','E5','F5'],2:['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5']},
  bass:{1:['G2','A2','B2','C3','D3','E3','F3','G3','A3'],2:['E2','F2','G2','A2','B2','C3','D3','E3','F3','G3','A3','B3','C4']}};
const NSTIP={treble:['Lines from the bottom: E G B D F.','Spaces from the bottom spell F A C E.'],bass:['Lines from the bottom: G B D F A.','Spaces from the bottom: A C E G.']};
function gSlide(){
  requestAnimationFrame(nsInit);
  const answer=NS.input==='letters'?`<div class="row">${'CDEFGAB'.split('').map(L=>`<button class="btn ${pcClass(L)} ans" data-act="nsAns" data-a="${L}">${L}</button>`).join('')}</div>`:kbHtml(new Set(),'nsKey');
  return `<div class="row"><h3 style="flex:1">Name each note before it reaches the line</h3><span class="pill" id="nsTempo">${TEMPI[NS.tempo][0]}</span></div>
  <div class="stagebox" id="nsBox"><canvas id="nsCanvas" height="230" aria-label="Notes sliding along a staff"></canvas></div>
  <div class="fb" id="nsTip">${NS.run?'':'Tap Start. Notes slide in from the right.'}</div>${answer}
  <div class="row"><button class="btn go" data-act="nsGo">${NS.run?'Pause':'Start'}</button>${chip('Treble clef','nsSet',NS.clef==='treble','data-k="clef" data-v="treble"')}${chip('Bass clef','nsSet',NS.clef==='bass','data-k="clef" data-v="bass"')}
  ${chip('Lines and spaces','nsSet',NS.lvl===1,'data-k="lvl" data-v="1"')}${chip('With ledger lines','nsSet',NS.lvl===2,'data-k="lvl" data-v="2"')}</div>
  <div class="row"><span class="muted small">Answer with</span>${chip('Letters','nsSet',NS.input==='letters','data-k="input" data-v="letters"')}${chip('Piano keys','nsSet',NS.input==='keys','data-k="input" data-v="keys"')}${chip('Colour hints','nsSet',NS.colors,'data-k="colors" data-v="x"')}</div>
  <p class="small muted">Get six in a row and the tempo steps up, from Largo to Presto. Miss one and it eases back.</p>`;
}
A.nsSet=el=>{const k=el.dataset.k, v=el.dataset.v; if(k==='colors') NS.colors=!NS.colors; else NS[k]=k==='lvl'?+v:v; if(k==='clef'||k==='lvl'){NS.notes=[];NS.streak=0;} render();};
A.nsGo=()=>{ac(); NS.run=!NS.run; if(NS.run&&!NS.notes.length){NS.tempo=0;NS.streak=0;} render();};
A.nsAns=el=>nsAnswer(el.dataset.a);
A.nsKey=el=>{const m=+el.dataset.m; play(m,0,.4,'keys',.35); const n=NN[m%12]; if(n.length===1) nsAnswer(n);};
function nsAnswer(L){
  if(!NS.run) return; const n=NS.notes.find(x=>x.st==='live'); if(!n) return;
  if(n.L===L){ n.st='pop'; n.t0=performance.now(); play(n.midi,0,.6,'keys',.5); NS.streak++; $('#nsTip').textContent='';
    if(NS.streak%6===0&&NS.tempo<TEMPI.length-1){NS.tempo++; nsTempo(true);} }
  else { NS.streak=0; const box=$('#nsBox'); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); say('nsTip',false,'Not '+L+'. '+NSTIP[NS.clef][n.di%2===NS.base%2?0:1]); }
}
function nsTempo(up){const p=$('#nsTempo'); if(!p) return; p.textContent=TEMPI[NS.tempo][0]; p.classList.remove('bump'); void p.offsetWidth; if(up) p.classList.add('bump');}
function nsInit(){
  const cv=$('#nsCanvas'); if(!cv) return; const box=cv.parentElement, W=box.clientWidth, H=230, dpr=window.devicePixelRatio||1;
  cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+'px'; cv.style.height=H+'px'; const g=cv.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0);
  NS.cv=cv; NS.W=W; NS.base=NS.clef==='treble'?30:18; NS.last=performance.now(); cancelAnimationFrame(NS.raf);
  if(!NS.run&&!NS.notes.length){ /* resting picture */ const pool=NSPOOL[NS.clef][NS.lvl]; NS.demo=[pool[1],pool[4],pool[6]].map((s,i)=>nsMake(s,W*(.42+i*.2))); } else NS.demo=null;
  const frame=now=>{
    if($('#nsCanvas')!==cv) return; const dt=Math.min(.05,(now-NS.last)/1000); NS.last=now;
    if(NS.run) nsStep(dt,now); nsDraw(g,W,H,now); NS.raf=requestAnimationFrame(frame);
  };
  NS.raf=requestAnimationFrame(frame);
}
function nsMake(s,x){const p=parseNote(s); return {L:p.L,midi:p.midi,di:LIDX[p.L]+7*p.oct,x,st:'live',t0:0};}
const NS_LINE=104;
function nsStep(dt,now){
  const W=NS.W, v=(W-NS_LINE)/TEMPI[NS.tempo][1], live=NS.notes.filter(n=>n.st==='live'), lastLive=live[live.length-1];
  if(live.length<3&&(!lastLive||lastLive.x<W-(W-NS_LINE)*.5)){const pool=NSPOOL[NS.clef][NS.lvl]; let s; do{s=pick(pool);}while(parseNote(s).midi===NS.prev); NS.prev=parseNote(s).midi; NS.notes.push(nsMake(s,W+24));}
  NS.notes.forEach(n=>{ if(n.st==='live'){ n.x-=v*dt; if(n.x<=NS_LINE){ n.st='miss'; n.t0=now; play(n.midi,0,.6,'keys',.4); NS.streak=0; if(NS.tempo>0){NS.tempo--; nsTempo(false);} say('nsTip',false,'That one was '+n.L+'. '+NSTIP[NS.clef][n.di%2===NS.base%2?0:1]); } } });
  NS.notes=NS.notes.filter(n=>n.st==='live'||now-n.t0<700);
}
function nsDraw(g,W,H,now){
  const top=62, sp=15, bottom=top+4*sp, ink='#1B2233', yOf=di=>bottom-(di-NS.base)*sp/2;
  g.clearRect(0,0,W,H); g.fillStyle='#FCFBF7'; g.fillRect(0,0,W,H);
  g.fillStyle='rgba(44,79,224,.10)'; g.fillRect(NS_LINE-16,top-34,32,4*sp+68); g.strokeStyle='#2C4FE0'; g.lineWidth=3; g.beginPath(); g.moveTo(NS_LINE,top-34); g.lineTo(NS_LINE,bottom+34); g.stroke();
  g.strokeStyle='#8A93A6'; g.lineWidth=1.2; for(let k=0;k<5;k++){g.beginPath();g.moveTo(10,top+k*sp);g.lineTo(W-10,top+k*sp);g.stroke();}
  g.fillStyle=ink; g.textBaseline='alphabetic'; g.textAlign='left';
  if(NS.clef==='treble'){g.font='78px serif'; g.fillText('𝄞',14,bottom+10);} else {g.font='62px serif'; g.fillText('𝄢',16,bottom-8);}
  const list=NS.demo||NS.notes, front=NS.demo?null:NS.notes.find(n=>n.st==='live');
  list.forEach(n=>{
    const y=yOf(n.di), age=(now-n.t0)/700; let a=1, r=1;
    if(n.st==='pop'){a=Math.max(0,1-age); r=1+age*.9;} else if(n.st==='miss'){a=Math.max(0,1-age);}
    g.globalAlpha=a; g.strokeStyle=ink; g.lineWidth=1.4;
    for(let d=NS.base-2;d>=n.di;d-=2){g.beginPath();g.moveTo(n.x-17,yOf(d));g.lineTo(n.x+17,yOf(d));g.stroke();}
    for(let d=NS.base+10;d<=n.di;d+=2){g.beginPath();g.moveTo(n.x-17,yOf(d));g.lineTo(n.x+17,yOf(d));g.stroke();}
    if(n===front){g.strokeStyle='rgba(44,79,224,.55)'; g.lineWidth=2.5; g.beginPath(); g.arc(n.x,y,19+Math.sin(now/220)*1.5,0,7); g.stroke();}
    g.fillStyle=n.st==='pop'?'#087A5A':n.st==='miss'?'#B42318':NS.colors?PCHEX[n.L]:ink;
    g.save(); g.translate(n.x,y); g.rotate(-.35); g.beginPath(); g.ellipse(0,0,10.5*r,7.6*r,0,0,7); g.fill(); g.restore();
    if(n.st==='live'||NS.demo){ g.strokeStyle=g.fillStyle; g.lineWidth=2; const up=n.di<NS.base+4; g.beginPath(); g.moveTo(n.x+(up?9.6:-9.6),y); g.lineTo(n.x+(up?9.6:-9.6),y+(up?-46:46)); g.stroke(); }
    else { g.font='800 26px Archivo, sans-serif'; g.textAlign='center'; g.fillText(n.L,n.x,y-22-age*18); g.textAlign='left'; }
    g.globalAlpha=1;
  });
}

/* ================= Key Finder ================= */
const KF={mode:'letter',t:null,done:false};
const KHINT={C:'C sits just left of the two black keys.',D:'D sits between the two black keys.',E:'E sits just right of the two black keys.',F:'F sits just left of the three black keys.',G:'G sits between the first and second of the three black keys.',A:'A sits between the second and third of the three black keys.',B:'B sits just right of the three black keys.'};
function kfNew(){const pool=NSPOOL.treble[2]; let t; do{t=pick(pool);}while(KF.t&&t[0]===KF.t[0]); KF.t=t; KF.done=false;}
function gKeys(){
  if(!KF.t) kfNew(); const L=KF.t[0];
  return `<h3>Find the key</h3><div class="row">${chip('From a letter','kfMode',KF.mode==='letter','data-m="letter"')}${chip('From the staff','kfMode',KF.mode==='staff','data-m="staff"')}</div>
  <div class="row" style="align-items:center">${KF.mode==='letter'?`<span class="prompt ${pcClass(L)}">${L}</span><span class="muted">Tap any ${L} on the keyboard.</span>`:miniStaff(KF.t)+'<span class="muted">Tap this exact note. Middle C is the first C on the left.</span>'}</div>
  ${kbHtml(new Set(),'kfKey')}<div class="fb" id="kfFb"></div><div><button class="btn" data-act="kfNext">Next one</button></div>`;
}
A.kfMode=el=>{KF.mode=el.dataset.m;kfNew();render();};
A.kfNext=()=>{kfNew();render();};
A.kfKey=el=>{const m=+el.dataset.m, tm=parseNote(KF.t).midi; play(m,0,.6,'keys',.45); if(KF.done) return;
  const ok=KF.mode==='letter'?m%12===tm%12:m===tm;
  el.classList.remove('shake','lit','ok'); void el.offsetWidth;
  if(ok){KF.done=true; el.classList.add('lit','ok'); say('kfFb',true,'Yes, that is '+KF.t[0]+'.'); setTimeout(()=>{ if(S.room==='games'&&S.games.tab==='keys'&&KF.done){kfNew();render();} },1100);}
  else {el.classList.add('shake'); say('kfFb',false,(KF.mode==='staff'&&m%12===tm%12?'Right letter, but a different octave. ':'That is '+NN[m%12]+'. ')+KHINT[KF.t[0]]);}
};

/* ================= Note values ================= */
const VALS={w:['Whole note',4],h:['Half note',2],q:['Quarter note',1],e:['Eighth note',.5],dh:['Dotted half note',3],dq:['Dotted quarter note',1.5],rw:['Whole rest',4],rh:['Half rest',2],rq:['Quarter rest',1]};
const BEATS_TXT={.5:'half a beat',1:'1 beat',1.5:'1 and a half beats',2:'2 beats',2.5:'2 and a half beats',3:'3 beats',4:'4 beats'};
function valSvg(k,w){
  w=w||120; let s=`<svg viewBox="0 0 90 80" width="${w}" height="${w*80/90}" aria-hidden="true"><g stroke="#8A93A6">${[20,30,40,50,60].map(y=>`<line x1="4" x2="86" y1="${y}" y2="${y}"/>`).join('')}</g><g fill="#1B2233" stroke="#1B2233">`;
  if(k==='rw') s+='<rect x="37" y="30" width="16" height="5.5"/>';
  else if(k==='rh') s+='<rect x="37" y="34.5" width="16" height="5.5"/>';
  else if(k==='rq') s+='<path d="M41 24 l9 10 -8 8 8 10 q-10 -3 -8 7" fill="none" stroke-width="3"/>';
  else { const open=['w','h','dh'].includes(k);
    s+=`<ellipse cx="44" cy="45" rx="6.6" ry="4.8" transform="rotate(-20 44 45)" fill="${open?'#FCFBF7':'#1B2233'}" stroke-width="1.8"/>`;
    if(k!=='w') s+='<line x1="50.2" y1="44" x2="50.2" y2="12" stroke-width="1.7"/>';
    if(k==='e') s+='<path d="M50.2 12 q11 6 7 17" fill="none" stroke-width="2"/>';
    if(k==='dh'||k==='dq') s+='<circle cx="57" cy="45" r="2.1"/>'; }
  return s+'</g></svg>';
}
const NV={mode:'name',rests:true,q:null,opts:null,done:false};
function nvNew(){const pool=Object.keys(VALS).filter(k=>NV.rests||k[0]!=='r'); let q; do{q=pick(pool);}while(q===NV.q); NV.q=q; NV.done=false;
  NV.opts=shuffle([q,...shuffle(pool.filter(k=>k!==q)).slice(0,3)]);}
function gValues(){
  if(!NV.q) nvNew();
  return `<h3>${NV.mode==='name'?'What is this called?':'How many beats does it last?'}</h3>
  <div class="row">${chip('Name it','nvMode',NV.mode==='name','data-m="name"')}${chip('Count its beats','nvMode',NV.mode==='beats','data-m="beats"')}${chip('Include rests','nvRests',NV.rests)}</div>
  <div class="paper mini" style="align-self:flex-start">${valSvg(NV.q,170)}</div>
  <div class="row">${NV.mode==='name'?NV.opts.map(k=>`<button class="btn ans" data-act="nvPick" data-a="${k}">${VALS[k][0]}</button>`).join(''):[.5,1,1.5,2,3,4].map(b=>`<button class="btn ans" data-act="nvPick" data-a="${b}">${b===.5?'½':b===1.5?'1½':b}</button>`).join('')}</div>
  <div class="fb" id="nvFb"></div><div><button class="btn" data-act="nvNext">Next one</button></div>`;
}
A.nvMode=el=>{NV.mode=el.dataset.m;nvNew();render();};
A.nvRests=()=>{NV.rests=!NV.rests;nvNew();render();};
A.nvNext=()=>{nvNew();render();};
A.nvPick=el=>{ if(NV.done) return; const v=VALS[NV.q], ok=NV.mode==='name'?el.dataset.a===NV.q:+el.dataset.a===v[1];
  el.classList.remove('shake'); void el.offsetWidth;
  if(!ok){el.classList.add('shake'); say('nvFb',false,'Not quite. Have another look and try again.'); return;}
  NV.done=true; el.classList.add('ok'); say('nvFb',true,`${v[0]}: ${BEATS_TXT[v[1]]}. Listen to how long it lasts.`);
  const a=ac().currentTime+.1, beat=.55; for(let i=0;i<Math.max(1,Math.ceil(v[1]));i++) drum('click',a+i*beat,.6); if(NV.q[0]!=='r') play(67,a,v[1]*beat,'tone',.6);
};

/* ================= Fill the bar ================= */
const FB={pre:[],post:[],gap:1,fill:[],done:false,lvl:1};
const FVAL={.5:'e',1:'q',1.5:'dq',2:'h',3:'dh'};
function fbNew(){
  const gap=pick(FB.lvl===1?[1,2,2,3]:[1,1.5,2,3,1.5]); let r=4-gap; const rest=[];
  while(r>1e-6){const o=[.5,1,1,2,1.5].filter(x=>x<=r+1e-6&&(FB.lvl>1||x%1===0)); const v=pick(o); rest.push(v); r-=v;}
  const cut=Math.floor(Math.random()*(rest.length+1)); Object.assign(FB,{gap,pre:rest.slice(0,cut),post:rest.slice(cut),fill:[],done:false});
}
function gFill(){
  if(!FB.pre.length&&!FB.post.length&&!FB.fill.length&&!FB.done) fbNew();
  const sum=FB.fill.reduce((a,b)=>a+b,0), left=FB.gap-sum, blk=(v,cls)=>`<div class="fblk ${cls}" style="flex:${v}">${valSvg(FVAL[v],54)}</div>`;
  return `<h3>Fill the gap so the bar has exactly 4 beats</h3><div class="row">${chip('Whole beats','fbLvl',FB.lvl===1,'data-l="1"')}${chip('With half beats','fbLvl',FB.lvl===2,'data-l="2"')}</div>
  <div class="fbar"><span class="fts">4<br>4</span>${FB.pre.map(v=>blk(v,'')).join('')}${FB.fill.map(v=>blk(v,'mine')).join('')}${left>1e-6?`<div class="fblk gap" style="flex:${left}">?</div>`:''}${FB.post.map(v=>blk(v,'')).join('')}</div>
  <div class="row">${[.5,1,1.5,2,3].filter(v=>FB.lvl>1||v%1===0).map(v=>`<button class="btn ans" data-act="fbAdd" data-v="${v}" aria-label="${VALS[FVAL[v]][0]}">${valSvg(FVAL[v],46)}</button>`).join('')}<button class="btn" data-act="fbUndo">Undo</button></div>
  <div class="fb" id="fbFb"></div><div class="row"><button class="btn" data-act="fbHear">Hear the bar</button><button class="btn" data-act="fbNext">Next bar</button></div>`;
}
A.fbLvl=el=>{FB.lvl=+el.dataset.l;fbNew();render();};
A.fbNext=()=>{fbNew();render();};
A.fbUndo=()=>{ if(!FB.done){FB.fill.pop();render();} };
function fbPlay(){const a=ac().currentTime+.1, beat=.6; let t=0; for(let i=0;i<4;i++) drum('click',a+i*beat,.4); [...FB.pre,...FB.fill,...FB.post].forEach(v=>{play(72,a+t*beat,v*beat*.9,'mallet',.6); t+=v;});}
A.fbHear=()=>fbPlay();
A.fbAdd=el=>{ if(FB.done) return; const v=+el.dataset.v, sum=FB.fill.reduce((a,b)=>a+b,0)+v;
  if(sum>FB.gap+1e-6){el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); say('fbFb',false,`Too long. That needs ${BEATS_TXT[v]}, but the gap has room for ${BEATS_TXT[FB.gap-(sum-v)]}.`); return;}
  FB.fill.push(v); if(Math.abs(sum-FB.gap)<1e-6) FB.done=true; render();
  if(FB.done){say('fbFb',true,'That makes 4 beats. Listen.'); fbPlay();}
};

/* ================= Tap the rhythm ================= */
const TR={lvl:1,cells:null,exp:[],taps:[],on:false,res:null};
function trNew(){const pool=RPOOL[TR.lvl]; TR.cells=Array.from({length:4},()=>pick(pool)); if(TR.cells[0]==='rest') TR.cells[0]='ta'; TR.res=null;}
function gTap(){
  if(!TR.cells) trNew();
  const res=TR.res?`<div class="row">${TR.res.map(r=>`<span class="pill ${r==='on time'?'ok':r==='missed'?'bad':'warn'}">${r}</span>`).join('')}</div>`:'';
  return `<h3>Tap the rhythm in time</h3><div class="row"><span class="muted small">Level</span>${[1,2,3].map(l=>chip(String(l),'trLvl',l===TR.lvl,`data-l="${l}"`)).join('')}</div>
  <div class="rcells">${TR.cells.map((c,i)=>`<span class="rcell" data-i="${i}">${cellSvg(c)}${CELLS[c].n}</span>`).join('')}</div>
  <div class="row"><button class="btn" data-act="trListen">Listen first</button><button class="btn go" data-act="trGo">My turn</button><button class="btn" data-act="trNext">New rhythm</button></div>
  <button class="tappad" data-tap="1" aria-label="Tap pad">Tap here</button>
  <div class="fb" id="trFb">${TR.res?'Each label is one note of the rhythm, in order.':'You get four clicks to count in. Then tap each note on the pad.'}</div>${res}`;
}
A.trLvl=el=>{TR.lvl=+el.dataset.l;trNew();stopAll();render();};
A.trNext=()=>{trNew();stopAll();render();};
A.trListen=()=>playRhythm(TR.cells,()=>76,true,i=>`.rcell[data-i="${i}"]`,false);
A.trGo=()=>{
  stopAll(); const cells=TR.cells, bpm=76; TR.exp=[]; TR.taps=[]; TR.on=true; TR.res=null; say('trFb',true,'Count in: 1, 2, 3, 4');
  startLoop({steps:16+16+4,loop:false,dur:()=>60/bpm/4,
    step:(s,t)=>{ if(s<16){ if(s%4===0) drum(s===0?'click1':'click',t); return; } const k=s-16; if(k>=16) return; if(k%4===0) drum('click',t,.4); if(CELLS[cells[Math.floor(k/4)]].h.includes((k%4)/4)) TR.exp.push(t); },
    ui:s=>{ if(s===16) say('trFb',true,'Go'); if(s>=16&&s<32&&(s-16)%4===0) nowMark(`.rcell[data-i="${(s-16)/4}"]`); },
    onStop:()=>{ if(!TR.on) return; TR.on=false; const lat=(AC.baseLatency||0)+(AC.outputLatency||0), used=new Set();
      TR.res=TR.exp.map(e=>{let best=-1,bd=9; TR.taps.forEach((tp,i)=>{const d=tp-lat-e; if(!used.has(i)&&Math.abs(d)<Math.abs(bd)){bd=d;best=i;}}); if(best<0||Math.abs(bd)>.3) return 'missed'; used.add(best); return Math.abs(bd)<=.12?'on time':bd<0?'early':'late';});
      if(S.room==='games'&&S.games.tab==='tap') render(); }});
};
document.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-tap]'); if(!el) return; e.preventDefault(); ac(); drum('wood'); if(TR.on) TR.taps.push(AC.currentTime); el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit');});

/* ================= Major or minor ================= */
const CH={q:null,arp:false,done:false};
function chNew(){CH.q={root:55+Math.floor(Math.random()*10),minor:Math.random()<.5}; CH.done=false;}
function gChord(){
  if(!CH.q) chNew();
  return `<h3>Is the chord major or minor?</h3><div class="row">${chip('All together','chArp',!CH.arp,'data-v="0"')}${chip('One note at a time','chArp',CH.arp,'data-v="1"')}</div>
  <div class="row"><button class="btn go" data-act="chHear">Hear the chord</button><button class="btn" data-act="chNext">Next one</button></div>
  <div class="row"><button class="btn ans" data-act="chPick" data-a="major">Major</button><button class="btn ans" data-act="chPick" data-a="minor">Minor</button></div><div class="fb" id="chFb"></div>
  <p class="small muted">Major chords often sound bright. Minor chords often sound darker. The only change is the middle note.</p>`;
}
A.chArp=el=>{CH.arp=el.dataset.v==='1';render();};
A.chHear=()=>{const a=ac().currentTime+.05, q=CH.q; [0,q.minor?3:4,7].forEach((iv,i)=>play(q.root+iv,a+(CH.arp?i*.4:0),CH.arp?1.6-i*.4:1.5,'keys',.5)); if(CH.arp) [0,q.minor?3:4,7].forEach(iv=>play(q.root+iv,a+1.5,1.4,'keys',.4));};
A.chNext=()=>{chNew();render();A.chHear();};
A.chPick=el=>{ if(CH.done) return; const ans=CH.q.minor?'minor':'major', ok=el.dataset.a===ans; el.classList.remove('shake'); void el.offsetWidth;
  if(ok){CH.done=true; el.classList.add('ok'); say('chFb',true,'Yes, '+ans+'.');} else {el.classList.add('shake'); say('chFb',false,'Listen again. Hum the middle note.'); A.chHear();} };
