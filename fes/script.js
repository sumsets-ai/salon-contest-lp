document.documentElement.classList.add('js');

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

// QUESTのスタンプ：見えたら順に押す（1回だけ）
(function () {
  var q = document.querySelector('.quest');
  if (!q) return;
  if (!('IntersectionObserver' in window)) { q.classList.add('is-in'); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { q.classList.add('is-in'); io.disconnect(); }
    });
  }, { threshold: 0.4 });
  io.observe(q);
})();

// ハサミの境目：見えたら1回だけ切り進む
(function () {
  var cuts = document.querySelectorAll('.cut');
  if (!cuts.length) return;
  if (!('IntersectionObserver' in window)) { cuts.forEach(function (c) { c.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  cuts.forEach(function (c) { io.observe(c); });
})();

// 時間差表示とマーカー：見えたら1回だけ
(function () {
  var els = document.querySelectorAll('.st, .mk');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
  var alive = false;
  var io = new IntersectionObserver(function (es) {
    alive = true;
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });
  // 安全策：2.5秒たっても判定が動かない環境では、最初から全部見せる
  setTimeout(function () { if (!alive) els.forEach(function (e) { e.classList.add('is-in'); }); }, 2500);
})();
