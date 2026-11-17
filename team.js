/* Archery Score - team sharing, privacy note, announcements.
   There is NO server run by the author. Records stay on this device.
   Only when a team link is joined, a saved record is sent to the spreadsheet that the team leader owns.
   Loaded after app.js. Uses window.__A (DB, t, uiDlg, flash, render). */
(function(){
'use strict';
var A=window.__A; if(!A)return;
var t=A.t, TK='archery_team_v1', DK='archery_announce_seen';
var COPYRIGHT='© 2026 M.Inamoto';

/* ---------- English text (other languages fall back to Japanese) ---------- */
(function(){var en=window.I18N&&window.I18N.en; if(!en)return;
 Object.assign(en,{
 'データについて':'About your data',
 '記入したデータは作者には届きません。記録はこの端末の中に保存されます。作者のサーバーはありません。':'The data you enter is never sent to the author. Your records are stored on this device. The author runs no server.',
 'チームで共有を使う場合だけ、保存した記録が、あなたのチームの代表が用意したスプレッドシートに送られます。送った内容は、そのチームの人だけが見られます。作者や他のチームには見えません。':'Only if you use team sharing, saved records are sent to a spreadsheet prepared by your team leader. Only people on that team can see it. The author and other teams cannot.',
 'チームで共有':'Team sharing',
 'チームに入っていません。代表から届いた招待リンクを開くと、ここに表示されます。':'You are not in a team. Open the invitation link from your team leader and it will appear here.',
 'チーム名':'Team','表示する名前':'Display name','このチームに送る':'Send my records to this team',
 'ONにすると、記録を保存するたびに、次の内容を代表のスプレッドシートに送ります：名前・日付・ラウンド・大会名・場所・順位・各回の点数・合計・10の数・Xの数。的のどこに当たったかは送りません。':'When ON, each time you save a record, this is sent to the leader\'s spreadsheet: name, date, round, event, place, rank, scores per part, total, 10s and Xs. Where arrows hit the target is not sent.',
 '今ある記録をすべて送る':'Send all my saved records','チームの成績を見る':'See team results','チームから抜ける':'Leave this team',
 '送りました':'Sent','送れませんでした（電波と招待リンクを確認してください）':'Could not send (check your connection and the invitation link)',
 'このチームに入りますか？':'Join this team?','入る':'Join',
 '招待リンクが正しくありません':'The invitation link is not valid',
 'チームから抜けました（送った記録は代表のスプレッドシートに残ります）':'You left the team (records already sent stay in the leader\'s spreadsheet)',
 '名前を入れてください':'Please enter a name',
 '読み込み中…':'Loading…','まだ記録がありません':'No records yet',
 '最近の記録':'Recent records','自己ベスト':'Personal best','件':' records',
 'お知らせ':'Notice','閉じる':'Close','開く':'Open',
 '無断での複製・再配布・改変を禁じます。個人での利用は自由です。':'Copying, redistribution and modification without permission are prohibited. Personal use is free.',
 'チームから抜けますか？':'Leave this team?','このチームから抜ける':'Leave this team','スコア管理人':'Score manager','（未設定）':'(not set)','スコア管理人の名前':'Score manager name','例：山田':'e.g. Yamada','管理人が変わったときは、新しい管理人の名前を入れて、新しいリンクをチームに送ってください。リンクを開いた人に、名前が更新されます。':'When the manager changes, enter the new name and send the new link to the team. Anyone who opens it gets the name updated.','同じ名前のチームに、すでに入っています。新しいリンクに入れ替えますか？':'You are already in a team with this name. Replace it with the new link?','入れ替える':'Replace','入れ替えました':'Replaced','代表を交代するとき':'When the leader changes','このチームの招待リンクを出す':'Show the invitation link of this team','このリンクを、チームに入れたい人に送ってください。':'Send this link to people you want to join the team.','Archery Score のチーム「':'Archery Score team "','」に入るリンクです。開いて「入る」を押してください。':'" - open this link and tap Join.','チームを切り替える':'Switch team','ほかのチームにも入るときは、そのチームの招待リンクを開いてください。このチームはそのまま残ります。':'To join another team, open the invitation link for that team. This team stays as it is.',
 '使い方（代表と選手）':'How to use (leader and players)',
 '選手：チームに入る':'Players: join a team',
 '代表から届いたリンクを開きます。':'Open the link sent by your team leader.',
 '「このチームに入りますか？」で「入る」を押します。':'Tap "Join" when asked "Join this team?".',
 'この画面で、表示する名前を入れて、「このチームに送る」をONにします。':'On this screen, enter your display name and turn ON "Send my records to this team".',
 'そのあと、記録を保存するたびに、自動でチームに送られます。':'After that, each saved record is sent to the team automatically.',
 '代表：チームを作る（最初に1回・10分ほど）':'Leader: create a team (once, about 10 minutes)',
 'Googleドライブで、新しいスプレッドシートを作ります。':'Create a new spreadsheet in Google Drive.',
 'メニュー「拡張機能」→「Apps Script」を開きます。':'Open the menu Extensions → Apps Script.',
 '下の「スクリプトをコピー」を押します。Apps Script の画面で、最初のコードを全部消して貼り付け、保存します。':'Tap "Copy script" below. In Apps Script, delete the original code, paste, and save.',
 'スプレッドシートを読み込み直し、メニュー「チーム設定」→「① 初期設定」を押します。最初に「許可」の確認が出ます。':'Reload the spreadsheet, then choose the menu "チーム設定" → "① 初期設定". Allow the permission request the first time.',
 '「設定」シートの B1 に、チーム名を入れます。':'In the "設定" sheet, enter the team name in B1.',
 'Apps Script の右上「デプロイ」→「新しいデプロイ」→種類「ウェブアプリ」。次のユーザーとして実行は「自分」、アクセスできるユーザーは「全員」にして「デプロイ」。出たURLをコピーして、「設定」シートの B2 に貼ります。':'In Apps Script, tap Deploy → New deployment → type "Web app". Execute as "Me", access "Anyone", then Deploy. Copy the URL and paste it into B2 of the "設定" sheet.',
 'メニュー「チーム設定」→「② 招待リンクを作る」を押します。B3 に出たリンクを、LINEなどで選手に送ります。':'Choose the menu "チーム設定" → "② 招待リンクを作る". Send the link shown in B3 to your players (for example by LINE).',
 '下の「フォームをコピー」を押して、開いた画面の「コピーを作成」を押します。':'Tap "Copy form" below, then tap "Make a copy" on the page that opens.',
 'コピーしたフォームの右上「公開」を押して、もう一度「公開」を押します。':'In the copied form, tap "Publish" at the top right, then "Publish" again.',
 'フォームの上の「回答」→「スプレッドシートにリンク」→「作成」を押します。':'At the top of the form, tap Responses → Link to Sheets → Create.',
 '開いたスプレッドシートで、「ファイル」→「共有」→「ウェブに公開」を押し、右の欄を「カンマ区切り形式（.csv）」にして「公開する」を押します。出たリンクをコピーします。':'In the spreadsheet, choose File → Share → Publish to web, set the right box to "Comma-separated values (.csv)", and tap Publish. Copy the link.',
 'フォームの画面に戻り、右上の「回答者へのリンクをコピー」（鎖のマーク）でフォームのリンクをコピーします。':'Back in the form, tap "Copy responder link" (chain icon) at the top right to copy the form link.',
 '下の欄に、2つのリンクを貼って、チーム名を入れ、「招待リンクを作る」を押します。出たリンクを、LINEなどで選手に送ります。':'Paste the two links below, enter the team name, and tap "Make invitation link". Send the link to your players (for example by LINE).',
 '代表：チームを作る':'Leader: create a team',
 'ボタンを押しながら進められる、かんたん手順のページがあります。10分ほどで、招待リンクまで作れます。':'There is a simple step-by-step page. In about 10 minutes you can make the invitation link.',
 '代表の方はこちら（かんたん手順）':'Team leaders: open the easy steps',
 '招待リンクは、チームの人だけに送ってください。リンクを知っている人は、チームの記録を送ったり見たりできます。':'Send the invitation link only to your team. Anyone with the link can send and see the team\'s records.',
 'フォームをコピー':'Copy form','フォームのリンク':'Form link','スプレッドシートの公開リンク（CSV）':'Published spreadsheet link (CSV)','招待リンクを作る':'Make invitation link','招待リンク':'Invitation link','招待リンクをコピー':'Copy invitation link',
 'フォームのリンクが正しくありません。「回答者へのリンクをコピー」で出るリンクを貼ってください。':'The form link is not valid. Paste the link from "Copy responder link".',
 'スプレッドシートの公開リンクが正しくありません。「ウェブに公開」で出たリンク（pubを含むもの）を貼ってください。':'The published spreadsheet link is not valid. Paste the link from "Publish to web" (it contains "pub").',
 '招待リンクは、チームの人だけに送ってください。リンクを知っている人は、チームの記録を送ったり見たりできます。同じ記録を直して保存し直すと、スプレッドシートに行が増えます（アプリには最新の分が出ます）。':'Send the invitation link only to your team. Anyone with the link can send and see the team\'s records. If you fix and save the same record again, a new row is added to the spreadsheet (the app shows the latest one).',
 '招待リンクは、チームの人だけに送ってください。外にもれたときは、メニュー「チーム設定」→「合言葉を変える」で、リンクを作り直せます。':'Send the invitation link only to your team. If it leaks, change the key from the menu "チーム設定" → "合言葉を変える" and make a new link.'
 });
})();

/* ---------- small helpers ---------- */
function $(s){return document.querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function b64d(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)))}
function b64e(o){return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
// Only the team leader's own Apps Script address is accepted
function okUrl(u){return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_\-]+\/exec$/.test(u||'')}
// Google Form (answers) + published CSV of its response sheet
function okFormId(s){return /^1FAIpQL[A-Za-z0-9_\-]{20,}$/.test(s||'')}
function okSheetId(s){return /^[A-Za-z0-9_-]{30,60}$/.test(s||'')&&!/^2PACX/.test(s)&&!/^1FAIpQL/.test(s)}
function sheetUrl(s){return 'https://docs.google.com/spreadsheets/d/'+s+'/gviz/tq?tqx=out:csv&headers=1'}
function okCsvId(s){return /^2PACX-[A-Za-z0-9_\-]{20,}$/.test(s||'')}
var FORM_ENTRY=['1529727742','602911474','456751206','1475056120','1307010073','1550011119','883440597','233074447','304304810','1107829433','1052275598','1134505227','25997494','1369288163'];
// order: 名前,日付,種別,ラウンド,大会名・場所,順位,1回目,2回目,3回目,4回目,合計,10の数,Xの数,ID
function formUrl(f){return 'https://docs.google.com/forms/d/e/'+f+'/formResponse'}
function csvUrl(c){return 'https://docs.google.com/spreadsheets/d/e/'+c+'/pub?output=csv'}
var TPL_COPY='https://docs.google.com/forms/d/1uJ7fcYiR81g40UguXlBm7wpG5GDjIt82QxJaEJVbu6Q/copy';
function parseCsv(tx){var rows=[],row=[],f='',q=false,i=0,c;
  for(;i<tx.length;i++){c=tx[i];
    if(q){if(c==='"'){if(tx[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true; else if(c===','){row.push(f);f=''}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&tx[i+1]==='\n')i++;row.push(f);rows.push(row);row=[];f=''}
    else f+=c}
  if(f!==''||row.length){row.push(f);rows.push(row)}
  return rows}

/* ---------- team state (kept apart from the records so it is not in backups) ---------- */
/* several teams per device: {list:[team...], cur:id}. The old single-team record (archery_team_v1) is migrated. */
var TK2='archery_teams_v2';
function st(){
  var s=lsGet(TK2,null);
  if(!s||!Array.isArray(s.list)){
    var old=lsGet(TK,null);s={list:[],cur:''};
    if(old&&old.n){old.id=old.id||('t'+Date.now().toString(36));s.list.push(old);s.cur=old.id}
    if(s.list.length)lsSet(TK2,s)}
  return s}
function saveSt(s){lsSet(TK2,s)}
function teams(){return st().list}
function team(){var s=st(),i;for(i=0;i<s.list.length;i++)if(s.list[i].id===s.cur)return s.list[i];return s.list[0]||null}
function saveTeam(T){var s=st(),i;for(i=0;i<s.list.length;i++)if(s.list[i].id===T.id){s.list[i]=T;break}saveSt(s)}
function addTeam(x){var s=st(),i,same=function(a){return a.f===x.f&&(a.s||a.c||a.u)===(x.s||x.c||x.u)};
  for(i=0;i<s.list.length;i++)if(same(s.list[i])){x.id=s.list[i].id;x.on=s.list[i].on;x.name=s.list[i].name;x.m=x.m||s.list[i].m||'';s.list[i]=x;s.cur=x.id;saveSt(s);return}
  x.id='t'+Date.now().toString(36)+Math.floor(Math.random()*1e4);s.list.push(x);s.cur=x.id;saveSt(s)}
function removeCur(){var s=st(),T=team();if(!T)return;s.list=s.list.filter(function(a){return a.id!==T.id});s.cur=s.list[0]?s.list[0].id:'';saveSt(s)}
function selectTeam(id){var s=st();s.cur=id;saveSt(s);board=null}

/* ---------- join by invitation link: #team=XXXX ---------- */
function readJoin(){
  var m=/[#&?]team=([A-Za-z0-9_\-]+)/.exec(location.hash||'')||/[?&]team=([A-Za-z0-9_\-]+)/.exec(location.search||'');
  if(!m)return;
  var cleaned=function(){try{history.replaceState(null,'',location.pathname)}catch(e){}};
  var o=null;try{o=JSON.parse(b64d(m[1]))}catch(e){}
  cleaned();
  var isForm=o&&okFormId(o.f)&&(okCsvId(o.c)||okSheetId(o.s))&&o.n, isOld=o&&okUrl(o.u)&&o.k&&o.n;
  if(!isForm&&!isOld){A.flash(t('招待リンクが正しくありません'));return}
  var dup=null;if(isForm)teams().forEach(function(a){if(String(a.n).trim()===String(o.n).trim()&&a.f&&!(a.f===o.f&&(a.s||a.c)===(o.s||o.c)))dup=a});
  if(dup){A.uiDlg({msg:t('同じ名前のチームに、すでに入っています。新しいリンクに入れ替えますか？')+'\n'+o.n,okLabel:t('入れ替える'),onOk:function(){
    var s=st(),i;for(i=0;i<s.list.length;i++)if(s.list[i].id===dup.id){s.list[i]=Object.assign({},dup,{f:o.f,c:(okCsvId(o.c)?o.c:undefined),s:(okSheetId(o.s)?o.s:undefined),n:String(o.n).slice(0,40),m:(typeof o.m==='string'&&o.m.trim()?o.m.trim().slice(0,20):(dup.m||''))});s.cur=dup.id;break}
    saveSt(s);board=null;A.flash(t('入れ替えました'));A.render()}});return}
  A.uiDlg({msg:t('このチームに入りますか？')+'\n'+o.n+((typeof o.m==='string'&&o.m.trim())?'\n'+t('スコア管理人')+'：'+o.m.trim().slice(0,20):''),okLabel:t('入る'),onOk:function(){
    var base={n:String(o.n).slice(0,40),on:false,name:(A.DB().set.name||''),m:(typeof o.m==='string'?o.m.trim().slice(0,20):'')};
    addTeam(isForm?Object.assign(base,{f:o.f,c:(okCsvId(o.c)?o.c:undefined),s:(okSheetId(o.s)?o.s:undefined)}):Object.assign(base,{u:o.u,k:o.k}));board=null;
    A.flash(t('入る'));A.render()}});
}

/* ---------- build the record that is sent (no arrow positions) ---------- */
function summarize(S){
  if(!S||S.type!=='score')return null;
  var tot=0,n=0,tens=0,xs=0,parts=[];
  S.halves.forEach(function(h){var q=0;h.ends.forEach(function(en){en.forEach(function(a){if(!a)return;q+=a.s;n++;if(a.s===10){tens++;if(a.x)xs++}})});tot+=q;parts.push({d:h.d,s:q})});
  var max=0;S.halves.forEach(function(h){h.ends.forEach(function(en){max+=en.length*10})});
  return {id:S.id,d:S.date||'',r:A.rl?A.rl(S):(S.roundLabel||S.round||''),p:S.place||'',k:S.purpose==='comp'?'試合':'練習',rk:S.rank||'',t:tot,tn:tens,x:xs,h:parts,_n:n};
}
function sendForm(T,payload,cb){
  var who=(T.name||'').slice(0,30);
  var jobs=payload.map(function(r){
    var hs=Array.isArray(r.h)?r.h:[];
    var vals=[who,r.d||'',r.k||'',r.r||'',r.p||'',r.rk||'',hs[0]?hs[0].s:'',hs[1]?hs[1].s:'',hs[2]?hs[2].s:'',hs[3]?hs[3].s:'',r.t,r.tn,r.x,r.id||''];
    var body=new URLSearchParams();FORM_ENTRY.forEach(function(id,i){body.append('entry.'+id,String(vals[i]==null?'':vals[i]))});
    return fetch(formUrl(T.f),{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()});
  });
  Promise.all(jobs).then(function(){cb&&cb(true)},function(){cb&&cb(false)});
}
function send(payload,cb,T0){
  var T=T0||team();if(!T){cb&&cb(false);return}
  if(T.f){sendForm(T,payload,cb);return}
  var body=JSON.stringify({a:'put',k:T.k,who:(T.name||'').slice(0,30),rec:payload});
  fetch(T.u,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:body,redirect:'follow'})
   .then(function(r){return r.json()}).then(function(j){cb&&cb(!!(j&&j.ok))}).catch(function(){cb&&cb(false)});
}
function push(S,quiet){
  var rec=summarize(S);if(!rec||rec._n===0)return;delete rec._n;
  teams().forEach(function(T){
    if(!T.on||!T.name)return;
    send([rec],function(ok){if(!quiet)A.flash((teams().length>1?T.n+'：':'')+(ok?t('送りました'):t('送れませんでした（電波と招待リンクを確認してください）')))},T)})
}
function pushAll(){
  var T=team();if(!T||!T.name){A.flash(t('名前を入れてください'));return}
  var recs=A.DB().sessions.map(summarize).filter(function(x){return x&&x._n>0}).map(function(x){delete x._n;return x});
  send(recs,function(ok){A.flash(ok?t('送りました')+' ('+recs.length+')':t('送れませんでした（電波と招待リンクを確認してください）'))});
}

/* ---------- team results screen (inside the settings card) ---------- */
var board=null;
function loadBoard(){
  var T=team();if(!T)return;board='loading';A.render();
  if(T.c||T.s){
    fetch((T.c?csvUrl(T.c)+'&t=':sheetUrl(T.s)+'&t=')+Date.now(),{redirect:'follow'}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(tx){
      var rows=parseCsv(tx),h=rows.shift()||[],ix=function(n){return h.indexOf(n)},seen={};
      var iN=ix('名前'),iD=ix('日付'),iK=ix('種別'),iR=ix('ラウンド'),iP=ix('大会名・場所'),iRk=ix('順位'),iT=ix('合計'),iI=ix('ID');
      rows.forEach(function(r){if(!r[iN])return;seen[r[iN]+'|'+(r[iI]||Math.random())]={n:r[iN],d:r[iD],k:r[iK],r:r[iR],p:r[iP],rk:r[iRk],t:+r[iT]||0}});
      board=Object.keys(seen).map(function(k){return seen[k]});A.render()}).catch(function(){board=[];A.render();A.flash(t('送れませんでした（電波と招待リンクを確認してください）'))});
    return}
  fetch(T.u+'?a=board&k='+encodeURIComponent(T.k),{redirect:'follow'}).then(function(r){return r.json()}).then(function(j){
    board=(j&&j.ok)?j.recs:[];A.render()}).catch(function(){board=[];A.render();A.flash(t('送れませんでした（電波と招待リンクを確認してください）'))});
}
function boardHtml(){
  if(board==null)return '';
  if(board==='loading')return '<p class="note">'+t('読み込み中…')+'</p>';
  if(!board.length)return '<p class="note">'+t('まだ記録がありません')+'</p>';
  var best={};board.forEach(function(r){var k=r.n+'|'+r.r;if(!best[k]||r.t>best[k].t)best[k]=r});
  var rows=Object.keys(best).map(function(k){return best[k]}).sort(function(a,b){return (a.r>b.r?1:a.r<b.r?-1:b.t-a.t)});
  var h='<h2 style="margin-top:10px">'+t('自己ベスト')+'</h2><table style="width:100%;border-collapse:collapse"><tbody>';
  rows.forEach(function(r){h+='<tr><td style="padding:3px 4px;border-top:1px solid var(--line)">'+esc(r.n)+'</td><td style="padding:3px 4px;border-top:1px solid var(--line);font-size:.8rem">'+esc(r.r)+'</td><td style="padding:3px 4px;border-top:1px solid var(--line);text-align:right"><b>'+esc(r.t)+'</b></td></tr>'});
  h+='</tbody></table><h2 style="margin-top:10px">'+t('最近の記録')+'</h2><table style="width:100%;border-collapse:collapse"><tbody>';
  board.slice().sort(function(a,b){return a.d<b.d?1:a.d>b.d?-1:0}).slice(0,15).forEach(function(r){h+='<tr><td style="padding:3px 4px;border-top:1px solid var(--line);font-size:.8rem">'+esc(r.d)+'</td><td style="padding:3px 4px;border-top:1px solid var(--line)">'+esc(r.n)+'</td><td style="padding:3px 4px;border-top:1px solid var(--line);text-align:right">'+esc(r.t)+'</td></tr>'});
  return h+'</tbody></table>';
}

/* ---------- how to use (written inside the app) ---------- */
var guideOpen=false;
function guideHtml(){
  var L=function(a){return '<li style="margin:4px 0">'+a+'</li>'};
  var h='<details data-guide style="margin-top:8px"'+(guideOpen?' open':'')+'><summary style="cursor:pointer;font-weight:bold;color:var(--accent)">📖 '+t('使い方（代表と選手）')+'</summary>';
  h+='<h2 style="margin-top:10px">'+t('選手：チームに入る')+'</h2><ol style="padding-left:1.3em;margin:4px 0">'
   +L(t('代表から届いたリンクを開きます。'))
   +L(t('「このチームに入りますか？」で「入る」を押します。'))
   +L(t('この画面で、表示する名前を入れて、「このチームに送る」をONにします。'))
   +'</ol><p class="note">'+t('そのあと、記録を保存するたびに、自動でチームに送られます。')+'</p>';
  h+='<h2 style="margin-top:12px">'+t('代表：チームを作る')+'</h2><p class="note" style="font-size:.95rem">'+t('ボタンを押しながら進められる、かんたん手順のページがあります。10分ほどで、招待リンクまで作れます。')+'</p>'
   +'<div class="row"><button class="pri" data-team-act="openLeader" style="min-height:48px;font-size:1rem">'+t('代表の方はこちら（かんたん手順）')+'</button></div>'
   +'<p class="note">'+t('招待リンクは、チームの人だけに送ってください。リンクを知っている人は、チームの記録を送ったり見たりできます。')+'</p>'
   +'<div class="row"><button data-team-act="openChange">'+t('代表を交代するとき')+'</button></div>';
  return h+'</details>';
}
function makeInvite(){
  var fv=($('#tm_form')||{}).value||'',cv=($('#tm_csv')||{}).value||'',nm=(($('#tm_name')||{}).value||'').trim();
  var f=(/forms\/d\/e\/([A-Za-z0-9_\-]+)/.exec(fv)||[])[1],c=(/spreadsheets\/d\/e\/([A-Za-z0-9_\-]+)\/pub/.exec(cv)||[])[1];
  var out=$('#tm_out');if(!out)return;
  if(!okFormId(f)){out.innerHTML='<p class="note" style="color:var(--warn)">'+esc(t('フォームのリンクが正しくありません。「回答者へのリンクをコピー」で出るリンクを貼ってください。'))+'</p>';return}
  if(!okCsvId(c)){out.innerHTML='<p class="note" style="color:var(--warn)">'+esc(t('スプレッドシートの公開リンクが正しくありません。「ウェブに公開」で出たリンク（pubを含むもの）を貼ってください。'))+'</p>';return}
  if(!nm){out.innerHTML='<p class="note" style="color:var(--warn)">'+esc(t('チーム名を入れてください'))+'</p>';return}
  var link=location.origin+location.pathname+'#team='+b64e({f:f,c:c,n:nm});
  out.innerHTML='<label>'+t('招待リンク')+'</label><textarea id="tm_link" rows="3" readonly style="width:100%">'+esc(link)+'</textarea><div class="row"><button data-team-act="copyLink">'+t('招待リンクをコピー')+'</button></div>';
}
function copyLink(){
  var tx=(($('#tm_link')||{}).value)||'';if(!tx)return;
  var done=function(){A.flash(t('コピーしました'))};
  var fb=function(){var e=$('#tm_link');if(e){e.select();try{document.execCommand('copy');done()}catch(x){A.uiDlg({msg:t('コピーしてください'),input:{value:tx,textarea:true},noCancel:true})}}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(tx).then(done,fb);else fb();
}

/* ---------- show the invitation link of a team already joined ---------- */
var showInv='';
function inviteLink(T){
  var o=T.f?(T.s?{f:T.f,s:T.s,n:T.n}:{f:T.f,c:T.c,n:T.n}):{u:T.u,k:T.k,n:T.n};if(T.m)o.m=T.m;
  return location.origin+location.pathname+'#team='+b64e(o)}
function inviteHtml(T){
  var link=inviteLink(T),msg=t('Archery Score のチーム「')+T.n+t('」に入るリンクです。開いて「入る」を押してください。')+'\n'+link;
  return '<div class="card" style="margin:8px 0;padding:10px"><p class="note"><b>'+esc(T.n)+'</b>：'+t('このリンクを、チームに入れたい人に送ってください。')+'</p>'
   +'<label>'+t('スコア管理人の名前')+'</label><input data-team="mgr" maxlength="20" value="'+esc(T.m||'')+'" placeholder="'+t('例：山田')+'"><p class="note">'+t('管理人が変わったときは、新しい管理人の名前を入れて、新しいリンクをチームに送ってください。リンクを開いた人に、名前が更新されます。')+'</p>'
   +'<textarea id="tm_invlink" rows="3" readonly style="width:100%">'+esc(link)+'</textarea>'
   +'<div class="row"><button class="pri" data-team-act="copyInv" style="min-height:48px">'+t('招待リンクをコピー')+'</button>'
   +'<a class="btn" target="_blank" rel="noopener" style="min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:0 12px" href="https://line.me/R/msg/text/?'+encodeURIComponent(msg)+'">💬 LINE</a></div>'
   +'<p class="note">'+t('招待リンクは、チームの人だけに送ってください。リンクを知っている人は、チームの記録を送ったり見たりできます。')+'</p></div>'}
function copyInv(){
  var T=team();if(!T)return;var tx=inviteLink(T);
  var done=function(){A.flash(t('コピーしました'))};
  var fb=function(){var e=$('#tm_invlink');if(e){e.select();try{document.execCommand('copy');done()}catch(x){A.uiDlg({msg:t('コピーしてください'),input:{value:tx,textarea:true},noCancel:true})}}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(tx).then(done,fb);else fb();
}

/* ---------- cards shown on the settings screen ---------- */
function cards(){
  var T=team(),h='';
  h+='<div class="card"><h2>🔒 '+t('データについて')+'</h2><p class="note" style="font-size:.9rem"><b>'+t('記入したデータは作者には届きません。記録はこの端末の中に保存されます。作者のサーバーはありません。')+'</b></p><p class="note">'+t('チームで共有を使う場合だけ、保存した記録が、あなたのチームの代表が用意したスプレッドシートに送られます。送った内容は、そのチームの人だけが見られます。作者や他のチームには見えません。')+'</p></div>';
  h+='<div class="card"><h2>👥 '+t('チームで共有')+'</h2>';
  if(!T){h+='<p class="note">'+t('チームに入っていません。代表から届いた招待リンクを開くと、ここに表示されます。')+'</p>'+guideHtml()+'</div>'}
  else{
    var L=teams();
    if(L.length>1){h+='<p class="note">'+t('チームを切り替える')+'</p><div class="row" style="flex-wrap:wrap;gap:6px">'+L.map(function(a){return '<button data-team-act="sel" data-id="'+esc(a.id)+'" class="'+(a.id===T.id?'pri':'')+'" style="min-height:44px">'+esc(a.n)+(a.on?' ✓':'')+'</button>'}).join('')+'</div>'}
    h+='<p class="note">'+t('チーム名')+'：<b>'+esc(T.n)+'</b><br>'+t('スコア管理人')+'：<b>'+(T.m?esc(T.m):t('（未設定）'))+'</b></p>'
     +'<label>'+t('表示する名前')+'</label><input data-team="name" value="'+esc(T.name||'')+'" maxlength="30">'
     +'<label style="display:flex;gap:8px;align-items:flex-start;margin-top:8px"><input type="checkbox" style="width:auto;margin-top:4px" data-team="on" '+(T.on?'checked':'')+'><span>'+t('このチームに送る')+'</span></label>'
     +'<p class="note">'+t('ONにすると、記録を保存するたびに、次の内容を代表のスプレッドシートに送ります：名前・日付・ラウンド・大会名・場所・順位・各回の点数・合計・10の数・Xの数。的のどこに当たったかは送りません。')+'</p>'
     +'<div class="row"><button data-team-act="all">'+t('今ある記録をすべて送る')+'</button><button data-team-act="board">'+t('チームの成績を見る')+'</button></div>'
     +boardHtml()
     +'<div class="row"><button data-team-act="inv">'+t('このチームの招待リンクを出す')+'</button></div>'+(showInv===T.id?inviteHtml(T):'')
     +'<div class="row"><button class="warn" data-team-act="leave">'+t('このチームから抜ける')+'</button></div>'
     +'<p class="note">'+t('ほかのチームにも入るときは、そのチームの招待リンクを開いてください。このチームはそのまま残ります。')+'</p>'+guideHtml()+'</div>'}
  h+='<p class="note" style="text-align:center;margin:14px 0 0"><b style="font-size:1rem;color:var(--text)">Let\'s keep score!</b><br>'+COPYRIGHT+'<br>'+t('無断での複製・再配布・改変を禁じます。個人での利用は自由です。')+'</p>';
  return h;
}

document.addEventListener('click',function(e){var b=e.target.closest('[data-team-act]');if(!b)return;var a=b.dataset.teamAct;
  if(a==='all')pushAll();
  else if(a==='board')loadBoard();
  else if(a==='sel'){selectTeam(b.dataset.id);showInv='';A.render()}
  else if(a==='inv'){var T0=team();showInv=(showInv===(T0&&T0.id))?'':(T0?T0.id:'');A.render()}
  else if(a==='copyInv')copyInv();
  else if(a==='openChange')window.open('leader-change.html','_blank');
  else if(a==='openLeader')window.open('leader.html','_blank');
  else if(a==='openTpl')window.open(TPL_COPY,'_blank','noopener');
  else if(a==='makeLink')makeInvite();
  else if(a==='copyLink')copyLink();
  else if(a==='leave')A.uiDlg({msg:t('チームから抜けますか？'),danger:true,okLabel:t('チームから抜ける'),onOk:function(){removeCur();board=null;A.flash(t('チームから抜けました（送った記録は代表のスプレッドシートに残ります）'));A.render()}})});
document.addEventListener('change',function(e){var x=e.target;if(!x.dataset||!x.dataset.team)return;var T=team();if(!T)return;
  if(x.dataset.team==='on'){
    if(x.checked&&!(T.name||'').trim()){x.checked=false;A.flash(t('名前を入れてください'));return}
    T.on=!!x.checked;saveTeam(T)}});
document.addEventListener('toggle',function(e){if(e.target&&e.target.hasAttribute&&e.target.hasAttribute('data-guide'))guideOpen=e.target.open},true);
document.addEventListener('input',function(e){var x=e.target;if(!x.dataset)return;
  if(x.dataset.team==='mgr'){var T1=team();if(!T1)return;T1.m=x.value.trim().slice(0,20);saveTeam(T1);var ta=$('#tm_invlink');if(ta)ta.value=inviteLink(T1);return}
  if(x.dataset.team!=='name')return;var T=team();if(!T)return;T.name=x.value;saveTeam(T)});

/* ---------- announcements (announce.json on the same site; never cached) ---------- */
function announce(){
  if(!/^https?:$/.test(location.protocol))return;
  fetch('announce.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(a){
    if(!a||!a.id||!a.message)return;
    if(a.until&&Date.now()>Date.parse(a.until))return;
    if(lsGet(DK,'')===a.id)return;
    var d=document.createElement('div');d.id='announce';
    d.style.cssText='position:fixed;left:10px;right:10px;top:10px;z-index:99;max-width:560px;margin:0 auto;background:var(--card);color:var(--text);border:2px solid var(--accent);border-radius:12px;padding:10px 12px;box-shadow:0 4px 14px #0006';
    var msg=(window.__A&&a['m_'+(document.documentElement.lang||'ja')])||a.message;
    var link=(a.url&&/^https:\/\//.test(a.url))?'<a href="'+esc(a.url)+'" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;color:var(--accent);font-weight:bold">'+t('開く')+'</a> ':'';
    d.innerHTML='<b>📣 '+t('お知らせ')+'</b><div style="white-space:pre-wrap;margin-top:4px">'+esc(msg)+'</div>'+link+'<button type="button" style="float:right;margin-top:6px">'+t('閉じる')+'</button>';
    d.querySelector('button').onclick=function(){lsSet(DK,a.id);d.remove()};
    document.body.appendChild(d)}).catch(function(){});
}

window.TEAM={cards:cards,push:push,makeLink:function(u,k,n){return location.origin+location.pathname+'#team='+b64e({u:u,k:k,n:n})}};
readJoin();announce();
})();
