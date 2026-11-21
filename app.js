const $=s=>document.querySelector(s);
let coords=null, prayerData=[], timer=null, tasbih=0;
const names={Fajr:"Fajr",Sunrise:"Lever du soleil",Dhuhr:"Dhuhr",Asr:"Asr",Maghrib:"Maghrib",Isha:"Isha"};
function showModal(html){$('#modalContent').innerHTML=html;$('#modal').classList.remove('hidden')}
$('#close').onclick=()=>$('#modal').classList.add('hidden');
function localDate(){return new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
$('#today').textContent=localDate();
function locate(){if(!navigator.geolocation){$('#place').textContent="Géolocalisation non disponible";return}
 $('#place').textContent="Localisation en cours…";
 navigator.geolocation.getCurrentPosition(async p=>{coords={lat:p.coords.latitude,lon:p.coords.longitude};await loadPrayerTimes()},()=>{$('#place').textContent="Localisation refusée — autorise-la dans les réglages."},{enableHighAccuracy:true,timeout:12000})}
async function loadPrayerTimes(){try{
 const url=`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${coords.lat}&longitude=${coords.lon}&method=3`;
 const r=await fetch(url);const j=await r.json();if(j.code!==200)throw Error();
 const t=j.data.timings;prayerData=['Fajr','Dhuhr','Asr','Maghrib','Isha'].map(k=>({name:k,time:t[k]}));
 $('#place').textContent=j.data.meta.timezone||'Position trouvée';$('#method').textContent='Méthode : Muslim World League';
 const dayKey=new Date().toISOString().slice(0,10);
 $('#prayers').innerHTML=prayerData.map(x=>{const done=localStorage.getItem(`noor_done_${dayKey}_${x.name}`)==='1';return `<div class="prayer" data-prayer="${x.name}"><div><strong>${names[x.name]}</strong><label class="donecheck"><input type="checkbox" data-done="${x.name}" ${done?'checked':''}> <small>${done?'Prière cochée':'J’ai prié'}</small></label></div><time>${x.time}</time></div>`}).join('');
 document.querySelectorAll('[data-done]').forEach(el=>el.onchange=()=>{localStorage.setItem(`noor_done_${dayKey}_${el.dataset.done}`,el.checked?'1':'0');el.nextElementSibling.textContent=el.checked?'Prière cochée':'J’ai prié'});
 startCountdown();
 }catch(e){$('#prayers').innerHTML='<p class="hint">Impossible de charger les horaires. Vérifie ta connexion et réessaie.</p>'}}
function startCountdown(){if(timer)clearInterval(timer);function tick(){if(!prayerData.length)return;let now=new Date(),next=null;
 for(const p of prayerData){let [h,m]=p.time.split(':').map(Number),d=new Date();d.setHours(h,m,0,0);if(d>now){next={...p,date:d};break}}
 if(!next){let p=prayerData[0],[h,m]=p.time.split(':').map(Number),d=new Date();d.setDate(d.getDate()+1);d.setHours(h,m,0,0);next={...p,date:d}}
 $('#nextName').textContent=names[next.name];let sec=Math.max(0,Math.floor((next.date-now)/1000));$('#countdown').textContent=`${String(Math.floor(sec/3600)).padStart(2,'0')} h ${String(Math.floor(sec%3600/60)).padStart(2,'0')} min`;document.querySelectorAll('.prayer').forEach(el=>el.classList.toggle('current',el.dataset.prayer===next.name))}
 tick();timer=setInterval(tick,30000)}
$('#locate').onclick=locate;
$('#focusToggle').onchange=e=>{$('#focusStatus').textContent=e.target.checked?'Mode concentration activé dans NOOR. Active aussi Ne pas déranger sur ton téléphone.':'Le mode concentration est désactivé.'};
function qibla(){if(!coords){showModal('<h2>Qibla</h2><p>Autorise d’abord la localisation depuis l’accueil.</p>');return}
 const lat1=coords.lat*Math.PI/180,lon1=coords.lon*Math.PI/180,lon2=39.8262*Math.PI/180,lat2=21.4225*Math.PI/180;
 const y=Math.sin(lon2-lon1),x=Math.cos(lat1)*Math.tan(lat2)-Math.sin(lat1)*Math.cos(lon2-lon1);
 let deg=(Math.atan2(y,x)*180/Math.PI+360)%360;
 showModal(`<h2>Direction de la Qibla</h2><div class="qibla" style="transform:rotate(${deg}deg)">➤</div><p style="text-align:center"><b>${deg.toFixed(0)}°</b> depuis le nord</p><p class="hint">Place ton téléphone à plat et éloigne-le des objets métalliques. La précision dépend du compas de ton appareil.</p>`)}
async function quran(){showModal('<h2>Le Coran</h2><p>Chargement des sourates…</p>');try{let r=await fetch('https://api.alquran.cloud/v1/surah');let j=await r.json();$('#modalContent').innerHTML='<button class="close" id="innerClose">✕</button><h2>Le Coran</h2>'+j.data.map(s=>`<button class="prayer" style="width:100%;margin:5px 0;text-align:left" onclick="readSurah(${s.number},'${s.name}')"><b>${s.number}. ${s.englishName}</b><span>${s.name}</span></button>`).join('');$('#innerClose').onclick=()=>$('#modal').classList.add('hidden')}catch(e){$('#modalContent').innerHTML='<h2>Le Coran</h2><p>Connexion nécessaire pour charger le texte du Coran.</p>'}}
async function readSurah(n,name){$('#modalContent').innerHTML='<h2>'+name+'</h2><p>Chargement…</p>';try{let r=await fetch(`https://api.alquran.cloud/v1/surah/${n}`),j=await r.json();$('#modalContent').innerHTML=`<button class="close" id="innerClose">✕</button><h2>${name}</h2>`+j.data.ayahs.map(a=>`<p class="arabic">${a.text} <small>۞ ${a.numberInSurah}</small></p>`).join('');$('#innerClose').onclick=()=>$('#modal').classList.add('hidden')}catch(e){$('#modalContent').innerHTML='<p>Erreur de chargement.</p>'}}
function openView(v){if(v==='home')return;if(v==='qibla')return qibla();if(v==='quran')return quran();if(v==='tasbih'){tasbih=0;showModal(`<h2>Tasbih</h2><p class="hint">Compte tes dhikr. Le compteur reste ouvert tant que tu ne fermes pas cette fenêtre.</p><div class="counter" id="count">0</div><button class="action" id="tap">Compter +1</button><button class="action" style="background:#dfe7df;color:#173a30" id="reset">Réinitialiser</button>`);$('#tap').onclick=()=>$('#count').textContent=++tasbih;$('#reset').onclick=()=>{$('#count').textContent=tasbih=0};return}
 if(v==='calendar'){showModal(`<h2>Calendrier hégirien</h2><p>${new Intl.DateTimeFormat('fr-FR-u-ca-islamic', {dateStyle:'full'}).format(new Date())}</p><p class="hint">La date peut varier selon l'observation locale du croissant lunaire.</p>`)}}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.bottom button').forEach(x=>x.classList.remove('active'));if(b.closest('.bottom'))b.classList.add('active');openView(b.dataset.view)});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
locate();
// Profil, programme spirituel progressif et préférences de pause.
const profileFields=['profileName','profileAge','prayerLevel','hardPrayer','goal'];
function renderPlan(){
 const name=(localStorage.getItem('noor_name')||'').trim();
 const level=localStorage.getItem('noor_level')||'';
 const hard=localStorage.getItem('noor_hard')||'';
 const goal=localStorage.getItem('noor_goal')||'';
 const greeting=name?`Pour ${name}`:'Ton programme';
 const tasks=[
 ['Au réveil','Commence ta journée par une intention positive et prépare-toi pour Fajr.'],
 ['À chaque heure de prière','Consulte l’horaire local, prépare-toi calmement et coche la prière après l’avoir accomplie.'],
 ['Après une prière','Prends 3 à 5 minutes pour le dhikr ou une invocation que tu connais.'],
 ['Chaque jour','Lis quelques versets du Coran, même si tu commences par une petite quantité.'],
 ['Dans tes relations','Choisis un effort concret : parler avec douceur, aider quelqu’un ou demander pardon.'],
 ['Avant de dormir','Fais le bilan de ta journée sans te juger et prépare-toi pour Fajr.']
 ];
 if(hard) tasks.splice(1,0,[`Ton objectif : ${hard}`,'Prépare cette prière à l’avance avec un rappel. Si tu la manques, reprends simplement au prochain rendez-vous.']);
 if(goal.includes('Coran')) tasks.push(['Petit apprentissage','Apprends ou révise quelques lignes du Coran avec une source fiable.']);
 if(goal.includes('comportement')) tasks.push(['Bon comportement','Choisis une qualité à travailler aujourd’hui : patience, honnêteté ou générosité.']);
 $('#dailyPlan').innerHTML=`<p class="hint">${greeting} — un programme souple, à adapter à tes cours, ton sommeil et ta famille. ${level==='Je débute'?'Commence petit : la régularité compte plus que la quantité.':''}</p>`+
 tasks.map((t,i)=>`<label class="planitem"><input type="checkbox" data-task="${i}"><span><b>${t[0]}</b><small>${t[1]}</small></span></label>`).join('');
 document.querySelectorAll('[data-task]').forEach(el=>{el.checked=localStorage.getItem('noor_task_'+el.dataset.task)==='1';el.onchange=()=>localStorage.setItem('noor_task_'+el.dataset.task,el.checked?'1':'0')});
}
$('#saveProfile').onclick=()=>{
 localStorage.setItem('noor_name',$('#profileName').value);
 localStorage.setItem('noor_age',$('#profileAge').value);
 localStorage.setItem('noor_level',$('#prayerLevel').value);
 localStorage.setItem('noor_hard',$('#hardPrayer').value);
 localStorage.setItem('noor_goal',$('#goal').value);
 $('#profileStatus').textContent='Ton programme est prêt. Tu peux modifier tes réponses quand tu veux.';
 renderPlan();
};
profileFields.forEach(id=>{let el=$('#'+id);if(el){let key={profileName:'noor_name',profileAge:'noor_age',prayerLevel:'noor_level',hardPrayer:'noor_hard',goal:'noor_goal'}[id];el.value=localStorage.getItem(key)||''}});
document.querySelectorAll('.appChoice').forEach(el=>{let saved=JSON.parse(localStorage.getItem('noor_apps')||'[]');el.checked=saved.includes(el.value);el.onchange=()=>{let chosen=[...document.querySelectorAll('.appChoice:checked')].map(x=>x.value);localStorage.setItem('noor_apps',JSON.stringify(chosen))}});
$('#setupBlock').onclick=()=>{
 const chosen=[...document.querySelectorAll('.appChoice:checked')].map(x=>x.value);
 localStorage.setItem('noor_apps',JSON.stringify(chosen));
 $('#blockStatus').textContent=chosen.length?`Choix enregistrés : ${chosen.join(', ')}. Pour les bloquer réellement, NOOR doit être installé comme application native et obtenir l'autorisation officielle du système.`:'Choisis au moins une catégorie. Le blocage réel nécessitera ensuite une autorisation système.';
};
renderPlan();
