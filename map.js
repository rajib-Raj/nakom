/**
 * map.js — Leaflet project map (reusable component)
 *
 * Data now comes from the shared `projectsData` array in
 * js/projects-data.js instead of a separate copy here, so
 * projects.html, project-detail.html, and this map all read
 * from one source.
 *
 * Load order matters:
 *   <script src="js/projects-data.js"></script>
 *   <script src="js/map.js"></script>
 *   <script src="js/project-detail.js"></script>  (or whatever calls it)
 *
 * USAGE
 * -----
 * 1) Overview map with every project pinned — auto-initializes,
 *    no extra JS needed. Popups are ON by default (home page use):
 *      <div data-eco-map="all" style="height:480px"></div>
 *
 *    To show markers only, with no popup card (e.g. a mini "all
 *    projects" map embedded inside project-detail.html), add
 *    data-eco-map-popup="false":
 *      <div data-eco-map="all" data-eco-map-popup="false" style="height:300px"></div>
 *
 *    Same toggle works if you call it manually:
 *      ProjectMap.renderAll(el, { showPopup: false });
 *
 * 2) Single-project map (this is what project-detail.js calls):
 *      ProjectMap.render(containerEl, { lat, lng, name, location, status })
 *
 * Both modes expect Leaflet's JS + CSS already loaded on the page.
 */
 
// ── Marker colors / labels ──────────────────────────────────────
const STATUS_COLOR = {
  ongoing:   '#4caf6e',
  completed: '#f37b3d',
  hq:        '#102017',
};
 
const STATUS_LABEL = {
  ongoing:   'Ongoing',
  completed: 'Completed',
  hq:        'HQ',
};
 
// ── Custom DivIcon marker ───────────────────────────────────────
function createMarkerIcon(status) {
  const color = STATUS_COLOR[status] || STATUS_COLOR.ongoing;
  return L.divIcon({
    className: '',
    html: `
      <div class="eco-pin" style="--pin-color:${color}">
        <div class="eco-pin__dot"></div>
        <div class="eco-pin__pulse"></div>
      </div>`,
    iconSize:    [20, 20],
    iconAnchor:  [10, 10],
    popupAnchor: [0, -18],
  });
}
 
// ── Popup HTML for an overview-map pin ──────────────────────────
function buildPopup(p) {
  const statusLabel = STATUS_LABEL[p.status] || p.status;
  const finishLabel = p.status === 'ongoing' ? 'Ongoing' : (p.endDate || 'Completed');
 
  return `
    <div class="eco-popup">
      <div class="eco-popup__left">
        <span class="eco-popup__badge">${statusLabel}</span>
        <h3 class="eco-popup__title">${p.title}</h3>
        <div class="eco-popup__loc">
          <svg class="eco-popup__pin" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
          <span>${p.location}</span>
        </div>
        <div class="eco-popup__date">Start date: ${p.startDate || p.year}</div>
        <div class="eco-popup__date">Finish date: ${finishLabel}</div>
      </div>
      <div class="eco-popup__right">
        <p class="eco-popup__desc">${p.description || ''}</p>
        <a class="eco-popup__more" href="project.html?id=${p.id}">Read more</a>
      </div>
    </div>`;
}
 
// Supports either { lat, lng } (current projectsData shape) or a
// legacy { coords: [lat, lng] } shape, in case old data sneaks in.
function toLatLng(p) {
  if (Array.isArray(p.coords)) return p.coords;
  return [p.lat, p.lng];
}
 
// ── Shared tile layer setup ─────────────────────────────────────
function addBaseTiles(map, maxZoom) {
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: maxZoom || 11,
  }).addTo(map);
}
 
// Re-enable scroll-zoom only once the user is actively interacting
// with the map, so the page can still scroll normally otherwise.
function guardScrollZoom(mapEl, map) {
  mapEl.addEventListener('click', () => map.scrollWheelZoom.enable());
  mapEl.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());
}
 
/**
 * Renders every project as a pin on one map — the overview / "all
 * projects" map. Pulls from projectsData by default; pass a custom
 * `data` array via options to override.
 *
 * options.showPopup (default true) — when false, markers render
 * with no click/hover popup card at all (used on project-detail.html
 * so the mini map doesn't compete with the page's own project info).
 */
function renderAll(container, options = {}) {
  const mapEl = typeof container === 'string' ? document.getElementById(container) : container;
  if (!mapEl || typeof L === 'undefined') return null;
 
  const data = options.data || (typeof projectsData !== 'undefined' ? projectsData : []);
 
  // Falls back to the element's data-eco-map-popup attribute so the
  // auto-init pass (below) can opt individual maps out via markup
  // alone, with no JS call needed.
  const showPopup = options.showPopup !== undefined
    ? options.showPopup
    : mapEl.dataset.ecoMapPopup !== 'false';
 
  const map = L.map(mapEl, {
    center: options.center || [23.6850, 90.3563],
    zoom: options.zoom || 7,
    minZoom: options.minZoom || 6,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
  });
 
  addBaseTiles(map, 11);
 
  data.forEach((p) => {
    const coords = toLatLng(p);
    if (coords[0] == null || coords[1] == null) return;
 
    const marker = L.marker(coords, { icon: createMarkerIcon(p.status) });
 
    if (showPopup) {
      marker.bindPopup(buildPopup(p), { maxWidth: 280, className: 'eco-popup-wrap' });
      marker.on('mouseover', function () { this.openPopup(); });
    }
 
    marker.addTo(map);
  });
 
  guardScrollZoom(mapEl, map);
  return map;
}
 
/**
 * Renders a single pin centered on one project. This is the function
 * project-detail.js calls for the per-project "Map" box:
 *   ProjectMap.render(containerEl, { lat, lng, name, location, status })
 */
function renderSingle(container, point = {}) {
  const mapEl = typeof container === 'string' ? document.getElementById(container) : container;
  if (!mapEl) return null;
 
  if (typeof L === 'undefined' || point.lat == null || point.lng == null) {
    mapEl.innerHTML = '<p class="map-fallback">Map unavailable</p>';
    return null;
  }
 
  const map = L.map(mapEl, {
    center: [point.lat, point.lng],
    zoom: 10,
    minZoom: 4,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
  });
 
  addBaseTiles(map, 15);
 
  const marker = L.marker([point.lat, point.lng], {
    icon: createMarkerIcon(point.status || 'ongoing'),
  }).addTo(map);
 
  if (point.showPopup && point.name) {
    marker
      .bindPopup(`
        <div class="eco-popup eco-popup--compact">
          <h3 class="eco-popup__title">${point.name}</h3>
          ${point.location ? `<div class="eco-popup__loc">${point.location}</div>` : ''}
        </div>
      `)
      .openPopup();
  }
 
  guardScrollZoom(mapEl, map);
  return map;
}
 
// ── Public API ───────────────────────────────────────────────────
window.ProjectMap = {
  renderAll,
  render: renderSingle,
};
 
// ── Auto-init any overview maps declared via data attribute ──────
// Doesn't touch single-project maps — those are rendered explicitly
// by whichever page calls ProjectMap.render(), e.g. project-detail.js.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-eco-map="all"]').forEach((el) => renderAll(el));
});