// ============================================================
//  DATA — swap with fetch('/api/causes').then(r => r.json())
// ============================================================
const causesData = [
  {
    id: 1,
    badge: null,
    image: 'clients/Project1.jpg',
    price: '$4,200', goal: '$10,000',
    author: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/40?img=5' },
    title: 'Fisheries Livelihood Enhancement Project in the Coastal Area of the Bay of Bengal (FiLEP-LNC)',
    text: 'Bringing safe drinking water to remote communities across Sub-Saharan Africa.',
  },
  {
    id: 2,
    badge: 'On Going',
    image: 'clients/project2.jpg',
    price: '$7,850', goal: '$15,000',
    author: { name: 'Marcus Lee', avatar: 'https://i.pravatar.cc/40?img=12' },
    title: 'Primary Scientific, Socio-Economic, and Cadastral Assessment the Declaration of Nine Areas in Sylhet',
    text: 'Building schools and providing learning materials for children in underserved regions.',
  },
  {
    id: 3,
    badge: null,
    image: 'clients/project3.jpeg',
    price: '$2,600', goal: '$8,000',
    author: { name: 'Amina Osei', avatar: 'https://i.pravatar.cc/40?img=9' },
    title: 'Cleaner Air, Healthier Dhaka: Enhancing Air Quality Monitoring & Public Awareness in DNCC',
    text: 'Delivering essential medicines and healthcare services to isolated rural villages.',
  },
  {
    id: 4,
    badge: null,
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop',
    price: '$5,100', goal: '$12,000',
    author: { name: 'Daniel Cruz', avatar: 'https://i.pravatar.cc/40?img=15' },
    title: 'Food Security Program',
    text: 'Supplying nutritious food packages and agricultural training to farming families.',
  },
  {
    id: 5,
    badge: 'On Going',
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=800&auto=format&fit=crop',
    price: '$3,300', goal: '$9,000',
    author: { name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/40?img=20' },
    title: 'Women Empowerment',
    text: 'Skills training and micro-finance support to help women build sustainable livelihoods.',
  },
  {
    id: 6,
    badge: null,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop',
    price: '$2,600', goal: '$8,000',
    author: { name: 'Amina Osei', avatar: 'https://i.pravatar.cc/40?img=9' },
    title: 'Medical Aid Outreach',
    text: 'Delivering essential medicines and healthcare services to isolated rural villages.',
  },
  {
    id: 7,
    badge: null,
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop',
    price: '$5,100', goal: '$12,000',
    author: { name: 'Daniel Cruz', avatar: 'https://i.pravatar.cc/40?img=15' },
    title: 'Food Security Program',
    text: 'Supplying nutritious food packages and agricultural training to farming families.',
  },
  {
    id: 8,
    badge: 'On Going',
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=800&auto=format&fit=crop',
    price: '$3,300', goal: '$9,000',
    author: { name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/40?img=20' },
    title: 'Women Empowerment',
    text: 'Skills training and micro-finance support to help women build sustainable livelihoods.',
  },
];

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
  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');
  menuToggle?.addEventListener('click', () => mainNav.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (mainNav?.classList.contains('open') &&
        !mainNav.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      mainNav.classList.remove('open');
    }
  });

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
