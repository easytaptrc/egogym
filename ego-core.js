/* =======================================================================
   EGO GYM · CLUB — Núcleo compartido (config + datos + utilidades)
   Lo usan index.html (público) y admin.html (panel).
   Funciona con Firebase (producción) o en MODO DEMO (datos de ejemplo).
   ======================================================================= */

/* ----- 1. CONFIGURACIÓN DE FIREBASE (tu proyecto) ----- */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDV3SVxoFv0Lk6OwnE7-c3Upp55pcKxIqg",
  authDomain: "egogym-39e45.firebaseapp.com",
  projectId: "egogym-39e45",
  storageBucket: "egogym-39e45.firebasestorage.app",
  messagingSenderId: "784474467563",
  appId: "1:784474467563:web:63a4ac5d8d6c5995d622ae",
  measurementId: "G-6BTWWRLQ31"
};

/* Admin inicial: la primera vez que este usuario entre con esta contraseña,
   se crea la cuenta de administrador automáticamente. */
const BOOTSTRAP_ADMIN = { username:'edson', password:'egogym2026@', name:'Edson' };
const EMAIL_DOMAIN = 'egogym.app';

/* ----- 2. CONFIG POR DEFECTO (horarios, precios, etc.) ----- */
const DEFAULT_CONFIG = {
  gymName:'EGO GYM · CLUB',
  phone:'8712345678',
  whatsapp:'8712345678',
  countryCode:'52',
  address:'',
  hours:'Lun–Vie · Spinning y Box',
  social:{ instagram:'', facebook:'', tiktok:'', whatsapp:'' },
  activities:{
    spinning:{
      label:'Spinning', tagline:'Energía en movimiento', price:80,
      bikeCount:12, cols:3, rows:4,
      schedule:{ mon:['07:00','08:00','19:00','20:00'], tue:['07:00','08:00','19:00','20:00'],
                 wed:['07:00','08:00','19:00','20:00'], thu:['07:00','08:00','19:00','20:00'],
                 fri:['07:00','08:00'], sat:[], sun:[] }
    },
    box:{
      label:'Box', tagline:'Disciplina y control', price:60,
      capacity:15,
      schedule:{ mon:['17:00','18:00','19:00','20:00'], tue:['17:00','18:00','19:00','20:00'],
                 wed:['17:00','18:00','19:00','20:00'], thu:['17:00','18:00','19:00','20:00'],
                 fri:['17:00','18:00','19:00','20:00'], sat:[], sun:[] }
    }
  }
};

