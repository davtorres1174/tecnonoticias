/* ============================================================
   TecnoNoticias - Modulo comun (utilidades, header, footer)
   Se ejecuta en todas las paginas del sitio

   Referencias:
   - Comunicacion cliente-servidor y peticiones HTTP:
     visto en Lectura fundamental 1 - Introduccion al Desarrollo Web
   - Estructura HTML generada dinamicamente (header, nav, footer,
     etiquetas <a href>, <img>, formularios, encabezados):
     visto en Lectura fundamental 2 - HTML
   ============================================================ */

// Clave del localStorage donde se guardan los IDs de favoritos
const FAVORITES_KEY = "tecnonoticias-favoritos";

/**
 * Devuelve el array de IDs de noticias marcadas como favoritas.
 * Si no hay nada guardado, devuelve un array vacio.
 */
function getFavoritos() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Guarda el array de IDs de favoritos en localStorage.
 * @param {number[]} ids
 */
function setFavoritos(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error("No se pudo guardar en localStorage", e);
  }
}

/**
 * Alterna el estado favorito de una noticia.
 * @param {number} id ID de la noticia
 * @returns {boolean} true si quedo como favorito, false si se removio
 */
function toggleFavorito(id) {
  const favs = getFavoritos();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    setFavoritos(favs);
    return false;
  }
  favs.push(id);
  setFavoritos(favs);
  return true;
}

/** Indica si una noticia esta marcada como favorita */
function esFavorito(id) {
  return getFavoritos().includes(id);
}

/**
 * Devuelve la clase CSS del badge segun la categoria.
 * @param {string} categoria
 */
function badgeClass(categoria) {
  const map = {
    "Inteligencia Artificial": "badge-ia",
    "Exploración Espacial": "badge-espacial",
    "Ciberseguridad": "badge-ciber",
    "Movilidad Eléctrica": "badge-movilidad",
    "Computación Cuántica": "badge-cuantica",
    "MedTech": "badge-medtech",
  };
  return map[categoria] || "badge-default";
}

/**
 * Carga las noticias desde el JSON local.
 * Se realiza una peticion HTTP GET al recurso data/noticias.json,
 * segun el modelo cliente/servidor y el protocolo HTTP
 * (peticion y respuesta) visto en Lectura fundamental 1 - Introduccion al Desarrollo Web.
 * @returns {Promise<Array>} Array de objetos noticia
 */
async function cargarNoticias() {
  try {
    const res = await fetch("data/noticias.json");
    if (!res.ok) throw new Error("No se pudo cargar noticias.json");
    return await res.json();
  } catch (e) {
    console.error("Error cargando noticias:", e);
    return [];
  }
}

/**
 * Renderiza el header en el elemento #site-header.
 * Se inyecta HTML dinamicamente con etiquetas <a href>, <nav> y <svg>
 * segun lo visto en Lectura fundamental 2 - HTML.
 * @param {string} pagina - identificador de la pagina actual (home, catalog, favorites, contact, detail)
 */
function renderHeader(pagina) {
  const header = document.getElementById("site-header");
  if (!header) return;

  const favCount = getFavoritos().length;
  const items = [
    { label: "Inicio", href: "index.html", key: "home" },
    { label: "Noticias", href: "noticias.html", key: "catalog" },
    { label: "Favoritos", href: "favoritos.html", key: "favorites" },
    { label: "Contacto", href: "contacto.html", key: "contact" },
  ];

  header.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="brand" aria-label="Ir al inicio">
        <span class="brand-mark" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="0" y="0" width="4" height="4" fill="white" />
            <rect x="6" y="0" width="4" height="4" fill="white" />
            <rect x="0" y="6" width="4" height="4" fill="white" />
            <rect x="6" y="6" width="4" height="4" fill="white" />
          </svg>
        </span>
        <span class="brand-text">TECNO<span>NOTICIAS</span></span>
      </a>

      <nav class="nav" id="site-nav">
        ${items.map(item => `
          <a href="${item.href}" class="nav-item ${item.key === pagina ? "active" : ""}">
            ${item.label}
            ${item.key === "favorites" && favCount > 0
              ? `<span class="nav-badge">${favCount}</span>`
              : ""}
          </a>
        `).join("")}
      </nav>

      <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menu">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
    <div class="nav-mobile container" id="nav-mobile">
      ${items.map(item => `
        <a href="${item.href}" class="nav-item ${item.key === pagina ? "active" : ""}">
          ${item.label}${item.key === "favorites" && favCount > 0 ? ` (${favCount})` : ""}
        </a>
      `).join("")}
    </div>
  `;

  // Toggle menu movil
  const toggle = document.getElementById("nav-toggle");
  const mobile = document.getElementById("nav-mobile");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      mobile.classList.toggle("open");
    });
  }
}

/** Renderiza el footer en el elemento #site-footer */
function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-cols">
        <div class="footer-col">
          <a href="index.html" class="brand">
            <span class="brand-mark" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="0" y="0" width="4" height="4" fill="white" />
                <rect x="6" y="0" width="4" height="4" fill="white" />
                <rect x="0" y="6" width="4" height="4" fill="white" />
                <rect x="6" y="6" width="4" height="4" fill="white" />
              </svg>
            </span>
            <span class="brand-text">TECNO<span>PRESS</span></span>
          </a>
          <p>El periódico digital de referencia para los profesionales de la tecnología en español. Periodismo riguroso, análisis profundo.</p>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Secciones</h4>
          <ul class="footer-list">
            <li><a href="index.html">Inicio</a></li>
            <li><a href="noticias.html">Noticias</a></li>
            <li><a href="favoritos.html">Favoritos</a></li>
            <li><a href="contacto.html">Contacto</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Categorías</h4>
          <ul class="footer-list">
            <li><span>Inteligencia Artificial</span></li>
            <li><span>Ciberseguridad</span></li>
            <li><span>Exploración Espacial</span></li>
            <li><span>Movilidad Eléctrica</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 TecnoPress. Todos los derechos reservados.</span>
        <span>Politécnico Gran Colombiano · Materia Frontend 2026</span>
      </div>
    </div>
  `;
}

