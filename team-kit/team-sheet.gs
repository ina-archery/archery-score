/**
 * Archery Score チーム共有キット（チーム代表用）
 * 使い方は README.md を見てください。
 *
 * このスプレッドシートとスクリプトは、チーム代表のGoogleアカウントの中にだけあります。
 * アプリの作者のサーバーはありません。作者や他のチームには、記録は見えません。
 */

var APP_URL = 'https://ina-archery.github.io/archery-score/';
var SHEET_REC = '記録';
var SHEET_SET = '設定';
var HEAD = ['受信日時', '名前', '日付', '種別', 'ラウンド', '大会名・場所', '順位', '1回目', '2回目', '3回目', '4回目', '合計', '10の数', 'Xの数', 'ID'];
var ID_COL = 15;
var MAX_PER_POST = 300;

/* 画面が出せない場所（エディタからの実行）でも止まらないように、メッセージは安全に出す */
function msg_(a, b, c) {
  try { var ui = SpreadsheetApp.getUi(); return (b === undefined) ? ui.alert(a) : ui.alert(a, b, c); }
  catch (e) { Logger.log(a + (b ? ' ' + b : '')); return null; }
}

/* ---------- メニュー ---------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('チーム設定')
    .addItem('① 初期設定（最初に1回）', 'setup')
    .addItem('② 招待リンクを作る', 'makeInviteLink')
    .addSeparator()
    .addItem('合言葉を変える（漏れたとき）', 'resetKey')
    .addToUi();
}

/* ---------- 初期設定 ---------- */
function setup() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEET_REC) || ss.insertSheet(SHEET_REC);
  if (sh.getLastRow() === 0) { sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight('bold'); sh.setFrozenRows(1); }
  var st = ss.getSheetByName(SHEET_SET) || ss.insertSheet(SHEET_SET);
  if (st.getLastRow() === 0) {
    st.getRange('A1:B4').setValues([
      ['チーム名', 'ここにチーム名を入れる'],
      ['ウェブアプリのURL', 'ここに、公開で出たURL（https://script.google.com/macros/s/…/exec）を貼る'],
      ['招待リンク', '（メニュー「② 招待リンクを作る」で出ます）'],
      ['注意', 'この「設定」シートは、チーム代表だけが見られるようにしてください。合言葉は入っていません。']
    ]);
    st.getRange('A1:A4').setFontWeight('bold');
    st.setColumnWidth(1, 160); st.setColumnWidth(2, 560);
  }
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('TEAM_KEY')) p.setProperty('TEAM_KEY', randomKey_());
  msg_('初期設定ができました。\n\n次は、「設定」シートにチーム名を入れ、画面右上の「デプロイ」→「新しいデプロイ」でウェブアプリとして公開して、出たURLを「設定」シートに貼ってください。\n（くわしくは README.md）');
}

function randomKey_() {
  var s = '', c = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (var i = 0; i < 24; i++) s += c.charAt(Math.floor(Math.random() * c.length));
  return s;
}

function resetKey() {
  var ui0 = SpreadsheetApp.getUi();
  var r = ui0.alert('合言葉を変えますか？', '変えると、今の招待リンクは使えなくなります。選手には新しい招待リンクを配り直してください。', ui0.ButtonSet.OK_CANCEL);
  if (r !== ui0.Button.OK) return;
  PropertiesService.getScriptProperties().setProperty('TEAM_KEY', randomKey_());
  msg_('合言葉を変えました。「② 招待リンクを作る」で、新しいリンクを作ってください。');
}