/* ----- 3. UTILIDADES ----- */
const DIAS      = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const DIAS_ABBR = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES     = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DAYKEYS   = ['sun','mon','tue','wed','thu','fri','sat'];
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const money = n => '$'+Number(n||0).toLocaleString('es-MX');
const pad2 = n => String(n).padStart(2,'0');
function dateKey(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
function parseKey(k){ const [y,m,dd]=k.split('-').map(Number); return new Date(y,m-1,dd); }
function prettyDate(k){ const d=parseKey(k); return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`; }
function shortDate(k){ const d=parseKey(k); return `${DIAS_ABBR[d.getDay()]} ${d.getDate()}/${pad2(d.getMonth()+1)}`; }
function todayKey(){ return dateKey(new Date()); }
function slotId(a,dk,t){ return `${a}_${dk}_${t.replace(':','')}`; }
function timeLabel(t){ let [h,m]=t.split(':').map(Number); const ap=h>=12?'PM':'AM'; let h12=h%12; if(h12===0)h12=12; return `${h12}:${pad2(m)} ${ap}`; }
function slotPassed(dk,t){ const d=parseKey(dk); const [h,m]=t.split(':').map(Number); d.setHours(h,m,0,0); return d.getTime() < Date.now(); }
function toast(msg,isErr){ const t=$('#toast'); if(!t)return; t.textContent=msg; t.className='show'+(isErr?' err':''); clearTimeout(t._t); t._t=setTimeout(()=>t.className='',2600); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function formatPhone(p){ p=(p||'').replace(/\D/g,''); return p.length===10?`${p.slice(0,3)} ${p.slice(3,6)} ${p.slice(6)}`:p; }
function waLink(text, toGym=true){ const cc=CONFIG.countryCode||'52'; const num=(CONFIG.whatsapp||CONFIG.phone||'').replace(/\D/g,'');
  const base = toGym && num ? `https://wa.me/${cc}${num}` : 'https://wa.me/'; return `${base}?text=${encodeURIComponent(text)}`; }

/* fechas / horarios */
function upcomingDates(n){ const arr=[]; const d=new Date(); for(let i=0;i<n;i++){ arr.push(dateKey(new Date(d.getFullYear(),d.getMonth(),d.getDate()+i))); } return arr; }
function daySlots(activity,dk){ const key=DAYKEYS[parseKey(dk).getDay()]; return (CONFIG.activities[activity].schedule[key]||[]).slice().sort(); }
function dayHasOpen(activity,dk){ return daySlots(activity,dk).some(t=>!slotPassed(dk,t)); }
function firstAvailableDate(activity){
  for(const dk of upcomingDates(14)){ if(dayHasOpen(activity,dk)) return dk; }
  for(const dk of upcomingDates(14)){ if(daySlots(activity,dk).length) return dk; }
  return todayKey();
}
function firstFutureTime(activity,dk){ const t=daySlots(activity,dk); return t.find(x=>!slotPassed(dk,x))||t[0]; }
function lastTime(activity,dk){ const t=daySlots(activity,dk); return t[t.length-1]; }

/* ----- 4. LOGO (logo.png con respaldo SVG si el archivo aún no existe) ----- */
function egoLogo(size, light){
  const stroke = light ? '#fff' : '#141414';
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" aria-label="EGO">
    <circle cx="50" cy="50" r="34" stroke="${stroke}" stroke-width="4"/>
    <circle cx="50" cy="50" r="34" stroke="var(--gold)" stroke-width="4" stroke-dasharray="10 12" opacity=".9"/>
    <line x1="50" y1="6" x2="50" y2="18" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
    <line x1="50" y1="82" x2="50" y2="94" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
    <line x1="6" y1="50" x2="18" y2="50" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
    <line x1="82" y1="50" x2="94" y2="50" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
    <rect x="30" y="44" width="40" height="6" rx="3" fill="var(--gold)"/>
    <rect x="26" y="38" width="7" height="18" rx="3" fill="${stroke}"/>
    <rect x="67" y="38" width="7" height="18" rx="3" fill="${stroke}"/>
    <rect x="35" y="34" width="6" height="26" rx="3" fill="var(--gold)"/>
    <rect x="59" y="34" width="6" height="26" rx="3" fill="var(--gold)"/>
  </svg>`;
}
/* Muestra logo.png; si no carga, muestra el logo SVG + texto. light=logo sobre fondo oscuro. */
function logoMark(h, light){
  const fb = light
    ? `<span class="logo-fb" style="display:none">${egoLogo(h,true)}<span class="brand-txt"><span class="b1" style="color:#fff">EGO</span><span class="b2">GYM · CLUB</span></span></span>`
    : `<span class="logo-fb" style="display:none">${egoLogo(h,false)}<span class="brand-txt"><span class="b1">EGO</span><span class="b2">GYM · CLUB</span></span></span>`;
  return `<img src="logo.png" alt="EGO GYM · CLUB" class="logo-img" style="height:${h}px"
     onerror="this.style.display='none';this.parentNode.querySelector('.logo-fb').style.display='flex'">${fb}`;
}

/* =======================================================================
   5. CAPA DE DATOS  (Firebase ó Demo/mock con localStorage)
   ======================================================================= */
let MODE='demo';
let fdb=null, fauth=null;
let CURRENT_USER=null;
let CONFIG=null;
const forceDemo = new URLSearchParams(location.search).has('demo');

function defaultCap(a){ const act=CONFIG.activities[a]; return a==='spinning'?(act.bikeCount||12):(act.capacity||15); }

/* ---------- MOCK (demo) ---------- */
const Store = {
  read(k,def){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):def; }catch(e){ return (Store._m&&Store._m[k])||def; } },
  write(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){ Store._m=Store._m||{}; Store._m[k]=v; } }
};
const MockDB = {
  async getConfig(){ let c=Store.read('ego_config',null); if(!c){ c=JSON.parse(JSON.stringify(DEFAULT_CONFIG)); Store.write('ego_config',c); } return c; },
  async saveConfig(c){ Store.write('ego_config',c); return c; },
  _slots(){ return Store.read('ego_slots',{}); },
  _saveSlots(s){ Store.write('ego_slots',s); },
  async getSlot(a,dk,t){ const s=this._slots()[slotId(a,dk,t)]; return s?{...s}:null; },
  async reserve(r){
    const slots=this._slots(); const id=slotId(r.activity,r.date,r.time); const cap=defaultCap(r.activity);
    let s=slots[id]||{activity:r.activity,date:r.date,time:r.time,capacity:cap,closed:false,count:0,takenBikes:[]};
    if(s.closed) return {ok:false,reason:'closed'};
    if(s.count>=s.capacity) return {ok:false,reason:'full'};
    if(r.bike!=null && (s.takenBikes||[]).includes(r.bike)) return {ok:false,reason:'bike'};
    s.count++; if(r.bike!=null){ s.takenBikes=[...(s.takenBikes||[]),r.bike]; }
    slots[id]=s; this._saveSlots(slots);
    const list=Store.read('ego_res',[]);
    const doc={id:'r'+Date.now()+Math.floor(Math.random()*999),...r,status:'reservado',paid:false,createdAt:Date.now()};
    list.push(doc); Store.write('ego_res',list);
    return {ok:true,id:doc.id};
  },
  async listReservations(f){ let l=Store.read('ego_res',[]);
    if(f.date) l=l.filter(r=>r.date===f.date);
    if(f.from) l=l.filter(r=>r.date>=f.from && r.date<=f.to);
    return l.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)); },
  async updateReservation(id,ch){ const l=Store.read('ego_res',[]); const r=l.find(x=>x.id===id); if(!r)return;
    if(ch.status==='cancelado' && r.status!=='cancelado'){ const slots=this._slots(); const s=slots[slotId(r.activity,r.date,r.time)];
      if(s){ s.count=Math.max(0,s.count-1); if(r.bike!=null) s.takenBikes=(s.takenBikes||[]).filter(b=>b!==r.bike); this._saveSlots(slots); } }
    Object.assign(r,ch); Store.write('ego_res',l); },
  async setSlotOverride(a,dk,t,ov){ const slots=this._slots(); const id=slotId(a,dk,t);
    const s=slots[id]||{activity:a,date:dk,time:t,capacity:defaultCap(a),closed:false,count:0,takenBikes:[]};
    if('capacity'in ov)s.capacity=ov.capacity; if('closed'in ov)s.closed=ov.closed; slots[id]=s; this._saveSlots(slots); },
  async listStaff(){ return Store.read('ego_staff',[]); },
  async createStaff(u){ const l=Store.read('ego_staff',[]);
    if(l.some(x=>x.username===u.username.toLowerCase())) throw new Error('Ese usuario ya existe');
    l.push({uid:'u'+Date.now(),username:u.username.toLowerCase(),password:u.password,name:u.name,role:u.role,active:true});
    Store.write('ego_staff',l); },
  async updateStaff(uid,ch){ const l=Store.read('ego_staff',[]); const s=l.find(x=>x.uid===uid); if(s){Object.assign(s,ch);Store.write('ego_staff',l);} },
  async deleteStaff(uid){ let l=Store.read('ego_staff',[]); l=l.filter(x=>x.uid!==uid); Store.write('ego_staff',l); },
  async listExpenses(from,to){ let l=Store.read('ego_exp',[]); if(from)l=l.filter(e=>e.date>=from&&e.date<=to); return l.sort((a,b)=>b.date.localeCompare(a.date)); },
  async addExpense(e){ const l=Store.read('ego_exp',[]); l.push({id:'e'+Date.now(),...e}); Store.write('ego_exp',l); },
  async deleteExpense(id){ let l=Store.read('ego_exp',[]); l=l.filter(x=>x.id!==id); Store.write('ego_exp',l); },
  async login(user,pass){ user=user.trim().toLowerCase();
    let staff=Store.read('ego_staff',[]);
    if(!staff.length && user===BOOTSTRAP_ADMIN.username && pass===BOOTSTRAP_ADMIN.password){
      staff=[{uid:'admin1',username:BOOTSTRAP_ADMIN.username,password:BOOTSTRAP_ADMIN.password,name:BOOTSTRAP_ADMIN.name,role:'admin',active:true}];
      Store.write('ego_staff',staff);
    }
    const u=staff.find(x=>x.username===user && x.password===pass);
    if(!u) throw new Error('Usuario o contraseña incorrectos');
    if(u.active===false) throw new Error('Tu cuenta está desactivada');
    CURRENT_USER={uid:u.uid,username:u.username,name:u.name,role:u.role}; return CURRENT_USER; },
  async logout(){ CURRENT_USER=null; }
};

/* ---------- FIREBASE ---------- */
const FirebaseDB = {
  async getConfig(){ const ref=fdb.collection('settings').doc('config'); const s=await ref.get();
    if(!s.exists){ await ref.set(DEFAULT_CONFIG); return JSON.parse(JSON.stringify(DEFAULT_CONFIG)); } return s.data(); },
  async saveConfig(c){ await fdb.collection('settings').doc('config').set(c); return c; },
  async getSlot(a,dk,t){ const s=await fdb.collection('slots').doc(slotId(a,dk,t)).get(); return s.exists?s.data():null; },
  async reserve(r){
    const id=slotId(r.activity,r.date,r.time); const ref=fdb.collection('slots').doc(id);
    const resRef=fdb.collection('reservations').doc(); const cap=defaultCap(r.activity);
    try{
      return await fdb.runTransaction(async tx=>{
        const snap=await tx.get(ref); const d=snap.exists?snap.data():null;
        const capacity=d&&d.capacity!=null?d.capacity:cap; const closed=d?!!d.closed:false;
        const count=d?d.count||0:0; const taken=d?d.takenBikes||[]:[];
        if(closed) return {ok:false,reason:'closed'};
        if(count>=capacity) return {ok:false,reason:'full'};
        if(r.bike!=null && taken.includes(r.bike)) return {ok:false,reason:'bike'};
        const newTaken=r.bike!=null?[...taken,r.bike]:taken;
        tx.set(ref,{activity:r.activity,date:r.date,time:r.time,capacity,closed,count:count+1,takenBikes:newTaken},{merge:true});
        tx.set(resRef,{...r,status:'reservado',paid:false,createdAt:Date.now()});
        return {ok:true,id:resRef.id};
      });
    }catch(e){ return {ok:false,reason:'error',error:e.message}; }
  },
  async listReservations(f){ let q=fdb.collection('reservations');
    if(f.date) q=q.where('date','==',f.date);
    else if(f.from) q=q.where('date','>=',f.from).where('date','<=',f.to);
    const snap=await q.get(); let l=snap.docs.map(d=>({id:d.id,...d.data()}));
    return l.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)); },
  async updateReservation(id,ch){ const ref=fdb.collection('reservations').doc(id);
    if(ch.status==='cancelado'){ const cur=(await ref.get()).data();
      if(cur && cur.status!=='cancelado'){ const sref=fdb.collection('slots').doc(slotId(cur.activity,cur.date,cur.time));
        await fdb.runTransaction(async tx=>{ const s=await tx.get(sref); if(s.exists){ const d=s.data();
          tx.update(sref,{count:Math.max(0,(d.count||1)-1),takenBikes:(d.takenBikes||[]).filter(b=>b!==cur.bike)}); }
          tx.update(ref,ch); }); return; } }
    await ref.update(ch); },
  async setSlotOverride(a,dk,t,ov){ const ref=fdb.collection('slots').doc(slotId(a,dk,t));
    const s=await ref.get(); const base=s.exists?{}:{activity:a,date:dk,time:t,count:0,takenBikes:[],capacity:defaultCap(a),closed:false};
    await ref.set({...base,...ov},{merge:true}); },
  async listStaff(){ const s=await fdb.collection('staff').get(); return s.docs.map(d=>({uid:d.id,...d.data()})); },
  async createStaff(u){ const email=u.username.toLowerCase()+'@'+EMAIL_DOMAIN;
    const secondary=firebase.initializeApp(FIREBASE_CONFIG,'sec_'+Date.now());
    let cred; try{ cred=await secondary.auth().createUserWithEmailAndPassword(email,u.password); }
    catch(e){ await secondary.delete(); throw new Error(e.code==='auth/email-already-in-use'?'Ese usuario ya existe':e.message); }
    const uid=cred.user.uid; await secondary.auth().signOut(); await secondary.delete();
    await fdb.collection('staff').doc(uid).set({username:u.username.toLowerCase(),name:u.name,role:u.role,active:true}); },
  async updateStaff(uid,ch){ await fdb.collection('staff').doc(uid).update(ch); },
  async deleteStaff(uid){ await fdb.collection('staff').doc(uid).delete(); },
  async listExpenses(from,to){ let q=fdb.collection('expenses'); if(from)q=q.where('date','>=',from).where('date','<=',to);
    const s=await q.get(); return s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.date.localeCompare(a.date)); },
  async addExpense(e){ await fdb.collection('expenses').add(e); },
  async deleteExpense(id){ await fdb.collection('expenses').doc(id).delete(); },
  async login(user,pass){ user=user.trim().toLowerCase(); const email=user+'@'+EMAIL_DOMAIN;
    try{ await fauth.signInWithEmailAndPassword(email,pass); }
    catch(e){
      if(user===BOOTSTRAP_ADMIN.username && pass===BOOTSTRAP_ADMIN.password &&
         (e.code==='auth/user-not-found'||e.code==='auth/invalid-credential'||e.code==='auth/invalid-login-credentials')){
        const cred=await fauth.createUserWithEmailAndPassword(email,pass);
        await fdb.collection('staff').doc(cred.user.uid).set({username:user,name:BOOTSTRAP_ADMIN.name,role:'admin',active:true});
      } else { throw new Error('Usuario o contraseña incorrectos'); }
    }
    const uid=fauth.currentUser.uid; const sdoc=await fdb.collection('staff').doc(uid).get();
    if(!sdoc.exists){ await fauth.signOut(); throw new Error('Este usuario no tiene permisos asignados'); }
    const d=sdoc.data(); if(d.active===false){ await fauth.signOut(); throw new Error('Tu cuenta está desactivada'); }
    CURRENT_USER={uid,username:d.username,name:d.name,role:d.role}; return CURRENT_USER; },
  async logout(){ await fauth.signOut(); CURRENT_USER=null; }
};

let DB = MockDB;

/* ----- 6. ARRANQUE DEL NÚCLEO ----- */
async function initCore(){
  const firebaseReady = !window.__FB_LOAD_FAIL && typeof firebase!=='undefined' && FIREBASE_CONFIG.apiKey && !/XXXX/.test(FIREBASE_CONFIG.apiKey);
  if(firebaseReady && !forceDemo){
    try{ firebase.initializeApp(FIREBASE_CONFIG); fdb=firebase.firestore(); fauth=firebase.auth(); DB=FirebaseDB; MODE='firebase'; }
    catch(e){ console.warn('Firebase no disponible, usando demo:',e); DB=MockDB; MODE='demo'; }
  } else { DB=MockDB; MODE='demo'; }
  CONFIG = await DB.getConfig();
  if(MODE==='demo'){ const badge=document.getElementById('modeBadge'); if(badge) badge.classList.remove('hidden'); document.body.classList.add('has-badge'); await seedDemo(); }
  return CONFIG;
}

/* Datos de ejemplo para el demo (a prueba de la hora del día) */
async function seedDemo(){
  if(Store.read('ego_seeded',false)) return;
  const t=new Date(); const tk=dateKey(t);
  const y=new Date(t); y.setDate(y.getDate()-1); const yk=dateKey(y);
  const y2=new Date(t); y2.setDate(y2.getDate()-2); const y2k=dateKey(y2);
  async function seedRes(a,dk,ti,name,phone,bike,status,paid){
    const r=await DB.reserve({activity:a,date:dk,time:ti,name,phone,bike:bike??null,price:CONFIG.activities[a].price,source:'web'});
    if(r.ok){ const ch={}; if(status&&status!=='reservado')ch.status=status; if(paid)ch.paid=true;
      if(Object.keys(ch).length) await DB.updateReservation(r.id,ch); }
    return r;
  }
  const sDate=firstAvailableDate('spinning'), sTime=firstFutureTime('spinning',sDate);
  await seedRes('spinning',sDate,sTime,'Ana López','8711112233',3);
  await seedRes('spinning',sDate,sTime,'Luis Márquez','8712223344',7);
  await seedRes('spinning',sDate,sTime,'Sofía Ríos','8713334455',10);
  const bDate=firstAvailableDate('box'), bFirst=firstFutureTime('box',bDate), bLast=lastTime('box',bDate);
  await seedRes('box',bDate,bFirst,'Diego Ramos','8714445566');
  await seedRes('box',bDate,bFirst,'Karla Núñez','8715556677');
  await DB.setSlotOverride('box',bDate,bLast,{capacity:2});
  await seedRes('box',bDate,bLast,'Pedro Salas','8716667788');
  await seedRes('box',bDate,bLast,'Marco Díaz','8717778899');
  await seedRes('spinning',tk,'19:00','Regina Ávila','8710001122',1,'asistio',true);
  await seedRes('spinning',tk,'19:00','Iván Torres','8710002233',2,'reservado',true);
  await seedRes('box',tk,'18:00','Nadia Cruz','8710003344',null,'asistio',true);
  await seedRes('box',tk,'17:00','Hugo Peña','8710004455',null,'no_asistio',false);
  for(const dk of [yk,y2k]){
    await seedRes('spinning',dk,'07:00','Cliente '+dk.slice(-2),'8710000000',2,'asistio',true);
    await seedRes('spinning',dk,'08:00','Cliente '+dk.slice(-5,-3),'8710000001',5,'asistio',true);
    await seedRes('box',dk,'18:00','Cliente Box '+dk.slice(-2),'8710000002',null,'asistio',true);
    await seedRes('box',dk,'19:00','Cliente Box '+dk.slice(-5,-3),'8710000003',null,'no_asistio',false);
  }
  await DB.addExpense({date:yk,concept:'Mantenimiento bicicletas',amount:600});
  await DB.addExpense({date:tk,concept:'Agua y limpieza',amount:250});
  Store.write('ego_seeded',true);
}
