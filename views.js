/* Music Hub views: Home, Practice, Create, Tools, Songs. */
'use strict';
const S={
  room:'home', inst:store.get('inst','uke'), done:store.get('done',{}),
  bench:{chord:null,snd:'angklung'}, echo:{lvl:0,pat:null},
  songs:{q:'',kind:'all',lvl:0,open:null,mode:'letters',inst:'uke',shift:0,bpm:100,drums:true,click:false,backing:true,snd:'keys'},
  create:{tab:'song'}, tools:{tab:'metro',tuner:'uke'}
};
const ROOMS=['home','practice','games','create','tools','songs'];
const A={}, I={};
const app=()=>$('#app');
const chip=(label,act,on,extra)=>`<button class="chip" data-act="${act}" aria-pressed="${on?'true':'false'}" ${extra||''}>${esc(label)}</button>`;
const pcClass=L=>'pc pc-'+L;

function go(room){ if(S.room!==room) stopAll(); S.room=room; const m=app(); m.classList.remove('enter'); void m.offsetWidth; m.classList.add('enter'); try{ if(location.hash.slice(1)!==room) location.hash=room; }catch(e){} render(); window.scrollTo(0,0); }
function render(){
  document.body.dataset.room=S.room;
  $$('nav button').forEach(b=>b.setAttribute('aria-current',b.dataset.v===S.room?'page':'false'));
  app().innerHTML=({home:vHome,practice:vPractice,games:vGames,create:vCreate,tools:vTools,songs:vSongs})[S.room]();
}
A.nav=el=>go(el.dataset.v);
A.stop=()=>stopAll();

/* ================= HOME ================= */
function vHome(){
  const full=SONGS.filter(s=>s.kind==='mel').length, charts=SONGS.length-full;
  return `<section class="hero"><span class="eyebrow" style="color:#9BA8C4">Grades 3 to 6</span><h1>Pick a room. Make some music.</h1>
  <p>Work at your own pace. Choose an instrument, tick off what you can do, then try the next thing.</p></section>
  <div class="doors">
    <button class="door d-practice" data-act="nav" data-v="practice"><b>Practice</b><span>Skill paths for ukulele, guitar, piano, angklung, voice, drums and rock band.</span><em>7 instruments, 4 levels each</em></button>
    <button class="door d-games" data-act="nav" data-v="games"><b>Games</b><span>Note Slide, Key Finder, Fill the Bar, Tap the Rhythm and more.</span><em>${GAMES.length} games</em></button>
    <button class="door d-create" data-act="nav" data-v="create"><b>Create</b><span>Song Maker, Beat Maker, Chord Jam and Rhythm Builder.</span><em>4 music makers</em></button>
    <button class="door d-tools" data-act="nav" data-v="tools"><b>Tools</b><span>Metronome, tuner, group maker and timer.</span><em>4 classroom tools</em></button>
    <button class="door d-songs" data-act="nav" data-v="songs"><b>Songs</b><span>Tab, staff, numbers and solfège for ${full} pieces. Chord charts for ${charts} songs.</span><em>${SONGS.length} songs</em></button>
  </div>
  <section class="card"><h2>Start with your instrument</h2><div class="row">${INSTRUMENTS.map(i=>chip(i.n,'inst',false,`data-id="${i.id}"`)).join('')}</div></section>
  <section class="card"><h3>Want longer lessons?</h3><p class="muted">The Music Sandbox has step-by-step guitar, keyboard and drum lessons with quick checks.</p>
  <div><a class="btn" style="display:inline-flex;align-items:center;text-decoration:none;color:var(--fg)" href="${SANDBOX_URL}" target="_blank" rel="noopener">Open the Music Sandbox</a></div></section>`;
}

