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
