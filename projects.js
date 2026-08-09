/**
 * projects.js
 * Renders project cards from projectsData and wires up:
 *  - top status pills (all / ongoing / completed)  -> single-select
 *  - sidebar location checkboxes                   -> multi-select (OR)
 *  - sidebar year checkboxes                        -> multi-select (OR)
 * All active filters combine with AND across groups.
 */
 
class ProjectsFilter {
  constructor(data, els) {
    this.data = data;
    this.grid = els.grid;
    this.noResults = els.noResults;
    this.locationList = els.locationList;
    this.yearList = els.yearList;
    this.clearBtn = els.clearBtn;
    this.statusButtons = els.statusButtons;
 
    this.state = {
      status: 'all',
      locations: new Set(),
      years: new Set(),
    };
 
    this.init();
  }
 
  init() {
    this.renderFilterList(this.locationList, this.getUniqueCounts('location'), 'location');
    this.renderFilterList(this.yearList, this.getUniqueCounts('year'), 'year');
    this.bindStatusButtons();
    this.bindCheckboxes();
    this.bindClearButton();
    this.render();
  }
 
  // Build a Map of value -> count for a given field, sorted sensibly
  getUniqueCounts(field) {
    const counts = new Map();
    this.data.forEach((project) => {
      const value = project[field];
      counts.set(value, (counts.get(value) || 0) + 1);
    });
 
    const sorted = [...counts.entries()].sort((a, b) => {
      return field === 'year' ? b[0] - a[0] : String(a[0]).localeCompare(String(b[0]));
    });
 
    return sorted;
  }
 
  renderFilterList(listEl, entries, type) {
    listEl.innerHTML = entries.map(([value, count]) => `
      <li>
        <label class="filter-option">
          <span class="filter-option__label">
            <input type="checkbox" data-filter-type="${type}" value="${value}">
            ${value}
          </span>
          <span class="filter-option__count">(${count})</span>
        </label>
      </li>
    `).join('');
  }
 
  bindStatusButtons() {
    this.statusButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.statusButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        this.state.status = btn.dataset.status;
        this.render();
      });
    });
  }
 
  bindCheckboxes() {
    [this.locationList, this.yearList].forEach((listEl) => {
      listEl.addEventListener('change', (e) => {
        const input = e.target;
        if (input.type !== 'checkbox') return;
 
        const type = input.dataset.filterType;
        const targetSet = type === 'location' ? this.state.locations : this.state.years;
        const value = type === 'year' ? Number(input.value) : input.value;
 
        if (input.checked) {
          targetSet.add(value);
        } else {
          targetSet.delete(value);
        }
        this.render();
      });
    });
  }
 
  bindClearButton() {
    this.clearBtn.addEventListener('click', () => {
      this.state.locations.clear();
      this.state.years.clear();
      this.state.status = 'all';
 
      this.statusButtons.forEach((b) => {
        b.classList.toggle('is-active', b.dataset.status === 'all');
        b.setAttribute('aria-selected', b.dataset.status === 'all' ? 'true' : 'false');
      });
      [...this.locationList.querySelectorAll('input'), ...this.yearList.querySelectorAll('input')]
        .forEach((input) => { input.checked = false; });
 
      this.render();
    });
  }
 
  getFilteredProjects() {
    return this.data.filter((project) => {
      const statusMatch = this.state.status === 'all' || project.status === this.state.status;
      const locationMatch = this.state.locations.size === 0 || this.state.locations.has(project.location);
      const yearMatch = this.state.years.size === 0 || this.state.years.has(project.year);
      return statusMatch && locationMatch && yearMatch;
    });
  }
 
  cardTemplate(project) {
    const badgeClass = project.status === 'ongoing' ? 'badge--ongoing' : 'badge--completed';
    const badgeLabel = project.status === 'ongoing' ? 'Ongoing' : 'Completed';
 
    return `
      <article class="project-card" data-id="${project.id}">
        <div class="card-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-title">${project.title}</h3>
          <span class="badge ${badgeClass}">${badgeLabel}</span>
          <div class="card-meta">
            <p class="card-meta__text">
              <strong>Location:</strong> ${project.location}<br>
              <strong>Start date:</strong> ${project.startDate}
            </p>
            <button type="button" class="view-btn" data-view-id="${project.id}">View</button>
          </div>
        </div>
      </article>
    `;
  }
 
  render() {
    const filtered = this.getFilteredProjects();
 
    this.grid.innerHTML = filtered.map((p) => this.cardTemplate(p)).join('');
    this.noResults.hidden = filtered.length !== 0;
 
    const hasActiveFilters = this.state.locations.size > 0 || this.state.years.size > 0 || this.state.status !== 'all';
    this.clearBtn.hidden = !hasActiveFilters;
  }
}
 
// ---- Bootstrap ----
document.addEventListener('DOMContentLoaded', () => {
  const filter = new ProjectsFilter(projectsData, {
    grid: document.getElementById('projectsGrid'),
    noResults: document.getElementById('noResults'),
    locationList: document.getElementById('locationFilterList'),
    yearList: document.getElementById('yearFilterList'),
    clearBtn: document.getElementById('clearFiltersBtn'),
    statusButtons: document.querySelectorAll('.status-btn'),
  });
 
  // Hook "View" buttons up to your project-detail page/route
  document.getElementById('projectsGrid').addEventListener('click', (e) => {
    const viewBtn = e.target.closest('[data-view-id]');
    if (!viewBtn) return;
    const id = viewBtn.dataset.viewId;
    window.location.href = `project.html?id=${id}`;
  });
});


// new home


document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('projectsGrid');
  if (!grid || typeof projectsData === 'undefined') return;
 
  const CARD_COUNT = 8; // 4 columns x 2 rows on desktop, see CSS
 
  const cards = projectsData.slice(0, CARD_COUNT);
  grid.innerHTML = cards.map(homeCardTemplate).join('');
});
 
function homeCardTemplate(project) {
  const badgeClass = project.status === 'ongoing' ? 'badge--ongoing' : 'badge--completed';
  const badgeLabel = project.status === 'ongoing' ? 'Ongoing' : 'Completed';
 
  return `
    <article class="project-card">
      <div class="card-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
      </div>
      <div class="card-body">
        <h3 class="card-title">${project.title}</h3>
        <span class="badge ${badgeClass}">${badgeLabel}</span>
        <div class="card-meta">
          <p class="card-meta__text">
            <strong>Location:</strong> ${project.location}<br>
            <strong>Start date:</strong> ${project.startDate}
          </p>
          <a class="view-btn" href="project.html?id=${project.id}">View</a>
        </div>
      </div>
    </article>
  `;
}