/* ================= PRACTICE ================= */
A.inst=el=>{S.inst=el.dataset.id; store.set('inst',S.inst); S.bench.chord=null; stopAll(); go('practice');};
A.tick=el=>{const k=el.dataset.k; if(el.checked) S.done[k]=1; else delete S.done[k]; store.set('done',S.done); const m=$('#pathMeter'); if(m) m.outerHTML=pathMeter();};
A.skill=el=>{
  const [kind,a,b,c]=el.dataset.go.split(':');
  if(kind==='game'||(kind==='tool'&&GAMES.some(g=>g[0]===a))){S.games.tab=a; go('games');}
  else if(kind==='tool'){S.tools.tab=a; if(b) S.tools.tuner=b; go('tools');}
  else if(kind==='songs'){Object.assign(S.songs,{kind:a,lvl:+b,open:null,q:''}); if(c){S.songs.mode=c==='gtr'?'gtr':c; } go('songs');}
  else if(kind==='song'){openSong(a); go('songs');}
  else if(kind==='create'){S.create.tab=a; if(b&&a==='beat') beatPreset(b); go('create');}
  else if(kind==='inst'){S.inst=a; store.set('inst',a); go('practice');}
  else if(kind==='bench'){ if(a){ if(curInst().bench==='echo'){S.echo.lvl=+a;S.echo.pat=null;} else S.bench.chord=a; } render(); const b=$('#bench'); if(b) b.scrollIntoView({behavior:'smooth',block:'start'}); }
};
const curInst=()=>INSTRUMENTS.find(i=>i.id===S.inst)||INSTRUMENTS[0];
function pathMeter(){
  const p=PATHS[S.inst], total=p.reduce((a,l)=>a+l.length,0), n=Object.keys(S.done).filter(k=>k.startsWith(S.inst+'.')).length;
  return `<div class="row" id="pathMeter"><div class="meter"><i style="width:${Math.round(n/total*100)}%"></i></div><span class="small muted">${n} of ${total} ticked</span></div>`;
}
function vPractice(){
  const inst=curInst(), path=PATHS[inst.id];
  return `<div><span class="eyebrow">Practice</span><h2>${esc(inst.n)}</h2></div>
  <div class="row">${INSTRUMENTS.map(i=>chip(i.n,'inst',i.id===inst.id,`data-id="${i.id}"`)).join('')}</div>
  <section class="card" id="bench">${bench(inst)}</section>
  <section class="card"><h3>My path</h3><p class="muted small">Tick a box when you can do it three times in a row. Tap the link to practise it.</p>${pathMeter()}
  <div class="levels">${path.map((lv,li)=>`<div class="level"><h3>Level ${li+1}<span class="small muted">${['Starting out','Getting going','Playing songs','Leading'][li]}</span></h3>
    ${lv.map((sk,si)=>{const k=`${inst.id}.${li}.${si}`;return `<div class="skill"><input type="checkbox" id="sk-${k}" data-act="tick" data-k="${k}" ${S.done[k]?'checked':''} aria-label="I can ${esc(sk[1])}">
    <div><div class="st">${STRANDS[sk[0]]}</div><label for="sk-${k}">I can ${esc(sk[1])}</label><div><button data-act="skill" data-go="${esc(sk[2])}">${goLabel(sk[2])}</button></div></div></div>`;}).join('')}</div>`).join('')}</div></section>`;
}
function goLabel(g){const [k,a]=g.split(':'); if(k==='game'||(k==='tool'&&GAMES.some(x=>x[0]===a))) return 'Play the game'; return ({tool:'Open the tool',songs:'Find songs',song:'Open the song',create:'Open the maker',inst:'Go to rock band',bench:'Try it above'})[k];}
function bench(inst){
  if(inst.bench==='chords') return benchChords(inst);
  if(inst.bench==='keys') return benchKeys(inst);
  if(inst.bench==='bars') return benchBars();
  if(inst.bench==='echo') return benchEcho();
  if(inst.bench==='kit') return `<h3>The kit</h3><p class="muted small">Tap each pad. Say its name. Then try kick, snare, kick, snare while you count 1, 2, 3, 4.</p>
    <div class="pads">${[['kick','Kick','#D93A40'],['snare','Snare','#3B5BDB'],['hat','Hi-hat','#0C8F88'],['tom','Tom','#E8731A'],['clap','Clap','#A33FB5']].map(p=>`<button class="pad" style="background:${p[2]}" data-act="pad" data-k="${p[0]}">${p[1]}</button>`).join('')}</div>
    <div><button class="btn go" data-act="skill" data-go="create:beat:rock1">Build Rock Beat 1 in Beat Maker</button></div>`;
  return `<h3>Jobs in the band</h3><div class="grid">${BAND_ROLES.map(r=>`<div class="note"><b>${r[0]}</b><br>${r[1]}</div>`).join('')}</div>
    <h3>Our band agreements</h3><ol style="margin:0;padding-left:1.2em;display:grid;gap:4px">${BAND_AGREEMENTS.map(a=>`<li>${a}</li>`).join('')}</ol>
    <div class="row"><button class="btn go" data-act="skill" data-go="songs:chart:1">Pick a band song</button><button class="btn" data-act="skill" data-go="create:chords">Write our own loop</button></div>`;
}
function benchChords(inst){
  const kind=inst.id==='guitar'?'gtr':'uke', c=inst.set.includes(S.bench.chord)?S.bench.chord:inst.set[0]; S.bench.chord=c;
  const others=inst.set.filter(x=>x!==c);
  return `<h3>Chord shapes</h3><div class="row">${inst.set.map(x=>chip(x,'bchord',x===c,`data-c="${esc(x)}"`)).join('')}</div>
  <div class="row" style="align-items:flex-start"><div class="dg"><b>${esc(c)}</b>${chordDiagram(c,kind)}</div>
  <div style="display:flex;flex-direction:column;gap:10px;flex:1;min-width:220px"><p class="small muted">Dots show where fingers go. A circle means play the string open. A cross means do not play it. Press just behind the fret.</p>
  <div class="row"><button class="btn go" data-act="hear" data-c="${esc(c)}">Hear ${esc(c)}</button></div>
  <div class="row"><label class="ctl" for="drillB">Switch drill with</label><select class="field" id="drillB">${others.map(o=>`<option>${esc(o)}</option>`).join('')}</select><button class="btn" data-act="drill">Start drill</button></div>
  <div class="fb" id="drillNow"></div></div></div>`;
}
A.bchord=el=>{S.bench.chord=el.dataset.c; stopAll(); render(); playChordNow(S.bench.chord);};
A.hear=el=>playChordNow(el.dataset.c);
function playChordNow(c){ if(S.inst==='piano') chordMidis(c).forEach(m=>play(m+12,0,1.2,'keys',.45)); else strum(c,0,'D',.45); }
A.drill=()=>{
  const a=S.bench.chord, b=$('#drillB').value, seq=[a,b];
  startLoop({steps:8,loop:true,dur:()=>1,step:(i,t)=>{drum(i%4===0?'click1':'click',t); if(i%4===0){const c=seq[i/4]; if(S.inst==='piano') chordMidis(c).forEach(m=>play(m+12,t,1.5,'keys',.4)); else strum(c,t,'D',.42);}},
    ui:i=>{const n=$('#drillNow'); if(n) n.textContent=`Play ${seq[Math.floor(i/4)]}   ·   beat ${i%4+1}   ·   next: ${seq[1-Math.floor(i/4)]}`;},onStop:()=>{const n=$('#drillNow'); if(n) n.textContent='';}});
};
function kbHtml(lit,act){
  act=act||'key';
  const W=[0,2,4,5,7,9,11], n=15, base=60; let h='<div class="kb-wrap"><div class="kb">';
  for(let i=0;i<n;i++){const m=base+12*Math.floor(i/7)+W[i%7], L='CDEFGAB'[i%7]; h+=`<button class="w ${lit.has(m)?'lit '+pcClass(L):''}" data-act="${act}" data-m="${m}">${L}</button>`;}
  for(let i=0;i<n-1;i++){ if([0,1,3,4,5].includes(i%7)){const m=base+12*Math.floor(i/7)+W[i%7]+1; h+=`<button class="b ${lit.has(m)?'lit':''}" style="left:${(i+1)/n*100}%" data-act="${act}" data-m="${m}" aria-label="${NN[m%12]}"></button>`;} }
  return h+'</div></div>';
}
function benchKeys(inst){
  const c=S.bench.chord, lit=new Set(c&&inst.set.includes(c)?chordMidis(c).map(m=>m+12):[]);
  return `<h3>Keyboard</h3><p class="small muted">Tap the keys. C sits just left of each pair of black keys. Tap a chord to see which keys to press.</p>
  ${kbHtml(lit)}<div class="row">${inst.set.map(x=>chip(x,'bchord',x===c,`data-c="${esc(x)}"`)).join('')}${c?chip('Clear','bclear',false):''}</div>`;
}
A.bclear=()=>{S.bench.chord=null;render();};
A.key=el=>play(+el.dataset.m,0,.8,'keys',.5);
A.pad=el=>drum(el.dataset.k);
function benchBars(){
  const notes=[60,62,64,65,67,69,71,72];
  return `<h3>Angklung and bars</h3><p class="small muted">Tap a bar to play it. The number is the angklung number. The word is solfège.</p>
  <div class="row">${chip('Angklung shake','bsnd',S.bench.snd==='angklung','data-s="angklung"')}${chip('Xylophone','bsnd',S.bench.snd==='mallet','data-s="mallet"')}</div>
  <div class="barset">${notes.map((m,i)=>{const L=NN[m%12];return `<button class="${pcClass(L)}" style="height:${170-i*12}px" data-act="bar" data-m="${m}">${i===7?"1'":i+1}<small>${L} · ${SOLF[m%12]}</small></button>`;}).join('')}</div>
  <div class="row"><button class="btn go" data-act="skill" data-go="songs:mel:1:numbers">Play a song from numbers</button></div>`;
}
A.bsnd=el=>{S.bench.snd=el.dataset.s;render();};
A.bar=el=>play(+el.dataset.m,0,.6,S.bench.snd,.55);
const ECHO=[[7,4],[7,4,9],[0,2,4,7,9],[0,2,4,5,7],[0,2,4,5,7,9,11,12]];
const ECHO_N=['so mi','so mi la','do re mi so la','do to so','whole scale'];
function benchEcho(){
  const set=ECHO[S.echo.lvl].slice().sort((a,b)=>a-b);
  return `<h3>Echo singing</h3><p class="small muted">Listen for four beats. Then sing it back for four beats while the ladder lights up. Use hand signs if you know them.</p>
  <div class="row">${ECHO_N.map((n,i)=>chip(n,'elvl',i===S.echo.lvl,`data-l="${i}"`)).join('')}</div>
  <div class="row" style="align-items:flex-start"><div class="ladder">${set.map(d=>{const L=NN[d%12];return `<span class="pc-${L}" data-d="${d}">${d===12?"do'":SOLF[d]}</span>`;}).join('')}</div>
  <div style="display:flex;flex-direction:column;gap:10px"><button class="btn go" data-act="echo" data-new="1">New pattern</button><button class="btn" data-act="echo">Hear it again</button><div class="fb" id="echoFb"></div></div></div>`;
}
A.elvl=el=>{S.echo.lvl=+el.dataset.l;S.echo.pat=null;stopAll();render();};
A.echo=el=>{
  const set=ECHO[S.echo.lvl]; if(el.dataset.new||!S.echo.pat){let p=[pick(set)]; while(p.length<4){const n=pick(set); if(n!==p[p.length-1]||set.length<3) p.push(n);} S.echo.pat=p;}
  const p=S.echo.pat;
  startLoop({steps:8,loop:false,dur:()=>.75,step:(i,t)=>{ if(i<4) play(60+p[i],t,.68,'tone',.6); else drum('click',t,.5); },
    ui:i=>{nowMark(`.ladder span[data-d="${p[i%4]}"]`); const f=$('#echoFb'); if(f) f.textContent=i<4?'Listen':'Your turn';},onStop:()=>{const f=$('#echoFb'); if(f) f.textContent='';}});
};

