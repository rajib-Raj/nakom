const translat = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.project": "Projects",
    "nav.resources": "Resources",
    "nav.news": "News and Events",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
  },

  bn: {
    "nav.home": "হেম",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.project": "প্রজেক্টসমূহ",
    "nav.resources": "সম্পদসমূহ",
    "nav.news": "ঘটনাবলি",
    "nav.gallery": "গ্যালারি",
    "nav.contact": "যোগাযোগ",
  },
};

let currentLang = localStorage.getItem("site-lang") || "en";

function t(key) {
  return translat[currentLang]?.[key] ?? translat.en[key] ?? key;
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem("site-lang", lang);

  document.documentElement.lang = lang === "bn" ? "bn" : "en";

  document.querySelectorAll("[data-longs]").forEach((el) => {
    const val = t(el.dataset.longs);
    if (val !== undefined) el.textContent = val;
  });

  document.querySelectorAll("[data-longs-html]").forEach((el) => {
    const val = t(el.dataset.longsHTML);
    if (val !== undefined) el.innerHTML = val;
  });

  document.dispatchEvent(new CustomEvent("langChange", { detail: lang }));
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("language-toggle");
  if (!toggle) return;

  toggle.checked = currentLang === "bn";
  applyLang(currentLang);

  toggle.addEventListener("change", () => {
    applyLang(toggle.checked ? "bn" : "en");
  });
});
