const translat = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.project": "Projects",
    "nav.resources": "Resources",
    "nav.news": "News and Events",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",

    // hero
    "hero.s1.eye": "Save the environment",
    "hero.s1.title": "Grow trees for Your future",

    "hero.s2.eye": "Clean Water Initiative",
    "hero.s2.title": "Every Drop of Water is a Human Right",

    "hero.s3.eye": "Education For All",
    "hero.s3.title": "Build a Future Through the Power of Edcation",

    // featur

    "fet.nu1": "100",

    "fet.pr": "Projects",
    "fet.be": "Beneficiaries",
    "fet.co": "Species Consercation",
    "fet.cd": "Covered District",

    // about

    "ab.eye": "✤ About Us",
    "ab.h4": "Nature Conservation Management (NACOM) is the pioneer, non-government, pro-environment organization in Bangladesh, founded in 1987.",
    "ab.item.mh": "Mission",
    "ab.item.mp": "NACOM’s mission is to engage in activities to ensure protection of nature while empowering local communities",
    "ab.item.vh": "Vision",
    "ab.item.vp": "Protection of Nature for Better Human Life"
  },

  bn: {
    "nav.home": "হেম",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.project": "প্রজেক্টসমূহ",
    "nav.resources": "সম্পদসমূহ",
    "nav.news": "ঘটনাবলি",
    "nav.gallery": "গ্যালারি",
    "nav.contact": "যোগাযোগ",

    // hero

    "hero.s1.eye": "পরিবেশ বাঁচান",
    "hero.s1.title": "আপনার ভবিষ্যতের জন্য গাছ লাগান।",

    "hero.s2.eye": "বিশুদ্ধ জল উদ্যোগ",
    "hero.s2.title": "পানির প্রতিটি ফোঁটা একটি মানবাধিকার।",
    
    "hero.s3.eye": "সবার জন্য শিক্ষা",
    "hero.s3.title": "শিক্ষার শক্তিতে ভবিষ্যৎ গড়ুন",

    // feature

    // numb

    "fet.nu1": "১০০",


    "fet.pr": "প্রকল্প",
    "fet.be": "সুবিধাভোগী",
    "fet.co": "প্রজাতি সংরক্ষণ",
    "fet.cd": "আওতাভুক্ত এলাকা",


    // about

    "ab.eye": "✤ আমাদের সম্পর্কে",
    "ab.h4": "প্রকৃতি সংরক্ষণ ব্যবস্থাপনা (NACOM) হলো বাংলাদেশের একটি অগ্রণী, বেসরকারি, পরিবেশ-বান্ধব সংস্থা, যা ১৯৮৭ সালে প্রতিষ্ঠিত হয়।",
    "ab.item.mh": "লক্ষ্য",
    "ab.item.mp": "NACOM-এর লক্ষ্য হলো স্থানীয় জনগোষ্ঠীকে ক্ষমতায়নের পাশাপাশি প্রকৃতি সুরক্ষায় ভূমিকা রাখা।",
    "ab.item.vh": "দর্শন",
    "ab.item.vp": "উন্নত মানবজীবনের জন্য প্রকৃতি সুরক্ষা",
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
