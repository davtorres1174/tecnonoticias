/* ============================================================
   TecnoNoticias - Pagina Listado (catalogo con filtros)

   La peticion HTTP para cargar los datos (fetch) se apoya en el
   protocolo HTTP visto en Lectura fundamental 1 - Introduccion
   al Desarrollo Web. Las etiquetas HTML del catalogo (article,
   button, encabezados, parrafos, imagenes) fueron vistas en
   Lectura fundamental 2 - HTML.
   ============================================================ */

(async function initCatalog() {
  const noticias = await cargarNoticias();
  if (noticias.length === 0) return;

  // Categorias unicas + Todas al inicio
  const categorias = ["Todas", ...Array.from(new Set(noticias.map(n => n.category)))];
  let categoriaActiva = "Todas";

  const contFiltros = document.getElementById("filtros");
  const contLista = document.getElementById("lista-noticias");

  /** Renderiza los botones de filtro */
  function renderFiltros() {
    contFiltros.innerHTML = categorias.map(cat => `
      <button class="filter-btn ${cat === categoriaActiva ? "active" : ""}" data-cat="${cat}">
        ${cat}
      </button>
    `).join("");

    contFiltros.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        categoriaActiva = btn.getAttribute("data-cat");
        renderFiltros();
        renderLista();
      });
    });
  }

  /** Renderiza la lista de noticias filtradas */
  function renderLista() {
    const filtradas = categoriaActiva === "Todas"
      ? noticias
      : noticias.filter(n => n.category === categoriaActiva);

    if (filtradas.length === 0) {
      contLista.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1;text-align:center;padding:3rem;">No hay noticias en esta categoría.</p>`;
      return;
    }

    contLista.innerHTML = filtradas.map(n => cardHTML(n, "default")).join("");
    enlazarBotonesFav(contLista);
  }

  renderFiltros();
  renderLista();
})();
