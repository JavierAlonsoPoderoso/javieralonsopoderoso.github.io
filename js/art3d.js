/* ============================================================
   art3d.js — Solo para art3d.html (se carga DESPUÉS de main.js)
   Módulos:
   1. Pestañas de proyecto (con enlace directo: art3d.html#gato)
   2. Selector de animaciones (vídeos)
   3. Modelos 3D: avisar si falta el archivo
   ============================================================ */

/* ── 1. PESTAÑAS ──────────────────────────────────────────
   Cada botón .art-tab tiene data-target="id-del-panel".
   Mostrar un proyecto = marcar su pestaña y su panel como .active
   (el CSS hace el resto: .art-panel solo se ve con .active).
   ──────────────────────────────────────────────────────── */
function initArtTabs() {
  const tabs   = [...document.querySelectorAll('.art-tab[data-target]')];
  const panels = [...document.querySelectorAll('.art-panel')];
  if (!panels.length) return;

  function show(id, updateHash) {
    // Si el id no existe (o no hay hash), abrir el primer panel
    if (!panels.some(p => p.id === id)) id = panels[0].id;

    tabs.forEach(t => {
      const on = t.dataset.target === id;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);   // accesibilidad
    });
    panels.forEach(p => p.classList.toggle('active', p.id === id));

    // replaceState cambia la URL sin hacer scroll ni llenar el historial
    if (updateHash) history.replaceState(null, '', '#' + id);
  }

  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.target, true)));
  show(location.hash.slice(1), false);   // al cargar: respetar #gato / #arana
}

/* ── 2. SELECTOR DE ANIMACIONES ───────────────────────────
   Un solo <video> por tarjeta [data-anim]; los botones le
   cambian el src. Si el archivo no existe, se oculta el vídeo
   y se ve el aviso de "pendiente" que hay detrás.
   ──────────────────────────────────────────────────────── */
function initAnimPickers() {
  document.querySelectorAll('[data-anim]').forEach(card => {
    const video = card.querySelector('video');
    const ph    = card.querySelector('.slot-ph');
    const btns  = [...card.querySelectorAll('.anim-btn')];

    video.addEventListener('error',      () => video.classList.add('missing'));
    video.addEventListener('loadeddata', () => video.classList.remove('missing'));

    function select(btn, autoplay) {
      btns.forEach(b => b.classList.toggle('active', b === btn));
      ph.textContent = 'Vídeo pendiente · ' + btn.dataset.src;
      video.src = btn.dataset.src;
      if (autoplay) video.play().catch(() => {});  // el navegador puede bloquear play()
    }

    btns.forEach(b => b.addEventListener('click', () => select(b, true)));
    select(btns[0], false);   // cargar la primera sin reproducir
  });
}

/* ── 3. MODELOS 3D ────────────────────────────────────────
   <model-viewer> dispara "error" si el .glb no se encuentra.
   ──────────────────────────────────────────────────────── */
function initModelViewers() {
  document.querySelectorAll('model-viewer').forEach(mv => {
    mv.addEventListener('error', () => mv.classList.add('missing'));
    mv.addEventListener('load',  () => mv.classList.remove('missing'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initArtTabs();
  initAnimPickers();
  initModelViewers();
});
