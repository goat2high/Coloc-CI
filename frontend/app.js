/* ═══════════════════════════════════════════════════════
   ColocCI – Frontend SPA
   Plateforme de Colocation – Côte d'Ivoire 🇨🇮
   ═══════════════════════════════════════════════════════ */

'use strict';

// ── CONFIG ────────────────────────────────────────────
const API_BASE = 'http://localhost:5000';

// ── MOCK DATA (demo mode when API is offline) ─────────
const MOCK = {
  listings: [
    {
      id: 1, title: 'Chambre meublée à Cocody Angré – Résidence moderne',
      city: 'Abidjan', neighborhood: 'Cocody',
      rent: 85000, charges: 10000,
      room_type: 'Privée', bathroom_type: 'Partagée',
      furnished: true, wifi: true, smoking_allowed: false, pets_allowed: false,
      lifestyle: 'calme', available_from: '2024-11-01',
      description: 'Belle chambre lumineuse dans un appartement moderne au cœur de Cocody. Accès sécurisé, eau courante et électricité incluses. Quartier calme, proche des transports et commerces. Idéal pour étudiant ou jeune professionnel sérieux.',
      compatibility_score: 87,
      score_details: { budget: 100, quartier: 70, mode_vie: 90, fumeur: 100, animaux: 100, type_chambre: 100 },
      photos: [], owner: { id: 2, first_name: 'Kouamé', last_name: 'A.', age: 27 }
    },
    {
      id: 2, title: 'Studio partagé au Plateau – Vue panoramique',
      city: 'Abidjan', neighborhood: 'Plateau',
      rent: 120000, charges: 15000,
      room_type: 'Privée', bathroom_type: 'Privée',
      furnished: true, wifi: true, smoking_allowed: false, pets_allowed: true,
      lifestyle: 'social', available_from: '2024-10-15',
      description: 'Superbe studio en colocation au Plateau avec vue dégagée. Appartement au 8ᵉ étage, entièrement meublé, connexion fibre incluse. Colocation mixte, atmosphère conviviale.',
      compatibility_score: 72,
      score_details: { budget: 50, quartier: 100, mode_vie: 70, fumeur: 100, animaux: 70, type_chambre: 100 },
      photos: [], owner: { id: 3, first_name: 'Aya', last_name: 'K.', age: 24 }
    },
    {
      id: 3, title: 'Chambre spacieuse à Yopougon – Résidence sécurisée',
      city: 'Abidjan', neighborhood: 'Yopougon',
      rent: 55000, charges: 8000,
      room_type: 'Partagée', bathroom_type: 'Partagée',
      furnished: false, wifi: false, smoking_allowed: false, pets_allowed: false,
      lifestyle: 'calme', available_from: '2024-11-01',
      description: 'Grande chambre dans une villa sécurisée à Yopougon. Espace vert, parking disponible. Cherche colocataire sérieux et respectueux.',
      compatibility_score: 58,
      score_details: { budget: 100, quartier: 30, mode_vie: 90, fumeur: 100, animaux: 100, type_chambre: 0 },
      photos: [], owner: { id: 4, first_name: 'Serge', last_name: 'D.', age: 30 }
    },
    {
      id: 4, title: 'Chambre meublée à Marcory Zone 4 – Centre-ville',
      city: 'Abidjan', neighborhood: 'Marcory',
      rent: 70000, charges: 12000,
      room_type: 'Privée', bathroom_type: 'Partagée',
      furnished: true, wifi: true, smoking_allowed: false, pets_allowed: false,
      lifestyle: 'mixte', available_from: '2024-10-20',
      description: 'Chambre meublée dans un appartement 3 pièces à Marcory Zone 4. Proche de la lagune, commerces et restaurants. Parfait pour jeune professionnel.',
      compatibility_score: 81,
      score_details: { budget: 100, quartier: 70, mode_vie: 70, fumeur: 100, animaux: 100, type_chambre: 100 },
      photos: [], owner: { id: 5, first_name: 'Marie', last_name: 'T.', age: 26 }
    },
    {
      id: 5, title: 'Chambre privée dans villa à la Riviera – Très calme',
      city: 'Abidjan', neighborhood: 'Riviera',
      rent: 95000, charges: 15000,
      room_type: 'Privée', bathroom_type: 'Privée',
      furnished: true, wifi: true, smoking_allowed: false, pets_allowed: false,
      lifestyle: 'calme', available_from: '2024-12-01',
      description: 'Belle chambre privée avec salle de bain dans une villa calme à la Riviera. Jardin privatif, sécurité 24h/24. Colocation avec un couple de professionnels.',
      compatibility_score: 91,
      score_details: { budget: 80, quartier: 100, mode_vie: 100, fumeur: 100, animaux: 100, type_chambre: 100 },
      photos: [], owner: { id: 6, first_name: 'Brice', last_name: 'N.', age: 32 }
    },
    {
      id: 6, title: 'Chambre étudiante à Bouaké – Proche campus universitaire',
      city: 'Bouaké', neighborhood: 'Commerce',
      rent: 35000, charges: 5000,
      room_type: 'Partagée', bathroom_type: 'Partagée',
      furnished: false, wifi: false, smoking_allowed: false, pets_allowed: false,
      lifestyle: 'social', available_from: '2024-10-01',
      description: "Chambre étudiante à 5 min du campus. Groupe d'étudiants accueillants. Prix très abordable.",
      compatibility_score: 65,
      score_details: { budget: 100, quartier: 0, mode_vie: 20, fumeur: 100, animaux: 100, type_chambre: 0 },
      photos: [], owner: { id: 7, first_name: 'Francis', last_name: 'O.', age: 21 }
    }
  ],
  conversations: [
    { partner_id: 2, partner_name: 'Kouamé A.', last_message: 'Bonjour, la chambre est-elle encore disponible ?', last_time: '14:32', unread: 2 },
    { partner_id: 3, partner_name: 'Aya K.', last_message: 'Oui, vous pouvez visiter samedi matin', last_time: 'Hier', unread: 0 }
  ],
  messages: {
    2: [
      { id: 1, sender_id: 2, content: 'Bonjour ! Je suis intéressé par votre chambre à Cocody.', created_at: '2024-10-15T10:00:00Z' },
      { id: 2, sender_id: 1, content: 'Bonjour ! Oui, elle est encore disponible. Voulez-vous visiter ?', created_at: '2024-10-15T10:05:00Z' },
      { id: 3, sender_id: 2, content: 'Bonjour, la chambre est-elle encore disponible ?', created_at: '2024-10-15T14:32:00Z' }
    ]
  },
  notifications: [
    { id: 1, message: 'Kouamé A. vous a envoyé un message', type: 'message', is_read: false, created_at: '2024-10-15T14:32:00Z' },
    { id: 2, message: 'Votre annonce "Chambre à Cocody" a bien été publiée', type: 'listing', is_read: false, created_at: '2024-10-14T09:15:00Z' },
    { id: 3, message: 'Nouvelle correspondance à 91% avec votre profil !', type: 'match', is_read: true, created_at: '2024-10-13T16:00:00Z' }
  ]
};

// ── STATE ─────────────────────────────────────────────
const state = {
  demoMode: false,
  currentPartnerId: null,
  favorites: new Set(),
  allListings: []
};

// ── LOCAL STORAGE ─────────────────────────────────────
const getToken = () => localStorage.getItem('colocci_token');
const setToken = t => localStorage.setItem('colocci_token', t);
const getUser  = () => { try { return JSON.parse(localStorage.getItem('colocci_user')); } catch { return null; } };
const setUser  = u => localStorage.setItem('colocci_user', JSON.stringify(u));
const clearAuth = () => { localStorage.removeItem('colocci_token'); localStorage.removeItem('colocci_user'); };
const isLoggedIn = () => !!(getToken() && getUser());

// ── API CLIENT ────────────────────────────────────────
async function api(method, path, body = null) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body)  headers['Content-Type'] = 'application/json';
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method, headers,
      body: body ? JSON.stringify(body) : null
    });
    if (res.status === 204) return {};
    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    return data;
  } catch (err) {
    if (err && err.status) throw err;
    // Network/CORS error → demo mode
    state.demoMode = true;
    throw { status: 0, data: { error: 'API indisponible' } };
  }
}

