/* LetsMakeMusic core: helpers, music theory, audio engine, notation drawing. */
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=s=>s.toLowerCase().replace(/['’.!,()]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const store={
  get(k,d){try{const v=localStorage.getItem('mh.'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
  set(k,v){try{localStorage.setItem('mh.'+k,JSON.stringify(v));}catch(e){}}
};

/* ---------- theory ---------- */
const NN=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const RIDX={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
const LIDX={C:0,D:1,E:2,F:3,G:4,A:5,B:6};
const SOLF=['do','di','re','me','mi','fa','fi','so','le','la','te','ti'];
const NUMS=['1','#1','2','b3','3','4','#4','5','b6','6','b7','7'];
const freq=m=>440*Math.pow(2,(m-69)/12);
function parseNote(s){
  const m=/^([A-G])([#b]?)(\d?)$/.exec(s); if(!m) return null;
  const oct=m[3]===''?4:+m[3];
  return {midi:RIDX[m[1]+m[2]]+12*(oct+1),L:m[1],acc:m[2],oct};
}
function parseMel(str){
  return str.trim().split(/\s+/).filter(t=>t!=='|').map(t=>{
    const [n,d]=t.split(':'); const dur=d?+d:1;
    if(n==='R') return {rest:true,dur};
    const p=parseNote(n); if(!p||!(dur>0)) throw new Error('Bad note: '+t);
    p.dur=dur; return p;
  });
}
const chordRe=/^([A-G][#b]?)(.*)$/;
function parseChord(c){const m=chordRe.exec(c.split('/')[0].replace(' (easy)',''));return {root:RIDX[m[1]],q:m[2],L:m[1][0]};}
function chordMidis(c){
  const {root,q}=parseChord(c); const minor=q[0]==='m'&&q.slice(0,3)!=='maj';
  const iv=[0,minor?3:4,7]; if(q==='7'||q==='m7') iv.push(10); if(q==='maj7') iv.push(11);
  let base=48+root; if(base>55) base-=12;
  return iv.map(i=>base+i);
}
function transChord(c,n){
  if(!n) return c;
  return c.split('/').map(p=>{const m=chordRe.exec(p);return NN[(RIDX[m[1]]+n+120)%12]+m[2];}).join('/');
}
const keyDo=k=>{const m=chordRe.exec(k);const r=RIDX[m[1]];return m[2]==='m'?(r+3)%12:r;};

/* ---------- songs ---------- */
function parseCharts(text,tier){
  return text.trim().split('\n').map(line=>{
    const [head,meter]=line.split(/\|(?=\d$)/); const f=head.split('|');
    const secs=f[5].split(';').map(s=>{const i=s.indexOf(':');return [s.slice(0,i),s.slice(i+1).trim().split(/\s+/).map(b=>b.split('_'))];});
    const chords=new Set(); secs.forEach(s=>s[1].forEach(b=>b.forEach(c=>chords.add(c))));
    const n=chords.size;
    return {id:slug(f[0]),t:f[0],by:f[1],key:f[2],bpm:+f[3],strum:f[4],secs,meter:meter?+meter:4,tier,kind:'chart',
      lvl:n<=2?1:n===3?2:n===4?3:4,nch:n,chords:[...chords]};
  });
}
const SONGS=[
  ...MELODIES.map(s=>Object.assign({tier:'pd',kind:'mel',meter:4,pickup:0},s)),
  ...parseCharts(FOLK_CHARTS,'pd'),
  ...parseCharts(POP_CHARTS,'pop')
];
const songById=id=>SONGS.find(s=>s.id===id);
function barsOf(song){ /* group melody events into bars */
  const ev=parseMel(song.mel), bars=[]; let cur=[], t=0, len=song.pickup||song.meter;
  ev.forEach((e,i)=>{e.i=i; cur.push(e); t+=e.dur; if(t>=len-1e-6){bars.push(cur);cur=[];t=0;len=song.meter;}});
  if(cur.length) bars.push(cur);
  return {ev,bars};
}

/* ---------- audio ---------- */
let AC=null, OUT=null, NOISE=null;
function ac(){
  if(!AC){
    const C=window.AudioContext||window.webkitAudioContext; AC=new C();
    const comp=AC.createDynamicsCompressor(); OUT=AC.createGain(); OUT.gain.value=.85; OUT.connect(comp); comp.connect(AC.destination);
    NOISE=AC.createBuffer(1,AC.sampleRate,AC.sampleRate); const d=NOISE.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  }
  if(AC.state==='suspended') AC.resume();
  return AC;
}
function env(g,t,a,peak,rel){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+rel);}
function osc(type,f,t,stop,dest){const o=AC.createOscillator();o.type=type;o.frequency.value=f;o.connect(dest);o.start(t);o.stop(stop);return o;}
function play(midi,t,dur,snd,vel){
  ac(); t=t||AC.currentTime; dur=dur||.5; vel=vel==null?.5:vel; const f=freq(midi), g=AC.createGain(); g.connect(OUT);
  if(snd==='angklung'){ const n=Math.max(2,Math.round(dur/.075)); for(let i=0;i<n;i++) play(midi,t+i*.075,.12,'mallet',vel*.8); return; }
  if(snd==='mallet'){ env(g,t,.003,vel,.45); osc('sine',f,t,t+.5,g); const g2=AC.createGain(); g2.connect(OUT); env(g2,t,.002,vel*.3,.12); osc('sine',f*4,t,t+.15,g2); return; }
  if(snd==='pluck'){ const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(3200,t); lp.frequency.exponentialRampToValueAtTime(500,t+.5); lp.connect(g);
    env(g,t,.004,vel*.7,Math.max(.6,dur)); osc('sawtooth',f,t,t+Math.max(.7,dur)+.1,lp); osc('triangle',f*2,t,t+.3,lp); return; }
  if(snd==='synth'){ const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1800; lp.connect(g);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vel*.35,t+.02); g.gain.setValueAtTime(vel*.35,t+Math.max(.05,dur-.05)); g.gain.exponentialRampToValueAtTime(0.0001,t+dur+.05);
    osc('square',f,t,t+dur+.1,lp); return; }
  if(snd==='tone'){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vel*.6,t+.04); g.gain.setValueAtTime(vel*.6,t+Math.max(.06,dur-.08)); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    osc('sine',f,t,t+dur+.05,g); const g2=AC.createGain(); g2.gain.value=.15; g2.connect(g); osc('triangle',f*2,t,t+dur+.05,g2); return; }
  /* keys */
  env(g,t,.005,vel*.8,Math.max(.9,dur*1.3)); osc('triangle',f,t,t+Math.max(1,dur*1.3)+.1,g);
  const g2=AC.createGain(); g2.gain.value=.25; g2.connect(g); osc('sine',f*2,t,t+.6,g2);
}
function noise(t,dur,type,fr,vel){const s=AC.createBufferSource();s.buffer=NOISE;const fl=AC.createBiquadFilter();fl.type=type;fl.frequency.value=fr;const g=AC.createGain();env(g,t,.001,vel,dur);s.connect(fl);fl.connect(g);g.connect(OUT);s.start(t);s.stop(t+dur+.05);}
function drum(k,t,vel){
  ac(); t=t||AC.currentTime; vel=vel==null?.8:vel; const g=AC.createGain(); g.connect(OUT);
  if(k==='kick'){const o=osc('sine',150,t,t+.3,g);o.frequency.exponentialRampToValueAtTime(45,t+.15);env(g,t,.002,vel,.25);}
  else if(k==='snare'){noise(t,.16,'bandpass',1800,vel*.7);const o=osc('triangle',190,t,t+.12,g);o.frequency.exponentialRampToValueAtTime(120,t+.1);env(g,t,.001,vel*.4,.1);}
  else if(k==='hat'){noise(t,.04,'highpass',7000,vel*.35);}
  else if(k==='clap'){[0,.012,.026].forEach(d=>noise(t+d,.08,'bandpass',1200,vel*.5));}
  else if(k==='tom'){const o=osc('sine',210,t,t+.3,g);o.frequency.exponentialRampToValueAtTime(110,t+.2);env(g,t,.002,vel*.8,.25);}
  else if(k==='wood'){osc('triangle',880,t,t+.08,g);env(g,t,.001,vel*.6,.06);}
  else if(k==='click'||k==='click1'){osc('square',k==='click1'?1600:1000,t,t+.04,g);env(g,t,.001,vel*.25,.03);}
  else if(k==='chime'){[0,4,7,12].forEach((iv,i)=>play(72+iv,t+i*.12,1,'mallet',.5));}
}
const GTR_TUNE=[40,45,50,55,59,64], UKE_TUNE=[67,60,64,69];
function voiceChord(c,kind){
  const key=c.split('/')[0], map=kind==='gtr'?GTR:UKE, tune=kind==='gtr'?GTR_TUNE:UKE_TUNE, sh=map[key]||map[key.replace(' (easy)','')];
  if(!sh) return chordMidis(c);
  const out=[]; sh.split('').forEach((ch,i)=>{ if(ch!=='x') out.push(tune[i]+(+ch)); });
  return out.length?out:chordMidis(c);
}
function strum(c,t,dir,vel,kind){const ms=kind?voiceChord(c,kind):chordMidis(c);const v=kind?(dir==='U'?ms.slice().reverse():ms.slice()):(dir==='U'?ms.slice(1).reverse():[ms[0]-12,...ms,ms[0]+12]);v.forEach((m,i)=>play(m,t+i*.016,.7,'pluck',(vel||.38)*(dir==='U'?.7:1)));}

/* ---------- scheduler: one loop at a time ---------- */
let LOOP=null;
function stopAll(){
  if(LOOP){clearInterval(LOOP.timer); const end=LOOP.onStop; LOOP=null; if(end) end();}
  document.body.classList.remove('playing'); $$('.is-now').forEach(e=>e.classList.remove('is-now'));
}
function startLoop(o){ /* o: steps, dur(i)->seconds, step(i,t), ui(i), loop, onStop */
  stopAll(); const a=ac(); let i=0, next=a.currentTime+.1;
  const L={onStop:o.onStop}; LOOP=L; document.body.classList.add('playing');
  L.timer=setInterval(()=>{
    if(LOOP!==L) return;
    while(next<a.currentTime+.15){
      if(i>=o.steps){ if(o.loop){i=0;} else { clearInterval(L.timer); setTimeout(()=>{if(LOOP===L) stopAll();},Math.max(0,(next-a.currentTime)*1000)+150); return; } }
      const idx=i, t=next; o.step(idx,t);
      if(o.ui) setTimeout(()=>{if(LOOP===L) o.ui(idx);},Math.max(0,(t-a.currentTime)*1000));
      next+=o.dur(idx); i++;
    }
  },25);
  return L;
}
function nowMark(sel,root){$$('.is-now',root||document).forEach(e=>e.classList.remove('is-now'));$$(sel,root||document).forEach(e=>e.classList.add('is-now'));}
function beatDrums(k,meter,t,on){ /* k = eighth index within bar */
  if(!on) return;
  if(meter===3){ if(k===0) drum('kick',t); else if(k%2===0) drum('hat',t,.9); return; }
  if(k===0||k===4) drum('kick',t); if(k===2||k===6) drum('snare',t); drum('hat',t,k%2?.5:.8);
}

/* ---------- drawing ---------- */
function fretSvg(shape,nStr){
  const fr=shape.split('').map(c=>c==='x'?-1:+c), pos=fr.filter(f=>f>0), max=Math.max(0,...pos), min=pos.length?Math.min(...pos):1;
  const base=max>4?min:1, W=18*(nStr-1)+24, H=96, x0=12, y0=18, fh=17;
  let s=`<svg viewBox="0 0 ${W} ${H}" width="${W*1.25}" height="${H*1.25}" role="img" aria-label="Chord shape ${shape}"><g stroke="#1B2233" fill="none">`;
  for(let i=0;i<nStr;i++) s+=`<line x1="${x0+i*18}" y1="${y0}" x2="${x0+i*18}" y2="${y0+fh*4}"/>`;
  for(let j=0;j<=4;j++) s+=`<line x1="${x0}" y1="${y0+j*fh}" x2="${x0+(nStr-1)*18}" y2="${y0+j*fh}" stroke-width="${j===0&&base===1?3:1}"/>`;
  s+='</g>';
  fr.forEach((f,i)=>{const x=x0+i*18;
    if(f<0) s+=`<text x="${x}" y="12" text-anchor="middle" font-size="10" fill="#1B2233">×</text>`;
    else if(f===0) s+=`<circle cx="${x}" cy="9" r="3.5" fill="none" stroke="#1B2233"/>`;
    else s+=`<circle cx="${x}" cy="${y0+(f-base+.5)*fh}" r="6" fill="#1B2233"/>`;});
  if(base>1) s+=`<text x="${W-1}" y="${y0+12}" text-anchor="end" font-size="9" fill="#1B2233">${base}</text>`;
  return s+'</svg>';
}
function pianoSvg(c){
  const ms=chordMidis(c).map(m=>m%12), root=ms[0]; let s='<svg viewBox="0 0 142 62" width="178" height="78" role="img" aria-label="Piano chord">';
  const whites=[0,2,4,5,7,9,11], lit=new Set(); let prev=-1; ms.forEach(pc=>{let m=pc; while(m<=prev) m+=12; lit.add(m); prev=m;});
  for(let o=0;o<2;o++) whites.forEach((pc,i)=>{const m=pc+12*o,x=1+(o*7+i)*10;s+=`<rect x="${x}" y="1" width="10" height="60" fill="${lit.has(m)?(m%12===root?'#D93A40':'#F1C40F'):'#fff'}" stroke="#1B2233"/>`;});
  for(let o=0;o<2;o++) [[1,0],[3,1],[6,3],[8,4],[10,5]].forEach(([pc,i])=>{const m=pc+12*o,x=1+(o*7+i)*10+7;s+=`<rect x="${x}" y="1" width="6" height="36" fill="${lit.has(m)?(m%12===root?'#D93A40':'#F1C40F'):'#1B2233'}" stroke="#1B2233"/>`;});
  return s+'</svg>';
}
function chordDiagram(c,inst){
  if(inst==='piano') return pianoSvg(c);
  const shape=(inst==='gtr'?GTR:UKE)[c.split('/')[0]];
  return shape?fretSvg(shape,inst==='gtr'?6:4):'<span class="small">no shape yet</span>';
}
/* rhythm cells: one beat each */
const CELLS={ta:{n:'ta',h:[0]},titi:{n:'ti-ti',h:[0,.5]},tika:{n:'tika-tika',h:[0,.25,.5,.75]},titika:{n:'ti-tika',h:[0,.5,.75]},tikati:{n:'tika-ti',h:[0,.25,.5]},rest:{n:'sh',h:[]}};
function cellSvg(id,w){
  w=w||54; const h=CELLS[id].h, xs=h.map(p=>10+p*40); let s=`<svg viewBox="0 0 54 46" width="${w}" height="${w*46/54}" aria-hidden="true"><g stroke="#1B2233" stroke-width="1.6" fill="#1B2233">`;
  if(!h.length) s+='<path d="M24 12 l7 8 -6 6 6 8 q-7 -3 -6 5" fill="none" stroke-width="2.2"/>';
  xs.forEach(x=>{s+=`<ellipse cx="${x}" cy="37" rx="5" ry="3.8" transform="rotate(-20 ${x} 37)"/><line x1="${x+4.6}" y1="36" x2="${x+4.6}" y2="9"/>`;});
  if(h.length>1){ s+=`<rect x="${xs[0]+4.6}" y="8" width="${xs[xs.length-1]-xs[0]}" height="3.5"/>`;
    for(let i=0;i<h.length-1;i++) if(h[i+1]-h[i]<.4) s+=`<rect x="${xs[i]+4.6}" y="14" width="${xs[i+1]-xs[i]}" height="3.5"/>`; }
  return s+'</g></svg>';
}
function rhythmSvg(cells){return `<span style="display:inline-flex">${cells.map(c=>cellSvg(c,48)).join('')}</span>`;}
/* staff */
function staffSvg(song,opt){
  opt=opt||{}; const {bars}=barsOf(song), lines=[]; let cur=[], w=0; const MAXW=700, wOf=e=>18+Math.min(3,e.dur)*13;
  bars.forEach(b=>{const bw=b.reduce((a,e)=>a+wOf(e),14); if(w+bw>MAXW-70&&cur.length){lines.push(cur);cur=[];w=0;} cur.push(b); w+=bw;});
  if(cur.length) lines.push(cur);
  const LH=92, top=30, sp=9, yOf=di=>top+4*sp-(di-30)*sp/2;
  let s=`<svg viewBox="0 0 ${MAXW} ${lines.length*LH+6}" role="img" aria-label="Staff notation for ${esc(song.t)}"><g font-family="serif" fill="#1B2233">`;
  lines.forEach((ln,li)=>{
    const oy=li*LH; let x=li===0?62:44;
    for(let k=0;k<5;k++) s+=`<line x1="4" x2="${MAXW-4}" y1="${oy+top+k*sp}" y2="${oy+top+k*sp}" stroke="#8A93A6"/>`;
    s+=`<text x="6" y="${oy+top+4*sp+1}" font-size="44">𝄞</text>`;
    if(li===0){const ts=(song.ts||song.meter+'/4').split('/');s+=`<text x="40" y="${oy+top+sp*2-1}" font-size="19" font-weight="700">${ts[0]}</text><text x="40" y="${oy+top+sp*4-1}" font-size="19" font-weight="700">${ts[1]}</text>`;}
    ln.forEach((bar,bi)=>{
      bar.forEach(e=>{
        const cx=x+9;
        if(e.rest){ s+=e.dur>=2?`<rect x="${cx-5}" y="${oy+top+sp*2-4}" width="11" height="4"/>`:`<path d="M${cx-3} ${oy+top+sp} l6 7 -5 5 5 7 q-6 -2 -5 4" fill="none" stroke="#1B2233" stroke-width="2"/>`; }
        else{
          const di=LIDX[e.L]+7*e.oct, y=oy+yOf(di), open=e.dur>=2, up=di<34;
          for(let d=28;d>=di;d-=2) s+=`<line x1="${cx-9}" x2="${cx+9}" y1="${oy+yOf(d)}" y2="${oy+yOf(d)}" stroke="#1B2233"/>`;
          for(let d=40;d<=di;d+=2) s+=`<line x1="${cx-9}" x2="${cx+9}" y1="${oy+yOf(d)}" y2="${oy+yOf(d)}" stroke="#1B2233"/>`;
          s+=`<g data-n="${e.i}">`;
          if(e.acc) s+=`<text x="${cx-16}" y="${y+5}" font-size="15">${e.acc==='#'?'♯':'♭'}</text>`;
          s+=`<ellipse cx="${cx}" cy="${y}" rx="5.6" ry="4.1" transform="rotate(-20 ${cx} ${y})" fill="${open?'#FCFBF7':'#1B2233'}" stroke="#1B2233" stroke-width="1.5"/>`;
          if(e.dur<4){ const sx=up?cx+5.2:cx-5.2, y2=up?y-27:y+27; s+=`<line x1="${sx}" y1="${y}" x2="${sx}" y2="${y2}" stroke="#1B2233" stroke-width="1.4"/>`;
            const fl=e.dur<=.25?2:e.dur<1?1:0; for(let f=0;f<fl;f++){const fy=up?y2+f*6:y2-f*6; s+=`<path d="M${sx} ${fy} q9 ${up?5:-5} 6 ${up?13:-13}" fill="none" stroke="#1B2233" stroke-width="1.6"/>`;} }
          if([3,1.5,.75].includes(e.dur)) s+=`<circle cx="${cx+10}" cy="${y-(di%2===0?sp/2:0)}" r="1.7"/>`;
          s+='</g>';
          if(opt.names) s+=`<text x="${cx}" y="${oy+LH-6}" font-size="10" font-family="monospace" text-anchor="middle" fill="#53617C">${e.L}${e.acc}</text>`;
        }
        x+=wOf(e);
      });
      const last=li===lines.length-1&&bi===ln.length-1;
      s+=`<line x1="${x+3}" x2="${x+3}" y1="${oy+top}" y2="${oy+top+4*sp}" stroke="#1B2233" stroke-width="${last?3:1}"/>`; x+=14;
    });
  });
  return s+'</g></svg>';
}
/* tab */
const TAB={uke:{open:[69,64,60],names:['A','E','C','G'],lines:4},gtr:{open:[64,59,55,50,45,40],names:['e','B','G','D','A','E'],lines:6}};
function tabText(song,inst){
  const T=TAB[inst], {ev,bars}=barsOf(song), ms=ev.filter(e=>!e.rest).map(e=>e.midi); let sh=0;
  if(inst==='uke'){ while(Math.min(...ms)+sh<60) sh+=12; }
  else if(Math.max(...ms)>67&&Math.min(...ms)-12>=40) sh=-12;
  const place=m=>{let best=null;T.open.forEach((o,si)=>{const f=m-o;if(f>=0&&f<=15&&(!best||f<best.f)) best={si,f};});return best;};
  const blocks=[]; let rows=T.names.map(n=>n+'|'), count=0;
  const flush=()=>{blocks.push(rows.join('\n'));rows=T.names.map(n=>n+'|');count=0;};
  bars.forEach(b=>{
    b.forEach(e=>{const p=e.rest?null:place(e.midi+sh); const pad=e.dur>=2?'--':e.dur>=1?'-':'';
      for(let r=0;r<T.lines;r++){const cell=p&&p.si===r?String(p.f):'-'; rows[r]+='-'+cell+(cell.length>1?'':'-')+pad;}});
    for(let r=0;r<T.lines;r++) rows[r]+='|';
    if(++count>=(rows[0].length>44?1:4)||rows[0].length>52) flush();
  });
  if(count) flush();
  return {text:blocks.join('\n\n'),shift:sh};
}
