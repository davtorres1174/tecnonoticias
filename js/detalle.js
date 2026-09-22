/* ============================================================
   TecnoNoticias - Pagina Detalle de noticia
   Lee ?id=N de la URL y muestra la noticia completa.

   El uso de la URL con parametros (?id=) forma parte del modelo
   de peticiones HTTP visto en Lectura fundamental 1 -
   Introduccion al Desarrollo Web.
   El contenido renderizado (articulo con titulo, subtitulo,
   parrafos, imagen y enlaces) corresponde a las etiquetas HTML
   vistas en Lectura fundamental 2 - HTML.
   ============================================================ */

(async function initDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  const cont = document.getElementById("detalle-contenido");
  if (!cont) return;

  if (isNaN(id)) {
    cont.innerHTML = `<p style="color:var(--color-text-muted);text-align:center;padding:3rem;">Noticia no encontrada. <a href="noticias.html" style="color:var(--color-primary);">Ver el catálogo</a>.</p>`;
    return;
  }

  const noticias = await cargarNoticias();
  const noticia = noticias.find(n => n.id === id);

  if (!noticia) {
    cont.innerHTML = `<p style="color:var(--color-text-muted);text-align:center;padding:3rem;">Noticia no encontrada. <a href="noticias.html" style="color:var(--color-primary);">Ver el catálogo</a>.</p>`;
    return;
  }

  document.title = `${noticia.title} · TecnoNoticias`;

  // Sugerencias: 2 misma categoria + 1 otra
  const sameCat = noticias.filter(n => n.id !== id && n.category === noticia.category).slice(0, 2);
  const others = noticias.filter(n => n.id !== id && n.category !== noticia.category).slice(0, 2);
  const sugerencias = [...sameCat, ...others].slice(0, 3);

  const fav = esFavorito(noticia.id);
  const catClass = badgeClass(noticia.category);

  cont.innerHTML = `
    <div class="detail-layout">
      <article>
        <span class="badge ${catClass}">${noticia.category}</span>
        <h1 class="detail-title">${noticia.title}</h1>
        <p class="detail-subtitle">${noticia.subtitle}</p>

        <div class="detail-author-bar">
          <div class="detail-author">
            <div class="detail-avatar">${noticia.author.charAt(0)}</div>
            <div class="detail-author-info">
              <div class="name">${noticia.author}</div>
              <div class="meta">${noticia.date} · ${noticia.readTime} de lectura</div>
            </div>
          </div>
          <button class="btn-fav-detail ${fav ? "active" : ""}" data-fav="${noticia.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${fav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="btn-fav-label">${fav ? "En favoritos" : "Guardar"}</span>
          </button>
        </div>

        <div class="detail-image">
          <img src="${noticia.image}" alt="${noticia.title}">
        </div>

        <div class="detail-body">
          ${noticia.body.map(p => `<p>${p}</p>`).join("")}
        </div>
      </article>

      <aside>
        <h3 class="detail-sidebar-title">
          <span class="detail-sidebar-title-line"></span>
          También te puede interesar
        </h3>
        <div id="sugerencias">
          ${sugerencias.map(n => cardHTML(n, "compact")).join("")}
        </div>
      </aside>
    </div>
  `;

  // Enlazar boton de favorito principal
  const btnFav = cont.querySelector(".btn-fav-detail");
  if (btnFav) {
    btnFav.addEventListener("click", (e) => {
      e.preventDefault();
      const active = toggleFavorito(noticia.id);
      btnFav.classList.toggle("active", active);
      const svg = btnFav.querySelector("svg");
      if (svg) svg.setAttribute("fill", active ? "currentColor" : "none");
      const label = btnFav.querySelector(".btn-fav-label");
      if (label) label.textContent = active ? "En favoritos" : "Guardar";
      renderHeader("detail");
    });
  }
})();
