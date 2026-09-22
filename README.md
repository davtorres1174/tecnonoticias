# TecnoNoticias

Aplicativo web tipo periódico digital especializado en tecnología, desarrollado como
parte del módulo **Desarrollo de Front-End** del **Politécnico Gran Colombiano**
(Materia Frontend, agosto 2026).

Es la **Entrega 2 – Prototipo funcional** del proyecto, construida en HTML, CSS y
JavaScript vanilla, siguiendo la maquetación aprobada en la Entrega 1.

## Vistas

| Página             | Archivo           | Descripción                                                                 |
| ------------------ | ----------------- | --------------------------------------------------------------------------- |
| Inicio             | `index.html`      | Hero, noticias destacadas, más noticias y banner de favoritos.              |
| Listado de noticias| `noticias.html`   | Catálogo con filtros por categoría.                                         |
| Detalle            | `detalle.html`    | Vista completa del artículo con sugerencias relacionadas (`?id=N`).         |
| Favoritos          | `favoritos.html`  | Lista personal, persistida en `localStorage`.                               |
| Contacto           | `contacto.html`   | Formulario con validaciones y mensaje de confirmación.                      |

## Estructura del proyecto

```
front tecnonoticias/
├── index.html
├── noticias.html
├── detalle.html
├── favoritos.html
├── contacto.html
├── css/
│   └── styles.css
├── js/
│   ├── common.js       # Header, footer, utilidades y favoritos
│   ├── home.js
│   ├── noticias.js
│   ├── detalle.js
│   ├── favoritos.js
│   └── contacto.js
├── data/
│   └── noticias.json   # Base de datos local de noticias
└── README.md
```

## Tecnologías

- **HTML5** semántico
- **CSS3** con variables personalizadas (tema oscuro, acentos rojos)
- **JavaScript** (ES6+) vanilla, con `fetch` para leer el JSON de noticias
- **localStorage** para persistir la lista de favoritos entre sesiones
- Fuentes **Playfair Display** e **Inter** desde Google Fonts
- Imágenes desde **Unsplash** (uso educativo)

## Funcionalidades implementadas

1. **Renderizado dinámico** de noticias desde `data/noticias.json`.
2. **Filtrado por categoría** en la vista de listado (Todas, IA, Ciberseguridad,
   Exploración Espacial, Movilidad Eléctrica, Computación Cuántica, MedTech).
3. **Gestión de favoritos** persistida en `localStorage` con contador en el header.
4. **Vista de detalle** con parámetro `?id=` y noticias sugeridas.
5. **Formulario de contacto** con validaciones (obligatoriedad, formato de email,
   longitud mínima) y confirmación visual al enviar.
6. **Diseño responsive** para escritorio, tablet y móvil.

## Cómo ejecutar el proyecto

Como el sitio carga `data/noticias.json` mediante `fetch`, es necesario servirlo
desde un servidor HTTP (no basta con abrir el `index.html` haciendo doble clic).

Opciones sencillas:

**Con Python 3:**
```bash
cd "front tecnonoticias"
python -m http.server 8080
```
Luego abre <http://localhost:8080>.

**Con Node.js (npx):**
```bash
npx serve .
```

**Con la extensión Live Server de VS Code** (recomendada): botón derecho sobre
`index.html` → *Open with Live Server*.

## Autor

David Torres — Politécnico Gran Colombiano — 2026
