/* Shared teaching controls. Sound generation belongs to the existing synth engine. */
(()=>{
'use strict';
const synth=window.SynthClass;
if(!synth)return;
const page=Number(document.body.dataset.course),de=document.documentElement.lang==='de';
const t=(a,b)=>de?a:b;
const panel=document.createElement('section');panel.className='course-controls';
const label=(caption,control)=>`<label>${caption}${control}</label>`;
if(page===2){
  return;
}
if(page!==4)return;
panel.classList.add('seq-rack');
panel.innerHTML=`<div class="seq-heading"><h2>STEP SEQUENCER</h2><span>PATTERN 01 · 8 STEPS</span></div><div class="transport-row seq-toolbar">`+
 label(t('Spielweise','Mode'),`<select id="transport-mode"><option value="seq">Step-Sequencer</option><option value="arp">Arpeggiator</option></select>`)+
 label('BPM','<input id="tempo" type="number" min="30" max="240" step="1" value="120">')+
 label(t('Schrittlänge','Step length'),'<select id="division"><option value="1">1/4</option><option value="2">1/8</option><option value="4" selected>1/16</option></select>')+
 label('Gate <output id="gate-value">65 %</output>','<input id="gate" type="range" min="10" max="95" value="65">')+
 `</div><div class="seq-channel-row" id="pattern-row"><div class="steps" id="pattern"></div></div><div id="arp-options" hidden><div class="transport-row">`+
 label(t('Richtung','Direction'),`<select id="direction"><option value="up">${t('Aufwärts','Up')}</option><option value="down">${t('Abwärts','Down')}</option><option value="updown">${t('Auf/Ab','Up/down')}</option></select>`)+
 label(t('Oktaven','Octaves'),'<select id="octaves"><option value="1">1</option><option value="2">2</option></select>')+
 `</div><div class="transport-row"><button class="pbtn" id="chord">${t('C-Dur halten','Hold C major')}</button><button class="pbtn" id="clear-chord">${t('Töne lösen','Release notes')}</button></div></div><div class="transport-row"><button class="pbtn" id="transport-start" aria-pressed="false">▶ Start</button><button class="pbtn" id="transport-stop">■ ${t('Stopp','Stop')}</button></div><p class="course-status" id="transport-status" role="status" aria-live="polite">${t('Gestoppt','Stopped')}</p><p id="chord-status"></p>`;
document.querySelector('#synth .s-main').prepend(panel);
const $=id=>panel.querySelector('#'+id);
const notes=[48,48,55,58,60,55,51,55];
const names=de?['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','H']:['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const noteName=n=>names[n%12]+(Math.floor(n/12)-1);
const steps=notes.map((note,i)=>{
  const el=document.createElement('div');el.className='seq-step'+(i>=4?' second-group':'');el.innerHTML=`<span class="step-number">${String(i+1).padStart(2,'0')}</span><label class="step-switch"><input type="checkbox" checked aria-label="${t('Schritt','Step')} ${i+1} ${t('aktiv','enabled')}"><span class="step-cap" aria-hidden="true"></span></label><select aria-label="${t('Note für Schritt','Note for step')} ${i+1}"></select>`;
  const select=el.querySelector('select');for(let n=36;n<=84;n++){const option=new Option(noteName(n),n);select.add(option);}select.value=note;
  $('pattern').append(el);return {el,select,enabled:el.querySelector('input')};
});
let running=false,generation=0,timer=null,gateTimer=null,index=0,nextTime=0;
const held=new Set(),latched=new Set();
const mode=()=>$('transport-mode').value;
const showChord=()=>{$('chord-status').textContent=t('Gehaltene Töne: ','Held notes: ')+([...new Set([...held,...latched])].sort((a,b)=>a-b).map(noteName).join(' · ')||'—');};
const clearHighlight=()=>steps.forEach(s=>s.el.classList.remove('playing'));
function stop(){
  running=false;generation++;clearTimeout(timer);clearTimeout(gateTimer);synth.input=null;synth.off();synth.stop();held.clear();latched.clear();clearHighlight();
  $('transport-start').setAttribute('aria-pressed','false');$('transport-status').textContent=t('Gestoppt','Stopped');showChord();
}
function arpNotes(){
  const base=[...new Set([...held,...latched])].sort((a,b)=>a-b);const all=[];
  for(let o=0;o<Number($('octaves').value);o++)base.forEach(n=>{if(n+o*12<=127)all.push(n+o*12);});
  const result=[...new Set(all)].sort((a,b)=>a-b);
  if($('direction').value==='down')result.reverse();
  if($('direction').value==='updown'&&result.length>2)result.push(...result.slice(1,-1).reverse());
  return result;
}
function tick(){
  if(!running)return;
  const bpm=Math.max(30,Math.min(240,Number($('tempo').value)||120));
  const duration=60000/bpm/Number($('division').value);
  clearTimeout(gateTimer);synth.off();clearHighlight();let note;
  if(mode()==='seq'){const step=steps[index%steps.length];step.el.classList.add('playing');if(step.enabled.checked)note=Number(step.select.value);}
  else {const pool=arpNotes();if(pool.length)note=pool[index%pool.length];}
  if(note!==undefined){synth.on(note);gateTimer=setTimeout(()=>synth.off(),duration*Number($('gate').value)/100);}
  index++;nextTime+=duration;
  // Rebase after a delayed frame; never burst through missed notes.
  if(nextTime<performance.now())nextTime=performance.now()+duration;
  timer=setTimeout(tick,Math.max(0,nextTime-performance.now()));
}
async function start(){
  stop();const token=generation;
  try{await synth.ready();}catch{ $('transport-status').textContent=t('Audio konnte nicht gestartet werden. Bitte erneut starten.','Audio could not start. Please try again.');return;}
  if(token!==generation)return;
  synth.stop();synth.set('e1a',.005);synth.set('e1r',.12);running=true;index=0;nextTime=performance.now();
  // While transport runs it owns the monophonic voice. Arp keys feed its held-note pool.
  synth.input=(note,on)=>{if(mode()!=='arp')return;if(on)held.add(note);else held.delete(note);showChord();};
  $('transport-start').setAttribute('aria-pressed','true');$('transport-status').textContent=t('Läuft · ','Playing · ')+(mode()==='seq'?'Step-Sequencer':'Arpeggiator');tick();
}
$('transport-start').addEventListener('click',()=>{if(running)stop();else start();});$('transport-stop').addEventListener('click',stop);
$('transport-mode').addEventListener('change',()=>{stop();$('pattern-row').hidden=mode()==='arp';$('arp-options').hidden=mode()!=='arp';});
$('gate').addEventListener('input',()=>{$('gate-value').value=$('gate').value+' %';});
$('tempo').addEventListener('change',()=>{$('tempo').value=Math.max(30,Math.min(240,Number($('tempo').value)||120));});
$('chord').addEventListener('click',async()=>{if(!running)await start();if(!running)return;[48,52,55].forEach(n=>latched.add(n));showChord();});
$('clear-chord').addEventListener('click',()=>{held.clear();latched.clear();synth.off();showChord();});
// Existing synth stop, power, lesson and preset controls must cancel the transport too.
document.querySelectorAll('#stop,#power,#hold,#preset,#previewTest,#previewStop,.try').forEach(el=>el.addEventListener(el.id==='preset'?'change':'click',()=>{if(running)stop();},true));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('pagehide',stop);window.addEventListener('blur',()=>{held.clear();showChord();});
showChord();
})();
