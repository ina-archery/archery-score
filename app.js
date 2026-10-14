(function(){
'use strict';
/* ================= i18n =================
   Source language = Japanese. t('日本語') returns the translation of the current language.
   Add a language: add I18N.xx = {...} in i18n.js and one line in LANGS. */
var LANGS={ja:'日本語',en:'English'};
var LANG='ja';
function t(s){var d=(LANG!=='ja'&&window.I18N&&window.I18N[LANG])||null,r=(d&&d[s]!=null)?d[s]:s,a=arguments;
  return r.replace(/\{(\d)\}/g,function(m,i){return a[+i+1]})}
function pickLang(c){if(c&&c!=='auto'&&LANGS[c])return c;var n=(navigator.language||'ja').toLowerCase().slice(0,2);return LANGS[n]?n:'en'}

/* ================= 定義 ================= */
// face: rw=width of one ring(cm) min=lowest score spots=number of faces indoor=indoor(no X) comp=compound indoor(small 10)
var FACES={
 '122':{l:'122cm',rw:6.1,min:1,spots:1},
 '80':{l:'80cm',rw:4,min:1,spots:1},
 '80-6':{l:'80cm 6リング',rw:4,min:5,spots:1},
 '60':{l:'60cm',rw:3,min:1,spots:1,indoor:true},
 '60c':{l:'60cm コンパウンド',rw:3,min:1,spots:1,indoor:true,comp:true},
 '40':{l:'40cm',rw:2,min:1,spots:1,indoor:true},
 '40c':{l:'40cm コンパウンド',rw:2,min:1,spots:1,indoor:true,comp:true},
 '40t':{l:'40cm 縦三つ目',rw:2,min:6,spots:3,lay:'v',indoor:true},
 '40tc':{l:'40cm 縦三つ目 コンパウンド',rw:2,min:6,spots:3,lay:'v',indoor:true,comp:true},
 '40tr':{l:'40cm 三角三つ目',rw:2,min:6,spots:3,lay:'t',indoor:true},
 '40trc':{l:'40cm 三角三つ目 コンパウンド',rw:2,min:6,spots:3,lay:'t',indoor:true,comp:true}
};
// centers of the 3 spots (cm): v = vertical, t = triangle (1 on top, 2 below)
var LAY={v:[[0,-22],[0,0],[0,22]],t:[[0,-12.7],[-11,6.4],[11,6.4]]};
// rounds: h=[distance,face,arrows]  (JAF rules art.111-112 / World Archery)
var ROUNDS=[
 {id:'70',l:'70mラウンド（72射）リカーブ',per:6,h:[['70m','122',36],['70m','122',36]]},
 {id:'60',l:'60mラウンド（72射）U18・50+・高校生',per:6,h:[['60m','122',36],['60m','122',36]]},
 {id:'50bb',l:'ベアボウ 50mラウンド（72射）',per:6,h:[['50m','122',36],['50m','122',36]]},
 {id:'50c',l:'コンパウンド 50mラウンド（72射）80cm',per:6,h:[['50m','80',36],['50m','80',36]]},
 {id:'50c6',l:'コンパウンド 50mラウンド（72射）80cm6リング',per:6,h:[['50m','80-6',36],['50m','80-6',36]]},
 {id:'5030',l:'50m・30mラウンド（各36射）80cm',per:6,h:[['50m','80',36],['30m','80',36]]},
 {id:'40u15',l:'リカーブU15 40m（72射）',per:6,h:[['40m','122',36],['40m','122',36]]},
 {id:'30jh',l:'リカーブ中学生 30m（72射）80cm',per:6,h:[['30m','80',36],['30m','80',36]]},
 {id:'18es',l:'リカーブ小学生 18m（72射）80cm',per:6,h:[['18m','80',36],['18m','80',36]]},
 {id:'40cu15',l:'コンパウンドU15 40m（72射）80cm',per:6,h:[['40m','80',36],['40m','80',36]]},
 {id:'30bbu15',l:'ベアボウU15 30m（72射）',per:6,h:[['30m','122',36],['30m','122',36]]},
 {id:'18in',l:'インドア 18m（60射）40cm',per:3,h:[['18m','40',30],['18m','40',30]]},
 {id:'18int',l:'インドア 18m（60射）40cm縦三つ目',per:3,h:[['18m','40t',30],['18m','40t',30]]},
 {id:'18tri',l:'インドア 18m（60射）40cm三角三つ目',per:3,h:[['18m','40tr',30],['18m','40tr',30]]},
 {id:'25in',l:'インドア 25m（60射）60cm',per:3,h:[['25m','60',30],['25m','60',30]]},
 {id:'1440m',l:'WA 1440ラウンド 男子（144射）90-70-50-30m',per:6,h:[['90m','122',36],['70m','122',36],['50m','80',36],['30m','80',36]]},
 {id:'1440w',l:'WA 1440ラウンド 女子（144射）70-60-50-30m',per:6,h:[['70m','122',36],['60m','122',36],['50m','80',36],['30m','80',36]]},
 {id:'free',l:'自由設定（練習・その他）',per:6,h:[['','122',36]]}
];
var RGROUPS=[
 {id:'g70',l:'70m',r:['70']},{id:'g60',l:'60m',r:['60']},{id:'g50',l:'50m',r:['50bb','50c','50c6','5030']},
 {id:'gjr',l:'ジュニア',r:['40u15','30jh','18es','40cu15','30bbu15']},{id:'gin',l:'インドア',r:['18in','18int','18tri','25in']},
 {id:'gwa',l:'WA 1440',r:['1440m','1440w']},{id:'gfree',l:'自由設定',r:['free']}];
function rgroupOf(id){return RGROUPS.filter(function(g){return g.r.indexOf(id)>=0})[0]||RGROUPS[0]}
// match play (JAF rules art.208 / World Archery)
var MKINDS={
 'r-ind':{l:'個人戦・セット制（3射×5セット・6ポイント先取）',per:3,sets:5,mode:'set',win:6,so:1},
 'r-team':{l:'団体戦・セット制（6射×4セット・5ポイント先取）',per:6,sets:4,mode:'set',win:5,so:3},
 'r-mix':{l:'ミックス団体・セット制（4射×4セット・5ポイント先取）',per:4,sets:4,mode:'set',win:5,so:2},
 'c-ind':{l:'個人戦・トータルスコア制（3射×5エンド・累計150点）',per:3,sets:5,mode:'cum',so:1},
 'c-team':{l:'団体戦・トータルスコア制（6射×4エンド・累計240点）',per:6,sets:4,mode:'cum',so:3},
 'c-mix':{l:'ミックス団体・トータルスコア制（4射×4エンド・累計160点）',per:4,sets:4,mode:'cum',so:2}
};
// match format x scoring system -> internal kind id
var MUNIT={ind:'個人戦',team:'団体戦',mix:'ミックス団体'};
var MSYS={set:'セット制',cum:'トータルスコア制'};
function mkind(u,y){return (y==='cum'?'c-':'r-')+u}
var BOWS={recurve:'リカーブ',compound:'コンパウンド',barebow:'ベアボウ',other:'その他'};
var ZC={10:'#f7d117',9:'#f7d117',8:'#e0342b',7:'#e0342b',6:'#2a8be0',5:'#2a8be0',4:'#2b2b2b',3:'#2b2b2b',2:'#fafafa',1:'#fafafa'};

/* ================= 状態・保存 ================= */
var KEY='archery_pro_v1';
var DB=load();
LANG=pickLang(DB.set.lang);
var ui={view:'rec',all:false,info:false,mode:null,anaScope:'cur',anaRound:'all',anaDist:'all',histRound:'all',dlgKind:'score'};
var CAP=window.Capacitor,NATIVE=!!(CAP&&CAP.isNativePlatform&&CAP.isNativePlatform());
function defSet(){return {cursorX:2,zoom:1.5,lang:'auto',name:'',arrowMm:5.5,offset:true,sort:true,vib:true,wake:false,bow:'recurve',mode:'target'}}
function load(){var d=null;try{d=JSON.parse(localStorage.getItem(KEY))}catch(e){}
  if(!d||!d.sessions)d={v:1,sessions:[],cur:null,set:defSet()};
  if(!d.events)d.events=[];
  d.set=Object.assign(defSet(),d.set||{});
  if(!d.migrated){d.migrated=1;try{var o=JSON.parse(localStorage.getItem('score70m_v1')||'null');if(o&&o.rounds)migrateOld(d,o)}catch(e){}}
  return d}
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
function migrateOld(d,o){var any=false,hs=[];
  o.rounds.forEach(function(r){var ends=r.map(function(en){return en.map(function(a,i){if(!a)return null;any=true;return {s:a.s,x:!!a.xr,px:a.x,py:a.y,sp:0,n:i+1,t:0}})});hs.push({d:o.dist||'70M',f:'122',ends:ends})});
  if(!any)return;
  d.sessions.push({id:uid(),type:'score',created:Date.now(),name:o.name||'',date:o.date||today(),place:o.place||'',bow:'recurve',round:'free',roundLabel:'旧アプリから引き継ぎ',per:6,halves:hs,cur:{h:0,e:0,a:0},memo:'',weather:'',arrowMm:5.5})}

/* ================= 共通 ================= */
function $(s){return document.querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function curS(){for(var i=0;i<DB.sessions.length;i++)if(DB.sessions[i].id===DB.cur)return DB.sessions[i];return null}
function lab(a){return !a?'':(a.s===0?'M':(a.x?'X':String(a.s)))}
function cls(a){return a?'s'+a.s:''}
function f2(n){return (Math.round(n*100)/100).toFixed(2)}
function maxArrows(S){return S.halves.reduce(function(t,h){return t+h.ends.reduce(function(u,en){return u+en.length},0)},0)}
function faceOf(h){return FACES[h.f]||FACES['122']}
function rl(S){var R=ROUNDS.filter(function(r){return r.id===S.round})[0];if(R&&R.id!=='free')return t(R.l);return t(S.roundLabel||'自由設定')}
function rlShort(S){return rl(S).replace(/[（(].*?[）)]/,'').trim()}
function scoreAt(f,dx,dy,ar){
  var R=(11-f.min)*f.rw, d=Math.sqrt(dx*dx+dy*dy)-ar;
  if(d>R+1e-9)return {s:0,x:false};
  if(d<0)d=0;
  var k=Math.max(1,Math.ceil(d/f.rw-1e-9)), s=11-k, x=false, inner=d<=f.rw/2+1e-9;
  if(f.comp){ if(inner)s=10; else if(s===10)s=9 }
  else if(!f.indoor&&s===10&&inner)x=true;
  return {s:s,x:x}}
function sortEnd(en){en.sort(function(a,b){return (b.s-a.s)||((b.x?1:0)-(a.x?1:0))||((a.n||0)-(b.n||0))})}
function stat(S){
  var o={total:0,n:0,tens:0,xs:0,nines:0,cap:maxArrows(S),half:[]},ind=faceOf(S.halves[0]).indoor;
  S.halves.forEach(function(h){var q={sum:0,n:0,tens:0,xs:0,nines:0};
    h.ends.forEach(function(en){en.forEach(function(a){if(!a)return;q.sum+=a.s;q.n++;if(a.s===10){q.tens++;if(a.x)q.xs++}if(a.s===9)q.nines++})});
    o.half.push(q);o.total+=q.sum;o.n+=q.n;o.tens+=q.tens;o.xs+=q.xs;o.nines+=q.nines});
  o.max=o.cap*10;o.avg=o.n?o.total/o.n:0;o.indoor=ind;o.done=o.n>=o.cap;return o}
function endTotal(en){var q=0;en.forEach(function(a){if(a)q+=a.s});return q}
function bestOf(S){var b=null;DB.sessions.forEach(function(x){if(x.type!=='score'||x.id===S.id||x.round!==S.round||maxArrows(x)!==maxArrows(S))return;var st=stat(x);if(!st.done)return;if(!b||st.total>b.t)b={t:st.total,d:x.date}});return b}
function nextEmpty(S,h,e,a){var order=[];
  S.halves.forEach(function(hh,hi){hh.ends.forEach(function(en,ei){en.forEach(function(_,ai){order.push({h:hi,e:ei,a:ai})})})});
  var start=0;for(var i=0;i<order.length;i++){if(order[i].h===h&&order[i].e===e&&order[i].a===a){start=i;break}}
  for(var j=0;j<order.length;j++){var p=order[(start+j)%order.length];if(!S.halves[p.h].ends[p.e][p.a])return p}
  return null}
function vib(){if(DB.set.vib&&navigator.vibrate)try{navigator.vibrate(12)}catch(e){}}
function tens(st,x){return st.indoor?t('10:{0} 9:{1}',x.tens,x.nines):t('10+X:{0} X:{1}',x.tens,x.xs)}

/* ================= 記録の作成 ================= */
function makeScore(o){
  var R=ROUNDS.filter(function(r){return r.id===o.round})[0]||ROUNDS[0],per=Math.max(1,Math.min(30,Math.round(+o.per)||R.per)),hs=[];
  if(o.round==='free'){var n=Math.max(1,+o.free.arrows||36),cnt=Math.max(1,Math.min(6,+o.free.halves||1));
    for(var i=0;i<cnt;i++)hs.push({d:o.free.dist||'',f:o.face||'122',n:n})}
  else hs=R.h.map(function(h){return {d:h[0],f:o.face||h[1],n:h[2]}});
  var halves=hs.map(function(h){var ne=Math.max(1,Math.ceil(h.n/per)),ends=[];for(var e=0;e<ne;e++)ends.push(new Array(Math.min(per,h.n-e*per)).fill(null));return {d:h.d,f:h.f,ends:ends}});
  return {id:uid(),type:'score',created:Date.now(),name:o.name,date:o.date,place:o.place,bow:o.bow,round:o.round,
    per:per,halves:halves,cur:{h:0,e:0,a:0},memo:'',weather:'',arrowMm:DB.set.arrowMm,gear:lastGear(),goal:0}}
function lastGear(){var b=null;DB.sessions.forEach(function(x){if(x.type==='score'&&x.gear&&(!b||x.created>b.created))b=x});return b?Object.assign({},b.gear):{}}
function makeMatch(o){var K=MKINDS[o.kind],sets=[];
  var per=+o.per||K.per;for(var i=0;i<K.sets;i++)sets.push({me:new Array(per).fill(null),op:new Array(per).fill(null)});
  return {id:uid(),type:'match',created:Date.now(),name:o.name,opp:o.opp||'',date:o.date,place:o.place,kind:o.kind,per:per,sets:sets,
    so:{me:new Array(K.so).fill(null),op:new Array(K.so).fill(null),closer:null},cur:{g:'set',s:0,side:'me',a:0},memo:''}}
function mper(S){return S.per||MKINDS[S.kind].per}
function mname(S){var u=S.kind.slice(2);return t(MUNIT[u])+'・'+t(S.kind.charAt(0)==='c'?MSYS.cum:MSYS.set)}
function mlabel(S){var K=MKINDS[S.kind],p=mper(S);return mname(S)+'（'+(K.mode==='set'?t('{0}射×{1}セット',p,K.sets)+'・'+t('{0}ポイント先取',K.win):t('{0}射×{1}エンド',p,K.sets)+'・'+t('満点{0}点',p*K.sets*10))+'）'}
function oppName(S){return S.opp||t('相手')}
function meName(S){return S.name||t('自分')}

/* ================= 画面切替 ================= */
function applyStatic(){document.documentElement.lang=LANG;document.title=t('アーチェリー スコア記録');
  var l=document.querySelectorAll('[data-i18n]');for(var i=0;i<l.length;i++)l[i].textContent=t(l[i].getAttribute('data-i18n'))}
function show(v){ui.view=v;['rec','hist','ana','cal','set'].forEach(function(k){$('#v-'+k).className='view'+(k===v?' on':'');$('#n-'+k).className=(k===v?'on':'')});render()}
function render(){
  var S=curS();applyStatic();
  $('#sub').textContent=S?((S.name||t('名前なし'))+' ・ '+(S.type==='match'?t('対戦'):rl(S))+' ・ '+S.date):'';
  if(ui.view==='rec')renderRec();else if(ui.view==='hist')renderHist();else if(ui.view==='ana')renderAna();else if(ui.view==='cal')renderCal();else renderSet()}

/* ================= 的の描画 ================= */
function faceSVG(f,cx,cy){var n=11-f.min,rw=f.rw,s='';
  for(var k=n;k>=1;k--){var sc=11-k;s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(k*rw)+'" fill="'+ZC[sc]+'" stroke="'+((sc===3||sc===4)?'#888':'#222')+'" stroke-width="'+(rw*0.035)+'"/>'}
  if(f.comp||!f.indoor)s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(rw/2)+'" fill="none" stroke="#222" stroke-width="'+(rw*0.03)+'"/>';
  var c=rw*0.22;s+='<path d="M'+(cx-c)+' '+cy+'H'+(cx+c)+'M'+cx+' '+(cy-c)+'V'+(cy+c)+'" stroke="#222" stroke-width="'+(rw*0.03)+'"/>';return s}
function vbOf(P,R,m){var x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;P.forEach(function(p){x0=Math.min(x0,p[0]-R);x1=Math.max(x1,p[0]+R);y0=Math.min(y0,p[1]-R);y1=Math.max(y1,p[1]+R)});return [x0-m,y0-m,x1-x0+2*m,y1-y0+2*m]}
function geom(h){var f=faceOf(h),R=(11-f.min)*f.rw,P=f.spots>1?LAY[f.lay||'v']:[[0,0]];
  return {f:f,R:R,vb:vbOf(P,R,f.spots>1?2:1.5),cps:P}}
function arrowMarks(S,h,g,cur){var s='',mr=g.R*0.034*(g.f.spots>1?1.3:1);
  S.halves[h].ends.forEach(function(en,ei){
    if(!ui.all&&ei!==cur.e)return;var isCur=(ei===cur.e);
    en.forEach(function(a,ai){if(!a||a.px==null)return;var cp=g.cps[a.sp||0]||[0,0],x=a.px+cp[0],y=a.py+cp[1],sel=isCur&&cur.a===ai;
      s+='<circle cx="'+x+'" cy="'+y+'" r="'+(isCur?mr:mr*0.62)+'" fill="'+(isCur?'#fff':'#9b59b6')+'" stroke="'+(sel?'#e67e00':(isCur?'#000':'#fff'))+'" stroke-width="'+(sel?mr*0.35:mr*0.18)+'" opacity="'+(isCur?1:0.85)+'"/>';
      if(isCur)s+='<text x="'+x+'" y="'+(y+mr*0.45)+'" text-anchor="middle" font-size="'+(mr*1.25)+'" font-weight="bold" fill="#000">'+(a.n||ai+1)+'</text>'})});
  return s}

/* ================= 記録画面 ================= */
function emptyRec(){
  var h='<div class="card"><h2>'+t('記録がありません')+'</h2><p class="note">'+t('下のボタンから新しい記録を始めましょう。')+'</p><div class="row"><button class="pri" data-act="newDlg">'+t('＋ 新しい記録')+'</button></div></div>';
  var recent=DB.sessions.slice().sort(function(a,b){return b.created-a.created}).slice(0,3);
  if(recent.length){h+='<h2>'+t('最近の記録')+'</h2>'+recent.map(listItem).join('')}
  return h}
function renderRec(){var S=curS(),el=$('#v-rec');
  if(!S){el.innerHTML=emptyRec();return}
  if(S.type==='match'){el.innerHTML=matchHTML(S);return}
  var st=stat(S),c=S.cur,H=S.halves[c.h],g=geom(H),mode=ui.mode||DB.set.mode,per=S.per,best=bestOf(S);
  var h='';
  h+='<div class="card sum"><div class="grand"><small>'+t('合計')+'</small><b>'+st.total+'</b><small>/ '+st.max+'</small></div>'
    +'<div><small>'+t('本数')+'</small><b>'+st.n+'/'+st.cap+'</b></div><div><small>'+t('平均/矢')+'</small><b>'+f2(st.avg)+'</b></div>'
    +(st.indoor?'<div><small>'+t('10 / 9の数')+'</small><b>'+st.tens+' / '+st.nines+'</b></div>':'<div><small>'+t('10+X / X')+'</small><b>'+st.tens+' / '+st.xs+'</b></div>')
    +'<div><small>'+(best?t('ベスト差'):t('ベスト'))+'</small><b>'+(best?(st.done?(st.total-best.t>=0?'+':'')+(st.total-best.t):best.t):'―')+'</b></div></div>';
  h+=goalCard(S,st);
  h+='<div class="card">';
  if(S.halves.length>1){h+='<div class="tabs">'+S.halves.map(function(hh,i){return '<button class="'+(c.h===i?'on':'')+'" data-act="tab" data-v="'+i+'">'+t('{0}回目 {1}',i+1,esc(hh.d))+'<br><small>'+t('{0}点',st.half[i].sum)+'</small></button>'}).join('')+'</div>'}
  var cell=H.ends[c.e][c.a];
  h+='<div class="now">'+esc(H.d)+'　'+t('{0}エンド目',c.e+1)+'　'+t('{0}本目',c.a+1)+' <span>'+(cell?t('（{0}を書き換え）',lab(cell)):(st.done?t('（全部入力済み）'):''))+'</span></div>';
  var perHalf=H.ends.length*per,showAll=ui.tableAll&&S.halves.length>1,list=showAll?S.halves.map(function(_,i){return i}):[c.h],run=0,hMain=h;h='';
  h+='<div class="scwrap">';
  h+='<div class="chips tbar">'+(S.halves.length>1?'<button class="'+(!showAll?'on':'')+'" data-act="tbl" data-v="0">'+t('{0}本ずつ',perHalf)+'</button><button class="'+(showAll?'on':'')+'" data-act="tbl" data-v="1">'+t('全{0}本',st.cap)+'</button>':'')+'<button class="pri" data-act="undo">'+t('↩ 1本戻す')+'</button>'+(mode==='target'?'<button data-act="zoomReset"'+(zoomed()?'':' disabled')+'>'+t('🔍 拡大を戻す')+'</button>':'')+'</div>';
  h+='<div class="chips"><button class="'+(DB.set.sort?'on':'')+'" data-act="sortEnd">'+t('エンド終了で点数順に並べる')+'</button></div>';
  list.forEach(function(hi){var HH=S.halves[hi],hs=st.half[hi];
    if(!showAll)run=0;
    h+='<table class="'+(per>8?'many':'')+'"'+(hi!==list[0]?' style="margin-top:10px"':'')+'><colgroup><col style="width:11%">'+new Array(per+1).join('<col>')+'<col style="width:13%"><col style="width:14%"></colgroup><thead><tr><th>'+(showAll?esc(HH.d)+'<br>'+(hi+1):t('エンド'))+'</th>';
    for(var i=1;i<=per;i++)h+='<th>'+i+'</th>';h+='<th>'+t('計')+'</th><th>'+t('累計')+'</th></tr></thead><tbody>';
    HH.ends.forEach(function(en,e){var q=endTotal(en);run+=q;var any=en.some(Boolean);
      h+='<tr><th>'+(e+1)+'</th>'+en.map(function(a,i){return '<td class="c '+cls(a)+((c.h===hi&&c.e===e&&c.a===i)?' sel':'')+'" data-act="cellSel" data-h="'+hi+'" data-e="'+e+'" data-a="'+i+'">'+lab(a)+'</td>'}).join('')+new Array(per-en.length+1).join('<td></td>')+'<td class="tot">'+(any?q:'')+'</td><td class="tot">'+(any?run:'')+'</td></tr>'});
    h+='</tbody><tfoot><tr><th colspan="'+(per+1)+'">'+(S.halves.length>1?t('{0}回目 ',hi+1):'')+t('小計')+'　'+tens(st,hs)+'</th><td colspan="2">'+hs.sum+'</td></tr>';
    if(S.halves.length>1&&(!showAll||hi===list[list.length-1]))h+='<tr><th colspan="'+(per+1)+'">'+t('合計')+'</th><td colspan="2">'+st.total+'</td></tr>';
    h+='</tfoot></table>'});
  h+='</div>';var tb=h;h=hMain;
  h+='<div class="chips"><button class="'+(mode==='target'?'on':'')+'" data-act="mode" data-v="target">'+t('的にタッチ')+'</button><button class="'+(mode==='key'?'on':'')+'" data-act="mode" data-v="key">'+t('点数ボタン')+'</button></div>';
  if(mode==='target'){
    var vb=g.vb.join(' '),faces='';g.cps.forEach(function(cp){faces+=faceSVG(g.f,cp[0],cp[1])});
    h+='<div class="tgwrap"><svg id="tg" viewBox="'+((ui.tgView&&ui.tgKey===g.vb.join(' '))?ui.tgView.join(' '):vb)+'" style="touch-action:'+((ui.tgView&&ui.tgKey===g.vb.join(' ')&&ui.tgView[2]<g.vb[2]-0.01)?'none':'pan-y')+'"><g id="world">'+faces+'<g>'+arrowMarks(S,c.h,g,c)+'</g></g><g id="prev" visibility="hidden"><circle r="'+(g.R*0.05)+'" fill="none" stroke="#e67e00" stroke-width="'+(g.R*0.012)+'"/></g></svg></div>'+tb
      +'<p class="note">'+t('的をタップすると、その位置の得点が入ります。2本指で拡大して、拡大したままタップできます。拡大中は1本指で動かせます。的の外をタップするとミスになります。')+(g.f.spots>1?t('三つ目は押した位置に近い的が対象です。'):'')+'</p>'}
  else{h+=keypad(g.f,'key')+tb}
  h+='<div class="row">'+(cell?'<button data-act="clr">'+t('選んだ矢を消す')+'</button>':'')+(mode==='target'?'<button data-act="viewAll">'+(ui.all?t('表示：全エンド'):t('表示：今のエンドだけ'))+'</button>':'')+'</div></div>';
  h+='<details class="card" id="info" '+(ui.info?'open':'')+'><summary><b>'+t('記録の情報・メモ')+'</b></summary>'
    +'<div class="grid2"><div><label>'+t('氏名')+'</label><input data-bind="name" value="'+esc(S.name)+'"></div><div><label>'+t('日付')+'</label><input type="date" data-bind="date" value="'+esc(S.date)+'"></div></div>'
    +'<label>'+t('大会名・場所')+'</label><input data-bind="place" value="'+esc(S.place)+'">'
    +'<div class="grid2"><div><label>'+t('天候・風')+'</label><input data-bind="weather" placeholder="'+esc(t('例: 晴れ・右から3m'))+'" value="'+esc(S.weather)+'"></div><div><label>'+t('弓種')+'</label><select data-bind="bow">'+Object.keys(BOWS).map(function(k){return '<option value="'+k+'"'+(S.bow===k?' selected':'')+'>'+t(BOWS[k])+'</option>'}).join('')+'</select></div></div>'
    +gearHTML(S)+'<label>'+t('メモ（調子・反省・セッティング）')+'</label><textarea rows="3" data-bind="memo">'+esc(S.memo)+'</textarea></details>';
  h+='<div class="card"><div class="row">'+(NATIVE?'':'<button data-act="print">'+t('🖨 スコアカード印刷')+'</button>')+'<button data-act="csv">'+t('CSV保存')+'</button><button data-act="copy">'+t('結果をコピー')+'</button><button data-act="share">'+t('共有')+'</button></div>'
    +'<div class="row"><button data-act="newDlg" class="pri">'+t('＋ 新しい記録')+'</button><button data-act="go" data-v="ana">'+t('この記録の分析へ')+'</button></div></div>';
  el.innerHTML=h}
var GEAR=[['sight','サイト（数値）','例: 70m 4.52'],['hite','ハイト（ブレースハイト）','例: 23.5cm'],['tiller','ティラー','例: 上13 下10'],['nock','ノッキングポイント','例: +3mm'],['lbs','ポンド','例: 38lbs'],['arrow','矢（長さ・番手）','例: 29.5in 1000'],['other','その他セッティング','例: クリッカー位置']];
function gearHTML(S){var g=S.gear||{};
  return '<h2 style="margin-top:10px">'+t('弓具セッティング')+'</h2><div class="grid2">'+GEAR.map(function(f){return '<div><label>'+t(f[1])+'</label><input data-gear="'+f[0]+'" placeholder="'+esc(t(f[2]))+'" value="'+esc(g[f[0]]||'')+'"></div>'}).join('')+'</div><p class="note">'+t('次の新しい記録には、前回の内容が引き継がれます。')+'</p>'}
function goalCard(S,st){var g=+S.goal||0;
  if(!g)return '<div class="row" style="margin:0 0 8px"><button data-act="goal">'+t('🎯 目標点数を設定')+'</button></div>';
  var left=st.cap-st.n,need=g-st.total,h='<div class="card" style="padding:8px 10px"><div class="now" style="margin:0">'+t('目標 {0}点',g)+' <span>'+(left<=0?(st.total>=g?t('達成！'):t('あと{0}点で届きませんでした',g-st.total)):need<=0?t('達成済み（あと{0}本）',left):t('あと{0}点・残り{1}本 → 平均 {2}点/本',need,left,f2(need/left)))+'</span></div>';
  if(left>0&&need>0&&need/left>10)h+='<p class="note" style="margin:2px 0 0">'+t('目標が高めです。残りの本数では届かない可能性があります。')+'</p>';
  return h+'<div class="row" style="margin-top:4px"><button data-act="goal">'+t('目標を変更')+'</button></div></div>'}
function keypad(f,act){
  var vals=[];if(!f.indoor)vals.push('X');for(var v=10;v>=f.min;v--)vals.push(v);vals.push('M');
  return '<div class="pad">'+vals.map(function(v){var k=v==='X'?'X':(v==='M'?'0':v);return '<button class="k'+k+'" data-act="'+act+'" data-v="'+v+'">'+v+'</button>'}).join('')+'</div>'}

/* ----- 入力 ----- */
function putArrow(S,a){var c=S.cur,en=S.halves[c.h].ends[c.e],old=en[c.a];
  a.t=Date.now();a.n=old?old.n:en.filter(Boolean).length+1;en[c.a]=a;vib();
  if(DB.set.sort&&en.every(Boolean))sortEnd(en);
  var n=nextEmpty(S,c.h,c.e,c.a);if(n)S.cur=n;
  save();render()}
function keyIn(v){var S=curS();if(!S)return;var a;
  if(v==='M')a={s:0,x:false,px:null,py:null,sp:null};
  else if(v==='X')a={s:10,x:true,px:null,py:null,sp:null};
  else a={s:+v,x:false,px:null,py:null,sp:null};
  putArrow(S,a)}
var ACT={
 nav:function(b){show(b.dataset.v)},
 go:function(b){show(b.dataset.v)},
 tab:function(b){var S=curS(),h=+b.dataset.v,n=nextEmpty(S,h,0,0);S.cur=(n&&n.h===h)?n:{h:h,e:0,a:0};save();render()},
 mode:function(b){ui.mode=b.dataset.v;DB.set.mode=ui.mode;save();render()},
 key:function(b){keyIn(b.dataset.v)},
 miss:function(){keyIn('M')},
 goal:function(){var S=curS();if(!S)return;var v=prompt(t('目標点数を入力（空で解除）'),S.goal||'');if(v===null)return;S.goal=Math.max(0,Math.min(maxArrows(S)*10,Math.round(+v)||0));save();render()},
 calAdd:function(){var d=prompt(t('日付（例 2026-11-03）'),today());if(!d)return;if(!/^\d{4}-\d{1,2}-\d{1,2}$/.test(d.trim())){alert(t('日付は 2026-11-03 の形で入力してください'));return}var p=d.trim().split('-');d=p[0]+'-'+('0'+p[1]).slice(-2)+'-'+('0'+p[2]).slice(-2);var ti=prompt(t('予定の名前（例 新人戦）'),'');if(!ti)return;DB.events.push({id:uid(),date:d,title:ti,kind:'試合'});save();render()},
 calDel:function(b){if(confirm(t('この予定を削除しますか？'))){DB.events=DB.events.filter(function(e){return e.id!==b.dataset.id});save();render()}},
 calMonth:function(b){ui.calM=(ui.calM||0)+(+b.dataset.v);render()},
 zoomReset:function(){ui.tgView=null;render()},
 viewAll:function(){ui.all=!ui.all;render()},
 cellSel:function(b){var S=curS();S.cur={h:b.dataset.h!=null?+b.dataset.h:S.cur.h,e:+b.dataset.e,a:+b.dataset.a};save();render()},
 sortEnd:function(){DB.set.sort=!DB.set.sort;save();render()},
 tbl:function(b){ui.tableAll=b.dataset.v==='1';render()},
 clr:function(){var S=curS(),c=S.cur;S.halves[c.h].ends[c.e][c.a]=null;save();render()},
 undo:function(){var S=curS(),best=null;
  S.halves.forEach(function(h,hi){h.ends.forEach(function(en,ei){en.forEach(function(a,ai){if(a&&(!best||(a.t||0)>=(best.a.t||0)))best={a:a,h:hi,e:ei,i:ai}})})});
  if(!best)return;var en=S.halves[best.h].ends[best.e];en[best.i]=null;
  var rest=en.filter(Boolean).sort(function(a,b){return (a.n||0)-(b.n||0)});rest.forEach(function(a,k){a.n=k+1});
  for(var k=0;k<en.length;k++)en[k]=rest[k]||null;
  S.cur={h:best.h,e:best.e,a:rest.length};save();render()},
 newDlg:function(){openNew()},
 create:function(){createFromDlg()},
 closeDlg:function(){$('#dlg').close()},
 dlgKind:function(b){ui.dlgKind=b.dataset.v;openNew(true)},
 rgrp:function(b){var cur=readDlg()||{};cur.round=b.dataset.v;cur.per=undefined;ui.dlgVals=cur;openNew()},
 open:function(b){DB.cur=b.dataset.id;save();ui.all=false;show('rec')},
 del:function(b){if(confirm(t('この記録を削除しますか？（元に戻せません）'))){DB.sessions=DB.sessions.filter(function(s){return s.id!==b.dataset.id});if(DB.cur===b.dataset.id)DB.cur=null;save();render()}},
 histRound:function(b){ui.histRound=b.dataset.v;render()},
 csv:function(){exportCSV()},
 copy:function(b){copyText(summaryText(curS()),b)},
 share:function(){var S=curS(),tx=summaryText(S);
   if(NATIVE&&plug('Share')){plug('Share').share({text:tx}).catch(function(){})}
   else if(navigator.share)navigator.share({text:tx}).catch(function(){});else copyText(tx,null)},
 print:function(){buildPrint(curS());setTimeout(function(){window.print()},60)},
 expAll:function(){saveFile('archery_backup_'+today()+'.json',JSON.stringify(DB),'application/json')},
 impAll:function(){$('#file').click()},
 wipe:function(){if(confirm(t('すべての記録を削除します。よろしいですか？'))&&confirm(t('本当に削除しますか？（先にバックアップ保存を推奨）'))){DB.sessions=[];DB.cur=null;save();render()}},
 anaScope:function(b){ui.anaScope=b.dataset.v;render()},
 mKey:function(b){mKey(b.dataset.v)},
 mCell:function(b){var S=curS();S.cur={g:b.dataset.g,s:+b.dataset.s,side:b.dataset.side,a:+b.dataset.a};save();render()},
 mUndo:function(){mUndo()},
 mClr:function(){var S=curS();var arr=mArr(S,S.cur);arr[S.cur.a]=null;save();render()},
 mCloser:function(b){var S=curS();S.so.closer=(S.so.closer===b.dataset.v?null:b.dataset.v);save();render()}
};
document.addEventListener('click',function(e){var b=e.target.closest('[data-act]');if(!b||!ACT[b.dataset.act])return;ACT[b.dataset.act](b,e)});
document.addEventListener('input',function(e){var x=e.target;
  if(x.dataset&&x.dataset.gear){var S0=curS();if(S0){S0.gear=S0.gear||{};S0.gear[x.dataset.gear]=x.value;ui.info=true;save()}}
  if(x.dataset&&x.dataset.bind){var S=curS();if(S){S[x.dataset.bind]=x.value;ui.info=true;save();$('#sub').textContent=(S.name||t('名前なし'))+' ・ '+(S.type==='match'?t('対戦'):rl(S))+' ・ '+S.date}}
  if(x.dataset&&x.dataset.set&&x.dataset.set!=='lang'){var k=x.dataset.set;DB.set[k]=(x.type==='checkbox')?x.checked:(x.type==='number'?(+x.value||DB.set[k]):x.value);save();if(k==='wake')wake()}});
document.addEventListener('change',function(e){var x=e.target;if(x.dataset&&x.dataset.set==='lang'){DB.set.lang=x.value;LANG=pickLang(x.value);save();render()}});
document.addEventListener('toggle',function(e){if(e.target.id==='info')ui.info=e.target.open},true);

/* ----- 的タッチ入力（2本指で拡大・タップで入力） ----- */
var tp={p:{},svg:null,moved:false,pinch:false};
function svgPt(ev,svg){var q=svg.createSVGPoint();q.x=ev.clientX;q.y=ev.clientY;var r=q.matrixTransform(svg.getScreenCTM().inverse());return {x:r.x,y:r.y}}
function currentGeom(){var S=curS();return geom(S.halves[S.cur.h])}
function spotOf(g,x,y){if(g.cps.length===1)return 0;var bi=0,bd=1e9;g.cps.forEach(function(cp,i){var d=(x-cp[0])*(x-cp[0])+(y-cp[1])*(y-cp[1]);if(d<bd){bd=d;bi=i}});return bi}
function getView(svg){return svg.getAttribute('viewBox').split(' ').map(Number)}
function baseView(){return currentGeom().vb.slice()}
function setView(svg,v){var B=baseView(),w=Math.max(B[2]/6,Math.min(B[2],v[2])),h=w*B[3]/B[2],x=Math.max(B[0],Math.min(B[0]+B[2]-w,v[0])),y=Math.max(B[1],Math.min(B[1]+B[3]-h,v[1]));
  v=[x,y,w,h];svg.setAttribute('viewBox',v.join(' '));ui.tgView=v;ui.tgKey=B.join(' ');svg.style.touchAction=(w<B[2]-0.01)?'none':'pan-y';var zb=document.querySelector('[data-act=zoomReset]');if(zb)zb.disabled=!(w<B[2]-0.01)}
function zoomed(){var g=currentGeom();return !!(ui.tgView&&ui.tgKey===g.vb.join(' ')&&ui.tgView[2]<g.vb[2]-0.01)}
function placeAt(ev,svg){var g=currentGeom(),S=curS(),pt=svgPt(ev,svg),r=svg.getBoundingClientRect();
  if(!(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom))return;
  var sp=spotOf(g,pt.x,pt.y),dx=pt.x-g.cps[sp][0],dy=pt.y-g.cps[sp][1],sc=scoreAt(g.f,dx,dy,(S.arrowMm||5.5)/20*(+DB.set.cursorX||1));
  vib();putArrow(S,{s:sc.s,x:sc.x,px:Math.round(dx*10)/10,py:Math.round(dy*10)/10,sp:sp})}
function pinchInit(){var ids=Object.keys(tp.p),a=tp.p[ids[0]],b=tp.p[ids[1]];
  tp.d0=Math.hypot(a.x-b.x,a.y-b.y)||1;tp.m0={clientX:(a.x+b.x)/2,clientY:(a.y+b.y)/2};tp.v0=getView(tp.svg);tp.q0=svgPt(tp.m0,tp.svg)}
document.addEventListener('pointerdown',function(ev){var svg=ev.target.closest&&ev.target.closest('#tg');if(!svg||!curS())return;
  if(tp.svg!==svg){tp.p={}}tp.svg=svg;tp.p[ev.pointerId]={x:ev.clientX,y:ev.clientY,sx:ev.clientX,sy:ev.clientY};
  try{svg.setPointerCapture(ev.pointerId)}catch(e){}
  var n=Object.keys(tp.p).length;
  if(n===1){tp.moved=false;tp.pinch=false;tp.v0=getView(svg)}
  else{tp.pinch=true;tp.moved=true;pinchInit()}
  if(ev.pointerType!=='touch')ev.preventDefault()});
document.addEventListener('pointermove',function(ev){var P=tp.p[ev.pointerId];if(!P||!tp.svg)return;P.x=ev.clientX;P.y=ev.clientY;
  var svg=tp.svg,n=Object.keys(tp.p).length,r=svg.getBoundingClientRect();
  if(n>=2&&tp.pinch){ev.preventDefault();var ids=Object.keys(tp.p),a=tp.p[ids[0]],b=tp.p[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2,w=tp.v0[2]/(d/tp.d0),h=w*tp.v0[3]/tp.v0[2];
    setView(svg,[tp.q0.x-(mx-r.left)/r.width*w,tp.q0.y-(my-r.top)/r.height*h,w,h]);return}
  if(Math.abs(ev.clientX-P.sx)>8||Math.abs(ev.clientY-P.sy)>8)tp.moved=true;
  if(tp.moved&&zoomed()&&n===1){ev.preventDefault();var v=tp.v0;setView(svg,[v[0]-(ev.clientX-P.sx)/r.width*v[2],v[1]-(ev.clientY-P.sy)/r.height*v[3],v[2],v[3]])}},{passive:false});
document.addEventListener('pointerup',function(ev){var P=tp.p[ev.pointerId];if(!P||!tp.svg)return;
  var svg=tp.svg,wasLast=Object.keys(tp.p).length===1;delete tp.p[ev.pointerId];
  if(wasLast&&!tp.moved&&!tp.pinch)placeAt(ev,svg);
  if(!Object.keys(tp.p).length){tp.pinch=false}
  else{tp.moved=true;tp.v0=getView(svg);var k=Object.keys(tp.p)[0];tp.p[k].sx=tp.p[k].x;tp.p[k].sy=tp.p[k].y}});
document.addEventListener('pointercancel',function(ev){delete tp.p[ev.pointerId];tp.moved=true;if(!Object.keys(tp.p).length)tp.pinch=false});
document.addEventListener('wheel',function(ev){var svg=ev.target.closest&&ev.target.closest('#tg');if(!svg||!curS())return;ev.preventDefault();
  var v=getView(svg),q=svgPt(ev,svg),r=svg.getBoundingClientRect(),f=ev.deltaY<0?0.8:1.25,w=v[2]*f,h=v[3]*f;
  setView(svg,[q.x-(ev.clientX-r.left)/r.width*w,q.y-(ev.clientY-r.top)/r.height*h,w,h])},{passive:false});

/* ================= 履歴 ================= */
function listItem(s){var sub,title;
  if(s.type==='match'){var M=mState(s);title=t('対戦 vs {0}',esc(oppName(s)))+'　<small>'+esc(M.label)+'</small>';sub=esc(s.date)+' ・ '+esc(mname(s))+' ・ '+esc(s.place)}
  else{var st=stat(s);title=st.total+'<small> / '+st.max+'</small>　'+t('平均')+' '+f2(st.avg);sub=esc(s.date)+' ・ '+esc(rlShort(s))+' ・ '+esc(s.place)+(st.done?'':' ・ '+t('入力中')+' '+st.n+'/'+st.cap)}
  return '<div class="li"><div class="m" data-act="open" data-id="'+s.id+'"><b>'+title+'</b><div>'+sub+'</div></div><button data-act="del" data-id="'+s.id+'" class="warn">'+t('削除')+'</button></div>'}
function renderHist(){var el=$('#v-hist'),list=DB.sessions.slice().sort(function(a,b){return (b.date<a.date?-1:b.date>a.date?1:b.created-a.created)});
  var rounds={};DB.sessions.forEach(function(s){if(s.type==='score')rounds[s.round]=rlShort(s)});
  var h='<div class="row" style="margin:0 0 8px"><button class="pri" data-act="newDlg">'+t('＋ 新しい記録')+'</button></div>';
  h+='<div class="chips"><button class="'+(ui.histRound==='all'?'on':'')+'" data-act="histRound" data-v="all">'+t('すべて')+'</button><button class="'+(ui.histRound==='match'?'on':'')+'" data-act="histRound" data-v="match">'+t('対戦')+'</button>'
    +Object.keys(rounds).map(function(k){return '<button class="'+(ui.histRound===k?'on':'')+'" data-act="histRound" data-v="'+k+'">'+esc(rounds[k])+'</button>'}).join('')+'</div>';
  list=list.filter(function(s){return ui.histRound==='all'||(ui.histRound==='match'?s.type==='match':s.round===ui.histRound)});
  h+=list.length?list.map(listItem).join(''):'<p class="note">'+t('記録がありません。')+'</p>';
  el.innerHTML=h}

/* ================= 分析 ================= */
function scopeHalves(){var out=[];
  if(ui.anaScope==='cur'){var S=curS();if(S&&S.type==='score')S.halves.forEach(function(h,hi){out.push({S:S,hi:hi})})}
  else DB.sessions.forEach(function(S){if(S.type!=='score')return;if(ui.anaRound!=='all'&&S.round!==ui.anaRound)return;S.halves.forEach(function(h,hi){if(ui.anaDist!=='all'&&h.d!==ui.anaDist)return;out.push({S:S,hi:hi})})});
  return out}
function renderAna(){var el=$('#v-ana'),S=curS(),h='';
  h+='<div class="chips"><button class="'+(ui.anaScope==='cur'?'on':'')+'" data-act="anaScope" data-v="cur">'+t('今の記録')+'</button><button class="'+(ui.anaScope==='all'?'on':'')+'" data-act="anaScope" data-v="all">'+t('過去の記録を合わせて')+'</button></div>';
  if(ui.anaScope==='all'){var rs={},ds={};DB.sessions.forEach(function(s){if(s.type!=='score')return;rs[s.round]=rlShort(s);s.halves.forEach(function(x){ds[x.d]=1})});
    h+='<div class="grid2"><div><label>'+t('ラウンド')+'</label><select id="aR"><option value="all">'+t('すべて')+'</option>'+Object.keys(rs).map(function(k){return '<option value="'+k+'"'+(ui.anaRound===k?' selected':'')+'>'+esc(rs[k])+'</option>'}).join('')+'</select></div>'
      +'<div><label>'+t('距離')+'</label><select id="aD"><option value="all">'+t('すべて')+'</option>'+Object.keys(ds).map(function(k){return '<option value="'+esc(k)+'"'+(ui.anaDist===k?' selected':'')+'>'+esc(k||'―')+'</option>'}).join('')+'</select></div></div><div style="height:8px"></div>'}
  var sc=scopeHalves();
  if(ui.anaScope==='cur'&&(!S||S.type!=='score')){el.innerHTML=h+'<div class="card"><p class="note">'+t('分析する記録（通常の記録）を開いてください。')+'</p></div>';bindAna();return}
  var cnt={},tot=0,sum=0,pts=[],sq=0;
  sc.forEach(function(o){var hf=o.S.halves[o.hi];hf.ends.forEach(function(en){en.forEach(function(a){if(!a)return;var k=a.x?'X':String(a.s);cnt[k]=(cnt[k]||0)+1;tot++;sum+=a.s;sq+=a.s*a.s;if(a.px!=null)pts.push({x:a.px,sp:a.sp||0,f:hf.f,py:a.py})})})});
  if(!tot){el.innerHTML=h+'<div class="card"><p class="note">'+t('まだ矢のデータがありません。')+'</p></div>';bindAna();return}
  var avg=sum/tot,sd=Math.sqrt(Math.max(0,sq/tot-avg*avg));
  h+='<div class="card"><h2>'+t('全体')+'</h2><div class="stat"><div><small>'+t('矢数')+'</small><b>'+tot+'</b></div><div><small>'+t('平均/矢')+'</small><b>'+f2(avg)+'</b></div><div><small>'+t('ばらつき(SD)')+'</small><b>'+f2(sd)+'</b></div></div></div>';
  if(ui.anaScope==='all'){var ss=[],seen={};sc.forEach(function(o){if(!seen[o.S.id]){seen[o.S.id]=1;ss.push(o.S)}});
    ss=ss.filter(function(x){return stat(x).n>0}).sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:a.created-b.created});
    if(ss.length>=2)h+='<div class="card"><h2>'+t('得点の推移（記録ごとの平均/矢）')+'</h2>'+lineChart(ss.map(function(x){return {v:stat(x).avg,l:x.date}}))+'</div>'}
  var keys=['X','10','9','8','7','6','5','4','3','2','1','0'],mx=0;keys.forEach(function(k){mx=Math.max(mx,cnt[k]||0)});
  h+='<div class="card"><h2>'+t('得点の分布')+'</h2>'+keys.map(function(k){var n=cnt[k]||0;if(!n&&(k==='X'||k==='0'))return '';return '<div class="bar"><b style="width:1.6em">'+(k==='0'?'M':k)+'</b><i style="width:'+Math.round(n/mx*100*0.62)+'%;background:'+(k==='X'||k==='10'||k==='9'?'#d4a800':(k==='8'||k==='7'?'#e0342b':(k==='6'||k==='5'?'#2a8be0':(k==='4'||k==='3'?'#444':'#aaa'))))+'"></i><span>'+n+'</span><span>'+Math.round(n/tot*100)+'%</span></div>'}).join('')+'</div>';
  var ea={};sc.forEach(function(o){o.S.halves[o.hi].ends.forEach(function(en,ei){var n=0,q=0;en.forEach(function(a){if(a){n++;q+=a.s}});if(n){ea[ei]=ea[ei]||{n:0,t:0};ea[ei].n+=n;ea[ei].t+=q}})});
  h+='<div class="card"><h2>'+t('エンド別の平均（疲れ・集中の傾向）')+'</h2>'+Object.keys(ea).map(function(k){var a=ea[k].t/ea[k].n;return '<div class="bar"><b style="width:2.2em">'+(+k+1)+'E</b><i style="width:'+Math.round(a*6.2)+'%"></i><span>'+f2(a)+'</span></div>'}).join('')+'</div>';
  if(pts.length){var f0=FACES[pts[0].f]||FACES['122'],pf=pts[0].f;pts=pts.filter(function(p){return p.f===pf});
    var g={f:f0,R:(11-f0.min)*f0.rw};
    var vb=vbOf([[0,0]],g.R,1.5),mr=g.R*0.022*(f0.spots>1?1.4:1);
    var mx0=0,my0=0;pts.forEach(function(p){mx0+=p.x;my0+=p.py});mx0/=pts.length;my0/=pts.length;
    var rr=0;pts.forEach(function(p){rr+=Math.sqrt((p.x-mx0)*(p.x-mx0)+(p.py-my0)*(p.py-my0))});rr/=pts.length;
    var svg='<svg viewBox="'+vb.join(' ')+'" style="max-width:520px;margin:0 auto">';svg+=faceSVG(f0,0,0);
    pts.forEach(function(p){svg+='<circle cx="'+p.x+'" cy="'+p.py+'" r="'+mr+'" fill="#fff" fill-opacity=".85" stroke="#7b1fa2" stroke-width="'+(mr*0.35)+'"/>'});
    var cyc=0;
    svg+='<circle cx="'+mx0+'" cy="'+(my0+cyc)+'" r="'+rr+'" fill="none" stroke="#fff" stroke-width="'+(mr*0.3)+'" stroke-dasharray="'+(mr)+' '+(mr*0.7)+'"/><path d="M'+(mx0-mr*1.6)+' '+(my0+cyc)+'H'+(mx0+mr*1.6)+'M'+mx0+' '+(my0+cyc-mr*1.6)+'V'+(my0+cyc+mr*1.6)+'" stroke="#e67e00" stroke-width="'+(mr*0.5)+'"/></svg>';
    h+='<div class="card"><h2>'+t('着弾マップ（{0}・{1}本）',t(f0.l),pts.length)+'</h2>'+svg
      +'<div class="stat"><div><small>'+t('グループの中心')+'</small><b>'+(mx0>=0?t('右'):t('左'))+f2(Math.abs(mx0))+'cm<br>'+(my0>=0?t('下'):t('上'))+f2(Math.abs(my0))+'cm</b></div><div><small>'+t('広がり(平均半径)')+'</small><b>'+f2(rr)+'cm</b></div><div><small>'+t('最も外れた矢')+'</small><b>'+f2(Math.max.apply(null,pts.map(function(p){return Math.sqrt(p.x*p.x+p.py*p.py)})))+'cm</b></div></div>'
      +'<p class="note">'+t('オレンジの＋が矢群の中心、白い点線の輪が広がりです。中心が的の中心からずれている向きに、サイトを動かす目安になります（距離やサイトの種類で動かす量は変わります）。位置を的タッチで入力した矢だけが対象です。')+'</p></div>'}
  else h+='<div class="card"><p class="note">'+t('着弾マップは「的にタッチ」で入力した矢が対象です。')+'</p></div>';
  el.innerHTML=h;bindAna()}
function bindAna(){var r=$('#aR'),d=$('#aD');if(r)r.onchange=function(){ui.anaRound=this.value;render()};if(d)d.onchange=function(){ui.anaDist=this.value;render()}}
function lineChart(data){var W=320,Hh=150,P=26,mn=Math.min.apply(null,data.map(function(d){return d.v})),mxv=Math.max.apply(null,data.map(function(d){return d.v}));
  if(mxv-mn<0.2){mn-=0.2;mxv+=0.2}var pad=(mxv-mn)*0.15;mn-=pad;mxv+=pad;
  function X(i){return P+(W-P-8)*i/(data.length-1)}function Y(v){return Hh-18-(Hh-30)*(v-mn)/(mxv-mn)}
  return '<svg viewBox="0 0 '+W+' '+Hh+'"><g stroke="#8886" stroke-width=".5"><line x1="'+P+'" y1="'+Y(mn)+'" x2="'+(W-8)+'" y2="'+Y(mn)+'"/><line x1="'+P+'" y1="'+Y(mxv)+'" x2="'+(W-8)+'" y2="'+Y(mxv)+'"/></g>'
   +'<text x="2" y="'+(Y(mxv)+4)+'" font-size="9" fill="#888">'+f2(mxv)+'</text><text x="2" y="'+(Y(mn)+4)+'" font-size="9" fill="#888">'+f2(mn)+'</text>'
   +'<polyline fill="none" stroke="#1d6fd8" stroke-width="2" points="'+data.map(function(d,i){return X(i)+','+Y(d.v)}).join(' ')+'"/>'
   +data.map(function(d,i){return '<circle cx="'+X(i)+'" cy="'+Y(d.v)+'" r="3.5" fill="#1d6fd8"/>'}).join('')
   +'<text x="'+P+'" y="'+(Hh-3)+'" font-size="9" fill="#888">'+data[0].l+'</text><text x="'+(W-8)+'" y="'+(Hh-3)+'" font-size="9" fill="#888" text-anchor="end">'+data[data.length-1].l+'</text></svg>'}

/* ================= 新しい記録ダイアログ ================= */
function openNew(keep){var d=$('#dlg'),k=ui.dlgKind,o=ui.dlgVals||{};
  if(keep){var cur=readDlg();if(cur)ui.dlgVals=o=cur}
  var h='<h2>'+t('新しい記録')+'</h2><div class="chips"><button class="'+(k==='score'?'on':'')+'" data-act="dlgKind" data-v="score">'+t('通常の記録（ラウンド）')+'</button><button class="'+(k==='match'?'on':'')+'" data-act="dlgKind" data-v="match">'+t('対戦（マッチ）')+'</button></div>'
   +'<div class="grid2"><div><label>'+t('氏名')+'</label><input id="d_name" value="'+esc(o.name!=null?o.name:DB.set.name)+'"></div><div><label>'+t('日付')+'</label><input id="d_date" type="date" value="'+esc(o.date||today())+'"></div></div>'
   +'<label>'+t('大会名・場所')+'</label><input id="d_place" value="'+esc(o.place||'')+'">';
  if(k==='score'){var rd=o.round||'70',R=ROUNDS.filter(function(r){return r.id===rd})[0]||ROUNDS[0],perSel=o.per&&o.per!=='m'?+o.per:R.per,manual=(o.per==='m')||([3,6,9,12].indexOf(perSel)<0);
    var G=rgroupOf(rd);
    h+='<label>'+t('ラウンド')+'</label><div class="chips">'+RGROUPS.map(function(g){return '<button class="'+(g.id===G.id?'on':'')+'" data-act="rgrp" data-v="'+g.r[0]+'">'+t(g.l)+'</button>'}).join('')+'</div>'
     +(G.r.length>1?'<select id="d_round" onchange="this.dispatchEvent(new CustomEvent(\'rr\',{bubbles:true}))">'+G.r.map(function(id){var r=ROUNDS.filter(function(x){return x.id===id})[0];return '<option value="'+r.id+'"'+(r.id===rd?' selected':'')+'>'+esc(t(r.l))+'</option>'}).join('')+'</select>'
       :'<input type="hidden" id="d_round" value="'+rd+'"><p class="note">'+esc(t(R.l))+'</p>')
     +'<div class="grid2"><div><label>'+t('標的面（ラウンドの既定から変更可）')+'</label><select id="d_face"><option value="">'+t('ラウンドの既定')+'</option>'+Object.keys(FACES).map(function(f){return '<option value="'+f+'"'+(o.face===f?' selected':'')+'>'+esc(t(FACES[f].l))+'</option>'}).join('')+'</select></div>'
     +'<div><label>'+t('1エンドの射数')+'</label><select id="d_per" onchange="this.dispatchEvent(new CustomEvent(\'rr\',{bubbles:true}))">'+[3,6,9,12].map(function(n){return '<option value="'+n+'"'+(!manual&&perSel==n?' selected':'')+'>'+t('{0}射',n)+'</option>'}).join('')+'<option value="m"'+(manual?' selected':'')+'>'+t('手入力')+'</option></select>'+(manual?'<input id="d_perm" type="number" min="1" max="30" style="margin-top:4px" placeholder="'+t('射数（1〜30）')+'" value="'+esc(o.perm||'')+'">':'')+'</div></div>'
     +(rd==='free'?'<div class="grid2"><div><label>'+t('距離（例 30m）')+'</label><input id="d_dist" value="'+esc(o.dist||'')+'"></div><div><label>'+t('矢数 / 1回分')+'</label><input id="d_arrows" type="number" value="'+(o.arrows||36)+'"></div><div><label>'+t('回数（距離の数）')+'</label><input id="d_halves" type="number" min="1" max="6" value="'+(o.halves||1)+'"></div></div>':'')
     +'<label>'+t('弓種')+'</label><select id="d_bow">'+Object.keys(BOWS).map(function(b){return '<option value="'+b+'"'+((o.bow||DB.set.bow)===b?' selected':'')+'>'+t(BOWS[b])+'</option>'}).join('')+'</select>'}
  else{var mu=o.unit||'ind',ms=o.sys||'set';
    h+='<div class="grid2"><div><label>'+t('形式')+'</label><select id="d_unit">'+Object.keys(MUNIT).map(function(k){return '<option value="'+k+'"'+(mu===k?' selected':'')+'>'+t(MUNIT[k])+'</option>'}).join('')+'</select></div>'
     +'<div><label>'+t('方式')+'</label><select id="d_sys">'+Object.keys(MSYS).map(function(k){return '<option value="'+k+'"'+(ms===k?' selected':'')+'>'+t(MSYS[k])+'</option>'}).join('')+'</select></div></div>'
     +'<p class="note">'+t('目安：リカーブ・ベアボウはセット制、コンパウンドはトータルスコア制')+'</p>'
     +'<label>'+t('1セット（1エンド）の射数')+'</label><select id="d_mper"><option value="">'+t('形式の既定（個人3・団体6・ミックス4）')+'</option>'+[3,4,6].map(function(n){return '<option value="'+n+'"'+(String(o.mper)===String(n)?' selected':'')+'>'+t('{0}射',n)+'</option>'}).join('')+'</select>'
     +'<label>'+t('相手の名前（団体はチーム名）')+'</label><input id="d_opp" value="'+esc(o.opp||'')+'">'}
  h+='<div class="row"><button data-act="closeDlg">'+t('キャンセル')+'</button><button class="pri" data-act="create">'+t('記録を始める')+'</button></div>';
  d.innerHTML=h;if(!d.open)d.showModal()}
document.addEventListener('rr',function(){ui.dlgVals=readDlg();openNew()});
function readDlg(){var g=function(i){var e=$('#'+i);return e?e.value:undefined};
  return {name:g('d_name'),date:g('d_date'),place:g('d_place'),round:g('d_round'),face:g('d_face'),per:(g('d_per')==='m'?(g('d_perm')||'m'):g('d_per')),perm:g('d_perm'),dist:g('d_dist'),arrows:g('d_arrows'),halves:g('d_halves'),bow:g('d_bow'),unit:g('d_unit'),mper:g('d_mper'),sys:g('d_sys'),kind:(g('d_unit')?mkind(g('d_unit'),g('d_sys')):undefined),opp:g('d_opp')}}
function createFromDlg(){var v=readDlg(),S;
  DB.set.name=v.name||DB.set.name;
  if(ui.dlgKind==='match')S=makeMatch({kind:v.kind||'r-ind',per:v.mper,name:v.name,opp:v.opp,date:v.date||today(),place:v.place});
  else{if(v.bow)DB.set.bow=v.bow;S=makeScore({round:v.round||'70',face:v.face,per:v.per,name:v.name,date:v.date||today(),place:v.place,bow:v.bow||'recurve',free:{dist:v.dist,arrows:v.arrows,halves:v.halves}})}
  DB.sessions.push(S);DB.cur=S.id;ui.dlgVals=null;ui.all=false;save();$('#dlg').close();show('rec')}

/* ================= 対戦（マッチ） ================= */
function mArr(S,c){return c.g==='so'?S.so[c.side]:S.sets[c.s][c.side]}
function sum(a){var q=0;a.forEach(function(x){if(x)q+=x.s});return q}
function full(a){return a.every(Boolean)}
function mState(S){var K=MKINDS[S.kind],r={rows:[],pts:[0,0],tot:[0,0],ended:-1,needSO:false,winner:null,label:''};
  for(var i=0;i<S.sets.length;i++){var me=S.sets[i].me,op=S.sets[i].op,row={me:sum(me),op:sum(op),done:full(me)&&full(op),pm:0,po:0};
    if(r.ended>=0&&i>r.ended){row.skip=true;r.rows.push(row);continue}
    if(row.done){r.tot[0]+=row.me;r.tot[1]+=row.op;
      if(K.mode==='set'){if(row.me>row.op){row.pm=2}else if(row.me<row.op){row.po=2}else{row.pm=1;row.po=1}r.pts[0]+=row.pm;r.pts[1]+=row.po;
        if(r.pts[0]>=K.win||r.pts[1]>=K.win)r.ended=i}}
    r.rows.push(row)}
  var alldone=r.rows.every(function(x){return x.done||x.skip});
  if(K.mode==='set'){if(r.pts[0]>=K.win)r.winner='me';else if(r.pts[1]>=K.win)r.winner='op';else if(alldone)r.needSO=true}
  else if(alldone){if(r.tot[0]>r.tot[1])r.winner='me';else if(r.tot[0]<r.tot[1])r.winner='op';else r.needSO=true}
  if(r.needSO){var so=S.so;if(full(so.me)&&full(so.op)){var a=sum(so.me),b=sum(so.op);r.soSum=[a,b];
      if(a>b)r.winner='me';else if(a<b)r.winner='op';else if(so.closer)r.winner=so.closer;else r.soTie=true}}
  var sc=K.mode==='set'?r.pts[0]+'-'+r.pts[1]:r.tot[0]+'-'+r.tot[1];
  r.label=r.winner?(r.winner==='me'?t('勝ち'):t('負け'))+' '+sc+(r.needSO?'(SO)':''):(r.needSO?t('シュートオフ'):t('進行中')+' '+sc);
  return r}
function mNext(S){var M=mState(S);
  for(var i=0;i<S.sets.length;i++){if(M.ended>=0&&i>M.ended)break;
    for(var sd=0;sd<2;sd++){var side=sd?'op':'me',arr=S.sets[i][side];for(var a=0;a<arr.length;a++)if(!arr[a])return {g:'set',s:i,side:side,a:a}}}
  if(M.needSO){var sides=['me','op'];for(var q=0;q<2;q++){var ar=S.so[sides[q]];for(var b=0;b<ar.length;b++)if(!ar[b])return {g:'so',s:0,side:sides[q],a:b}}}
  return null}
function mKey(v){var S=curS(),c=S.cur,arr=mArr(S,c),a=(v==='M')?{s:0,x:false,t:Date.now()}:(v==='X'?{s:10,x:true,t:Date.now()}:{s:+v,x:false,t:Date.now()});
  arr[c.a]=a;vib();var n=mNext(S);if(n)S.cur=n;save();render()}
function mUndo(){var S=curS(),best=null;
  function scan(arr,ref){arr.forEach(function(a,i){if(a&&(!best||a.t>=best.a.t))best={a:a,c:Object.assign({a:i},ref)}})}
  S.sets.forEach(function(st,i){scan(st.me,{g:'set',s:i,side:'me'});scan(st.op,{g:'set',s:i,side:'op'})});
  scan(S.so.me,{g:'so',s:0,side:'me'});scan(S.so.op,{g:'so',s:0,side:'op'});
  if(!best)return;mArr(S,best.c)[best.c.a]=null;S.cur=best.c;save();render()}
function matchHTML(S){var K=MKINDS[S.kind],M=mState(S),c=S.cur,h='';
  var big=K.mode==='set'?M.pts[0]+' - '+M.pts[1]:M.tot[0]+' - '+M.tot[1];
  function side(nm,who){var bd=M.winner?(M.winner===who?'<span class="badge w">WIN</span>':'<span class="badge l">LOSE</span>'):'';return '<div class="sd'+(M.winner===who?' win':'')+'">'+bd+esc(nm)+'</div>'}
  h+='<div class="card"><div class="res vs">'+side(meName(S),'me')+'<div class="sc">'+big+'</div>'+side(oppName(S),'op')+'</div>'
   +'<div style="text-align:center;font-weight:bold">'+esc(M.label)+'</div><p class="note" style="text-align:center">'+esc(mlabel(S))+'</p></div>';
  h+='<div class="card"><table><colgroup><col style="width:9%"><col style="width:12%">'+new Array(mper(S)+1).join('<col>')+'<col style="width:11%"><col style="width:10%"></colgroup><thead><tr><th>'+t('セット')+'</th><th></th>';
  for(var i=1;i<=mper(S);i++)h+='<th>'+i+'</th>';h+='<th>'+t('計')+'</th><th>'+(K.mode==='set'?'pt':t('累計'))+'</th></tr></thead><tbody>';
  var cum=[0,0];
  S.sets.forEach(function(st,si){var R=M.rows[si];if(R.done){cum[0]+=R.me;cum[1]+=R.op}
    ['me','op'].forEach(function(sd,k){h+='<tr'+(R.skip?' style="opacity:.35"':'')+'>'+(k===0?'<th rowspan="2">'+(si+1)+'</th>':'')+'<th>'+esc((k?oppName(S):meName(S)).slice(0,3))+'</th>'
      +st[sd].map(function(a,ai){return '<td class="c '+cls(a)+((c.g==='set'&&c.s===si&&c.side===sd&&c.a===ai)?' sel':'')+'" data-act="mCell" data-g="set" data-s="'+si+'" data-side="'+sd+'" data-a="'+ai+'">'+lab(a)+'</td>'}).join('')
      +'<td class="tot">'+(st[sd].some(Boolean)?sum(st[sd]):'')+'</td><td class="tot">'+(R.done?(K.mode==='set'?(k?R.po:R.pm):cum[k]):'')+'</td></tr>'})});
  h+='</tbody></table>';
  if(M.needSO||S.so.me.some(Boolean)||S.so.op.some(Boolean)){
    h+='<div class="so"><b>'+t('シュートオフ（{0}射）',K.so)+'</b><table style="margin-top:6px"><tbody>';
    ['me','op'].forEach(function(sd,k){h+='<tr><th style="width:18%">'+esc((k?oppName(S):meName(S)).slice(0,4))+'</th>'+S.so[sd].map(function(a,ai){return '<td class="c '+cls(a)+((c.g==='so'&&c.side===sd&&c.a===ai)?' sel':'')+'" data-act="mCell" data-g="so" data-s="0" data-side="'+sd+'" data-a="'+ai+'">'+lab(a)+'</td>'}).join('')+'<td class="tot" style="width:14%">'+(S.so[sd].some(Boolean)?sum(S.so[sd]):'')+'</td></tr>'});
    h+='</tbody></table>';
    if(M.soTie||S.so.closer)h+='<p class="note">'+t('同点：中心に近い矢は？')+'</p><div class="row"><button class="'+(S.so.closer==='me'?'on':'')+'" data-act="mCloser" data-v="me">'+t('自分')+'</button><button class="'+(S.so.closer==='op'?'on':'')+'" data-act="mCloser" data-v="op">'+t('相手')+'</button></div>';
    h+='</div>'}
  h+='</div>';
  h+='<div class="card"><div class="now">'+(c.g==='so'?t('シュートオフ')+' ':t('{0}セット目',c.s+1)+' ')+esc(c.side==='me'?meName(S):oppName(S))+'　'+t('{0}本目',c.a+1)+'</div>'
    +keypad({indoor:false,min:1},'mKey')+'<div class="row"><button data-act="mUndo">'+t('1本戻す')+'</button><button data-act="mClr">'+t('選んだ矢を消す')+'</button></div></div>';
  h+='<div class="card"><div class="grid2"><div><label>'+t('自分')+'</label><input data-bind="name" value="'+esc(S.name)+'"></div><div><label>'+t('相手')+'</label><input data-bind="opp" value="'+esc(S.opp)+'"></div></div><label>'+t('大会名・場所')+'</label><input data-bind="place" value="'+esc(S.place)+'"><label>'+t('メモ')+'</label><textarea rows="2" data-bind="memo">'+esc(S.memo)+'</textarea>'
    +'<div class="row"><button data-act="newDlg" class="pri">'+t('＋ 新しい記録')+'</button></div></div>';
  return h}

/* ================= 出力・保存 ================= */
function plug(n){return CAP&&CAP.Plugins&&CAP.Plugins[n]}
function summaryText(S){if(!S)return '';
  if(S.type==='match'){var M=mState(S);return '🎯 '+t('対戦')+' '+S.date+' '+(S.name||'')+' vs '+oppName(S)+'\n'+mlabel(S)+'\n'+t('結果')+': '+M.label+(M.winner?'  (WIN: '+(M.winner==='me'?meName(S):oppName(S))+')':'')+'\n'+S.sets.map(function(st,i){return t('{0}セット',i+1)+': '+sum(st.me)+' - '+sum(st.op)}).join('\n')}
  var st=stat(S),x='🎯 '+(S.name||'')+' '+S.date+' '+rl(S)+'\n'+(S.place?S.place+'\n':'');
  S.halves.forEach(function(h,i){var q=st.half[i];x+=(S.halves.length>1?t('{0}回目 ',i+1):'')+h.d+': '+t('{0}点',q.sum)+' ('+tens(st,q)+')\n'});
  x+=t('合計')+' '+st.total+' / '+st.max+'　'+t('平均')+' '+f2(st.avg)+'/'+t('矢')+'\n'+(st.indoor?t('10の数')+' '+st.tens+'　'+t('9の数')+' '+st.nines:t('10+Xの数')+' '+st.tens+'　'+t('Xの数')+' '+st.xs);
  if(S.weather)x+='\n'+t('天候')+': '+S.weather;if(S.memo)x+='\n'+t('メモ')+': '+S.memo;return x}
function copyText(tx,b){function ok(){if(b){var o=b.textContent;b.textContent=t('コピーしました');setTimeout(function(){b.textContent=o},1500)}else alert(t('コピーしました'))}
  function fb(){var a=document.createElement('textarea');a.value=tx;document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){prompt(t('コピーしてください'),tx)}document.body.removeChild(a)}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(tx).then(ok,fb);else fb()}
// Save a file: browser = download, Android app (Capacitor) = write to cache + share sheet
function saveFile(name,text,type){
  if(NATIVE&&plug('Filesystem')&&plug('Share')){
    plug('Filesystem').writeFile({path:name,data:text,directory:'CACHE',encoding:'utf8'})
      .then(function(r){return plug('Share').share({title:name,url:r.uri})}).catch(function(){alert(t('保存できませんでした'))});return}
  var b=new Blob(['﻿'+text],{type:type+';charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);document.body.removeChild(a)},500)}
function exportCSV(){var S=curS();if(!S||S.type!=='score')return;
  var rows=[[t('氏名'),S.name,t('日付'),S.date,t('ラウンド'),rl(S),t('大会名・場所'),S.place],[t('回'),t('距離'),t('標的面'),t('エンド'),t('本'),t('点'),'X','x(cm)','y(cm)',t('的番号')]];
  S.halves.forEach(function(h,hi){h.ends.forEach(function(en,ei){en.forEach(function(a,ai){if(a)rows.push([hi+1,h.d,t(FACES[h.f].l),ei+1,ai+1,a.s,a.x?'X':'',a.px==null?'':a.px,a.py==null?'':a.py,a.sp==null?'':a.sp+1])})})});
  var st=stat(S);rows.push([t('合計'),st.total,'/',st.max,'10+X',st.tens,'X',st.xs]);
  saveFile('score_'+S.date+'_'+(S.name||'')+'.csv',rows.map(function(r){return r.map(function(c){c=String(c==null?'':c);return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(',')}).join('\r\n'),'text/csv')}
function buildPrint(S){if(!S)return;var el=$('#printArea'),h;
  if(S.type==='match'){var M=mState(S);
    h='<h2>'+t('対戦スコアカード')+'</h2><p>'+esc(S.date)+'　'+esc(S.place)+'<br>'+esc(mlabel(S))+'<br>'+esc(meName(S))+' vs '+esc(oppName(S))+'　'+t('結果')+': '+esc(M.label)+'</p><table><tr><th>'+t('セット')+'</th><th>'+t('選手')+'</th><th colspan="'+mper(S)+'">'+t('矢')+'</th><th>'+t('計')+'</th></tr>';
    S.sets.forEach(function(st,i){['me','op'].forEach(function(sd,k){h+='<tr><td>'+(k?'':i+1)+'</td><td>'+esc(k?oppName(S):meName(S))+'</td>'+st[sd].map(function(a){return '<td>'+lab(a)+'</td>'}).join('')+'<td>'+sum(st[sd])+'</td></tr>'})});
    el.innerHTML=h+'</table><div class="sig"><div>'+t('選手署名')+'</div><div>'+t('相手署名')+'</div></div>';return}
  var st=stat(S);h='<h2>'+t('アーチェリー スコアカード')+'</h2><p>'+t('氏名')+'：'+esc(S.name)+'　　'+t('日付')+'：'+esc(S.date)+'　　'+t('弓種')+'：'+t(BOWS[S.bow||'recurve'])+'<br>'+t('大会名・場所')+'：'+esc(S.place)+'　　'+t('ラウンド')+'：'+esc(rl(S))+'</p>';
  S.halves.forEach(function(hf,hi){var x=st.half[hi],run=0;
    h+='<table><tr><th>'+esc(hf.d)+'</th>'+new Array(S.per).fill(0).map(function(_,i){return '<th>'+(i+1)+'</th>'}).join('')+'<th>'+t('計')+'</th><th>'+t('累計')+'</th></tr>';
    hf.ends.forEach(function(en,ei){var q=endTotal(en);run+=q;h+='<tr><td>'+(ei+1)+'</td>'+en.map(function(a){return '<td>'+lab(a)+'</td>'}).join('')+new Array(S.per-en.length+1).join('<td></td>')+'<td>'+(en.some(Boolean)?q:'')+'</td><td>'+(en.some(Boolean)?run:'')+'</td></tr>'});
    h+='<tr><td colspan="'+(S.per+1)+'">'+t('小計')+'　'+tens(st,x)+'</td><td colspan="2">'+x.sum+'</td></tr></table>'});
  h+='<p><b>'+t('合計')+' '+st.total+' / '+st.max+'</b>　　'+(st.indoor?t('10の数')+' '+st.tens+'　'+t('9の数')+' '+st.nines:t('10+Xの数')+' '+st.tens+'　'+t('Xの数')+' '+st.xs)+'</p><div class="sig"><div>'+t('競技者署名')+'</div><div>'+t('スコアラー署名')+'</div></div>';
  el.innerHTML=h}

/* ================= 予定（カレンダー） ================= */
function pd(n){return ('0'+n).slice(-2)}
function dayDiff(a){var p=a.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]),n=new Date();n=new Date(n.getFullYear(),n.getMonth(),n.getDate());return Math.round((d-n)/86400000)}
function renderCal(){var el=$('#v-cal'),h='',now=new Date(),m=new Date(now.getFullYear(),now.getMonth()+(ui.calM||0),1),y=m.getFullYear(),mo=m.getMonth();
  var up=DB.events.filter(function(e){return dayDiff(e.date)>=0}).sort(function(a,b){return a.date<b.date?-1:1});
  h+='<div class="card">'+(up.length?'<div class="now" style="margin:0">'+esc(up[0].title)+' <span>'+(dayDiff(up[0].date)===0?t('今日！'):t('あと{0}日',dayDiff(up[0].date)))+'（'+esc(up[0].date)+'）</span></div>':'<p class="note" style="margin:0">'+t('予定はまだありません。試合や大会の日を登録すると、あと何日か表示されます。')+'</p>')+'</div>';
  var ev={},sc={};DB.events.forEach(function(e){(ev[e.date]=ev[e.date]||[]).push(e)});DB.sessions.forEach(function(x){if(x.type==='score'&&stat(x).n>0)sc[x.date]=(sc[x.date]||0)+1});
  h+='<div class="card"><div class="row" style="margin:0 0 6px;align-items:center"><button data-act="calMonth" data-v="-1" style="flex:none;min-width:3em">◀</button><b style="text-align:center">'+y+t('年')+(mo+1)+t('月')+'</b><button data-act="calMonth" data-v="1" style="flex:none;min-width:3em">▶</button></div>';
  h+='<table class="cal"><thead><tr>'+['日','月','火','水','木','金','土'].map(function(w){return '<th>'+t(w)+'</th>'}).join('')+'</tr></thead><tbody>';
  var first=m.getDay(),days=new Date(y,mo+1,0).getDate(),td=today();
  for(var r=0;r<6;r++){if(r*7-first+1>days)break;h+='<tr>';for(var c=0;c<7;c++){var dn=r*7+c-first+1;if(dn<1||dn>days){h+='<td></td>';continue}
    var ds=y+'-'+pd(mo+1)+'-'+pd(dn);h+='<td class="'+(ds===td?'today':'')+'"><div>'+dn+'</div>'+(ev[ds]?'<i class="ev">●</i>':'')+(sc[ds]?'<i class="sc">●</i>':'')+'</td>'}h+='</tr>'}
  h+='</tbody></table><p class="note"><i class="ev">●</i> '+t('予定')+'　<i class="sc">●</i> '+t('記録した日')+'</p><div class="row"><button class="pri" data-act="calAdd">'+t('＋ 予定を追加')+'</button></div></div>';
  var all=DB.events.slice().sort(function(a,b){return a.date<b.date?-1:1});
  if(all.length)h+='<div class="card"><h2>'+t('予定一覧')+'</h2>'+all.map(function(e){var d=dayDiff(e.date);return '<div class="li"><div class="m"><b>'+esc(e.title)+'</b><div>'+esc(e.date)+' ・ '+(d>0?t('あと{0}日',d):d===0?t('今日'):t('終了'))+'</div></div><button data-act="calDel" data-id="'+e.id+'" class="warn">'+t('削除')+'</button></div>'}).join('')+'</div>';
  el.innerHTML=h}

/* ================= 設定 ================= */
function renderSet(){var s=DB.set,h='';
  h+='<div class="card"><h2>'+t('言語')+' / Language</h2><select data-set="lang"><option value="auto"'+(s.lang==='auto'?' selected':'')+'>'+t('端末の設定に合わせる')+' (Auto)</option>'+Object.keys(LANGS).map(function(k){return '<option value="'+k+'"'+(s.lang===k?' selected':'')+'>'+LANGS[k]+'</option>'}).join('')+'</select></div>';
  h+='<div class="card"><h2>'+t('基本設定')+'</h2><label>'+t('氏名（新しい記録の初期値）')+'</label><input data-set="name" value="'+esc(s.name)+'">'
   +'<label>'+t('弓種の初期値')+'</label><select data-set="bow">'+Object.keys(BOWS).map(function(b){return '<option value="'+b+'"'+(s.bow===b?' selected':'')+'>'+t(BOWS[b])+'</option>'}).join('')+'</select>'
   +'<label>'+t('矢の太さ（mm）— ライン接触の判定に使います（矢の外径。ライン上は高い方の得点）')+'</label><input type="number" step="0.1" min="3" max="10" data-set="arrowMm" value="'+s.arrowMm+'">'
   +'<p class="note">'+t('目安: カーボン外径 約5.5〜6.0mm（新しい記録から反映）')+'</p></div>';
  h+='<div class="card"><h2>'+t('入力のしかた')+'</h2>'
   +'<label>'+t('カーソルの〇の大きさ（この〇が線に触れたら高い方の得点）')+'</label><select data-set="cursorX">'+[[1,t('実寸（矢の太さ）')],[2,t('矢の2倍')],[3,t('矢の3倍')]].map(function(z){return '<option value="'+z[0]+'"'+(+s.cursorX===z[0]?' selected':'')+'>'+z[1]+'</option>'}).join('')+'</select>'
   +'<label>'+t('拡大ルーペの倍率（〇が矢の太さ。〇が線に触れたら高い方の得点）')+'</label><select data-set="zoom">'+[[1.5,t('標準')],[2.5,t('大')],[4,t('特大')]].map(function(z){return '<option value="'+z[0]+'"'+(+s.zoom===z[0]?' selected':'')+'>'+z[1]+'</option>'}).join('')+'</select>'
   +'<label><input type="checkbox" style="width:auto" data-set="sort" '+(s.sort?'checked':'')+'> '+t('エンド完了時に高い得点順へ並べ替える（スコアカードの記入ルール）')+'</label>'
   +'<label><input type="checkbox" style="width:auto" data-set="vib" '+(s.vib?'checked':'')+'> '+t('入力時に振動')+'</label>'
   +'<label><input type="checkbox" style="width:auto" data-set="wake" '+(s.wake?'checked':'')+'> '+t('記録中は画面を消さない（対応ブラウザ）')+'</label></div>';
  h+='<div class="card"><h2>'+t('データ')+'</h2><p class="note">'+t('記録はこの端末に保存されます。機種変更・データ削除に備え、ときどきバックアップを保存してください。')+'</p>'
   +'<div class="row"><button data-act="expAll">'+t('バックアップ保存')+'</button><button data-act="impAll">'+t('バックアップを読み込む')+'</button></div><div class="row"><button class="warn" data-act="wipe">'+t('全記録を削除')+'</button></div>'
   +'<p class="note">'+t('記録数: {0}件',DB.sessions.length)+'</p></div>';
  h+='<div class="card"><h2>'+t('ルールの反映（アーチェリー競技規則）')+'</h2><ul class="note" style="padding-left:1.2em;margin:0"><li>'+t('矢がラインに触れていれば高い得点')+'</li><li>'+t('X＝インナー10。同点は アウトドア：X数→10数、インドア：10数→9数')+'</li><li>'+t('6リング標的面は5点未満、三つ目は6点未満、的の外はM')+'</li><li>'+t('コンパウンドのインドアは内側の小さい輪が10点')+'</li><li>'+t('エンド完了後は高い得点順に記入（設定で切替）')+'</li><li>'+t('対戦：セット制(2/1/0点)と累計制、シュートオフ対応')+'</li></ul>'
   +'<p class="note">'+t('※三つ目で同じ的に複数の矢が入った場合の「最低得点のみ採点（他はM）」は自動適用していません。審判の判定に従って手で直してください。')+'</p></div>';
  $('#v-set').innerHTML=h}
$('#file').addEventListener('change',function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var d=JSON.parse(String(r.result).replace(/^﻿/,''));if(!d.sessions)throw 0;
    var ids={};DB.sessions.forEach(function(s){ids[s.id]=1});var n=0;d.sessions.forEach(function(s){if(!ids[s.id]){DB.sessions.push(s);n++}});var eids={};DB.events.forEach(function(e){eids[e.id]=1});(d.events||[]).forEach(function(e){if(!eids[e.id])DB.events.push(e)});save();alert(t('{0}件を追加しました',n));render()}catch(e){alert(t('読み込めませんでした'))}};r.readAsText(f);this.value=''});
var wl=null;function wake(){try{if(DB.set.wake&&navigator.wakeLock){navigator.wakeLock.request('screen').then(function(l){wl=l}).catch(function(){})}else if(wl){wl.release();wl=null}}catch(e){}}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')wake()});
wake();
// Offline support (installed web version only): cache the app on first visit, tell the user when a new version arrives
if('serviceWorker' in navigator&&!NATIVE&&/^https?:$/.test(location.protocol)){
  var hadCtrl=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(function(){});
  navigator.serviceWorker.addEventListener('controllerchange',function(){
    if(!hadCtrl){hadCtrl=true;return}
    var d=document.createElement('div');d.id='toast';d.textContent=t('新しい版になりました。タッチして更新');d.onclick=function(){location.reload()};document.body.appendChild(d)});
}
if(!DB.cur&&DB.sessions.length)DB.cur=DB.sessions[DB.sessions.length-1].id;
show('rec');
window.__A={DB:function(){return DB},scoreAt:scoreAt,FACES:FACES,ROUNDS:ROUNDS,MKINDS:MKINDS,BOWS:BOWS,LANGS:LANGS,t:t,setLang:function(l){LANG=l;render()}};
})();
