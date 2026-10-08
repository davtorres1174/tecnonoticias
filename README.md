# TecnoNoticias — versión Angular

Aplicativo web tipo periódico digital especializado en tecnología, desarrollado para el
módulo **Desarrollo de Front-End** del **Politécnico Grancolombiano** (2026).

Es la **Entrega 3 – Entrega final**: migración a **Angular 19** del prototipo en HTML, CSS y
JavaScript de la Entrega 2, más la gestión de noticias (CRUD: crear, editar y eliminar).

## Vistas y rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `#/` | `HomeComponent` | Hero, portada con noticias destacadas, más noticias y banner de favoritos. |
| `#/noticias` | `NoticiasComponent` | Catálogo con filtros por categoría. |
| `#/noticia/:id` | `DetalleComponent` | Noticia completa, botones Guardar y Contactar, sugerencias relacionadas. |
| `#/favoritos` | `FavoritosComponent` | Noticias guardadas por el usuario (localStorage). |
| `#/gestion` | `GestionComponent` | **CRUD de noticias**: crear, editar y eliminar. |
| `#/contacto` | `ContactoComponent` | Formulario con validaciones y mensaje de confirmación. |

## Estructura

```
src/
├── index.html                 Página base (fuentes, <base href>, <app-root>)
├── styles.css                 Estilos globales (tema oscuro con acentos rojos)
├── main.ts                    Arranque de la aplicación
└── app/
    ├── app.component.ts       Esqueleto: header + <router-outlet> + footer
    ├── app.config.ts          HttpClient y Router (rutas con #)
    ├── app.routes.ts          Rutas de las 6 vistas
    ├── models/
    │   └── noticia.model.ts   Interfaz Noticia, categorías y colores de badge
    ├── services/
    │   ├── noticias.service.ts    Carga del JSON + crear/editar/eliminar (localStorage)
    │   └── favoritos.service.ts   Favoritos (localStorage)
    ├── components/            Componentes reutilizables
    │   ├── header/            Menú con contador de favoritos y menú móvil
    │   ├── footer/
    │   ├── logo/
    │   └── noticia-card/      Tarjeta de noticia (variantes featured, default y compact)
    └── pages/                 Un componente por vista
        ├── home/  noticias/  detalle/  favoritos/  gestion/  contacto/
public/
├── data/noticias.json         Noticias base
└── img/                       Imágenes locales
```

## Conceptos de Angular aplicados

- **Componentes standalone**: uno por vista y otros reutilizables (header, footer, logo, tarjeta).
- **Binding**:
  - interpolación `{{ noticia.title }}`;
  - property binding `[src]`, `[routerLink]`, `[class.active]`;
  - event binding `(click)`, `(ngSubmit)`;
  - two-way binding `[(ngModel)]` en los formularios de Contacto y Gestión (crear y editar).
- **Entradas de componente** (`input()`): `<app-noticia-card [noticia]="n" variante="featured" />`.
- **Servicios** con inyección de dependencias (`inject()`), compartidos por toda la aplicación.
- **Signals** (`signal`, `computed`) para el estado: filtros, favoritos y lista de noticias.
- **Router** con rutas parametrizadas (`noticia/:id`) y títulos por página.
- **HttpClient** para leer `data/noticias.json`.
- Control de flujo en plantillas: `@if`, `@for`, `@switch`.

## Ejecutar en local

Se necesita Node.js 18 o superior y Angular CLI.

```bash
npm install
npm start
```

Luego abre <http://localhost:4200>.

## Publicar en GitHub Pages

El sitio se publica desde la carpeta `docs/` de la rama `RamaAngular`.

1. Compila:

   ```bash
   npm run build:gh-pages
   ```

   Usa la configuración `gh-pages` de `angular.json`: compila en modo producción, con
   `baseHref` `/tecnonoticias/`, directo en `docs/`, y crea `docs/.nojekyll` para que
   GitHub no procese el sitio con Jekyll.
2. Haz commit de la carpeta `docs/` y súbela con `git push`.
3. En GitHub, en *Settings → Pages*, elige la rama `RamaAngular` y la carpeta `/docs`.

Cada vez que cambies el código, repite los pasos 1 y 2.

Las rutas usan `#` (por ejemplo `/#/noticias`) para que GitHub Pages no responda 404 al
recargar una página interna. Si el repositorio cambia de nombre, actualiza `baseHref` en la
configuración `gh-pages` de `angular.json`.

## Autor

Julián David Quintero Herrera — Politécnico Grancolombiano — 2026
