/* ============================================================
   TecnoNoticias - Pagina Favoritos
   Muestra las noticias guardadas por el usuario en localStorage.

   La estructura visual (cards con imagen, titulo, parrafo y
   enlaces) corresponde a las etiquetas HTML vistas en
   Lectura fundamental 2 - HTML.
   ============================================================ */

(async function initFavoritos() {
  const noticias = await cargarNoticias();
  const ids = getFavoritos();
  const favs = noticias.filter(n => ids.includes(n.id));

  const cont = document.getElementById("fav-contenido");
  const subtitle = document.getElementById("fav-subtitle");
  if (!cont) return;

  /** Renderiza el estado actual (vacio o con noticias) */
  function render() {
    const currentIds = getFavoritos();
    const currentFavs = noticias.filter(n => currentIds.includes(n.id));

    if (subtitle) {
      subtitle.textContent = currentFavs.length === 0
        ? "Aún no tienes artículos guardados."
        : `${currentFavs.length} artículo${currentFavs.length !== 1 ? "s" : ""} guardado${currentFavs.length !== 1 ? "s" : ""}`;
    }

    if (currentFavs.length === 0) {
      cont.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <p class="empty-text">Guarda artículos desde el catálogo</p>
          <a href="noticias.html" class="btn btn-primary">Explorar noticias</a>
        </div>
      `;
      return;
    }

    cont.innerHTML = `<div class="grid grid-3">${currentFavs.map(n => cardHTML(n, "default")).join("")}</div>`;
    // Al remover de favoritos, re-renderizar
    enlazarBotonesFav(cont, () => render());
  }

  render();
})();
