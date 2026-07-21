/**
 * map.js — Leaflet project map
 * Custom markers, popups, and project data
 * All project locations and descriptions live in the `projects` array below.
 * To add a new pin: push an object into `projects` and reload.
 */

// ── Project data ────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    name: 'Sundarbans Biodiversity Conservation Project (SBCP)',
    location: 'সাতক্ষীরা',
    status: 'active',
    coords: [22.714290, 89.074379],
    description: 'Delivering safe drinking water to 12 rural villages using solar-powered pumping systems.',
    impact: '18,000 people served',
    year: 2021,
  },
  {
    id: 2,
    name: 'Education for All',
    location: 'Dhaka, Bangladesh',
    status: 'active',
    coords: [23.8103, 90.4125],
    description: 'Building 14 community schools and training 60 local teachers in underserved districts.',
    impact: '3,400 children enrolled',
    year: 2022,
  },
  {
    id: 3,
    name: 'Biodiversity Study and Impact Assessment of the Sea Ports in Khulna Area and Sundarbans and Noapara in Relation to Coal Transportation EIA/ESIA Project',
    location: 'যশোর',
    status: 'completed',
    coords: [23.163421, 89.207733],
    description: 'Mobile clinic program providing essential healthcare to isolated highland communities.',
    impact: '9,200 patients treated',
    year: 2020,
  },
  {
    id: 4,
    name: 'Detailed Feasibility Study and Pilot Run of Slaughterhouse Waste-Based Biogas Plant in Bangladesh.',
    location: 'ফরিদপুর',
    status: 'active',
    coords: [23.603319, 89.832271],
    description: 'Agricultural training and seed distribution to 800 small-scale farming families.',
    impact: '4,800 families fed',
    year: 2023,
  },
  {
    id: 5,
    name: 'Ecological assessment component of the Phulbari Coal Mine EIA/ESIA Project',
    location: 'ঠাকুরগাঁও',
    status: 'active',
    coords: [26.028064, 88.478716],
    description: 'Micro-finance loans and skills training for women-led businesses in rural Andean communities.',
    impact: '620 women supported',
    year: 2022,
  },
  {
    id: 6,
    name: 'Econet Headquarters',
    location: 'Manchester, USA',
    status: 'hq',
    coords: [42.9956, -71.4548],
    description: 'Global coordination hub for all Econet programs and volunteer networks.',
    impact: 'Since 1998',
    year: 1998,
  },
  {
    id: 7,
    name: 'Solar Energy Access',
    location: 'Mumbai, India',
    status: 'active',
    coords: [19.0760, 72.8777],
    description: 'Installing solar micro-grids in 30 off-grid villages, replacing kerosene lamps.',
    impact: '6,500 households electrified',
    year: 2023,
  },
  {
    id: 8,
    name: 'Reforestation Drive',
    location: 'São Paulo, Brazil',
    status: 'completed',
    coords: [-23.5505, -46.6333],
    description: 'Planted 500,000 native trees in degraded Atlantic Forest areas with local communities.',
    impact: '500K trees planted',
    year: 2021,
  },
];

// ── Marker colors ────────────────────────────────────────────────
const STATUS_COLOR = {
  active:    '#4caf6e',
  completed: '#f37b3d',
  hq:        '#102017',
};

// ── Create a custom DivIcon marker ──────────────────────────────
function createMarker(status) {
  const color = STATUS_COLOR[status] || STATUS_COLOR.active;
  return L.divIcon({
    className: '',   // clear default leaflet class
    html: `
      <div class="eco-pin" style="--pin-color:${color}">
        <div class="eco-pin__dot"></div>
        <div class="eco-pin__pulse"></div>
      </div>`,
    iconSize:   [32, 32],
    iconAnchor: [16, 16],   // center of dot
    popupAnchor:[0, -18],   // popup appears above dot
  });
}

// ── Build popup HTML ─────────────────────────────────────────────
function buildPopup(p) {
  const statusLabel = { active: 'Active', completed: 'Completed', hq: 'HQ' }[p.status] || p.status;
  const color = STATUS_COLOR[p.status];
  return `
    <div class="eco-popup">
      <div class="eco-popup__header" style="background:${color}">
        <span class="eco-popup__status">${statusLabel}</span>
        <strong class="eco-popup__name">${p.name}</strong>
        <small class="eco-popup__loc">📍 ${p.location}</small>
      </div>
      <div class="eco-popup__body">
        <p class="eco-popup__desc">${p.description}</p>
        <div class="eco-popup__meta">
          <span>🌍 ${p.impact}</span>
          <span>📅 Since ${p.year}</span>
        </div>
      </div>
    </div>`;
}

// ── Init map ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('projectMap');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('projectMap', {
    center: [23.6850, 90.3563],
    zoom: 7,
    minZoom:6,
    zoomControl: true,
    scrollWheelZoom: false,   // prevent page-scroll hijack
    attributionControl: true,
  });

  // Tile layer — clean light style
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // Drop markers
  projects.forEach(p => {
    const marker = L.marker(p.coords, { icon: createMarker(p.status) });

    marker.bindPopup(buildPopup(p), {
      maxWidth: 280,
      className: 'eco-popup-wrap',
    });

    // Open on hover, keep open on click
    marker.on('mouseover', function () { this.openPopup(); });
    marker.on('mouseout',  function () { this.closePopup(); });
    marker.addTo(map);
  });

  // Re-enable scroll zoom when user clicks inside map
  mapEl.addEventListener('click', () => map.scrollWheelZoom.enable());
  mapEl.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());
});
