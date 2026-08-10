// ============================================================
//  DATA — swap with fetch('/api/causes').then(r => r.json())
// ============================================================


function truncateWords(text, limit = 10) {
    const words = text.trim().split(/\s+/);
    return words.length > limit
        ? words.slice(0, limit).join(" ") + '...'
        : text;
}

// ============================================================
//  CARD TEMPLATE — edit this to change card layout globally
// ============================================================
function renderCauseCard(card) {
  return `
    <div class="swiper-slide" style="width:auto;height:auto;display:flex;align-items:center;min-height:500px;">
      <div class="emotions-slider-item">
        ${card.badge ? `<div class="emotions-slider-item__badge">${card.badge}</div>` : ''}
        <div class="emotions-slider-item__image">
          <img src="${card.image}" alt="${card.title}" loading="lazy">
        </div>
        <div class="emotions-slider-item__content">
          <div class="emotions-slider-item__header">
            <div class="emotions-slider-item__header-inner">
            </div>
          </div>
          <div class="emotions-slider-item__info">
            <h3 class="emotions-slider-item__title">${truncateWords(card.title)}</h3>
            <p class="emotions-slider-item__text">${card.text}</p>
          </div>
          <div class="emotions-slider-item__footer">
            <a class="emotions-slider-item__btn" href="#" onclick="event.preventDefault()">
              <span class="emotions-slider-item__btn-text">Donate Now</span>
              <span class="emotions-slider-item__btn-icon"> →</span>
            </a>
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
//  INIT ALL CAROUSELS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // 1. Hero — static, fade, 3 slides, autoplay
  new Carousel('#heroSlider', {
    type: 'hero',
    delay: 4500,
  });

  // 2. Causes cards — dynamic data, autoplay, hover pause
  new Carousel('#causesSlider', {
    type: 'cards',
    data: causesData,
    renderFn: renderCauseCard,
    delay: 2800,
  });

  // 3. Logo strip — infinite, no controls, constant scroll
  new Carousel('#logoSlider', {
    type: 'logos',
    speed: 3500,
  });
  // ── Mobile menu toggle ──────────────────────────────────────
});

const mainNav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');
const langToggleWrap = document.querySelector('.lang-toggle-wrap');
const headerActions = document.querySelector('.header-actions');
const navUl = mainNav.querySelector('ul');

const mq = window.matchMedia('(max-width: 900px)');

function placeLangToggle(e) {
  if (e.matches) {
    mainNav.appendChild(langToggleWrap); // move into mobile nav
  } else {
    headerActions.insertBefore(langToggleWrap, menuToggle); // move back to header
    mainNav.classList.remove('open');
    mainNav.style.maxHeight = '';
  }
}
placeLangToggle(mq); // run once on load
mq.addEventListener('change', placeLangToggle);

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  if (isOpen) {
    // measure real content height and animate to it
    mainNav.style.maxHeight = mainNav.scrollHeight + 'px';
  } else {
    mainNav.style.maxHeight = '0px';
  }
});

// re-measure if a dropdown inside the mobile menu opens/closes content height
mainNav.querySelectorAll('li#drop > button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!mq.matches) return; // desktop uses hover, ignore
    btn.parentElement.classList.toggle('open');
    if (mainNav.classList.contains('open')) {
      mainNav.style.maxHeight = mainNav.scrollHeight + 'px';
    }
  });
});

// new for drop active

const currentPath = window.location.pathname;

document.querySelectorAll('.main-nav > ul > li').forEach(li => {
  li.classList.remove('active');
  const link = li.querySelector('a[href]');
  if (link && link.getAttribute('href') === currentPath) {
    li.classList.add('active');
  }
});

// number animation
const counters = document.querySelectorAll(".numba");

const animateCounter = (counter) => {
  const target = +counter.textContent.replace(/,/g, "");
  const duration = 3000; // Animation duration (2 seconds)
  const startTime = performance.now();

  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentValue = Math.floor(progress * target);

    counter.textContent = currentValue.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target.toLocaleString();
    }
  };

  requestAnimationFrame(updateCounter);
};

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Run only once
      }
    });
  },
  {
    threshold: 0.5,
  }
);

counters.forEach((counter) => observer.observe(counter));

// pagiantion
document.addEventListener('DOMContentLoaded', () => {
    const CARDS_PER_PAGE = 9; // change to 12 if you want 4x3 per page
    const container = document.getElementById('profileContainer');
    const pagination = document.getElementById('pagination');
    const cards = Array.from(container.querySelectorAll('.profile-card'));
    const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);

    let currentPage = 1;

    function showPage(page) {
        currentPage = page;
        const start = (page - 1) * CARDS_PER_PAGE;
        const end = start + CARDS_PER_PAGE;

        cards.forEach((card, i) => {
            card.style.display = (i >= start && i < end) ? '' : 'none';
        });

        renderPaginationControls();

        // optional: scroll back to top of section on page change
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderPaginationControls() {
        pagination.innerHTML = '';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '‹';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => showPage(currentPage - 1));
        pagination.appendChild(prevBtn);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === currentPage) btn.classList.add('active');
            btn.addEventListener('click', () => showPage(i));
            pagination.appendChild(btn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '›';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => showPage(currentPage + 1));
        pagination.appendChild(nextBtn);
    }

    // Only show pagination if there's more than one page
    if (totalPages > 1) {
        showPage(1);
    } else {
        pagination.style.display = 'none';
    }
});