/**
 * Genera el HTML de una card de noticia.
 * @param {Object} n Noticia
 * @param {"default"|"featured"|"compact"} variant Tipo de card
 * @returns {string}
 */
function cardHTML(n, variant = "default") {
  const fav = esFavorito(n.id);
  const cat = badgeClass(n.category);

  const heartSvg = (filled) => `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  `;

  if (variant === "compact") {
    return `
      <a href="detalle.html?id=${n.id}" class="card-compact">
        <div class="card-compact-img">
          <img src="${n.image}" alt="${n.title}" loading="lazy">
        </div>
        <div class="card-compact-info">
          <span class="badge ${cat}">${n.category}</span>
          <h4 class="card-compact-title">${n.title}</h4>
          <span class="card-compact-meta">${n.date} · ${n.readTime}</span>
        </div>
      </a>
    `;
  }

  if (variant === "featured") {
    return `
      <article class="card-featured" data-id="${n.id}">
        <a href="detalle.html?id=${n.id}" class="card-image">
          <img src="${n.image}" alt="${n.title}" loading="lazy">
          <div class="card-image-overlay"></div>
          <div class="card-image-badge">
            <span class="badge ${cat}">${n.category}</span>
          </div>
        </a>
        <div class="card-body">
          <a href="detalle.html?id=${n.id}">
            <h3 class="card-title">${n.title}</h3>
          </a>
          <p class="card-desc">${n.subtitle}</p>
          <div class="card-meta">
            <div class="card-meta-info">
              <span>${n.author}</span>
              <span class="card-meta-dot"></span>
              <span>${n.date}</span>
            </div>
            <div class="card-actions">
              <button class="btn-fav ${fav ? "active" : ""}" data-fav="${n.id}" title="${fav ? "Quitar de favoritos" : "Agregar a favoritos"}" aria-label="Marcar como favorito">
                ${heartSvg(fav)}
              </button>
              <a class="btn-more" href="detalle.html?id=${n.id}">Ver más →</a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // default
  return `
    <article class="card" data-id="${n.id}">
      <a href="detalle.html?id=${n.id}" class="card-image">
        <img src="${n.image}" alt="${n.title}" loading="lazy">
        <div class="card-image-overlay"></div>
        <div class="card-image-badge">
          <span class="badge ${cat}">${n.category}</span>
        </div>
      </a>
      <div class="card-body">
        <a href="detalle.html?id=${n.id}">
          <h3 class="card-title">${n.title}</h3>
        </a>
        <p class="card-desc">${n.subtitle}</p>
        <div class="card-footer">
          <span>${n.readTime} lectura</span>
          <div class="card-actions">
            <button class="btn-fav ${fav ? "active" : ""}" data-fav="${n.id}" aria-label="Marcar como favorito">
              ${heartSvg(fav)}
            </button>
            <a class="btn-more" href="detalle.html?id=${n.id}">Ver más →</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Enlaza los click a botones de favorito dentro de un contenedor.
 * @param {HTMLElement} container
 * @param {Function} [onChange] Callback opcional invocado al cambiar
 */
function enlazarBotonesFav(container, onChange) {
  container.querySelectorAll("[data-fav]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.getAttribute("data-fav"), 10);
      const active = toggleFavorito(id);
      btn.classList.toggle("active", active);
      // Actualizar icono relleno
      const path = btn.querySelector("svg");
      if (path) path.setAttribute("fill", active ? "currentColor" : "none");
      // Actualizar badge del header
      renderHeader(document.body.dataset.page || "");
      if (typeof onChange === "function") onChange(id, active);
    });
  });
}

// Al cargar la pagina, montamos header y footer
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  renderHeader(page);
  renderFooter();
});
