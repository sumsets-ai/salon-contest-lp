/* GROOM ONE 2027 LP — 0次版
   申込フォームができたら ENTRY_URL にURLを入れるだけで、
   すべてのエントリーボタンがフォームへのリンクに切り替わります。 */
const ENTRY_URL = ""; // 例："https://forms.example.com/groomone2027"

(() => {
  // ---- メニュー（スマホ） ----
  const menu = document.querySelector(".site-header__menu");
  const nav = document.getElementById("site-nav");
  const label = menu.querySelector(".js-menu-label");
  const setMenu = (open, returnFocus) => {
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    label.textContent = open ? "メニューを閉じる" : "メニューを開く";
    if (open) nav.querySelector("a").focus();
    else if (returnFocus) menu.focus();
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // ---- エントリー導線 ----
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  let timer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("is-show"), 3200);
  };

  const finalBtn = document.querySelector(".js-entry-final");
  if (ENTRY_URL) {
    document.querySelectorAll(".js-entry, .js-entry-final").forEach((a) => {
      a.href = ENTRY_URL;
      a.target = "_blank";
      a.rel = "noopener";
    });
    finalBtn.removeAttribute("aria-disabled");
    finalBtn.textContent = "エントリーフォームへ";
  } else {
    finalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("エントリー受付は準備中です。開始時にこのページでお知らせします。");
    });
  }

  // ---- クラス診断 ----
  const grid = document.querySelector(".class-grid");
  const btns = document.querySelectorAll(".finder__btn");
  btns.forEach((b) => b.setAttribute("aria-pressed", "false"));
  btns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const active = btn.getAttribute("aria-pressed") === "true";
      btns.forEach((b) => b.setAttribute("aria-pressed", "false"));
      grid.classList.toggle("is-filtered", !active);
      grid.querySelectorAll(".class-card").forEach((c) => {
        c.classList.toggle("is-match", !active && c.dataset.class === btn.dataset.class);
      });
      if (!active) {
        btn.setAttribute("aria-pressed", "true");
        const card = grid.querySelector(`.class-card[data-class="${btn.dataset.class}"]`);
        if (window.matchMedia("(max-width:980px)").matches) card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    })
  );

  // ---- スマホ固定ボタン：最初の画面とエントリー欄では隠す ----
  const cta = document.querySelector(".mobile-cta");
  const hide = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? hide.add(e.target) : hide.delete(e.target)));
    cta.classList.toggle("is-hidden", hide.size > 0);
  }, { threshold: 0.15 });
  [".hero", "#entry", ".site-footer"].forEach((s) => io.observe(document.querySelector(s)));
})();