// ── HELPERS ───────────────────────────────────────────
function formatPrice(n) {
  return new Intl.NumberFormat('fr-CI').format(n || 0) + ' FCFA';
}
function formatDate(s) {
  if (!s) return '';
  return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function timeAgo(s) {
  if (!s) return '';
  const diff = Date.now() - new Date(s).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Hier';
  if (d < 7)   return `Il y a ${d} jours`;
  return formatDate(s);
}
function initials(f, l) { return ((f || '?')[0] + (l || '?')[0]).toUpperCase(); }
function scoreColor(s)  { return s >= 80 ? '#3FB950' : s >= 60 ? '#F5A623' : '#F85149'; }
function scoreCls(s)    { return s >= 80 ? 'high' : s >= 60 ? 'mid' : 'low'; }
function scoreLabel(s)  { return s >= 80 ? '🟢 Excellente' : s >= 60 ? '🟡 Bonne' : '🔴 Faible'; }

// ── SCORE RING ────────────────────────────────────────
function ScoreRing(score, size) {
  const r = 42, circ = 2 * Math.PI * r;
  const dash = ((score || 0) / 100 * circ).toFixed(1);
  const color = scoreColor(score);
  const cls = size === 'lg' ? 'score-ring lg' : 'score-ring';
  return `<svg class="${cls}" viewBox="0 0 100 100" aria-label="Score ${score}%">
    <circle class="track" cx="50" cy="50" r="${r}"/>
    <circle class="fill" cx="50" cy="50" r="${r}" stroke="${color}"
      stroke-dasharray="${dash} ${circ.toFixed(1)}" stroke-dashoffset="0"/>
    <text class="ring-text" x="50" y="50">${score}%</text>
  </svg>`;
}

// ── SKELETON ──────────────────────────────────────────
function SkeletonCards(n) {
  return Array(n).fill('<div class="skeleton skeleton-card"></div>').join('');
}

// ── LISTING CARD ──────────────────────────────────────
function ListingCard(l, showScore) {
  const score = l.compatibility_score;
  const isFav = state.favorites.has(l.id);
  const hasPhoto = l.photos && l.photos.length > 0;

  const photoHtml = hasPhoto
    ? `<img src="${API_BASE}/uploads/${l.photos[0]}" alt="${l.title}" loading="lazy">`
    : `<div class="listing-photo-placeholder"><span>🏠</span><span>Aucune photo</span></div>`;

  const scoreBadge = (showScore && score != null)
    ? `<div class="listing-score-badge ${scoreCls(score)}">⚡ ${score}% compat.</div>` : '';

  const tags = [];
  if (l.furnished) tags.push('Meublé');
  if (l.wifi)      tags.push('Wi-Fi');
  if (l.room_type === 'Privée') tags.push('🚪 Privée'); else if (l.room_type) tags.push('🛏 Partagée');
  if (!l.smoking_allowed) tags.push('🚭 Non-fumeur');

  return `<div class="listing-card" role="article" onclick="navigate('#/annonce/${l.id}')">
    <div class="listing-photo">
      ${photoHtml}
      ${scoreBadge}
      <button class="listing-fav-btn ${isFav ? 'active' : ''}"
        onclick="event.stopPropagation();toggleFavorite(${l.id},this)"
        title="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
        aria-label="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
        ${isFav ? '❤️' : '🤍'}
      </button>
    </div>
    <div class="listing-body">
      <div class="listing-title">${l.title}</div>
      <div class="listing-location">📍 ${l.neighborhood}, ${l.city}</div>
      <div class="listing-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="listing-price">${formatPrice(l.rent)} <span>/ mois + ${formatPrice(l.charges || 0)} charges</span></div>
    </div>
    <div class="listing-footer">
      <div class="listing-owner">
        <div class="owner-avatar">${initials(l.owner?.first_name, l.owner?.last_name)}</div>
        <span>${l.owner?.first_name || 'Anonyme'} · ${l.owner?.age || '?'} ans</span>
      </div>
      ${(showScore && score != null)
        ? `<div style="flex-shrink:0">${ScoreRing(score)}</div>` : ''}
    </div>
  </div>`;
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg, type = 'info', ms = 4000) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(16px)';
    setTimeout(() => el.remove(), 350);
  }, ms);
}

// ── DEMO MODE BANNER ──────────────────────────────────
function showDemoBanner() {
  if (document.getElementById('demo-banner')) return;
  const b = document.createElement('div');
  b.id = 'demo-banner';
  b.style.cssText = `
    position:fixed;bottom:0;left:0;right:0;z-index:150;
    background:linear-gradient(90deg,#0D9E73,#F5A623);
    color:white;text-align:center;padding:8px 16px;
    font-size:0.8rem;font-weight:600;
    display:flex;align-items:center;justify-content:center;gap:12px;
  `;
  b.innerHTML = `<span>🎭 Mode démo – API hors ligne. Données d'exemple affichées.</span>
    <button onclick="this.parentElement.remove()" style="background:rgba(255,255,255,0.22);border:none;color:white;padding:2px 10px;border-radius:12px;cursor:pointer;font-size:0.75rem">✕</button>`;
  document.body.appendChild(b);
}

// ── NAVBAR ────────────────────────────────────────────
function renderNavbar() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const hash = window.location.hash || '#/';

  const authSection = loggedIn ? `
    <button class="nav-icon-btn" onclick="navigate('#/messages')" title="Messages" aria-label="Messages">💬</button>
    <button class="nav-icon-btn" onclick="navigate('#/notifications')" title="Notifications" aria-label="Notifications">🔔</button>
    <div style="position:relative">
      <div class="avatar-btn" id="user-avatar-btn" onclick="toggleUserMenu()" title="${user?.first_name}"
        aria-haspopup="true" aria-expanded="false">
        ${initials(user?.first_name, user?.last_name)}
      </div>
      <div id="user-menu" role="menu" style="display:none;position:absolute;top:calc(100% + 8px);right:0;
        background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-md);
        min-width:185px;overflow:hidden;box-shadow:var(--shadow-lg);z-index:200;">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border)">
          <div style="font-weight:600;font-size:0.875rem">${user?.first_name} ${user?.last_name}</div>
          <div style="font-size:0.73rem;color:var(--text-3)">${user?.email || ''}</div>
        </div>
        ${[
          ['#/profil', '👤 Mon profil'],
          ['#/mes-annonces', '🏠 Mes annonces'],
          ['#/favoris', '❤️ Favoris'],
          ['#/messages', '💬 Messages'],
        ].map(([href,lbl]) => `<a href="${href}" role="menuitem" onclick="closeUserMenu()"
          style="display:block;padding:10px 16px;font-size:0.875rem;color:var(--text-1);
          transition:background 0.15s" onmouseover="this.style.background='var(--bg-3)'"
          onmouseout="this.style.background=''">${lbl}</a>`).join('')}
        <div style="border-top:1px solid var(--border)">
          <button role="menuitem" onclick="doLogout()" style="display:block;width:100%;
            padding:10px 16px;font-size:0.875rem;color:var(--score-low);text-align:left;
            transition:background 0.15s" onmouseover="this.style.background='var(--bg-3)'"
            onmouseout="this.style.background=''">🚪 Déconnexion</button>
        </div>
      </div>
    </div>` : `
    <button class="btn btn-ghost btn-sm" onclick="navigate('#/login')">Connexion</button>
    <button class="btn btn-primary btn-sm" onclick="navigate('#/register')">Inscription</button>`;

  document.getElementById('navbar').innerHTML = `
    <nav class="navbar" role="navigation" aria-label="Navigation principale">
      <div class="navbar-inner">
        <div class="navbar-logo" onclick="navigate('#/')" role="link" tabindex="0" aria-label="ColocCI – Accueil">
          <div class="logo-icon" aria-hidden="true">🏘</div>
          Coloc<span class="ci">CI</span>
        </div>
        <div class="navbar-links" role="list">
          <span class="nav-link ${hash==='#/'?'active':''}" role="listitem" onclick="navigate('#/')" tabindex="0">Accueil</span>
          <span class="nav-link ${hash.startsWith('#/annonces')?'active':''}" role="listitem" onclick="navigate('#/annonces')" tabindex="0">Annonces</span>
          ${loggedIn ? `<span class="nav-link ${hash==='#/publier'?'active':''}" role="listitem" onclick="navigate('#/publier')" tabindex="0">+ Publier</span>` : ''}
        </div>
        <div class="navbar-spacer"></div>
        <div class="navbar-actions">${authSection}</div>
      </div>
    </nav>`;
}

function toggleUserMenu() {
  const m = document.getElementById('user-menu');
  const b = document.getElementById('user-avatar-btn');
  if (!m) return;
  const open = m.style.display === 'none';
  m.style.display = open ? 'block' : 'none';
  if (b) b.setAttribute('aria-expanded', open.toString());
}
function closeUserMenu() {
  const m = document.getElementById('user-menu');
  if (m) m.style.display = 'none';
}
document.addEventListener('click', e => {
  const m = document.getElementById('user-menu');
  const b = document.getElementById('user-avatar-btn');
  if (m && b && !b.contains(e.target) && !m.contains(e.target)) closeUserMenu();
});

function doLogout() {
  clearAuth();
  state.demoMode = false;
  state.favorites = new Set();
  closeUserMenu();
  const banner = document.getElementById('demo-banner');
  if (banner) banner.remove();
  renderNavbar();
  navigate('#/');
  showToast('Déconnecté avec succès', 'info');
}

// ── FAVORITES ─────────────────────────────────────────
async function loadFavorites() {
  try {
    const d = await api('GET', '/api/favorites');
    const list = d.favorites || d;
    state.favorites = new Set((list || []).map(f => Number(f.listing_id || f.id)));
  } catch {
    if (state.demoMode) state.favorites = new Set([4]);
  }
}

