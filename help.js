/* ヘルプの中身（質問と答え）。文章は短く、図で見せる。
   質問を足す = window.HELP.qs に1つ足すだけ。図の部品は下の f.* を使う。 */
(function(){
var f={
  btn:function(t,o){return '<span class="hb'+(o&&o.on?' on':'')+(o&&o.tap?' tap':'')+'">'+t+'</span>'},
  cell:function(c,t,tap){return '<span class="hc '+c+(tap?' tap':'')+'">'+t+'</span>'},
  row:function(a){return '<div class="hrow">'+a.join(' ')+'</div>'},
  target:function(o){o=o||{};
    var s='<svg viewBox="0 0 120 120" width="130" height="130" style="display:block;margin:0 auto"><circle cx="60" cy="60" r="56" fill="#fafafa" stroke="#999"/><circle cx="60" cy="60" r="46" fill="#2b2b2b"/><circle cx="60" cy="60" r="36" fill="#2a8be0"/><circle cx="60" cy="60" r="26" fill="#e0342b"/><circle cx="60" cy="60" r="13" fill="#f7d117"/>';
    if(o.touch)s+='<circle cx="68" cy="52" r="7" fill="#fff" fill-opacity=".45" stroke="#e67e00" stroke-width="2.5"/><text x="68" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#000" stroke="#fff" stroke-width="3" paint-order="stroke">'+o.touch+'</text><text x="78" y="72" font-size="20">&#128070;</text>';
    if(o.out)s+='<text x="104" y="22" font-size="20">&#128070;</text><text x="92" y="36" font-size="10" fill="#e67e00" font-weight="bold">M</text>';
    return s+'</svg>'},
  nav:function(on){var a=[['&#127919;','記録'],['&#128203;','履歴'],['&#128200;','分析'],['&#128197;','予定'],['&#9881;&#65039;','設定']];
    return '<div class="hnav">'+a.map(function(x){return '<span'+(x[1]===on?' class="on"':'')+'>'+x[0]+'<br><small>'+x[1]+'</small></span>'}).join('')+'</div>'},
  dots:function(){return '<div class="hdots">'+['#14532d','#b98a00','#0f766e','#1d4ed8','#1e3a5f','#6d28d9','#be185d','#b3261e','#c2570c','#2b2b2b'].map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</div>'}
};
window.HELP={
  greet:'こんにちは！ &#127919; 使い方で困ったことを選んでね。図で説明するよ。',
  formUrl:'',
  qs:[
    {id:'start',icon:'🎯',q:'記録のはじめかた',steps:[
      {t:'「＋ 新しい記録」をタップ',f:f.btn('＋ 新しい記録',{on:1,tap:1})},
      {t:'ラウンドと弓を選ぶ',f:f.row([f.btn('70m',{on:1}),f.btn('60m'),f.btn('50m'),f.btn('インドア'),f.btn('WA1440'),f.btn('自由設定')])},
      {t:'「記録を始める」をタップ',f:f.btn('記録を始める',{on:1,tap:1})}],
      tip:'名前は「設定」で入れておくと、毎回入力しなくて済みます。'},
    {id:'tap',icon:'👆',q:'的のタップのしかた',steps:[
      {t:'的を指で押すと、丸が出る'},
      {t:'押したまま動かして、位置を合わせる',f:f.target({touch:'9'})},
      {t:'指を離すと、その位置の点数が入る'},
      {t:'小さく狙うときは、2本指で拡大',f:f.btn('🔍 拡大を戻す')},
      {t:'的の外をタップすると、ミス（M）',f:f.target({out:1})}],
      tip:'すぐに指を動かすと、画面がスクロールします。丸が出てから動かしてね。'},
    {id:'keys',icon:'🔢',q:'点数ボタンで入れたい',steps:[
      {t:'「点数ボタン」を選ぶ',f:f.row([f.btn('的にタッチ'),f.btn('点数ボタン',{on:1,tap:1})])},
      {t:'点数の数字をタップ',f:f.row([f.cell('y','10',1),f.cell('y','9'),f.cell('r','8'),f.cell('r','7'),f.cell('b','6')])}],
      tip:'点数ボタンで入れた矢は、的の着弾マップには出ません。'},
    {id:'fix',icon:'✏️',q:'間違えた矢を直したい',steps:[
      {t:'表の、直したい数字をタップ',f:f.row([f.cell('y','10'),f.cell('y','9',1),f.cell('r','8')])},
      {t:'その矢が「書き換え」になる。的か点数ボタンで入れ直す'},
      {t:'直前の1本を消すだけなら「1本戻す」',f:f.btn('↩ 1本戻す',{on:1})}],
      tip:'入れ直すと、次の空いている矢に進みます。'},
    {id:'side',icon:'↔️',q:'表と的を左右に並べたい',steps:[
      {t:'記録画面の「表と的を左右に並べる」をタップ',f:f.btn('表と的を左右に並べる',{on:1,tap:1})},
      {t:'もう一度押すと、上下に戻る'}]},
    {id:'purpose',icon:'🏆',q:'試合と練習を分けたい',steps:[
      {t:'「新しい記録」で、練習か試合かを選ぶ',f:f.row([f.btn('練習',{on:1}),f.btn('試合')])},
      {t:'あとから変えるには、履歴の「練習 ⇄」をタップ',f:f.btn('練習 ⇄',{tap:1})},
      {t:'履歴と分析の上のボタンで、絞り込める',f:f.row([f.btn('練習も試合も',{on:1}),f.btn('練習'),f.btn('試合')])}],
      tip:'これまでの記録は、最初は全部「練習」です。'},
    {id:'save',icon:'✅',q:'「保存」は押さないとダメ？',steps:[
      {t:'入力は、自動で保存されています'},
      {t:'「保存」を押すと、履歴の画面に移動します',f:f.btn('✅ 保存',{on:1})}],
      tip:'押し忘れても、記録は消えません。'},
    {id:'hist',icon:'📈',q:'履歴と分析の見かた',steps:[
      {t:'履歴：記録をタップすると開く',f:f.nav('履歴')},
      {t:'分析：「過去の記録を合わせて」で、推移や着弾マップが見られる',f:f.row([f.btn('今の記録'),f.btn('過去の記録を合わせて',{on:1})])},
      {t:'着弾マップは、矢をタップして印やコメントを残せる'}]},
    {id:'cal',icon:'📅',q:'予定と目標点数',steps:[
      {t:'予定：試合の日を登録すると、あと何日か出る',f:f.btn('＋ 予定を追加',{on:1})},
      {t:'目標点数：目標を入れると、必要な平均点が出る',f:f.btn('🎯 目標点数を設定',{tap:1})}]},
    {id:'color',icon:'🎨',q:'色を変えたい',steps:[
      {t:'「設定」を開く',f:f.nav('設定')},
      {t:'「ベースカラー」から好きな色をタップ',f:f.dots()}],
      tip:'すぐに変わります。この端末だけの設定です。'},
    {id:'backup',icon:'💾',q:'バックアップを取りたい',steps:[
      {t:'「設定」の下のほうの「データ」を開く'},
      {t:'「バックアップ保存」をタップ',f:f.btn('バックアップ保存',{on:1,tap:1})},
      {t:'機種変更のときは「バックアップを読み込む」で戻す',f:f.btn('バックアップを読み込む')}],
      tip:'記録はこの端末の中にだけあります。ときどき保存してね。'},
    {id:'home',icon:'📲',q:'ホーム画面に追加したい',steps:[
      {t:'Chromeでこのアプリのページを開く'},
      {t:'右上のメニュー（︙）から「ホーム画面に追加」'},
      {t:'アイコンや色が古いときは、アイコンを削除して追加し直す'}],
      tip:'追加し直す前に、必ず「バックアップ保存」を押してね。'}
  ]
};
})();