/* ---------- 招待リンク ---------- */
function makeInviteLink() {
  var ss = SpreadsheetApp.getActive(), st = ss.getSheetByName(SHEET_SET);
  if (!st) { msg_('先に「① 初期設定」を実行してください。'); return; }
  var name = String(st.getRange('B1').getValue()).trim();
  var url = String(st.getRange('B2').getValue()).trim();
  if (!name || name.indexOf('ここに') === 0) { msg_('「設定」シートの B1 に、チーム名を入れてください。'); return; }
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_\-]+\/exec$/.test(url)) {
    msg_('「設定」シートの B2 に、ウェブアプリのURLを貼ってください。\n（https://script.google.com/macros/s/…/exec の形）'); return;
  }
  var key = PropertiesService.getScriptProperties().getProperty('TEAM_KEY');
  if (!key) { msg_('先に「① 初期設定」を実行してください。'); return; }
  var json = JSON.stringify({ u: url, k: key, n: name });
  var enc = Utilities.base64EncodeWebSafe(Utilities.newBlob(json).getBytes()).replace(/=+$/, '');
  var link = APP_URL + '#team=' + enc;
  st.getRange('B3').setValue(link);
  msg_('招待リンクを「設定」シートの B3 に書きました。\n選手に、このリンクを送ってください（LINEなど）。\n\n※このリンクを知っている人は、チームの記録を送ったり見たりできます。チームの外には渡さないでください。');
}

/* ---------- アプリからの受け口 ---------- */
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function keyOk_(k) {
  var real = PropertiesService.getScriptProperties().getProperty('TEAM_KEY');
  return !!real && typeof k === 'string' && k.length === real.length && k === real;
}
function clean_(v, n) {
  v = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').slice(0, n || 80);
  return /^[=+\-@]/.test(v) ? "'" + v : v;   // 数式として動かないようにする
}
function fmtDate_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v == null ? '' : v);
}
function num_(v) { var x = Number(v); return isFinite(x) ? x : ''; }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!keyOk_(b.k)) return json_({ ok: false, err: 'key' });
    if (b.a !== 'put' || !Array.isArray(b.rec)) return json_({ ok: false, err: 'bad' });
    var who = clean_(b.who, 30);
    if (!who) return json_({ ok: false, err: 'name' });
    var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_REC);
    if (!sh) return json_({ ok: false, err: 'nosheet' });
    var recs = b.rec.slice(0, MAX_PER_POST);
    var last = sh.getLastRow(), idx = {};
    if (last > 1) {
      var ids = sh.getRange(2, 2, last - 1, 1).getValues(), idv = sh.getRange(2, ID_COL, last - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) idx[ids[i][0] + '|' + idv[i][0]] = i + 2;
    }
    var now = new Date();
    recs.forEach(function (r) {
      var id = clean_(r.id, 40);
      if (!id) return;
      var hs = Array.isArray(r.h) ? r.h : [];
      var pt = [0, 1, 2, 3].map(function (i) { return hs[i] ? num_(hs[i].s) : ''; });   // 1回目〜4回目の点数
      var row = [now, who, clean_(r.d, 12), clean_(r.k, 6), clean_(r.r, 60), clean_(r.p, 60), clean_(r.rk, 6), pt[0], pt[1], pt[2], pt[3], num_(r.t), num_(r.tn), num_(r.x), id];
      var key = who + '|' + id;
      if (idx[key]) sh.getRange(idx[key], 1, 1, HEAD.length).setValues([row]);
      else { sh.appendRow(row); idx[key] = sh.getLastRow(); }
    });
    return json_({ ok: true, n: recs.length });
  } catch (err) {
    return json_({ ok: false, err: 'error' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!keyOk_(p.k)) return json_({ ok: false, err: 'key' });
  if (p.a !== 'board') return json_({ ok: false, err: 'bad' });
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_REC);
  if (!sh || sh.getLastRow() < 2) return json_({ ok: true, recs: [] });
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, HEAD.length).getValues();
  var out = v.map(function (r) { return { n: r[1], d: fmtDate_(r[2]), k: r[3], r: r[4], p: r[5], rk: r[6], t: r[11] }; });
  return json_({ ok: true, recs: out.slice(-2000) });
}