async function toggleFavorite(id, btn) {
  if (!isLoggedIn()) { showToast('Connectez-vous pour ajouter aux favoris', 'info'); return; }
  const was = state.favorites.has(id);
  try {
    if (was) {
      await api('DELETE', `/api/favorites/${id}`);
      state.favorites.delete(id);
    } else {
      await api('POST', `/api/favorites/${id}`);
      state.favorites.add(id);
    }
  } catch {
    if (state.demoMode) {
      was ? state.favorites.delete(id) : state.favorites.add(id);
    } else { return; }
  }
  const now = state.favorites.has(id);
  if (btn) { btn.innerHTML = now ? '❤️' : '🤍'; btn.classList.toggle('active', now); }
  showToast(now ? 'Ajouté aux favoris !' : 'Retiré des favoris', now ? 'success' : 'info');
}

// ── ROUTER ────────────────────────────────────────────
function navigate(hash) { window.location.hash = hash; }

function setView(html) {
  const main = document.getElementById('main');
  main.innerHTML = html;
  main.classList.remove('fade-in');
  void main.offsetWidth;
  main.classList.add('fade-in');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderNavbar();
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  const routes = [
    { re: /^#\/$/, fn: renderHome },
    { re: /^#\/annonces$/, fn: renderListings },
    { re: /^#\/annonce\/(\d+)$/, fn: m => renderListingDetail(m[1]) },
    { re: /^#\/login$/, fn: renderLogin },
    { re: /^#\/register$/, fn: renderRegister },
    { re: /^#\/profil$/, fn: renderProfile, auth: true },
    { re: /^#\/publier$/, fn: renderPublish, auth: true },
    { re: /^#\/mes-annonces$/, fn: renderMyListings, auth: true },
    { re: /^#\/favoris$/, fn: renderFavorites, auth: true },
    { re: /^#\/messages$/, fn: () => renderMessages(null), auth: true },
    { re: /^#\/messages\/(\d+)$/, fn: m => renderMessages(m[1]), auth: true },
    { re: /^#\/notifications$/, fn: renderNotifications, auth: true }
  ];
  for (const r of routes) {
    const m = hash.match(r.re);
    if (m) {
      if (r.auth && !isLoggedIn()) {
        navigate('#/login');
        showToast('Connexion requise', 'info');
        return;
      }
      r.fn(m);
      return;
    }
  }
  renderNotFound();
}

window.addEventListener('hashchange', handleRoute);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeUserMenu();
});

// ═══════════════════════════════════════════════════════
//  PAGES
// ═══════════════════════════════════════════════════════

// ── HOME ──────────────────────────────────────────────
async function renderHome() {
  setView(`
    <section class="hero">
      <div class="hero-bg"></div><div class="hero-grid"></div>
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center">
          <div class="hero-content">
            <div class="hero-eyebrow">🇨🇮 Plateforme de colocation #1 en Côte d'Ivoire</div>
            <h1 class="hero-title">
              Trouve ta <span class="accent">colocation idéale</span><br>en toute confiance
            </h1>
            <p class="hero-subtitle">
              ColocCI connecte étudiants et jeunes professionnels ivoiriens avec des colocataires compatibles grâce à notre algorithme de matching intelligent.
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" onclick="navigate('#/annonces')">🔍 Chercher une coloc</button>
              <button class="btn btn-outline btn-lg" onclick="navigate('${isLoggedIn()?'#/publier':'#/register'}')">+ Publier une annonce</button>
            </div>
            <div class="hero-stats">
              <div class="hero-stat"><div class="hero-stat-num">500<span class="unit">+</span></div><div class="hero-stat-label">Annonces actives</div></div>
              <div class="hero-stat"><div class="hero-stat-num">2k<span class="unit">+</span></div><div class="hero-stat-label">Utilisateurs</div></div>
              <div class="hero-stat"><div class="hero-stat-num">87<span class="unit">%</span></div><div class="hero-stat-label">Satisfaction</div></div>
            </div>
          </div>
          <div class="hero-cards" aria-hidden="true">
            <div class="hero-card">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
                <div class="owner-avatar" style="width:38px;height:38px;font-size:0.8rem">KA</div>
                <div>
                  <div style="font-weight:600;font-size:0.85rem">Chambre à Cocody Angré</div>
                  <div style="font-size:0.72rem;color:var(--text-3)">85 000 FCFA / mois</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <span class="badge badge-green">🟢 87% compat.</span>
                <span style="font-size:1.2rem">🏠</span>
              </div>
            </div>
            <div class="hero-card">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
                ${ScoreRing(91)}
                <div>
                  <div style="font-weight:700;font-size:0.95rem">Score de matching</div>
                  <div style="font-size:0.72rem;color:var(--score-high)">Excellente compatibilité !</div>
                </div>
              </div>
              <div style="font-size:0.72rem;color:var(--text-3)">Budget · Quartier · Mode de vie</div>
            </div>
            <div class="hero-card">
              <div style="font-size:0.72rem;color:var(--text-3);margin-bottom:8px">💬 Nouveau message</div>
              <div style="font-size:0.875rem;color:var(--text-1)">"La chambre est disponible, quand pouvez-vous visiter ?"</div>
              <div style="font-size:0.7rem;color:var(--green);margin-top:8px">Aya K. · il y a 2 min</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="border-top:1px solid var(--border)">
      <div class="container">
        <div class="section-header">
          <div class="section-eyebrow">Pourquoi ColocCI ?</div>
          <h2>Tout ce qu'il vous faut pour trouver la colocation parfaite</h2>
        </div>
        <div class="features-grid">
          ${[
            ['⚡','Algorithme de matching','Notre IA analyse vos critères (budget, quartier, mode de vie) pour calculer un score de compatibilité de 0 à 100 % sur chaque annonce.'],
            ['🔒','Plateforme sécurisée','Profils vérifiés, messagerie intégrée et signalement pour éviter les arnaques fréquentes sur les groupes Facebook et WhatsApp.'],
            ['🔍','Recherche avancée','Filtrez par ville, quartier, budget, type de chambre, meublé, Wi-Fi… Trouvez exactement ce que vous cherchez.'],
            ['💬','Messagerie directe','Contactez les annonceurs sans quitter ColocCI. Discutez, posez vos questions et organisez vos visites en toute simplicité.'],
            ['🇨🇮','Adapté à la Côte d\'Ivoire','Conçu pour Abidjan, Bouaké, Yamoussoukro et toutes les grandes villes ivoiriennes. Prix en FCFA.'],
            ['📱','100 % Responsive','Accessible sur mobile, tablette et ordinateur. Cherchez ou publiez où que vous soyez.'],
          ].map(([ic,ti,de]) => `<div class="feature-card"><div class="feature-icon">${ic}</div><div class="feature-title">${ti}</div><div class="feature-desc">${de}</div></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="background:var(--bg-0);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
      <div class="container">
        <div class="section-header">
          <div class="section-eyebrow">Annonces récentes</div>
          <h2>Découvrez les dernières offres</h2>
        </div>
        <div class="listing-grid" id="home-listings">${SkeletonCards(3)}</div>
        <div style="text-align:center;margin-top:var(--sp-xl)">
          <button class="btn btn-outline btn-lg" onclick="navigate('#/annonces')">Voir toutes les annonces →</button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container text-center">
        <h2 style="margin-bottom:var(--sp-md)">Prêt à trouver votre coloc idéale ?</h2>
        <p style="color:var(--text-2);max-width:500px;margin:0 auto var(--sp-xl);line-height:1.75">
          Rejoignez des milliers d'Ivoiriens qui ont déjà trouvé leur colocation grâce à ColocCI.
        </p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="navigate('${isLoggedIn()?'#/annonces':'#/register'}')">
            ${isLoggedIn()?'🔍 Explorer les annonces':'🚀 Créer un compte gratuit'}
          </button>
          ${!isLoggedIn()?`<button class="btn btn-outline btn-lg" onclick="navigate('#/login')">Déjà membre ? Connexion</button>`:''}
        </div>
      </div>
    </section>

    <footer style="background:var(--bg-0);border-top:1px solid var(--border);padding:var(--sp-xl) 0">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
        <div class="navbar-logo" onclick="navigate('#/')" style="cursor:pointer">
          <div class="logo-icon">🏘</div>Coloc<span class="ci">CI</span>
        </div>
        <p style="font-size:0.78rem;color:var(--text-3)">© 2024 ColocCI – Plateforme de colocation en Côte d'Ivoire 🇨🇮</p>
        <div style="display:flex;gap:16px;font-size:0.85rem;color:var(--text-2)">
          <span style="cursor:pointer" onclick="navigate('#/annonces')">Annonces</span>
          <span style="cursor:pointer" onclick="navigate('#/register')">Inscription</span>
        </div>
      </div>
    </footer>
  `);

  // Load recent listings
  try {
    const d = await api('GET', '/api/listings?per_page=3');
    const list = d.listings || d;
    document.getElementById('home-listings').innerHTML = list.slice(0,3).map(l => ListingCard(l, false)).join('');
  } catch {
    if (state.demoMode) {
      document.getElementById('home-listings').innerHTML = MOCK.listings.slice(0,3).map(l => ListingCard(l, false)).join('');
    } else {
      document.getElementById('home-listings').innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div>Impossible de charger les annonces</div></div>`;
    }
  }
}

// ── LISTINGS ──────────────────────────────────────────
async function renderListings() {
  const cities = ['Abidjan','Bouaké','Yamoussoukro','San-Pédro','Korhogo','Daloa'];
  setView(`
    <div class="container" style="padding-top:var(--sp-xl);padding-bottom:var(--sp-xl)">
      <div class="page-header">
        <h1 class="page-title">Annonces de colocation</h1>
        <p class="page-subtitle">Trouvez votre logement parmi nos annonces vérifiées${isLoggedIn()?' – scores de compatibilité personnalisés activés ⚡':''}</p>
      </div>

      <div class="filter-bar" role="search">
        <div class="filter-bar-inner">
          <div class="filter-group">
            <label class="filter-label" for="filter-search">Recherche</label>
            <input type="search" id="filter-search" class="form-input" placeholder="Titre, quartier, ville…" style="border-radius:var(--r-md)">
          </div>
          <div class="filter-group">
            <label class="filter-label" for="filter-city">Ville</label>
            <select id="filter-city" class="form-select" style="border-radius:var(--r-md)">
              <option value="">Toutes les villes</option>
              ${cities.map(c=>`<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label" for="filter-budget">Budget max (FCFA)</label>
            <input type="number" id="filter-budget" class="form-input" placeholder="Ex: 100 000" style="border-radius:var(--r-md)">
          </div>
          <div class="filter-group">
            <label class="filter-label" for="filter-room">Type de chambre</label>
            <select id="filter-room" class="form-select" style="border-radius:var(--r-md)">
              <option value="">Tout type</option>
              <option value="Privée">🚪 Privée</option>
              <option value="Partagée">🛏 Partagée</option>
            </select>
          </div>
          <div class="filter-group" style="align-self:end">
            <button class="btn btn-primary" id="filter-btn" onclick="applyFilters()" style="border-radius:var(--r-md);width:100%">🔍 Filtrer</button>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:12px;align-items:center">
          ${[['filter-furnished','Meublé'],['filter-wifi','Wi-Fi'],['filter-nosmoking','Non-fumeur']].map(([id,lbl])=>
            `<label style="display:flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--text-2);cursor:pointer">
              <input type="checkbox" id="${id}" style="accent-color:var(--green)"> ${lbl}
            </label>`).join('')}
          <span id="result-count" style="margin-left:auto;font-size:0.8rem;color:var(--text-3)"></span>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp-lg);flex-wrap:wrap;gap:12px">
        <div id="listings-info" style="font-size:0.875rem;color:var(--text-2)">Chargement…</div>
        <select id="sort-by" class="form-select" style="width:auto;font-size:0.85rem;padding:8px 36px 8px 12px;border-radius:var(--r-full)" onchange="applyFilters()">
          ${isLoggedIn()?'<option value="score">⚡ Meilleure compat.</option>':''}
          <option value="price_asc">Prix ↑</option>
          <option value="price_desc">Prix ↓</option>
          <option value="recent">Plus récent</option>
        </select>
      </div>

      <div class="listing-grid" id="listings-grid" aria-live="polite">${SkeletonCards(6)}</div>
    </div>
  `);

  await loadListings();

  let debTimer;
  ['filter-search','filter-budget'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { clearTimeout(debTimer); debTimer = setTimeout(applyFilters, 380); });
  });
  ['filter-city','filter-room','filter-furnished','filter-wifi','filter-nosmoking'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });
}

async function loadListings() {
  try {
    const ep = isLoggedIn() ? '/api/match' : '/api/listings';
    const d = await api('GET', ep);
    state.allListings = d.listings || d.matches || d;
    renderListingGrid(state.allListings);
  } catch {
    if (state.demoMode) {
      state.allListings = MOCK.listings;
      renderListingGrid(state.allListings);
      showToast('Mode démo : données d\'exemple', 'info');
    } else {
      document.getElementById('listings-grid').innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">⚠️</div>
          <div class="empty-title">Impossible de charger les annonces</div>
          <button class="btn btn-primary mt-md" onclick="loadListings()">Réessayer</button>
        </div>`;
    }
  }
}

function applyFilters() {
  const search  = (document.getElementById('filter-search')?.value||'').toLowerCase();
  const city    = document.getElementById('filter-city')?.value||'';
  const budget  = parseInt(document.getElementById('filter-budget')?.value)||Infinity;
  const room    = document.getElementById('filter-room')?.value||'';
  const furn    = document.getElementById('filter-furnished')?.checked||false;
  const wifi    = document.getElementById('filter-wifi')?.checked||false;
  const nosmoke = document.getElementById('filter-nosmoking')?.checked||false;
  const sort    = document.getElementById('sort-by')?.value||'score';

  let filtered = state.allListings.filter(l => {
    if (city    && l.city !== city) return false;
    if (room    && l.room_type !== room) return false;
    if ((l.rent+(l.charges||0)) > budget) return false;
    if (furn    && !l.furnished) return false;
    if (wifi    && !l.wifi)      return false;
    if (nosmoke && l.smoking_allowed) return false;
    if (search) {
      const hay = `${l.title} ${l.city} ${l.neighborhood} ${l.description||''}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  filtered.sort((a,b) => {
    if (sort === 'score')     return (b.compatibility_score||0)-(a.compatibility_score||0);
    if (sort === 'price_asc') return a.rent - b.rent;
    if (sort === 'price_desc')return b.rent - a.rent;
    return 0;
  });

  renderListingGrid(filtered);
}

function renderListingGrid(list) {
  const grid = document.getElementById('listings-grid');
  const info = document.getElementById('listings-info');
  if (info) info.textContent = `${list.length} annonce${list.length!==1?'s':''} trouvée${list.length!==1?'s':''}`;
  grid.innerHTML = list.length
    ? list.map(l => ListingCard(l, isLoggedIn())).join('')
    : `<div class="empty-state" style="grid-column:1/-1">
         <div class="empty-icon">🔍</div>
         <div class="empty-title">Aucune annonce trouvée</div>
         <div class="empty-desc">Modifiez vos filtres pour voir plus de résultats</div>
       </div>`;
}

// ── LISTING DETAIL ────────────────────────────────────
async function renderListingDetail(id) {
  setView(`<div class="container" style="padding-top:var(--sp-xl);padding-bottom:var(--sp-xl)">
    <div id="detail-content">
      <div class="listing-detail-grid">
        <div>
          <div class="skeleton" style="height:370px;border-radius:var(--r-lg)"></div>
          <div class="skeleton skeleton-line" style="margin-top:20px;height:28px;width:65%"></div>
          <div class="skeleton skeleton-line medium" style="height:14px"></div>
          <div class="skeleton skeleton-line" style="height:90px;margin-top:8px"></div>
        </div>
        <div>
          <div class="skeleton" style="height:160px;border-radius:var(--r-lg)"></div>
          <div class="skeleton" style="height:200px;border-radius:var(--r-lg);margin-top:16px"></div>
        </div>
      </div>
    </div>
  </div>`);

  let listing;
  try {
    listing = await api('GET', isLoggedIn() ? `/api/match/${id}` : `/api/listings/${id}`);
  } catch {
    if (state.demoMode) listing = MOCK.listings.find(l=>l.id==id) || MOCK.listings[0];
    else {
      document.getElementById('detail-content').innerHTML = `
        <div class="empty-state"><div class="empty-icon">❌</div>
          <div class="empty-title">Annonce introuvable</div>
          <button class="btn btn-primary mt-md" onclick="navigate('#/annonces')">Retour</button>
        </div>`;
      return;
    }
  }

  const score = listing.compatibility_score;
  const sd    = listing.score_details || {};
  const isFav = state.favorites.has(Number(listing.id));
  const owner = listing.owner || {};

  const tags = [
    listing.furnished         ? ['🛋','Meublé'] : null,
    listing.wifi              ? ['📶','Wi-Fi']   : null,
    !listing.smoking_allowed  ? ['🚭','Non-fumeur'] : null,
    listing.pets_allowed      ? ['🐾','Animaux acceptés'] : ['🚫','Sans animaux'],
    listing.room_type         ? ['🚪',`Chambre ${listing.room_type}`] : null,
    listing.bathroom_type     ? ['🚿',`SdB ${listing.bathroom_type}`] : null,
  ].filter(Boolean);

  const criteriaMap = [
    ['budget','Budget'], ['quartier','Quartier'], ['mode_vie','Mode de vie'],
    ['fumeur','Non-fumeur'], ['animaux','Animaux'], ['type_chambre','Type chambre']
  ];

  const scorePanel = (isLoggedIn() && score != null) ? `
    <div class="score-breakdown">
      <div class="score-breakdown-title">Détail de compatibilité</div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:var(--sp-md)">
        <div class="score-ring-wrap">
          ${ScoreRing(score,'lg')}
          <div class="score-label" style="color:${scoreColor(score)}">${scoreLabel(score)}</div>
        </div>
        <div>
          <div style="font-size:1.6rem;font-weight:800;color:${scoreColor(score)};font-family:'Outfit',sans-serif">${score}%</div>
          <div style="font-size:0.78rem;color:var(--text-2)">Compatibilité globale</div>
        </div>
      </div>
      ${criteriaMap.map(([k,lbl]) => {
        const v = sd[k] ?? null;
        if (v === null) return '';
        return `<div class="score-item">
          <span class="score-item-label">${lbl}</span>
          <div class="score-item-bar-wrap"><div class="score-item-bar" style="width:${v}%;background:${scoreColor(v)}"></div></div>
          <span class="score-item-value">${v}%</span>
        </div>`;
      }).join('')}
    </div>` : (!isLoggedIn() ? `
    <div class="detail-price-card" style="background:var(--green-dim);border-color:rgba(13,158,115,0.3)">
      <div style="font-size:0.875rem;color:var(--green);font-weight:600;margin-bottom:8px">⚡ Score de compatibilité</div>
      <div style="font-size:0.85rem;color:var(--text-2);line-height:1.6">Connectez-vous pour voir votre score de compatibilité personnalisé avec cette annonce.</div>
      <button class="btn btn-primary w-full mt-md" onclick="navigate('#/login')">Se connecter</button>
    </div>` : '');

  document.getElementById('detail-content').innerHTML = `
    <button class="btn btn-ghost btn-sm" onclick="navigate('#/annonces')" style="margin-bottom:16px">← Retour aux annonces</button>
    <div class="listing-detail-grid">
      <div>
        <div class="listing-gallery">
          ${listing.photos&&listing.photos.length
            ? `<img src="${API_BASE}/uploads/${listing.photos[0]}" alt="${listing.title}" style="width:100%;height:100%;object-fit:cover">`
            : `<div class="listing-gallery-placeholder"><span>🏠</span><span style="font-size:1rem;margin-top:8px;font-family:'Inter',sans-serif">Aucune photo</span></div>`}
        </div>

        <div style="margin-top:var(--sp-xl)">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:var(--sp-md)">
            <h1 style="font-size:1.65rem">${listing.title}</h1>
            <button class="btn btn-outline btn-sm ${isFav?'active':''}" onclick="toggleFavorite(${listing.id},this)" style="flex-shrink:0">
              ${isFav?'❤️ Favori':'🤍 Favoris'}
            </button>
          </div>
          <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:var(--sp-lg)">
            <span style="color:var(--text-2);font-size:0.9rem">📍 ${listing.neighborhood}, ${listing.city}</span>
            <span style="color:var(--text-2);font-size:0.9rem">📅 Disponible le ${formatDate(listing.available_from)}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:var(--sp-xl)">
            ${tags.map(([ic,lbl])=>`<span class="badge badge-gray">${ic} ${lbl}</span>`).join('')}
          </div>
          <div class="divider"></div>
          <div style="margin-top:var(--sp-lg)">
            <h3 style="margin-bottom:var(--sp-md)">Description</h3>
            <p style="color:var(--text-2);line-height:1.85;font-size:0.95rem">${listing.description||'Aucune description fournie.'}</p>
          </div>
          <div class="divider"></div>
          <div style="margin-top:var(--sp-lg)">
            <h3 style="margin-bottom:var(--sp-md)">Propriétaire / Colocataire</h3>
            <div style="display:flex;align-items:center;gap:16px">
              <div class="profile-avatar-lg" style="width:54px;height:54px;font-size:1.1rem">
                ${initials(owner.first_name,owner.last_name)}
              </div>
              <div>
                <div style="font-weight:700;font-size:1rem">${owner.first_name||'Anonyme'} ${owner.last_name||''}</div>
                ${owner.age?`<div style="color:var(--text-3);font-size:0.85rem">${owner.age} ans</div>`:''}
              </div>
              ${isLoggedIn()?`<button class="btn btn-outline btn-sm" style="margin-left:auto" onclick="navigate('#/messages/${owner.id}')">💬 Contacter</button>`:''}
            </div>
          </div>
        </div>
      </div>

      <div class="detail-sidebar">
        <div class="detail-price-card">
          <div class="detail-price">${formatPrice(listing.rent)}</div>
          <div class="detail-price-sub">par mois</div>
          ${listing.charges?`<div class="detail-price-sub">+ ${formatPrice(listing.charges)} de charges</div>`:''}
          <div class="divider"></div>
          ${isLoggedIn()
            ? `<button class="btn btn-primary w-full" onclick="navigate('#/messages/${owner.id}')">💬 Contacter l'annonceur</button>`
            : `<button class="btn btn-primary w-full" onclick="navigate('#/login')">Se connecter pour contacter</button>`}
          <button class="btn btn-outline w-full mt-sm" onclick="toggleFavorite(${listing.id},this)">
            ${isFav?'❤️ Dans vos favoris':'🤍 Ajouter aux favoris'}
          </button>
        </div>
        ${scorePanel}
      </div>
    </div>
  `;
}

// ── LOGIN ─────────────────────────────────────────────
function renderLogin() {
  if (isLoggedIn()) { navigate('#/'); return; }
  setView(`
    <div class="auth-container">
      <div class="auth-card">
        <div style="text-align:center;margin-bottom:var(--sp-xl)">
          <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--green),var(--gold));display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin:0 auto 12px">🏘</div>
          <h2 class="auth-title">Connexion</h2>
          <p class="auth-subtitle">Bienvenue sur ColocCI 🇨🇮</p>
        </div>
        <form id="login-form" onsubmit="handleLogin(event)" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-email">Email</label>
            <input type="email" id="login-email" class="form-input" placeholder="votre@email.ci" required autocomplete="email">
          </div>
          <div class="form-group">
            <label class="form-label" for="login-pwd">Mot de passe</label>
            <input type="password" id="login-pwd" class="form-input" placeholder="••••••••" required autocomplete="current-password">
          </div>
          <div id="login-error" class="form-error" style="display:none;margin-bottom:12px"></div>
          <button type="submit" id="login-btn" class="btn btn-primary w-full" style="border-radius:var(--r-md);padding:12px">Se connecter</button>
        </form>
        <div class="auth-divider"><span>ou</span></div>
        <button class="btn btn-outline w-full" style="border-radius:var(--r-md);padding:12px" onclick="demoLogin()">🎭 Connexion en mode démo</button>
        <div class="auth-switch">Pas encore de compte ? <a onclick="navigate('#/register')">Créer un compte</a></div>
      </div>
    </div>
  `);
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pwd   = document.getElementById('login-pwd').value;
  const btn   = document.getElementById('login-btn');
  const err   = document.getElementById('login-error');
  btn.disabled = true;
  btn.innerHTML = '<span class="spin">⟳</span> Connexion…';
  err.style.display = 'none';
  try {
    const d = await api('POST', '/api/auth/login', { email, password: pwd });
    setToken(d.access_token); setUser(d.user);
    await loadFavorites();
    renderNavbar();
    navigate('#/annonces');
    showToast(`Bienvenue ${d.user.first_name} ! 👋`, 'success');
  } catch (apiErr) {
    if (state.demoMode || apiErr.status === 0) { demoLogin(); return; }
    err.textContent = apiErr.data?.error || 'Email ou mot de passe incorrect';
    err.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = 'Se connecter';
  }
}

function demoLogin() {
  const u = { id:1, first_name:'Demo', last_name:'Utilisateur', email:'demo@colocci.ci', role:'user' };
  setToken('demo_token_colocci'); setUser(u);
  state.demoMode = true;
  state.favorites = new Set([4]);
  showDemoBanner(); renderNavbar();
  navigate('#/annonces');
  showToast('Mode démo activé 🎭 – données d\'exemple', 'info');
}

// ── REGISTER ──────────────────────────────────────────
function renderRegister() {
  if (isLoggedIn()) { navigate('#/'); return; }
  setView(`
    <div class="auth-container">
      <div class="auth-card" style="max-width:500px">
        <div style="text-align:center;margin-bottom:var(--sp-xl)">
          <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--green),var(--gold));display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin:0 auto 12px">🏘</div>
          <h2 class="auth-title">Créer un compte</h2>
          <p class="auth-subtitle">Rejoignez ColocCI gratuitement 🇨🇮</p>
        </div>
        <form id="register-form" onsubmit="handleRegister(event)" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="reg-fname">Prénom</label>
              <input type="text" id="reg-fname" class="form-input" placeholder="Kouamé" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-lname">Nom</label>
              <input type="text" id="reg-lname" class="form-input" placeholder="Assi" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-email">Email</label>
            <input type="email" id="reg-email" class="form-input" placeholder="votre@email.ci" required autocomplete="email">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="reg-pwd">Mot de passe</label>
              <input type="password" id="reg-pwd" class="form-input" placeholder="Min. 8 caractères" required minlength="8" autocomplete="new-password">
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-pwd2">Confirmer</label>
              <input type="password" id="reg-pwd2" class="form-input" placeholder="Répéter" required autocomplete="new-password">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-phone">Téléphone (optionnel)</label>
            <input type="tel" id="reg-phone" class="form-input" placeholder="+225 07 XX XX XX">
          </div>
          <div id="reg-error" class="form-error" style="display:none;margin-bottom:12px"></div>
          <button type="submit" id="reg-btn" class="btn btn-primary w-full" style="border-radius:var(--r-md);padding:12px">Créer mon compte</button>
        </form>
        <div class="auth-switch">Déjà membre ? <a onclick="navigate('#/login')">Se connecter</a></div>
      </div>
    </div>
  `);
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('reg-btn');
  const err = document.getElementById('reg-error');
  const pwd  = document.getElementById('reg-pwd').value;
  const pwd2 = document.getElementById('reg-pwd2').value;
  if (pwd !== pwd2) { err.textContent='Les mots de passe ne correspondent pas'; err.style.display='block'; return; }
  btn.disabled = true;
  btn.innerHTML = '<span class="spin">⟳</span> Création…';
  err.style.display = 'none';
  try {
    const d = await api('POST', '/api/auth/register', {
      first_name: document.getElementById('reg-fname').value,
      last_name:  document.getElementById('reg-lname').value,
      email:      document.getElementById('reg-email').value,
      password:   pwd,
      phone:      document.getElementById('reg-phone').value || undefined
    });
    setToken(d.access_token); setUser(d.user);
    renderNavbar();
    navigate('#/profil');
    showToast(`Compte créé ! Bienvenue ${d.user.first_name} 🎉`, 'success');
  } catch (apiErr) {
    if (state.demoMode || apiErr.status === 0) { demoLogin(); return; }
    err.textContent = apiErr.data?.error || 'Erreur lors de la création du compte';
    err.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = 'Créer mon compte';
  }
}

// ── PROFILE ───────────────────────────────────────────
async function renderProfile() {
  const user = getUser() || {};
  const cities = ['Abidjan','Bouaké','Yamoussoukro','San-Pédro','Korhogo'];
  setView(`
    <div class="container" style="padding-top:var(--sp-xl);padding-bottom:var(--sp-xl)">
      <div class="page-header">
        <h1 class="page-title">Mon profil</h1>
        <p class="page-subtitle">Gérez vos informations et préférences de colocation</p>
      </div>
      <div class="profile-header-card">
        <div class="profile-avatar-lg">${initials(user.first_name,user.last_name)}</div>
        <div class="profile-info">
          <h2>${user.first_name||''} ${user.last_name||''}</h2>
          <p>${user.email||''}</p>
          ${user.phone?`<p>📱 ${user.phone}</p>`:''}
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="navigate('#/mes-annonces')">🏠 Mes annonces</button>
          <button class="btn btn-primary btn-sm" onclick="navigate('#/publier')">+ Publier</button>
        </div>
      </div>
      <div class="profile-grid">
        <div class="card">
          <div class="card-body">
            <h3 style="margin-bottom:var(--sp-lg)">📋 Informations personnelles</h3>
            <form id="info-form" onsubmit="saveInfo(event)">
              <div class="form-row">
                <div class="form-group"><label class="form-label" for="pf-fn">Prénom</label><input type="text" id="pf-fn" class="form-input" value="${user.first_name||''}" required></div>
                <div class="form-group"><label class="form-label" for="pf-ln">Nom</label><input type="text" id="pf-ln" class="form-input" value="${user.last_name||''}" required></div>
              </div>
              <div class="form-group"><label class="form-label" for="pf-em">Email</label><input type="email" id="pf-em" class="form-input" value="${user.email||''}" required></div>
              <div class="form-row">
                <div class="form-group"><label class="form-label" for="pf-ph">Téléphone</label><input type="tel" id="pf-ph" class="form-input" value="${user.phone||''}" placeholder="+225 07 XX XX XX"></div>
                <div class="form-group"><label class="form-label" for="pf-ag">Âge</label><input type="number" id="pf-ag" class="form-input" value="${user.age||''}" placeholder="Ex: 24" min="18" max="99"></div>
              </div>
              <div class="form-group"><label class="form-label" for="pf-bi">Bio</label><textarea id="pf-bi" class="form-textarea" placeholder="Parlez de vous…">${user.bio||''}</textarea></div>
              <button type="submit" id="info-btn" class="btn btn-primary btn-sm">Sauvegarder</button>
            </form>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h3 style="margin-bottom:8px">🏠 Préférences de colocation</h3>
            <p class="form-hint" style="margin-bottom:var(--sp-md)">Utilisées pour calculer votre score de compatibilité</p>
            <form id="prefs-form" onsubmit="savePrefs(event)">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="pf-ci">Ville souhaitée</label>
                  <select id="pf-ci" class="form-select">
                    <option value="">Sélectionner</option>
                    ${cities.map(c=>`<option value="${c}" ${user.preferred_city===c?'selected':''}>${c}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group"><label class="form-label" for="pf-ne">Quartier</label><input type="text" id="pf-ne" class="form-input" value="${user.preferred_neighborhood||''}" placeholder="Ex: Cocody"></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label" for="pf-bu">Budget max (FCFA/mois)</label><input type="number" id="pf-bu" class="form-input" value="${user.budget_max||''}" placeholder="Ex: 100000"></div>
                <div class="form-group">
                  <label class="form-label" for="pf-rt">Type de chambre</label>
                  <select id="pf-rt" class="form-select">
                    <option value="">Indifférent</option>
                    <option value="Privée" ${user.room_type==='Privée'?'selected':''}>Privée</option>
                    <option value="Partagée" ${user.room_type==='Partagée'?'selected':''}>Partagée</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="pf-lf">Mode de vie</label>
                <select id="pf-lf" class="form-select">
                  <option value="">Sélectionner</option>
                  <option value="calme" ${user.lifestyle==='calme'?'selected':''}>🤫 Calme</option>
                  <option value="social" ${user.lifestyle==='social'?'selected':''}>🎉 Social</option>
                  <option value="mixte" ${user.lifestyle==='mixte'?'selected':''}>⚖️ Mixte</option>
                </select>
              </div>
              <div class="toggle-group"><span class="toggle-label">🚭 Non-fumeur</span>
                <label class="toggle"><input type="checkbox" id="pf-ns" ${!user.smoking_allowed?'checked':''}><span class="toggle-track"></span></label></div>
              <div class="toggle-group"><span class="toggle-label">🐾 Animaux acceptés</span>
                <label class="toggle"><input type="checkbox" id="pf-pa" ${user.pets_allowed?'checked':''}><span class="toggle-track"></span></label></div>
              <button type="submit" id="prefs-btn" class="btn btn-primary btn-sm mt-md">Sauvegarder les préférences</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `);
}

async function saveInfo(e) {
  e.preventDefault();
  const btn = document.getElementById('info-btn');
  btn.disabled = true; btn.innerHTML = '<span class="spin">⟳</span>';
  const payload = { first_name:document.getElementById('pf-fn').value, last_name:document.getElementById('pf-ln').value, email:document.getElementById('pf-em').value, phone:document.getElementById('pf-ph').value, age:parseInt(document.getElementById('pf-ag').value)||null, bio:document.getElementById('pf-bi').value };
  try { await api('PUT', '/api/profile', payload); } catch { if (!state.demoMode) { showToast('Erreur','error'); btn.disabled=false; btn.innerHTML='Sauvegarder'; return; } }
  setUser({ ...getUser(), ...payload }); renderNavbar();
  showToast('Profil mis à jour ✅', 'success');
  btn.disabled=false; btn.innerHTML='Sauvegarder';
}
async function savePrefs(e) {
  e.preventDefault();
  const btn = document.getElementById('prefs-btn');
  btn.disabled = true; btn.innerHTML = '<span class="spin">⟳</span>';
  const payload = { preferred_city:document.getElementById('pf-ci').value, preferred_neighborhood:document.getElementById('pf-ne').value, budget_max:parseInt(document.getElementById('pf-bu').value)||null, room_type:document.getElementById('pf-rt').value, lifestyle:document.getElementById('pf-lf').value, smoking_allowed:!document.getElementById('pf-ns').checked, pets_allowed:document.getElementById('pf-pa').checked };
  try { await api('PUT', '/api/profile', payload); } catch { if (!state.demoMode) { showToast('Erreur','error'); btn.disabled=false; btn.innerHTML='Sauvegarder les préférences'; return; } }
  setUser({ ...getUser(), ...payload });
  showToast('Préférences sauvegardées ✅', 'success');
  btn.disabled=false; btn.innerHTML='Sauvegarder les préférences';
}

// ── PUBLISH ───────────────────────────────────────────
function renderPublish() {
  const cities = ['Abidjan','Bouaké','Yamoussoukro','San-Pédro','Korhogo','Daloa','Grand-Bassam'];
  setView(`
    <div class="container" style="padding-top:var(--sp-xl);padding-bottom:var(--sp-xl)">
      <div class="page-header">
        <h1 class="page-title">Publier une annonce</h1>
        <p class="page-subtitle">Décrivez votre colocation pour trouver le colocataire idéal</p>
      </div>
      <div class="publish-layout">
        <div>
          <form id="pub-form" onsubmit="handlePublish(event)" novalidate>
            <div class="card" style="margin-bottom:var(--sp-lg)">
              <div class="card-body">
                <h3 style="margin-bottom:var(--sp-lg)">📋 Informations principales</h3>
                <div class="form-group">
                  <label class="form-label" for="pub-title">Titre *</label>
                  <input type="text" id="pub-title" class="form-input" placeholder="Ex: Chambre meublée à Cocody Angré – Résidence moderne" required maxlength="120">
                  <div class="form-hint">Soyez précis et descriptif pour attirer plus de candidats</div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="pub-city">Ville *</label>
                    <select id="pub-city" class="form-select" required>
                      <option value="">Sélectionner</option>
                      ${cities.map(c=>`<option value="${c}">${c}</option>`).join('')}
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="pub-nb">Quartier *</label>
                    <input type="text" id="pub-nb" class="form-input" placeholder="Ex: Cocody, Riviera…" required>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="pub-desc">Description *</label>
                  <textarea id="pub-desc" class="form-textarea" rows="5" placeholder="Décrivez le logement, l'ambiance, vos attentes…" required></textarea>
                </div>
              </div>
            </div>

            <div class="card" style="margin-bottom:var(--sp-lg)">
              <div class="card-body">
                <h3 style="margin-bottom:var(--sp-lg)">💰 Loyer et type</h3>
                <div class="form-row">
                  <div class="form-group"><label class="form-label" for="pub-rent">Loyer mensuel (FCFA) *</label><input type="number" id="pub-rent" class="form-input" placeholder="Ex: 85000" required min="0"></div>
                  <div class="form-group"><label class="form-label" for="pub-charges">Charges (FCFA)</label><input type="number" id="pub-charges" class="form-input" placeholder="Ex: 10000" min="0" value="0"></div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="pub-rt">Type de chambre *</label>
                    <select id="pub-rt" class="form-select" required><option value="">Sélectionner</option><option value="Privée">🚪 Privée</option><option value="Partagée">🛏 Partagée</option></select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="pub-bt">Salle de bain *</label>
                    <select id="pub-bt" class="form-select" required><option value="">Sélectionner</option><option value="Privée">🚿 Privée</option><option value="Partagée">🚿 Partagée</option></select>
                  </div>
                </div>
                <div class="form-group"><label class="form-label" for="pub-date">Disponible à partir du *</label><input type="date" id="pub-date" class="form-input" required></div>
              </div>
            </div>

            <div class="card" style="margin-bottom:var(--sp-lg)">
              <div class="card-body">
                <h3 style="margin-bottom:var(--sp-lg)">🏡 Règles & équipements</h3>
                ${[['pub-furn','🛋 Meublé'],['pub-wifi','📶 Wi-Fi inclus'],['pub-smoke','🚭 Fumeurs acceptés'],['pub-pets','🐾 Animaux acceptés']].map(([id,lbl])=>
                  `<div class="toggle-group"><span class="toggle-label">${lbl}</span>
                    <label class="toggle"><input type="checkbox" id="${id}"><span class="toggle-track"></span></label></div>`).join('')}
                <div class="form-group mt-md">
                  <label class="form-label" for="pub-lf">Mode de vie</label>
                  <select id="pub-lf" class="form-select"><option value="">Sélectionner</option><option value="calme">🤫 Calme</option><option value="social">🎉 Social</option><option value="mixte">⚖️ Mixte</option></select>
                </div>
              </div>
            </div>

            <div class="card" style="margin-bottom:var(--sp-xl)">
              <div class="card-body">
                <h3 style="margin-bottom:var(--sp-lg)">📸 Photos</h3>
                <div class="photo-upload-zone" id="drop-zone" onclick="document.getElementById('pub-photos').click()">
                  <div class="photo-upload-icon">📷</div>
                  <div style="font-weight:600;margin-bottom:4px">Cliquez ou glissez vos photos ici</div>
                  <div class="form-hint">JPG, PNG · Max 5 photos · 5 Mo par photo</div>
                  <input type="file" id="pub-photos" accept="image/*" multiple style="display:none" onchange="previewPhotos(event)">
                </div>
                <div id="photo-preview" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px"></div>
              </div>
            </div>

            <div id="pub-error" class="form-error" style="display:none;margin-bottom:12px"></div>
            <button type="submit" id="pub-btn" class="btn btn-primary btn-lg w-full">🚀 Publier l'annonce</button>
          </form>
        </div>

        <div>
          <div class="card" style="position:sticky;top:80px">
            <div class="card-body">
              <h4 style="margin-bottom:var(--sp-md)">💡 Conseils</h4>
              <ul style="list-style:none;display:flex;flex-direction:column;gap:12px">
                ${[['📸','Les annonces avec photos reçoivent 3× plus de vues'],['📝','Une description détaillée attire des candidats plus sérieux'],['💰','Indiquez toutes les charges pour éviter les malentendus'],['✅','Précisez vos règles de vie pour une colocation réussie']].map(([ic,tx])=>`<li style="display:flex;gap:8px;font-size:0.85rem;color:var(--text-2)"><span>${ic}</span><span>${tx}</span></li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
  const di = document.getElementById('pub-date');
  if (di) di.value = new Date().toISOString().split('T')[0];
  const dz = document.getElementById('drop-zone');
  if (dz) {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('dragover'); previewPhotos({ target: { files: e.dataTransfer.files } }); });
  }
}

function previewPhotos(ev) {
  const files = Array.from(ev.target?.files || []).slice(0, 5);
  const prev = document.getElementById('photo-preview');
  prev.innerHTML = files.map((f,i) => `
    <div style="position:relative;border-radius:var(--r-md);overflow:hidden;height:80px;background:var(--bg-3)">
      <img src="${URL.createObjectURL(f)}" alt="Photo ${i+1}" style="width:100%;height:100%;object-fit:cover">
    </div>`).join('');
}

async function handlePublish(e) {
  e.preventDefault();
  const btn = document.getElementById('pub-btn');
  const err = document.getElementById('pub-error');
  btn.disabled = true; btn.innerHTML = '<span class="spin">⟳</span> Publication…';
  err.style.display = 'none';
  const payload = {
    title:          document.getElementById('pub-title').value,
    city:           document.getElementById('pub-city').value,
    neighborhood:   document.getElementById('pub-nb').value,
    description:    document.getElementById('pub-desc').value,
    rent:           parseInt(document.getElementById('pub-rent').value),
    charges:        parseInt(document.getElementById('pub-charges').value)||0,
    room_type:      document.getElementById('pub-rt').value,
    bathroom_type:  document.getElementById('pub-bt').value,
    available_from: document.getElementById('pub-date').value,
    furnished:      document.getElementById('pub-furn').checked,
    wifi:           document.getElementById('pub-wifi').checked,
    smoking_allowed:document.getElementById('pub-smoke').checked,
    pets_allowed:   document.getElementById('pub-pets').checked,
    lifestyle:      document.getElementById('pub-lf').value || null
  };
  try {
    const d = await api('POST', '/api/listings', payload);
    showToast('Annonce publiée avec succès ! 🎉', 'success');
    navigate(`#/annonce/${d.id || d.listing?.id || 1}`);
  } catch (apiErr) {
    if (state.demoMode) { showToast('Annonce publiée (démo) ! 🎉', 'success'); navigate('#/mes-annonces'); return; }
    err.textContent = apiErr.data?.error || 'Erreur lors de la publication';
    err.style.display = 'block';
    btn.disabled = false; btn.innerHTML = '🚀 Publier l\'annonce';
  }
}

// ── MY LISTINGS ───────────────────────────────────────
async function renderMyListings() {
  setView(`
    <div class="container" style="padding-top:var(--sp-xl);padding-bottom:var(--sp-xl)">
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
          <div><h1 class="page-title">Mes annonces</h1><p class="page-subtitle">Gérez vos annonces publiées</p></div>
          <button class="btn btn-primary" onclick="navigate('#/publier')">+ Nouvelle annonce</button>
        </div>
      </div>
      <div class="listing-grid" id="my-grid">${SkeletonCards(3)}</div>
    </div>
  `);
  try {
    const d = await api('GET', '/api/listings/my');
    const list = d.listings || d;
    document.getElementById('my-grid').innerHTML = list.length
      ? list.map(l => ListingCard(l, false)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🏠</div><div class="empty-title">Aucune annonce publiée</div><button class="btn btn-primary mt-md" onclick="navigate('#/publier')">+ Publier</button></div>`;
  } catch {
    const demo = state.demoMode ? MOCK.listings.slice(0,2) : [];
    document.getElementById('my-grid').innerHTML = demo.length
      ? demo.map(l=>ListingCard(l,false)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🏠</div><div class="empty-title">Aucune annonce</div><button class="btn btn-primary mt-md" onclick="navigate('#/publier')">+ Publier</button></div>`;
  }
}

// ── FAVORITES ─────────────────────────────────────────
async function renderFavorites() {
  setView(`
    <div class="container" style="padding-top:var(--sp-xl);padding-bottom:var(--sp-xl)">
      <div class="page-header"><h1 class="page-title">❤️ Mes favoris</h1><p class="page-subtitle">Les annonces que vous avez sauvegardées</p></div>
      <div class="listing-grid" id="fav-grid">${SkeletonCards(3)}</div>
    </div>
  `);
  try {
    const d = await api('GET', '/api/favorites');
    const list = d.favorites || d;
    document.getElementById('fav-grid').innerHTML = (list&&list.length)
      ? list.map(f=>ListingCard(f.listing||f,true)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">❤️</div><div class="empty-title">Aucun favori</div><div class="empty-desc">Cliquez sur le 🤍 d'une annonce pour l'ajouter</div><button class="btn btn-primary mt-md" onclick="navigate('#/annonces')">Explorer</button></div>`;
  } catch {
    const favs = state.demoMode ? MOCK.listings.filter(l=>state.favorites.has(l.id)) : [];
    document.getElementById('fav-grid').innerHTML = favs.length
      ? favs.map(l=>ListingCard(l,true)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">❤️</div><div class="empty-title">Aucun favori</div><button class="btn btn-primary mt-md" onclick="navigate('#/annonces')">Explorer les annonces</button></div>`;
  }
}

// ── MESSAGES ──────────────────────────────────────────
async function renderMessages(partnerId) {
  setView(`
    <div class="container" style="padding-top:var(--sp-md);padding-bottom:var(--sp-md)">
      <div class="messages-layout">
        <div class="convo-list">
          <div class="convo-list-header">💬 Conversations</div>
          <div id="convo-list-items">
            ${[1,2,3].map(()=>`<div style="padding:12px;border-bottom:1px solid var(--border)"><div class="skeleton skeleton-line medium" style="margin-bottom:6px"></div><div class="skeleton skeleton-line short"></div></div>`).join('')}
          </div>
        </div>
        <div class="chat-area" id="chat-area">
          <div style="flex:1;display:flex;align-items:center;justify-content:center;background:var(--bg-1)">
            <div style="text-align:center;color:var(--text-3)"><div style="font-size:3rem;margin-bottom:12px">💬</div><div style="font-size:0.9rem">Sélectionnez une conversation</div></div>
          </div>
        </div>
      </div>
    </div>
  `);
  await loadConversations(partnerId);
}

async function loadConversations(openId) {
  let convos;
  try {
    const d = await api('GET', '/api/messages');
    convos = d.conversations || d;
  } catch {
    convos = state.demoMode ? MOCK.conversations : [];
  }
  document.getElementById('convo-list-items').innerHTML = convos.length
    ? convos.map(c=>`
        <div class="convo-item ${openId==c.partner_id?'active':''}" onclick="openConvo(${c.partner_id},'${c.partner_name}',this)">
          <div class="owner-avatar" style="width:36px;height:36px">${c.partner_name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>
          <div class="convo-info">
            <div class="convo-name">${c.partner_name}</div>
            <div class="convo-preview">${c.last_message||''}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
            <span class="convo-time">${c.last_time||''}</span>
            ${c.unread?`<span style="width:18px;height:18px;background:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.62rem;color:white;font-weight:700">${c.unread}</span>`:''}
          </div>
        </div>`).join('')
    : `<div class="empty-state" style="padding:32px 16px"><div class="empty-icon" style="font-size:2rem">💬</div><div class="empty-title" style="font-size:0.9rem">Aucune conversation</div></div>`;
  if (openId) {
    const name = convos.find(c=>c.partner_id==openId)?.partner_name || `Utilisateur #${openId}`;
    openConvo(openId, name, null);
  }
}

async function openConvo(pid, name, itemEl) {
  document.querySelectorAll('.convo-item').forEach(el=>el.classList.remove('active'));
  if (itemEl) itemEl.classList.add('active');
  state.currentPartnerId = pid;
  const initStr = name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
  document.getElementById('chat-area').innerHTML = `
    <div class="chat-header">
      <div class="owner-avatar" style="width:36px;height:36px">${initStr}</div>
      <div><div style="font-weight:600;font-size:0.9rem">${name}</div><div style="font-size:0.73rem;color:var(--green)">● En ligne</div></div>
    </div>
    <div class="chat-messages" id="chat-msgs"><div class="flex-center" style="height:100%"><span class="spin" style="font-size:1.5rem">⟳</span></div></div>
    <div class="chat-input-bar">
      <input class="chat-input" id="chat-input" placeholder="Écrire un message…"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage();}">
      <button class="btn btn-primary btn-icon" onclick="sendMessage()" aria-label="Envoyer">→</button>
    </div>
  `;
  await loadMessages(pid);
}

async function loadMessages(pid) {
  const c = document.getElementById('chat-msgs');
  const user = getUser();
  let msgs;
  try { const d = await api('GET', `/api/messages/${pid}`); msgs = d.messages || d; }
  catch { msgs = state.demoMode ? (MOCK.messages[pid]||[]) : []; }
  c.innerHTML = msgs.length
    ? msgs.map(m=>{
        const me = m.sender_id===(user?.id||1);
        return `<div class="msg ${me?'me':''}">
          ${!me?`<div class="owner-avatar" style="width:28px;height:28px;font-size:0.62rem;flex-shrink:0">P</div>`:''}
          <div><div class="msg-bubble">${m.content}</div><div class="msg-time">${timeAgo(m.created_at)}</div></div>
        </div>`;
      }).join('')
    : `<div class="empty-state"><div class="empty-icon" style="font-size:2rem">💬</div><div style="font-size:0.875rem;color:var(--text-2)">Commencez la conversation !</div></div>`;
  c.scrollTop = c.scrollHeight;
}

async function sendMessage() {
  const inp = document.getElementById('chat-input');
  const content = inp?.value?.trim();
  if (!content || !state.currentPartnerId) return;
  const c = document.getElementById('chat-msgs');
  const el = document.createElement('div');
  el.className = 'msg me';
  el.innerHTML = `<div><div class="msg-bubble">${content}</div><div class="msg-time">À l'instant</div></div>`;
  c.appendChild(el); c.scrollTop = c.scrollHeight;
  inp.value = '';
  try { await api('POST', '/api/messages', { receiver_id: state.currentPartnerId, content }); }
  catch { if (!state.demoMode) { el.style.opacity='0.5'; showToast("Erreur d'envoi",'error'); } }
}

// ── NOTIFICATIONS ─────────────────────────────────────
async function renderNotifications() {
  setView(`
    <div class="container" style="padding-top:var(--sp-xl);padding-bottom:var(--sp-xl);max-width:700px">
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
          <h1 class="page-title">🔔 Notifications</h1>
          <button class="btn btn-outline btn-sm" onclick="markAllRead()">✓ Tout marquer comme lu</button>
        </div>
      </div>
      <div class="notif-list" id="notif-list">
        ${[1,2,3].map(()=>`<div class="notif-item"><div class="skeleton" style="width:36px;height:36px;border-radius:50%;flex-shrink:0"></div><div style="flex:1"><div class="skeleton skeleton-line medium"></div><div class="skeleton skeleton-line short" style="margin-top:4px"></div></div></div>`).join('')}
      </div>
    </div>
  `);
  let notifs;
  try { const d = await api('GET', '/api/notifications'); notifs = d.notifications || d; }
  catch { notifs = state.demoMode ? MOCK.notifications : []; }
  const icons = { message:'💬', listing:'🏠', match:'⚡' };
  document.getElementById('notif-list').innerHTML = notifs.length
    ? notifs.map(n=>`
        <div class="notif-item ${n.is_read?'':'unread'}" id="notif-${n.id}">
          <div class="notif-icon">${icons[n.type]||'🔔'}</div>
          <div class="notif-body">
            <div class="notif-text">${n.message}</div>
            <div class="notif-time">${timeAgo(n.created_at)}</div>
          </div>
          ${!n.is_read?`<div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:4px"></div>`:''}
        </div>`).join('')
    : `<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-title">Aucune notification</div></div>`;
}

async function markAllRead() {
  try { await api('PUT', '/api/notifications/read-all'); } catch { /* demo ok */ }
  document.querySelectorAll('.notif-item.unread').forEach(el => {
    el.classList.remove('unread');
    el.querySelector('[style*="background:var(--green)"]')?.remove();
  });
  showToast('Notifications marquées comme lues', 'success');
}

// ── 404 ───────────────────────────────────────────────
function renderNotFound() {
  setView(`
    <div class="flex-center" style="min-height:calc(100vh - 72px)">
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title" style="font-size:1.3rem">Page introuvable</div>
        <div class="empty-desc">La page que vous cherchez n'existe pas ou a été déplacée.</div>
        <button class="btn btn-primary mt-md" onclick="navigate('#/')">Retour à l'accueil</button>
      </div>
    </div>
  `);
}

// ── INIT ──────────────────────────────────────────────
async function init() {
  renderNavbar();
  if (isLoggedIn()) loadFavorites().catch(() => {});
  handleRoute();
}

init();
