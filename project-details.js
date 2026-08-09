/**
 * project-detail.js
 * Reads ?id= from the URL, finds the matching project in projectsData,
 * populates the page, hands off to your map.js, and renders a strip
 * of other projects to explore.
 */
 
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const requestedId = Number(params.get('id'));
 
  const project = projectsData.find((p) => p.id === requestedId) || projectsData[0];
 
  if (!project) {
    document.getElementById('projectTitle').textContent = 'Project not found';
    return;
  }
 
  renderProject(project);
  renderMap(project);
  renderMoreProjects(project);
});
 
function renderProject(project) {
  // document.title = project.title;
 
  document.getElementById('projectTitle').textContent = project.title;
 
  const img = document.getElementById('projectImage');
  img.src = project.image;
  img.alt = project.title;
 
  document.getElementById('startDate').textContent = project.startDate;
  document.getElementById('endDate').textContent = project.endDate;
  document.getElementById('detailsBudget').textContent = project.budget;
 
  document.getElementById('country').textContent = project.country;
  document.getElementById('organization').textContent = project.organization;
  document.getElementById('locationBudget').textContent = project.budget;
 
  document.getElementById('projectDescription').textContent = project.description;
}
 
/**
 * Hands the map container off to your existing js/map.js.
 * Adjust the call below to match whatever map.js actually exposes —
 * this just tries a couple of common shapes and falls back to a
 * placeholder if map.js isn't wired up yet.
 */
function renderMap(project) {
  const container = document.getElementById('projectMap');
  const point = {
    lat: project.lat,
    lng: project.lng,
    name: project.title,
    location: project.location,
    country: project.country,
  };
 
  if (typeof window.initProjectMap === 'function') {
    // e.g. function initProjectMap(container, point) { ... }
    window.initProjectMap(container, point);
    return;
  }
 
  if (window.ProjectMap && typeof window.ProjectMap.render === 'function') {
    // e.g. ProjectMap.render(container, point)
    window.ProjectMap.render(container, point);
    return;
  }
 
  // Fallback so the layout still looks right before map.js is connected
  container.innerHTML = '<p class="map-fallback">Map</p>';
}
 
function renderMoreProjects(currentProject, count = 5) {
  const grid = document.getElementById('moreProjectsGrid');
 
  const others = projectsData
    .filter((p) => p.id !== currentProject.id)
    .slice(0, count);
 
  grid.innerHTML = others.map((p) => miniCardTemplate(p)).join('');
}
 
function miniCardTemplate(project) {
  const badgeClass = project.status === 'ongoing' ? 'mini-card__badge--ongoing' : 'mini-card__badge--completed';
  const badgeLabel = project.status === 'ongoing' ? 'Ongoing' : 'Completed';
 
  return `
    <a class="mini-card" href="project.html?id=${project.id}">
      <div class="mini-card__image">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
      </div>
      <div class="mini-card__body">
        <h3 class="mini-card__title">${project.title}</h3>
        <span class="mini-card__badge ${badgeClass}">${badgeLabel}</span>
      </div>
    </a>
  `;
}