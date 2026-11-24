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
