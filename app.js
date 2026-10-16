// =============================================
//  ColocCI – Documentation App Logic
// =============================================

const DOCS = [
  { id: '01', title: 'Description du Problème' },
  { id: '02', title: 'Cahier des Charges Backend' },
  { id: '03', title: 'Cahier des Charges Frontend' },
  { id: '04', title: 'Algorithme de Matching' },
  { id: '05', title: 'Schéma Base de Données' },
  { id: '06', title: 'Routes Flask' },
  { id: '07', title: 'README du Projet' },
];

let current = 0;
let isDark = true;

// ── DOM refs ──
const sidebar      = document.getElementById('sidebar');
const overlay      = document.getElementById('overlay');
const menuBtn      = document.getElementById('menuBtn');
const sidebarClose = document.getElementById('sidebarClose');
const navPrev      = document.getElementById('navPrev');
const navNext      = document.getElementById('navNext');
const progressBar  = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const docCounter   = document.getElementById('docCounter');
const bcCurrent    = document.getElementById('bcCurrent');
const themeBtn     = document.getElementById('themeBtn');
const dots         = document.querySelectorAll('.dot');
const navItems     = document.querySelectorAll('.nav-item');
const docPages     = document.querySelectorAll('.doc-page');

// ── Navigate to a doc ──
function goTo(index) {
  if (index < 0 || index >= DOCS.length) return;

  // Deactivate current
  docPages[current].classList.remove('active');
  navItems[current].classList.remove('active');
  dots[current].classList.remove('active');

  current = index;

  // Activate new
  docPages[current].classList.add('active');
  navItems[current].classList.add('active');
  dots[current].classList.add('active');

  // Update UI
  updateUI();

  // Scroll to top
  document.querySelector('.content-wrap').scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close sidebar on mobile
  if (window.innerWidth <= 768) closeSidebar();
}

function updateUI() {
  const total = DOCS.length;
  const pct   = ((current + 1) / total) * 100;

  progressBar.style.width  = pct + '%';
  progressText.textContent = `${current + 1} / ${total}`;
  docCounter.textContent   = `${current + 1}/${total}`;
  bcCurrent.textContent    = DOCS[current].title;

  navPrev.disabled = current === 0;
  navNext.disabled = current === total - 1;
  navNext.textContent = current === total - 1 ? '' : '';

  // Reset next button label
  navNext.innerHTML = current === total - 1
    ? '<span class="nav-nav-label">Fin</span><span class="nav-arrow">✓</span>'
    : '<span class="nav-nav-label">Suivant</span><span class="nav-arrow">→</span>';

  // Scroll sidebar nav item into view
  navItems[current].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ── Sidebar toggle ──
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('show');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

menuBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// ── Nav buttons ──
navPrev.addEventListener('click', () => goTo(current - 1));
navNext.addEventListener('click', () => goTo(current + 1));

// ── Sidebar nav items ──
navItems.forEach((btn, i) => {
  btn.addEventListener('click', () => goTo(i));
});

// ── Dots ──
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => goTo(i));
});

// ── Keyboard navigation ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
});

// ── Theme toggle ──
themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
});

// ── Animate criteria bars on first view of doc 04 ──
const criteriaObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.crit-bar').forEach(bar => {
        bar.style.width = bar.style.width; // trigger repaint
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.criteria-visual').forEach(el => criteriaObserver.observe(el));

// ── Init ──
updateUI();

// Animate progress bar entrance
setTimeout(() => {
  progressBar.style.transition = 'width 0.6s ease';
}, 100);