/* ================= SONGS ================= */
function openSong(id){const s=songById(id); if(!s) return; stopAll(); Object.assign(S.songs,{open:id,shift:0,bpm:Math.min(s.bpm,140)});}
A.song=el=>{openSong(el.dataset.id);render();window.scrollTo(0,0);};
A.back=()=>{stopAll();S.songs.open=null;render();};
A.fkind=el=>{S.songs.kind=el.dataset.k;render();};
A.flvl=el=>{S.songs.lvl=+el.dataset.l;render();};
I.q=el=>{S.songs.q=el.value; $('#songlist').innerHTML=songList();};
function filtered(){
  const f=S.songs, q=f.q.trim().toLowerCase();
  return SONGS.filter(s=>(f.kind==='all'||s.kind===f.kind)&&(!f.lvl||s.lvl===f.lvl)&&(!q||(s.t+' '+s.by+' '+(s.tags||'')+' '+(s.chords||[]).join(' ')).toLowerCase().includes(q)))
    .sort((a,b)=>a.lvl-b.lvl||a.t.localeCompare(b.t));
}
function songList(){
  const l=filtered();
  return `<p class="small muted" style="grid-column:1/-1">${l.length} song${l.length===1?'':'s'}</p>`+(l.map(s=>`<button class="song" data-act="song" data-id="${s.id}"><b>${esc(s.t)}</b><span class="small muted">${esc(s.by)}</span>
    <span><span class="tag ${s.kind==='mel'?'t-full':'t-chart'}">${s.kind==='mel'?'Full notation':'Chord chart'}</span><span class="tag">Level ${s.lvl}</span>${s.kind==='chart'?`<span class="tag">${s.nch} chord${s.nch>1?'s':''}</span>`:''}</span></button>`).join('')||'<p>No songs match. Try fewer filters.</p>');
}
function vSongs(){
  if(S.songs.open) return vSong(songById(S.songs.open));
  const f=S.songs;
  return `<div><span class="eyebrow">Songs</span><h2>Song library</h2></div>
  <section class="card"><div class="row"><input class="field" id="q" data-in="q" type="search" placeholder="Search a song, artist or chord" value="${esc(f.q)}" style="flex:1;min-width:200px" aria-label="Search songs"></div>
  <div class="row">${chip('All','fkind',f.kind==='all','data-k="all"')}${chip('Full notation','fkind',f.kind==='mel','data-k="mel"')}${chip('Chord charts','fkind',f.kind==='chart','data-k="chart"')}
  <span class="muted small">Level</span>${[0,1,2,3,4].map(l=>chip(l?String(l):'Any','flvl',f.lvl===l,`data-l="${l}"`)).join('')}</div>
  <p class="note"><b>Full notation</b> songs are traditional, classical or written for the Hub, so you get tab, staff, numbers and solfège. <b>Chord charts</b> show the chords and form of well-known songs in an easy key. They have no lyrics or melody, so play along with the recording.</p></section>
  <div class="songlist" id="songlist">${songList()}</div>`;
}
const MODES=[['letters','Letters'],['solfege','Solfège'],['numbers','Numbers'],['staff','Staff'],['uke','Ukulele tab'],['gtr','Guitar tab']];
function vSong(s){
  const f=S.songs, head=`<div><button class="btn small" data-act="back">Back to songs</button></div><div><span class="eyebrow">${s.kind==='mel'?'Full notation':'Chord chart'} · Level ${s.lvl}</span><h2>${esc(s.t)}</h2><p class="muted">${esc(s.by)}</p></div>`;
  const tempo=`<label class="ctl" for="bpm">Speed <span class="mono" id="bpmV">${f.bpm}</span></label><input type="range" id="bpm" data-in="bpm" min="40" max="180" value="${f.bpm}">`;
  if(s.kind==='mel'){
    const mode=MODES.some(m=>m[0]===f.mode)?f.mode:'letters';
    return head+`<section class="card"><div class="row"><button class="btn go" data-act="playMel">Play</button>${tempo}</div>
    <div class="row"><label class="ctl" for="snd">Sound</label><select class="field" id="snd" data-in="snd">${[['keys','Piano'],['mallet','Xylophone'],['angklung','Angklung'],['pluck','Guitar'],['synth','Synth']].map(o=>`<option value="${o[0]}" ${f.snd===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select>
    ${s.ch?chip('Backing chords','tog',f.backing,'data-k="backing"'):''}${chip('Click','tog',f.click,'data-k="click"')}</div></section>
    <section class="card"><div class="row">${MODES.map(m=>chip(m[1],'mode',m[0]===mode,`data-m="${m[0]}"`)).join('')}</div><div id="score">${melBody(s,mode)}</div></section>`;
  }
  const sh=f.shift, keys=[0,7,2,5,9], inst=['uke','gtr','piano'].includes(f.inst)?f.inst:'uke', st=STRUMS[s.strum], used=s.chords.map(c=>transChord(c,sh));
  let b=0;
  return head+`<section class="card"><div class="row"><button class="btn go" data-act="playChart">Play along</button>${tempo}</div>
  <div class="row">${chip('Drums','tog',f.drums,'data-k="drums"')}${chip('Click','tog',f.click,'data-k="click"')}<span class="muted small">Key</span>${keys.map(k=>chip(transChord(s.key,k),'shift',k===sh,`data-n="${k}"`)).join('')}</div></section>
  <section class="card">${s.secs.map(sec=>`<div><h3>${esc(sec[0]==='All'?'Whole song':sec[0])}</h3></div><div class="bars">${sec[1].map(bar=>`<div class="barcell" data-b="${b++}">${bar.map(c=>{const t=transChord(c,sh);return `<span class="${pcClass(parseChord(t).L)}">${esc(t)}</span>`;}).join('')}</div>`).join('')}</div>`).join('')}
  <div class="row"><span class="small muted">Strum: ${st.n}</span>${strumHtml(st.p)}</div>
  <p class="small muted">Chords are simplified to an easy key and may differ from the recording. Each box is one bar. Repeat each part as the song needs.</p></section>
  <section class="card"><div class="row"><h3>Chord shapes</h3>${chip('Ukulele','cinst',inst==='uke','data-i="uke"')}${chip('Guitar','cinst',inst==='gtr','data-i="gtr"')}${chip('Piano','cinst',inst==='piano','data-i="piano"')}</div>
  <div class="diagrams">${used.map(c=>`<button class="dg" data-act="hearC" data-c="${esc(c)}"><b>${esc(c)}</b>${chordDiagram(c,inst)}</button>`).join('')}</div></section>`;
}
function strumHtml(p){const cnt=p.length===6?['1','&','2','&','3','&']:['1','&','2','&','3','&','4','&'];return `<div class="strum">${p.split('').map((c,i)=>`<span>${c==='D'?'↓':c==='U'?'↑':'·'}<small>${cnt[i]}</small></span>`).join('')}</div>`;}
function melBody(s,mode){
  if(mode==='staff') return `<div class="paper">${staffSvg(s,{names:true})}</div>`;
  if(mode==='uke'||mode==='gtr'){const t=tabText(s,mode);return `<pre class="tab">${esc(t.text)}</pre><p class="small muted">${mode==='uke'?'Top line is the A string, the one nearest the floor.':'Top line is the thin E string.'} Numbers are frets. 0 means open.${t.shift?` Shown ${t.shift>0?'an octave higher':'an octave lower'} to fit the instrument.`:''}</p>`;}
  const {ev,bars}=barsOf(s), d=keyDo(s.key);
  const ms=ev.filter(e=>!e.rest).map(e=>e.midi).sort((a,b)=>a-b), ref=Math.floor((ms[ms.length>>1]-d)/12)*12+d;
  const lab=e=>mode==='solfege'?SOLF[(e.midi-d+120)%12]:mode==='numbers'?NUMS[(e.midi-d+120)%12]:e.L+(e.acc==='#'?'♯':e.acc==='b'?'♭':'');
  const mark=e=>{ if(mode==='letters'||e.rest) return ''; const rel=e.midi-ref; return rel>=12?"'":rel<0?',':''; };
  return `<div class="notes">${bars.map(b=>b.map(e=>`<span class="n ${e.rest?'rest':pcClass(e.L)}" data-n="${e.i}" style="width:${Math.round(18+e.dur*24)}px">${e.rest?'–':lab(e)+mark(e)}</span>`).join('')).join('<span class="bar-sep"></span>')}</div>
  <p class="small muted">Wider boxes are longer notes. ${mode==='letters'?'':'A mark after the name (\') means the high one. A comma means the low one.'} ${mode==='numbers'?'Numbers match the angklung: 1 is do.':''}</p>`;
}
A.mode=el=>{S.songs.mode=el.dataset.m; $('#score').innerHTML=melBody(songById(S.songs.open),S.songs.mode); $$('[data-act="mode"]').forEach(b=>b.setAttribute('aria-pressed',b===el));};
A.tog=el=>{const k=el.dataset.k; S.songs[k]=!S.songs[k]; el.setAttribute('aria-pressed',S.songs[k]);};
A.shift=el=>{S.songs.shift=+el.dataset.n; const was=!!LOOP; stopAll(); render(); if(was) A.playChart();};
A.cinst=el=>{S.songs.inst=el.dataset.i; render();};
A.hearC=el=>{ if(S.songs.inst==='piano') chordMidis(el.dataset.c).forEach(m=>play(m+12,0,1.2,'keys',.45)); else strum(el.dataset.c,0,'D',.45); };
I.bpm=el=>{S.songs.bpm=+el.value; $('#bpmV').textContent=el.value;};
I.snd=el=>{S.songs.snd=el.value;};
A.playMel=()=>{
  if(LOOP){stopAll();return;}
  const s=songById(S.songs.open), f=S.songs, ev=parseMel(s.mel), at={}; let t=0; ev.forEach((e,i)=>{at[Math.round(t*4)]=i; t+=e.dur;});
  const steps=Math.round(t*4), pk=s.pickup||0, ch=s.ch?s.ch.split(/\s+/).map(b=>b.split('_')):null, pulse=s.ts==='6/8'?1.5:1;
  startLoop({steps,loop:false,dur:()=>60/f.bpm/4,
    step:(k,tm)=>{const beat=k/4, i=at[k];
      if(i!=null&&!ev[i].rest) play(ev[i].midi,tm,ev[i].dur*60/f.bpm,f.snd,.55);
      if(beat<pk) { if(f.click&&k%4===0) drum('click',tm); return; }
      const pos=(beat-pk)%s.meter, bar=Math.floor((beat-pk)/s.meter+1e-6);
      if(Math.abs(pos/pulse-Math.round(pos/pulse))<1e-6){
        if(f.click) drum(pos<1e-6?'click1':'click',tm);
        if(ch&&f.backing){const b=ch[bar%ch.length], c=b[Math.min(b.length-1,Math.floor(pos/(s.meter/b.length)+1e-6))]; strum(c,tm,'D',pos<1e-6?.3:.2);}
      }},
    ui:k=>{const i=at[k]; if(i!=null) nowMark(`[data-n="${i}"]`,$('#score'));}});
};
function chartBars(s){const out=[];s.secs.forEach(sec=>sec[1].forEach(b=>out.push(b)));return out;}
function playChart(s,o){ /* o: bpm(), shift, drums(), click(), root selector for bars */
  const bars=chartBars(s), slots=s.meter===3?6:8, pat=STRUMS[s.strum].p;
  startLoop({steps:bars.length*slots,loop:true,dur:()=>60/o.bpm()/2,
    step:(i,t)=>{const bar=bars[Math.floor(i/slots)], k=i%slots, c=transChord(bar[Math.min(bar.length-1,Math.floor(k/(slots/bar.length)))],o.shift), d=pat[k%pat.length];
      if(d==='D'||d==='U') strum(c,t,d,.34);
      if(k===0||(bar.length>1&&k===slots/2)) play(chordMidis(c)[0]-12,t,.5,'synth',.5);
      beatDrums(k,s.meter,t,o.drums()); if(o.click()&&k%2===0) drum(k===0?'click1':'click',t);},
    ui:i=>{ if(i%slots===0) nowMark(`.barcell[data-b="${Math.floor(i/slots)}"]`); }});
}
A.playChart=()=>{ if(LOOP){stopAll();return;} const f=S.songs; playChart(songById(f.open),{bpm:()=>f.bpm,shift:f.shift,drums:()=>f.drums,click:()=>f.click}); };

/* ================= CREATE ================= */
A.ctab=el=>{stopAll();S.create.tab=el.dataset.t;render();};
function vCreate(){
  const t=S.create.tab;
  return `<div><span class="eyebrow">Create</span><h2>Make your own music</h2></div>
  <div class="row">${[['song','Song Maker'],['beat','Beat Maker'],['chords','Chord Jam'],['rhythm','Rhythm Builder']].map(x=>chip(x[1],'ctab',x[0]===t,`data-t="${x[0]}"`)).join('')}</div>
  ${({song:vSongMaker,beat:vBeat,chords:vJam,rhythm:vRhythm})[t]()}`;
}
/* --- Song Maker --- */
const SCALES={penta:['Pentatonic',[60,62,64,67,69,72,74,76,79,81]],major:['Major',[60,62,64,65,67,69,71,72,74,76]],minor:['Minor',[57,59,60,62,64,65,67,69,71,72]],blues:['Blues',[60,63,65,66,67,70,72,75,77,79]]};
const SM=Object.assign({scale:'penta',cols:16,bpm:110,snd:'mallet',g:{}},store.get('sm',{}));
const smSave=()=>store.set('sm',SM);
function seqHead(cols,div){let h='<div class="seq-row"><span></span>';for(let c=0;c<cols;c++) h+=`<span class="muted">${c%div===0?c/div%4+1:c%(div/2)===0&&div>2?'&':''}</span>`;return h+'</div>';}
function vSongMaker(){
  const rows=SCALES[SM.scale][1].slice().reverse(), dr=[['hat','Hat'],['snare','Snare'],['kick','Kick']];
  const row=(key,label,cls,style)=>{let h=`<div class="seq-row"><span class="${cls}" style="${style||''}">${label}</span>`;for(let c=0;c<SM.cols;c++){const k=key+':'+c;h+=`<button class="cell ${c%4===0&&c?'b4':''} ${cls.split(' ')[1]||''} ${SM.g[k]?'on':''}" data-act="smCell" data-k="${k}" data-c="${c}" aria-label="${label} step ${c+1}"></button>`;}return h+'</div>';};
  return `<section class="card"><div class="row"><button class="btn go" data-act="smPlay">Play</button><label class="ctl" for="smBpm">Speed <span class="mono" id="smBpmV">${SM.bpm}</span></label><input type="range" id="smBpm" data-in="smBpm" min="60" max="180" value="${SM.bpm}"></div>
  <div class="row"><span class="muted small">Scale</span>${Object.keys(SCALES).map(k=>chip(SCALES[k][0],'smScale',k===SM.scale,`data-s="${k}"`)).join('')}
  <span class="muted small">Length</span>${chip('2 bars','smCols',SM.cols===16,'data-n="16"')}${chip('4 bars','smCols',SM.cols===32,'data-n="32"')}</div>
  <div class="row"><label class="ctl" for="smSnd">Sound</label><select class="field" id="smSnd" data-in="smSnd">${[['mallet','Xylophone'],['keys','Piano'],['pluck','Guitar'],['synth','Synth']].map(o=>`<option value="${o[0]}" ${SM.snd===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select><button class="btn" data-act="smClear">Clear</button></div>
  <div class="seq" style="--cols:${SM.cols}">${seqHead(SM.cols,2)}${rows.map(m=>{const n=NN[m%12];return row(m,n,'pc pc-'+n[0]);}).join('')}<div style="height:6px"></div>${dr.map(d=>row(d[0],d[1],'muted')).join('')}</div>
  <p class="small muted">Tap squares to add notes. Each colour is one note name. Your song saves on this iPad.</p></section>
  <section class="card"><h3>Share your song</h3><p class="small muted">Copy your song code and paste it into your process journal. Paste a code here to load a song.</p>
  <div class="row"><button class="btn" data-act="smCopy">Copy my song code</button><input class="field" id="smCode" placeholder="Paste a song code" style="flex:1;min-width:180px" aria-label="Song code"><button class="btn" data-act="smLoad">Load</button></div><div class="fb" id="smFb"></div></section>`;
}
A.smCell=el=>{const k=el.dataset.k; if(SM.g[k]) delete SM.g[k]; else {SM.g[k]=1; const [r]=k.split(':'); if(+r) play(+r,0,.3,SM.snd,.5); else drum(r);} el.classList.toggle('on'); smSave();};
A.smScale=el=>{SM.scale=el.dataset.s; Object.keys(SM.g).forEach(k=>{if(+k.split(':')[0]) delete SM.g[k];}); smSave(); stopAll(); render();};
A.smCols=el=>{SM.cols=+el.dataset.n; smSave(); stopAll(); render();};
A.smClear=()=>{SM.g={}; smSave(); stopAll(); render();};
I.smBpm=el=>{SM.bpm=+el.value; $('#smBpmV').textContent=el.value; smSave();};
I.smSnd=el=>{SM.snd=el.value; smSave();};
A.smPlay=()=>{ if(LOOP){stopAll();return;}
  startLoop({steps:SM.cols,loop:true,dur:()=>60/SM.bpm/2,step:(c,t)=>{Object.keys(SM.g).forEach(k=>{const [r,cc]=k.split(':'); if(+cc!==c) return; if(+r) play(+r,t,.3,SM.snd,.5); else drum(r,t);});},ui:c=>nowMark(`.cell[data-c="${c}"]`)}); };
A.smCopy=()=>{const code='MH1.'+btoa(JSON.stringify({s:SM.scale,c:SM.cols,b:SM.bpm,n:SM.snd,g:Object.keys(SM.g)})); const fb=$('#smFb'); $('#smCode').value=code;
  try{navigator.clipboard.writeText(code).then(()=>{fb.textContent='Copied. Paste it into your journal.';},()=>{fb.textContent='Your code is in the box. Select it and copy.';});}catch(e){fb.textContent='Your code is in the box. Select it and copy.';}};
A.smLoad=()=>{const fb=$('#smFb'); try{const o=JSON.parse(atob($('#smCode').value.trim().replace(/^MH1\./,''))); if(!SCALES[o.s]||!Array.isArray(o.g)) throw 0; SM.scale=o.s; SM.cols=o.c===32?32:16; SM.bpm=Math.max(60,Math.min(180,+o.b||110)); SM.snd=o.n||'mallet'; SM.g={}; o.g.slice(0,600).forEach(k=>{if(/^[a-z0-9]+:\d+$/.test(k)) SM.g[k]=1;}); smSave(); stopAll(); render();}catch(e){fb.textContent='That code did not work. Check you pasted all of it.';}};
/* --- Beat Maker --- */
const BM={bpm:96,g:{},name:''};
const BROWS=[['hat','Hi-hat','#0C8F88'],['clap','Clap','#A33FB5'],['snare','Snare','#3B5BDB'],['tom','Tom','#E8731A'],['kick','Kick','#D93A40']];
const BEATS={rock1:['Rock Beat 1',{hat:[0,2,4,6,8,10,12,14],snare:[4,12],kick:[0,8]}],rock2:['Rock Beat 2',{hat:[0,2,4,6,8,10,12,14],snare:[4,12],kick:[0,8,10]}],
 four:['Four on the floor',{hat:[2,6,10,14],snare:[4,12],kick:[0,4,8,12]}],onedrop:['Reggae one drop',{hat:[0,2,4,6,8,10,12,14],snare:[8],kick:[8]}],
 hiphop:['Hip-hop',{hat:[0,2,4,6,8,10,12,14],snare:[4,12],kick:[0,7,10]}],fill:['Rock beat with a fill',{hat:[0,2,4,6,8,10],snare:[4,14,15],kick:[0,8],tom:[12,13]}]};
function beatPreset(id){const p=BEATS[id]; if(!p) return; BM.g={}; BM.name=p[0]; Object.keys(p[1]).forEach(r=>p[1][r].forEach(c=>BM.g[r+':'+c]=1));}
beatPreset('rock1');
function vBeat(){
  return `<section class="card"><div class="row"><button class="btn go" data-act="bmPlay">Play</button><label class="ctl" for="bmBpm">Speed <span class="mono" id="bmBpmV">${BM.bpm}</span></label><input type="range" id="bmBpm" data-in="bmBpm" min="50" max="160" value="${BM.bpm}"><button class="btn" data-act="bmClear">Clear</button></div>
  <div class="row"><span class="muted small">Start from</span>${Object.keys(BEATS).map(k=>chip(BEATS[k][0],'bmPre',BM.name===BEATS[k][0],`data-p="${k}"`)).join('')}</div>
  <div class="seq" style="--cols:16">${seqHead(16,4)}${BROWS.map(r=>{let h=`<div class="seq-row"><span>${r[1]}</span>`;for(let c=0;c<16;c++){const k=r[0]+':'+c;h+=`<button class="cell ${c%4===0&&c?'b4':''} ${BM.g[k]?'on':''}" style="--c:${r[2]}" data-act="bmCell" data-k="${k}" data-c="${c}" aria-label="${r[1]} step ${c+1}"></button>`;}return h+'</div>';}).join('')}</div>
  <p class="small muted">One bar, sixteen steps. The numbers are the beats. Kick on 1 and 3 with snare on 2 and 4 is the heart of most rock songs.</p></section>`;
}
A.bmCell=el=>{const k=el.dataset.k; if(BM.g[k]) delete BM.g[k]; else {BM.g[k]=1; drum(k.split(':')[0]);} BM.name=''; el.classList.toggle('on');};
A.bmPre=el=>{beatPreset(el.dataset.p); const was=!!LOOP; stopAll(); render(); if(was) A.bmPlay();};
A.bmClear=()=>{BM.g={};BM.name='';stopAll();render();};
I.bmBpm=el=>{BM.bpm=+el.value; $('#bmBpmV').textContent=el.value;};
A.bmPlay=()=>{ if(LOOP){stopAll();return;} startLoop({steps:16,loop:true,dur:()=>60/BM.bpm/4,step:(c,t)=>{BROWS.forEach(r=>{if(BM.g[r[0]+':'+c]) drum(r[0],t);});},ui:c=>nowMark(`.cell[data-c="${c}"]`)}); };
/* --- Chord Jam --- */
const CJ={key:'C',bars:['C','G','Am','F'],sel:0,strum:'s3',bpm:96,drums:true};
const ROMAN=['I','ii','iii','IV','V','vi'], DEG=[[0,''],[2,'m'],[4,'m'],[5,''],[7,''],[9,'m']];
const palette=key=>DEG.map(d=>NN[(RIDX[key]+d[0])%12]+d[1]);
const PROGS=[['I V vi IV',[0,4,5,3]],['I vi IV V',[0,5,3,4]],['vi IV I V',[5,3,0,4]],['12-bar blues',[0,0,0,0,3,3,0,0,4,3,0,0]],['Canon',[0,4,5,2,3,0,3,4]]];
function vJam(){
  const pal=palette(CJ.key), inst=['uke','gtr','piano'].includes(S.songs.inst)?S.songs.inst:'uke';
  return `<section class="card"><div class="row"><button class="btn go" data-act="cjPlay">Play my loop</button><label class="ctl" for="cjBpm">Speed <span class="mono" id="cjBpmV">${CJ.bpm}</span></label><input type="range" id="cjBpm" data-in="cjBpm" min="50" max="160" value="${CJ.bpm}">${chip('Drums','cjDrums',CJ.drums)}</div>
  <div class="row"><span class="muted small">Key</span>${['C','G','D','F','A'].map(k=>chip(k,'cjKey',k===CJ.key,`data-k="${k}"`)).join('')}<span class="muted small">Strum</span>${['s1','s2','s3','s4','s5'].map(k=>chip(STRUMS[k].n,'cjStrum',k===CJ.strum,`data-s="${k}"`)).join('')}</div>
  <h3>1. Tap a bar</h3><div class="bars">${CJ.bars.map((c,i)=>`<button class="barcell" data-act="cjSel" data-b="${i}" data-i="${i}" style="border:3px solid ${i===CJ.sel?'var(--accent)':'transparent'}"><span class="${pcClass(parseChord(c).L)}">${esc(c)}</span></button>`).join('')}</div>
  <div class="row"><button class="btn small" data-act="cjAdd">Add a bar</button><button class="btn small" data-act="cjDel">Remove last bar</button></div>
  <h3>2. Pick its chord</h3><div class="row">${pal.map((c,i)=>`<button class="btn" data-act="cjSet" data-c="${c}"><span class="small muted">${ROMAN[i]}</span> ${c}</button>`).join('')}</div>
  <h3>Or start from a famous loop</h3><div class="row">${PROGS.map((p,i)=>chip(p[0],'cjProg',false,`data-p="${i}"`)).join('')}</div></section>
  <section class="card"><div class="row"><h3>Chord shapes</h3>${chip('Ukulele','cinst',inst==='uke','data-i="uke"')}${chip('Guitar','cinst',inst==='gtr','data-i="gtr"')}${chip('Piano','cinst',inst==='piano','data-i="piano"')}</div>
  <div class="diagrams">${[...new Set(CJ.bars)].map(c=>`<button class="dg" data-act="hearC" data-c="${esc(c)}"><b>${esc(c)}</b>${chordDiagram(c,inst)}</button>`).join('')}</div></section>`;
}
const cjRe=()=>{const was=!!LOOP; stopAll(); render(); if(was) A.cjPlay();};
A.cjSel=el=>{CJ.sel=+el.dataset.i; render();};
A.cjSet=el=>{CJ.bars[CJ.sel]=el.dataset.c; strum(el.dataset.c,0,'D',.4); CJ.sel=(CJ.sel+1)%CJ.bars.length; cjRe();};
A.cjAdd=()=>{ if(CJ.bars.length<16){CJ.bars.push(CJ.bars[CJ.bars.length-1]); CJ.sel=CJ.bars.length-1; cjRe();} };
A.cjDel=()=>{ if(CJ.bars.length>1){CJ.bars.pop(); CJ.sel=Math.min(CJ.sel,CJ.bars.length-1); cjRe();} };
A.cjKey=el=>{const n=RIDX[el.dataset.k]-RIDX[CJ.key]; CJ.bars=CJ.bars.map(c=>transChord(c,n)); CJ.key=el.dataset.k; cjRe();};
A.cjStrum=el=>{CJ.strum=el.dataset.s; cjRe();};
A.cjDrums=el=>{CJ.drums=!CJ.drums; el.setAttribute('aria-pressed',CJ.drums);};
A.cjProg=el=>{const pal=palette(CJ.key); CJ.bars=PROGS[+el.dataset.p][1].map(d=>pal[d]); CJ.sel=0; cjRe();};
I.cjBpm=el=>{CJ.bpm=+el.value; $('#cjBpmV').textContent=el.value;};
A.cjPlay=()=>{ if(LOOP){stopAll();return;} playChart({secs:[['Loop',CJ.bars.map(c=>[c])]],meter:4,strum:CJ.strum},{bpm:()=>CJ.bpm,shift:0,drums:()=>CJ.drums,click:()=>false}); };
/* --- Rhythm Builder --- */
const RB={cells:['ta','titi','ta','rest','titi','titi','ta','ta'],sel:'titi',bpm:84};
function vRhythm(){
  return `<section class="card"><div class="row"><button class="btn go" data-act="rbPlay">Play</button><label class="ctl" for="rbBpm">Speed <span class="mono" id="rbBpmV">${RB.bpm}</span></label><input type="range" id="rbBpm" data-in="rbBpm" min="50" max="140" value="${RB.bpm}"></div>
  <h3>1. Choose a rhythm card</h3><div class="rcells">${Object.keys(CELLS).map(k=>`<button class="rcell" data-act="rbSel" data-k="${k}" aria-pressed="${k===RB.sel}">${cellSvg(k)}${CELLS[k].n}</button>`).join('')}</div>
  <h3>2. Tap a beat to place it</h3>
  ${[0,1].map(b=>`<div class="rcells"><span class="muted small" style="align-self:center;width:44px">Bar ${b+1}</span>${RB.cells.slice(b*4,b*4+4).map((c,i)=>`<button class="rcell" data-act="rbPut" data-i="${b*4+i}">${cellSvg(c)}${CELLS[c].n}</button>`).join('')}</div>`).join('')}
  <p class="small muted">Each card is one beat. Say the words, then clap it, then play it on your instrument.</p></section>`;
}
A.rbSel=el=>{RB.sel=el.dataset.k; render();};
A.rbPut=el=>{RB.cells[+el.dataset.i]=RB.sel; const was=!!LOOP; stopAll(); render(); if(was) A.rbPlay();};
I.rbBpm=el=>{RB.bpm=+el.value; $('#rbBpmV').textContent=el.value;};
function playRhythm(cells,bpm,countIn,sel,loop){
  const pre=countIn?16:0;
  startLoop({steps:pre+cells.length*4,loop,dur:()=>60/bpm()/4,step:(s,t)=>{ if(s<pre){ if(s%4===0) drum(s===0?'click1':'click',t); return; } const k=s-pre; if(k%4===0) drum('click',t,.35); if(CELLS[cells[Math.floor(k/4)]].h.includes((k%4)/4)) drum('wood',t); },
    ui:s=>{ if(sel&&s>=pre&&(s-pre)%4===0) nowMark(sel((s-pre)/4)); }});
}
A.rbPlay=()=>{ if(LOOP){stopAll();return;} playRhythm(RB.cells,()=>RB.bpm,false,i=>`.rcell[data-i="${i}"]`,true); };

/* ================= TOOLS ================= */
A.ttab=el=>{stopAll();S.tools.tab=el.dataset.t;render();};
const TOOLS=[['metro','Metronome'],['tuner','Tuner'],['groups','Group maker'],['timer','Timer']];
function vTools(){
  const t=TOOLS.some(x=>x[0]===S.tools.tab)?S.tools.tab:'metro';
  return `<div><span class="eyebrow">Tools</span><h2>Classroom tools</h2></div><div class="row">${TOOLS.map(x=>chip(x[1],'ttab',x[0]===t,`data-t="${x[0]}"`)).join('')}</div>
  <section class="card">${({metro:tMetro,tuner:tTuner,rhythm:tRhythm,pitch:tPitch,reader:tReader,groups:tGroups,timer:tTimer})[t]()}</section>`;
}
/* metronome */
const M={bpm:90,beats:4,taps:[]};
function tMetro(){
  return `<div class="row" style="align-items:flex-end"><div class="big" id="mBpm">${M.bpm}</div><span class="muted">beats per minute</span></div>
  <div class="row"><button class="btn" data-act="mAdj" data-d="-5">−5</button><input type="range" id="mR" data-in="mBpm" min="40" max="200" value="${M.bpm}" aria-label="Tempo"><button class="btn" data-act="mAdj" data-d="5">+5</button></div>
  <div class="row"><span class="muted small">Beats in a bar</span>${[2,3,4,6].map(n=>chip(String(n),'mBeats',n===M.beats,`data-n="${n}"`)).join('')}</div>
  <div class="dots" id="mDots">${Array.from({length:M.beats},(_,i)=>`<i data-i="${i}"></i>`).join('')}</div>
  <div class="row"><button class="btn go" data-act="mGo">Start</button><button class="btn" data-act="mTap">Tap the tempo</button></div>`;
}
const mShow=()=>{const b=$('#mBpm'); if(b){b.textContent=M.bpm; $('#mR').value=M.bpm;}};
I.mBpm=el=>{M.bpm=+el.value; mShow();};
A.mAdj=el=>{M.bpm=Math.max(40,Math.min(200,M.bpm+ +el.dataset.d)); mShow();};
A.mBeats=el=>{M.beats=+el.dataset.n; const was=!!LOOP; stopAll(); render(); if(was) A.mGo();};
A.mTap=()=>{const n=performance.now(); M.taps=M.taps.filter(t=>n-t<2500); M.taps.push(n); drum('click'); if(M.taps.length>1){const d=(M.taps[M.taps.length-1]-M.taps[0])/(M.taps.length-1); M.bpm=Math.max(40,Math.min(200,Math.round(60000/d))); mShow();}};
A.mGo=()=>{ if(LOOP){stopAll();return;} startLoop({steps:M.beats,loop:true,dur:()=>60/M.bpm,step:(i,t)=>drum(i===0?'click1':'click',t,1),ui:i=>nowMark(`#mDots i[data-i="${i}"]`)}); };
/* tuner */
const TUNE={uke:['Ukulele',[['G',67],['C',60],['E',64],['A',69]]],guitar:['Guitar',[['E',40],['A',45],['D',50],['G',55],['B',59],['E',64]]],bass:['Bass',[['E',28],['A',33],['D',38],['G',43]]]};
function tTuner(){
  const t=TUNE[S.tools.tuner]||TUNE.uke;
  return `<h3>Tuning notes</h3><div class="row">${Object.keys(TUNE).map(k=>chip(TUNE[k][0],'tInst',TUNE[k]===t,`data-k="${k}"`)).join('')}</div>
  <div class="pads">${t[1].map((s,i)=>`<button class="pad ${pcClass(s[0])}" style="background:var(--c);color:var(--k)" data-act="tStr" data-m="${s[1]}">${s[0]}<br><span class="small">string ${t[1].length-i}</span></button>`).join('')}</div>
  <p class="small muted">Tap a string to hear its note. Turn the peg slowly until your string sounds the same. Strings are shown from the one nearest your chin to the one nearest the floor.</p>`;
}
A.tInst=el=>{S.tools.tuner=el.dataset.k;render();};
A.tStr=el=>{const m=+el.dataset.m; play(m<48?m+12:m,0,2.6,'tone',.6); play(m,0,2,'pluck',.5);};
/* rhythm ears */
const RE={lvl:1,q:null,score:0,total:0,done:false};
const RPOOL={1:['ta','titi','rest'],2:['ta','titi','rest','tika'],3:['ta','titi','rest','tika','titika','tikati']};
function reNew(){const pool=RPOOL[RE.lvl], mk=()=>{const r=Array.from({length:4},()=>pick(pool)); if(r[0]==='rest') r[0]='ta'; return r;}; const target=mk(), opts=[target]; let guard=0;
  while(opts.length<3&&guard++<200){const o=target.slice(); o[Math.floor(Math.random()*4)]=pick(pool); if(guard>20){o[Math.floor(Math.random()*4)]=pick(pool);} if(o[0]==='rest') o[0]='ta'; if(!opts.some(x=>x.join()===o.join())) opts.push(o);}
  RE.q={target,opts:shuffle(opts)}; RE.done=false;}
function tRhythm(){
  if(!RE.q) reNew();
  return `<h3>Which rhythm did you hear?</h3><div class="row"><span class="muted small">Level</span>${[1,2,3].map(l=>chip(String(l),'reLvl',l===RE.lvl,`data-l="${l}"`)).join('')}</div>
  <div class="row"><button class="btn go" data-act="reHear">Hear the rhythm</button><button class="btn" data-act="reNext">Next rhythm</button></div>
  <p class="small muted">You hear four clicks to count you in, then the rhythm.</p>
  <div class="opts">${RE.q.opts.map((o,i)=>`<button class="opt" data-act="rePick" data-i="${i}" aria-label="Rhythm ${i+1}: ${o.map(c=>CELLS[c].n).join(', ')}">${rhythmSvg(o)}</button>`).join('')}</div><div class="fb" id="reFb"></div>`;
}
A.reLvl=el=>{RE.lvl=+el.dataset.l;reNew();stopAll();render();};
A.reHear=()=>playRhythm(RE.q.target,()=>80,true,null,false);
A.reNext=()=>{reNew();stopAll();render();A.reHear();};
A.rePick=el=>{ if(RE.done) return; const ok=RE.q.opts[+el.dataset.i].join()===RE.q.target.join(); RE.total++; if(ok) RE.score++; RE.done=true;
  $$('.opt').forEach((b,i)=>{ if(RE.q.opts[i].join()===RE.q.target.join()) b.classList.add('right'); else if(b===el) b.classList.add('wrong'); });
  const fb=$('#reFb'); fb.className='fb '+(ok?'good':'bad'); fb.textContent=ok?'Yes. Say it: '+RE.q.target.map(c=>CELLS[c].n).join(', '):'Not this time. The green one is right. Listen again and follow it.'; };
/* pitch ears */
const PE={mode:'hl',lvl:1,q:null,score:0,total:0,done:false};
const PSETS={1:[0,4,7],2:[0,2,4,7,9],3:[0,2,4,5,7,9,11,12]};
function peNew(){ if(PE.mode==='hl'){const a=60+Math.floor(Math.random()*13); let b=a; const gap=PE.lvl===1?4:PE.lvl===2?2:1; while(Math.abs(b-a)<gap||b<57||b>76) b=a+Math.floor(Math.random()*15)-7; PE.q={a,b};} else PE.q={d:pick(PSETS[PE.lvl])}; PE.done=false; }
function tPitch(){
  if(!PE.q) peNew(); const set=PSETS[PE.lvl];
  return `<h3>${PE.mode==='hl'?'Is the second note higher or lower?':'Which note comes after do?'}</h3>
  <div class="row">${chip('Higher or lower','peMode',PE.mode==='hl','data-m="hl"')}${chip('Name the solfège','peMode',PE.mode==='solf','data-m="solf"')}<span class="muted small">Level</span>${[1,2,3].map(l=>chip(String(l),'peLvl',l===PE.lvl,`data-l="${l}"`)).join('')}</div>
  <div class="row"><button class="btn go" data-act="peHear">Hear the notes</button><button class="btn" data-act="peNext">Next one</button></div>
  <div class="row">${PE.mode==='hl'?`<button class="btn" data-act="pePick" data-a="up">Higher</button><button class="btn" data-act="pePick" data-a="down">Lower</button>`:set.map(d=>`<button class="btn ${pcClass(NN[d%12])}" data-act="pePick" data-a="${d}">${d===12?"do'":SOLF[d]}</button>`).join('')}</div><div class="fb" id="peFb"></div>`;
}
A.peMode=el=>{PE.mode=el.dataset.m;peNew();render();};
A.peLvl=el=>{PE.lvl=+el.dataset.l;peNew();render();};
A.peHear=()=>{const a=ac().currentTime+.05; if(PE.mode==='hl'){play(PE.q.a,a,.7,'keys',.6);play(PE.q.b,a+.85,.9,'keys',.6);} else {play(60,a,.7,'tone',.6);play(60+PE.q.d,a+.9,1,'tone',.6);} };
A.peNext=()=>{peNew();render();A.peHear();};
A.pePick=el=>{ if(PE.done) return; const ans=PE.mode==='hl'?(PE.q.b>PE.q.a?'up':'down'):String(PE.q.d), ok=el.dataset.a===ans; PE.total++; if(ok) PE.score++; PE.done=true;
  const fb=$('#peFb'); fb.className='fb '+(ok?'good':'bad'); fb.textContent=ok?'Yes, well heard.':'Not this time. It was '+(PE.mode==='hl'?(ans==='up'?'higher':'lower'):(ans==='12'?"high do":SOLF[+ans]))+'. Listen again.'; };
/* note reader */
const NR={lvl:1,note:null,score:0,total:0,done:false};
const NPOOL={1:['E4','F4','G4','A4','B4','C5','D5','E5','F5'],2:['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5']};
function nrNew(){let n; do{n=pick(NPOOL[NR.lvl]);}while(n===NR.note); NR.note=n; NR.done=false;}
function tReader(){
  if(!NR.note) nrNew();
  return `<h3>Name the note</h3><div class="row"><span class="muted small">Level</span>${chip('Lines and spaces','nrLvl',NR.lvl===1,'data-l="1"')}${chip('With ledger lines','nrLvl',NR.lvl===2,'data-l="2"')}</div>
  <div class="paper mini" style="max-width:340px">${staffSvg({t:'one note',mel:NR.note+':4',meter:4,pickup:0}).replace('viewBox="0 0 700','viewBox="0 0 230').replace(/x2="696"/g,'x2="226"')}</div>
  <div class="row">${'CDEFGAB'.split('').map(L=>`<button class="btn ${pcClass(L)}" style="min-width:48px" data-act="nrPick" data-a="${L}">${L}</button>`).join('')}<button class="btn" data-act="nrNext">Next note</button></div><div class="fb" id="nrFb"></div>
  <p class="small muted">Lines from the bottom: E G B D F. Spaces from the bottom: F A C E.</p>`;
}
A.nrLvl=el=>{NR.lvl=+el.dataset.l;nrNew();render();};
A.nrNext=()=>{nrNew();render();};
A.nrPick=el=>{ if(NR.done) return; const ok=el.dataset.a===NR.note[0]; NR.total++; if(ok) NR.score++; NR.done=true; play(parseNote(NR.note).midi,0,.8,'keys',.5);
  const fb=$('#nrFb'); fb.className='fb '+(ok?'good':'bad'); fb.textContent=ok?'Yes, that is '+NR.note[0]+'.':'That one is '+NR.note[0]+'. Tap Next note to try another.'; };
/* groups */
const G={names:store.get('names',''),n:4,out:null};
function tGroups(){
  return `<h3>Group maker</h3><p class="small muted">For teachers. Type one name on each line. Names stay on this device only.</p>
  <textarea class="field" id="gNames" data-in="gNames" rows="7" style="width:100%" aria-label="Names">${esc(G.names)}</textarea>
  <div class="row"><label class="ctl" for="gN">Groups</label><input class="field" id="gN" data-in="gN" type="number" min="2" max="12" value="${G.n}" style="width:80px"><button class="btn go" data-act="gMake">Make groups</button><button class="btn" data-act="gOne">Pick one name</button></div>
  <div class="groups" id="gOut">${G.out||''}</div>`;
}
I.gNames=el=>{G.names=el.value;store.set('names',G.names);};
I.gN=el=>{G.n=Math.max(2,Math.min(12,+el.value||2));};
const gList=()=>G.names.split(/[\n,]+/).map(s=>s.trim()).filter(Boolean);
A.gMake=()=>{const l=shuffle(gList()); if(!l.length){G.out='<p>Add some names first.</p>';} else {const gs=Array.from({length:Math.min(G.n,l.length)},()=>[]); l.forEach((n,i)=>gs[i%gs.length].push(n)); G.out=gs.map((g,i)=>`<div><b>Group ${i+1}</b><br>${g.map(esc).join('<br>')}</div>`).join('');} $('#gOut').innerHTML=G.out;};
A.gOne=()=>{const l=gList(); G.out=l.length?`<div><b>${esc(pick(l))}</b></div>`:'<p>Add some names first.</p>'; $('#gOut').innerHTML=G.out;};
/* timer */
const T={left:300,total:300,int:null};
const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
function tTimer(){
  return `<div class="big" id="tBig">${fmt(T.left)}</div><div class="meter"><i id="tBar" style="width:${T.total?T.left/T.total*100:0}%"></i></div>
  <div class="row"><span class="muted small">Minutes</span>${[1,2,3,5,10,15].map(m=>chip(String(m),'tSet',T.total===m*60,`data-m="${m}"`)).join('')}</div>
  <div class="row"><button class="btn go" data-act="tGo">${T.int?'Pause':'Start'}</button><button class="btn" data-act="tReset">Reset</button><button class="btn" data-act="tQuiet">Quiet signal: 5 to 1</button></div>
  <p class="small muted">A chime plays when the time is up. The quiet signal counts down from 5 so everyone can stop and listen.</p>`;
}
const tShow=()=>{const b=$('#tBig'); if(b){b.textContent=fmt(T.left); $('#tBar').style.width=(T.total?T.left/T.total*100:0)+'%';}};
const tStop=()=>{clearInterval(T.int);T.int=null;};
A.tSet=el=>{tStop();T.total=T.left=+el.dataset.m*60;render();};
A.tReset=()=>{tStop();T.left=T.total;render();};
A.tGo=()=>{ ac(); if(T.int){tStop();render();return;} if(T.left<=0) T.left=T.total; const end=Date.now()+T.left*1000;
  T.int=setInterval(()=>{T.left=Math.max(0,Math.round((end-Date.now())/1000)); tShow(); if(T.left<=0){tStop(); drum('chime'); setTimeout(()=>drum('chime'),700); if(S.room==='tools'&&S.tools.tab==='timer') render();}},250); render(); };
A.tQuiet=()=>{tStop(); const a=ac().currentTime+.05; [5,4,3,2,1].forEach((n,i)=>{play(79-i*3,a+i,.5,'mallet',.6); setTimeout(()=>{const b=$('#tBig'); if(b) b.textContent=n;},i*1000);}); setTimeout(()=>{drum('chime'); const b=$('#tBig'); if(b) b.textContent='Listen';},5000); setTimeout(tShow,8000); };

/* ================= events ================= */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]'); if(!el||el.matches('input[type=checkbox]')) return; const f=A[el.dataset.act]; if(f){ if(el.tagName==='A') return; f(el,e);} });
document.addEventListener('change',e=>{const el=e.target; if(el.matches('input[type=checkbox][data-act]')) A[el.dataset.act](el); });
document.addEventListener('input',e=>{const el=e.target, f=el.dataset&&I[el.dataset.in]; if(f) f(el);});
window.addEventListener('hashchange',()=>{const r=location.hash.slice(1); if(ROOMS.includes(r)&&r!==S.room){stopAll();S.room=r;render();}});
window.addEventListener('DOMContentLoaded',()=>{const r=location.hash.slice(1); if(ROOMS.includes(r)) S.room=r; render();});
