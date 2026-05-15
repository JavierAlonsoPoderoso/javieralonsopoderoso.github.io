/* ============================================================
   PORTFOLIO - JAVIER ALONSO
   main.js — Comportamiento interactivo global
   ============================================================
   Módulos:
   1. Banner de anuncio (cerrar y recordar)
   2. Flyout / panel lateral (abrir, cerrar, contenido dinámico)
   3. Comparador de imágenes antes/después (Arte 3D)
   4. Scroll: navbar shadow suave
   ============================================================ */

/* ── 1. BANNER DE ANUNCIO ─────────────────────────────────
   Si el usuario cierra el banner, se guarda en sessionStorage
   para que no vuelva a aparecer en la misma sesión.
   Para hacer el banner permanente quita el bloque de
   sessionStorage y deja solo mostrarBanner().
   ──────────────────────────────────────────────────────── */

function initBanner() {
  const banner = document.querySelector('.site-banner');
  if (!banner) return; // si no hay banner en esta página, salir

  const BANNER_KEY = 'banner_cerrado';

  // ¿Ya lo cerró el usuario esta sesión?
  if (sessionStorage.getItem(BANNER_KEY)) {
    banner.style.display = 'none';
    return;
  }

  // Mostrar banner y ajustar offset del navbar
  document.body.classList.add('has-banner');

  const closeBtn = banner.querySelector('.site-banner-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.style.display = 'none';
      document.body.classList.remove('has-banner');
      sessionStorage.setItem(BANNER_KEY, '1');
    });
  }
}


/* ── 2. FLYOUT / PANEL LATERAL ────────────────────────────
   Uso:
   - Añade data-flyout a cualquier .project-card.
   - Pon los datos del proyecto en data-* attributes o en
     el objeto PROJECTS_DATA de cada sub-página.
   - openFlyout(data) inyecta el contenido y abre el panel.
   ──────────────────────────────────────────────────────── */

function initFlyout() {
  const overlay = document.querySelector('.flyout-overlay');
  if (!overlay) return;

  const panel    = overlay.querySelector('.flyout-panel');
  const closeBtn = overlay.querySelector('.flyout-close');

  // Cerrar al hacer clic en el overlay (fuera del panel)
  overlay.addEventListener('click', (e) => {
    if (!panel.contains(e.target)) closeFlyout();
  });

  // Cerrar con el botón X
  if (closeBtn) closeBtn.addEventListener('click', closeFlyout);

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFlyout();
  });
}

/**
 * Abre el flyout con los datos de un proyecto.
 * @param {Object} data - { type, title, desc, tags, links, extra }
 *   links: array de { label, url, icon } — icon: 'github'|'itch'|'yt'|'external'
 *   extra: HTML libre para añadir dentro del panel (opcional)
 */
