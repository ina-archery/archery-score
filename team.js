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
 'チームから抜けますか？':'Leave this team?',
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
 'スクリプトをコピー':'Copy script',
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

/* ---------- team state (kept apart from the records so it is not in backups) ---------- */
function team(){return lsGet(TK,null)}
function setTeam(x){if(x)lsSet(TK,x);else try{localStorage.removeItem(TK)}catch(e){}}

/* ---------- join by invitation link: #team=XXXX ---------- */
function readJoin(){
  var m=/[#&?]team=([A-Za-z0-9_\-]+)/.exec(location.hash||'')||/[?&]team=([A-Za-z0-9_\-]+)/.exec(location.search||'');
  if(!m)return;
  var cleaned=function(){try{history.replaceState(null,'',location.pathname)}catch(e){}};
  var o=null;try{o=JSON.parse(b64d(m[1]))}catch(e){}
  cleaned();
  if(!o||!okUrl(o.u)||!o.k||!o.n){A.flash(t('招待リンクが正しくありません'));return}
  A.uiDlg({msg:t('このチームに入りますか？')+'\n'+o.n,okLabel:t('入る'),onOk:function(){
    setTeam({u:o.u,k:o.k,n:String(o.n).slice(0,40),on:false,name:(A.DB().set.name||'')});
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
function send(payload,cb){
  var T=team();if(!T){cb&&cb(false);return}
  var body=JSON.stringify({a:'put',k:T.k,who:(T.name||'').slice(0,30),rec:payload});
  fetch(T.u,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:body,redirect:'follow'})
   .then(function(r){return r.json()}).then(function(j){cb&&cb(!!(j&&j.ok))}).catch(function(){cb&&cb(false)});
}
function push(S,quiet){
  var T=team();if(!T||!T.on||!T.name)return;
  var rec=summarize(S);if(!rec||rec._n===0)return;delete rec._n;
  send([rec],function(ok){if(!quiet)A.flash(ok?t('送りました'):t('送れませんでした（電波と招待リンクを確認してください）'))});
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
  h+='<h2 style="margin-top:12px">'+t('代表：チームを作る（最初に1回・10分ほど）')+'</h2><ol style="padding-left:1.3em;margin:4px 0">'
   +L(t('Googleドライブで、新しいスプレッドシートを作ります。'))
   +L(t('メニュー「拡張機能」→「Apps Script」を開きます。'))
   +L(t('下の「スクリプトをコピー」を押します。Apps Script の画面で、最初のコードを全部消して貼り付け、保存します。'))
   +L(t('スプレッドシートを読み込み直し、メニュー「チーム設定」→「① 初期設定」を押します。最初に「許可」の確認が出ます。'))
   +L(t('「設定」シートの B1 に、チーム名を入れます。'))
   +L(t('Apps Script の右上「デプロイ」→「新しいデプロイ」→種類「ウェブアプリ」。次のユーザーとして実行は「自分」、アクセスできるユーザーは「全員」にして「デプロイ」。出たURLをコピーして、「設定」シートの B2 に貼ります。'))
   +L(t('メニュー「チーム設定」→「② 招待リンクを作る」を押します。B3 に出たリンクを、LINEなどで選手に送ります。'))
   +'</ol><div class="row"><button data-team-act="copyScript">'+t('スクリプトをコピー')+'</button></div>'
   +'<p class="note">'+t('招待リンクは、チームの人だけに送ってください。外にもれたときは、メニュー「チーム設定」→「合言葉を変える」で、リンクを作り直せます。')+'</p>';
  return h+'</details>';
}
function copyScript(){
  fetch('team-kit/team-sheet.gs',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(tx){
    var done=function(){A.flash(t('コピーしました'))};
    var fb=function(){A.uiDlg({msg:t('コピーしてください'),input:{value:tx,textarea:true},noCancel:true})};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(tx).then(done,fb);else fb()
  }).catch(function(){A.flash(t('送れませんでした（電波と招待リンクを確認してください）'))});
}

/* ---------- cards shown on the settings screen ---------- */
function cards(){
  var T=team(),h='';
  h+='<div class="card"><h2>🔒 '+t('データについて')+'</h2><p class="note" style="font-size:.9rem"><b>'+t('記入したデータは作者には届きません。記録はこの端末の中に保存されます。作者のサーバーはありません。')+'</b></p><p class="note">'+t('チームで共有を使う場合だけ、保存した記録が、あなたのチームの代表が用意したスプレッドシートに送られます。送った内容は、そのチームの人だけが見られます。作者や他のチームには見えません。')+'</p></div>';
  h+='<div class="card"><h2>👥 '+t('チームで共有')+'</h2>';
  if(!T){h+='<p class="note">'+t('チームに入っていません。代表から届いた招待リンクを開くと、ここに表示されます。')+'</p>'+guideHtml()+'</div>'}
  else{
    h+='<p class="note">'+t('チーム名')+'：<b>'+esc(T.n)+'</b></p>'
     +'<label>'+t('表示する名前')+'</label><input data-team="name" value="'+esc(T.name||'')+'" maxlength="30">'
     +'<label style="display:flex;gap:8px;align-items:flex-start;margin-top:8px"><input type="checkbox" style="width:auto;margin-top:4px" data-team="on" '+(T.on?'checked':'')+'><span>'+t('このチームに送る')+'</span></label>'
     +'<p class="note">'+t('ONにすると、記録を保存するたびに、次の内容を代表のスプレッドシートに送ります：名前・日付・ラウンド・大会名・場所・順位・各回の点数・合計・10の数・Xの数。的のどこに当たったかは送りません。')+'</p>'
     +'<div class="row"><button data-team-act="all">'+t('今ある記録をすべて送る')+'</button><button data-team-act="board">'+t('チームの成績を見る')+'</button></div>'
     +boardHtml()
     +'<div class="row"><button class="warn" data-team-act="leave">'+t('チームから抜ける')+'</button></div>'+guideHtml()+'</div>'}
  h+='<p class="note" style="text-align:center;margin:14px 0 0"><b style="font-size:1rem;color:var(--text)">Let\'s keep score!</b><br>'+COPYRIGHT+'<br>'+t('無断での複製・再配布・改変を禁じます。個人での利用は自由です。')+'</p>';
  return h;
}

document.addEventListener('click',function(e){var b=e.target.closest('[data-team-act]');if(!b)return;var a=b.dataset.teamAct;
  if(a==='all')pushAll();
  else if(a==='board')loadBoard();
  else if(a==='copyScript')copyScript();
  else if(a==='leave')A.uiDlg({msg:t('チームから抜けますか？'),danger:true,okLabel:t('チームから抜ける'),onOk:function(){setTeam(null);board=null;A.flash(t('チームから抜けました（送った記録は代表のスプレッドシートに残ります）'));A.render()}})});
document.addEventListener('change',function(e){var x=e.target;if(!x.dataset||!x.dataset.team)return;var T=team();if(!T)return;
  if(x.dataset.team==='on'){
    if(x.checked&&!(T.name||'').trim()){x.checked=false;A.flash(t('名前を入れてください'));return}
    T.on=!!x.checked;setTeam(T)}});
document.addEventListener('toggle',function(e){if(e.target&&e.target.hasAttribute&&e.target.hasAttribute('data-guide'))guideOpen=e.target.open},true);
document.addEventListener('input',function(e){var x=e.target;if(!x.dataset||x.dataset.team!=='name')return;var T=team();if(!T)return;T.name=x.value;setTeam(T)});

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
