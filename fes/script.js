document.documentElement.classList.add('js');
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

// スマホのメニュー
(function () {
  var btn = document.querySelector('.bar__menu');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// スマホの固定ボタン：最初の画面と登録欄が見えている間は隠す
(function () {
  var f = document.querySelector('.float');
  if (!f || !('IntersectionObserver' in window)) return;
  var seen = new Set();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.isIntersecting ? seen.add(e.target) : seen.delete(e.target); });
    f.classList.toggle('is-hide', seen.size > 0);
  });
  ['#top', '#entry'].forEach(function (s) { var el = document.querySelector(s); if (el) io.observe(el); });
})();

// 出てくるたびに動く：時間差表示・マーカー・QUESTのスタンプ
// 画面に入ったら is-in を付け、画面から完全に出たら外す（次に入ったとき、もう一度動く）
(function () {
  var els = document.querySelectorAll('.st, .mk, .quest');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
  var alive = false;
  var io = new IntersectionObserver(function (es) {
    alive = true;
    es.forEach(function (e) {
      if (e.intersectionRatio >= 0.2) e.target.classList.add('is-in');
      else if (!e.isIntersecting) e.target.classList.remove('is-in');
    });
  }, { threshold: [0, 0.2] });
  els.forEach(function (e) { io.observe(e); });
  setTimeout(function () { if (!alive) els.forEach(function (e) { e.classList.add('is-in'); }); }, 2500);
})();

// ハサミの境目・セクション：画面に入るたびに動く（出たら元に戻し、次に入ったときもう一度動く）
(function () {
  var els = document.querySelectorAll('.cut, .fade');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
  var alive = false;
  var io = new IntersectionObserver(function (es) {
    alive = true;
    es.forEach(function (e) {
      var need = e.target.classList.contains('cut') ? 0.9 : 0.12;
      if (e.intersectionRatio >= need) e.target.classList.add('is-in');
      else if (!e.isIntersecting) e.target.classList.remove('is-in');
    });
  }, { threshold: [0, 0.12, 0.9] });
  els.forEach(function (e) { io.observe(e); });
  setTimeout(function () { if (!alive) els.forEach(function (e) { e.classList.add('is-in'); }); }, 2500);
})();

// PROGRAM一覧：スマホでは、画面の真ん中に来た行の写真を開く（パソコンはマウスを乗せたとき）
(function () {
  var rows = document.querySelectorAll('.plist li, .steps li');
  if (!rows.length || !('IntersectionObserver' in window)) return;
  var mq = matchMedia('(max-width: 859px)');
  var io = new IntersectionObserver(function (es) {
    if (!mq.matches) return;
    es.forEach(function (e) { e.target.classList.toggle('is-active', e.isIntersecting); });
  }, { rootMargin: '-42% 0px -42% 0px' });
  rows.forEach(function (r) { io.observe(r); });
  mq.addEventListener && mq.addEventListener('change', function () { if (!mq.matches) rows.forEach(function (r) { r.classList.remove('is-active'); }); });
})();

// トップに戻るボタン：最初の画面を過ぎたら出す
(function () {
  var t = document.querySelector('.totop');
  var hero = document.getElementById('top');
  if (!t || !hero) return;
  function check() { t.classList.toggle('is-show', window.scrollY > hero.offsetHeight * 0.8); }
  addEventListener('scroll', check, { passive: true });
  check();
  t.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();

// 講師のプロフィール：写真や名前を押すと開く（×・外側・Escで閉じる）
(function () {
  var dlg = document.getElementById('pm');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var body = dlg.querySelector('.pm__body');
  var opener = null;
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-person]');
    if (!b) return;
    var tpl = document.getElementById('p-' + b.getAttribute('data-person'));
    if (!tpl) return;
    opener = b;
    body.innerHTML = '';
    body.appendChild(tpl.content.cloneNode(true));
    dlg.showModal();
    dlg.scrollTop = 0;
  });
  dlg.querySelector('.pm__close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { if (opener) opener.focus(); });
})();