function openFlyout(data) {
  const overlay = document.querySelector('.flyout-overlay');
  const panel   = overlay.querySelector('.flyout-panel');

  // Construir el contenido del panel
  panel.innerHTML = `
    <button class="flyout-close" aria-label="Cerrar panel">✕</button>

    <p class="flyout-label label">${data.type || ''}</p>
    <h2 class="flyout-title">${data.title || ''}</h2>
    <p class="flyout-desc">${data.desc || ''}</p>

    ${data.tags?.length ? `
      <div class="flyout-divider"></div>
      <p class="flyout-meta-label">Tecnologías</p>
      <div class="flyout-tags">
        ${data.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}
      </div>
    ` : ''}

    ${data.extra || ''}

    ${data.links?.length ? `
      <div class="flyout-divider"></div>
      <p class="flyout-meta-label">Enlaces</p>
      <div class="flyout-links">
        ${data.links.map(l => `
          <a href="${l.url}" target="_blank" rel="noopener" class="flyout-link-btn">
            ${getLinkIcon(l.icon)}
            <span>${l.label}</span>
          </a>
        `).join('')}
      </div>
    ` : `
      <div class="flyout-divider"></div>
      <p class="flyout-meta-label">Estado</p>
      <p style="font-size:0.88rem; color:var(--text-muted); font-style:italic;">
        Proyecto en progreso — los enlaces estarán disponibles próximamente.
      </p>
    `}
  `;

  // Re-registrar el botón X (innerHTML lo destruye)
  panel.querySelector('.flyout-close')
       .addEventListener('click', closeFlyout);

  // Abrir
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFlyout() {
  const overlay = document.querySelector('.flyout-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Devuelve un SVG inline según el tipo de enlace.
 * Añade más tipos aquí cuando los necesites.
 */
function getLinkIcon(type) {
  const icons = {
    github:   `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
    itch:     `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3.13 1.338C2.08 1.96.02 4.328 0 4.95v1.3c0 1.65 1.547 3.1 2.95 3.1 1.68 0 3.082-1.376 3.082-3.027 0 1.65 1.37 3.027 3.05 3.027 1.68 0 3.008-1.376 3.008-3.027 0 1.65 1.46 3.027 3.14 3.027h.032c1.68 0 3.14-1.376 3.14-3.027 0 1.65 1.326 3.027 3.005 3.027 1.404 0 2.95-1.45 2.95-3.1V4.95c-.02-.622-2.08-2.99-3.13-3.612-4.577-.2-9.195-.2-13.038 0zm6.95 9.268c-.457.003-.91.082-1.33.244-.047.018-.09.04-.136.06C7.633 11.476 6.38 13.104 6.38 15.7c0 .44.04.896.12 1.362.36 2.13 1.493 3.89 2.61 5.205.558.658 1.112 1.2 1.553 1.57.22.186.41.328.56.424.075.05.14.085.193.11.054.026.09.04.114.046.026.007.04.01.04.01s.014-.003.04-.01c.025-.006.06-.02.113-.046.054-.025.118-.06.193-.11.15-.096.34-.238.56-.424.44-.37.995-.912 1.553-1.57 1.117-1.315 2.25-3.074 2.61-5.205.08-.466.12-.922.12-1.362 0-2.596-1.253-4.224-2.234-4.79a4.083 4.083 0 00-.135-.06c-.42-.16-.874-.24-1.33-.243h-.057zm-.023 1.96h.135c.822 0 2.15.48 2.15 4.132 0 2.493-1.32 5.042-2.217 5.88-.895-.838-2.216-3.387-2.216-5.88 0-3.652 1.327-4.13 2.148-4.132zm-.068 2.85c-.53 0-.96.432-.96.965s.43.966.96.966c.53 0 .96-.433.96-.966s-.43-.965-.96-.965z"/></svg>`,
    yt:       `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`,
    external: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    pdf:      `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
  };
  return icons[type] || icons.external;
}


/* ── 3. COMPARADOR DE IMAGEN ANTES/DESPUÉS ────────────────
   Uso:
   <div class="img-compare" id="compare-1">
     <img class="img-compare-before" src="sin_render.jpg" alt="Sin render">
     <img class="img-compare-after"  src="con_render.jpg" alt="Con render">
     <div class="img-compare-slider"></div>
   </div>

   Llama a initImageCompare() al cargar la página.
   Funciona con mouse y touch.
   ──────────────────────────────────────────────────────── */

function initImageCompare() {
  const comparers = document.querySelectorAll('.img-compare');

  comparers.forEach(el => {
    const after  = el.querySelector('.img-compare-after');
    const slider = el.querySelector('.img-compare-slider');
    let isDragging = false;

    function setPosition(x) {
      const rect  = el.getBoundingClientRect();
      let pct     = (x - rect.left) / rect.width;
      pct         = Math.max(0, Math.min(1, pct));
      const pctPx = `${pct * 100}%`;

      after.style.clipPath        = `inset(0 ${100 - pct * 100}% 0 0)`;
      slider.style.left           = pctPx;
    }

    // Mouse events
    slider.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup',   () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });

    // Touch events
    slider.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
    window.addEventListener('touchend',   () => { isDragging = false; });
    window.addEventListener('touchmove',  (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    // Clic directo en el contenedor (sin drag)
    el.addEventListener('click', (e) => setPosition(e.clientX));
  });
}


/* ── 4. SCROLL: SOMBRA DEL NAVBAR ─────────────────────────
   Añade una sombra sutil al navbar cuando se hace scroll.
   ──────────────────────────────────────────────────────── */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });
}


/* ── INICIALIZACIÓN ───────────────────────────────────────
   Todo arranca aquí. El DOMContentLoaded garantiza que el
   HTML esté listo antes de tocar nada.
   ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initBanner();
  initFlyout();
  initImageCompare();
  initNavbarScroll();
});