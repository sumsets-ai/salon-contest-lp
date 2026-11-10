/* GROOM ONE 2027 LP v0.1
   申込フォームができたら ENTRY_URL にURLを入れるだけで、
   エントリーボタンがフォームへのリンクに切り替わります。 */
const ENTRY_URL = ""; // 例："https://forms.example.com/groomone2027"

(() => {
  // ---- スマホメニュー ----
  const menu = document.querySelector(".topbar__menu");
  const nav = document.getElementById("sp-nav");
  const label = menu.querySelector(".js-menu-label");
  const setMenu = (open, returnFocus) => {
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    label.textContent = open ? "メニューを閉じる" : "メニューを開く";
    if (open) nav.querySelector("a").focus();
    else if (returnFocus) menu.focus();
  };
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });

  // ---- エントリーボタン ----
  const btn = document.querySelector(".js-entry");
  if (ENTRY_URL) {
    btn.href = ENTRY_URL;
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.removeAttribute("aria-disabled");
    btn.classList.add("is-open");
    btn.textContent = "エントリーフォームへ";
    return;
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  let timer;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toast.textContent = "受付開始まで、もう少しお待ちください。";
    toast.classList.add("is-show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("is-show"), 3000);
  });
})();

// ---- 控えめなアニメーション（1回だけ） ----
(() => {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("anim");
  // カード：グループ内で少しずつ遅らせる
  [".points li", ".cls", ".rules li", ".judge", ".flow li"].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add("rv");
      el.style.setProperty("--d", `${(i % 4) * 0.08}s`);
    });
  });
  // 安全策：判定処理が動かない環境では、アニメーションをやめて最初から全部見せる
  let ioAlive = false;
  setTimeout(() => { if (!ioAlive) document.documentElement.classList.remove("anim"); }, 1500);
  const io = new IntersectionObserver((entries) => {
    ioAlive = true;
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });
  // ハサミの移動距離（transformで動かすため、線の長さを先に測っておく）
  const setCut = () => document.querySelectorAll(".cut").forEach((c) => {
    const line = c.querySelector(".cut__line");
    c.style.setProperty("--cutw", `${line.getBoundingClientRect().width}px`);
  });
  setCut();
  addEventListener("resize", setCut, { passive: true });
  document.querySelectorAll(".cut, .ttl, .rv").forEach((el) => io.observe(el));
})();
