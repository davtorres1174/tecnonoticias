import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { CATEGORIAS, Noticia, NuevaNoticia, badgeClass } from '../../models/noticia.model';

interface FormularioNoticia {
  title: string;
  subtitle: string;
  category: string;
  author: string;
  minutos: number | null;
  imagen: string;
  imagenUrl: string;
  cuerpo: string;
  featured: boolean;
}

type ErroresNoticia = Partial<Record<keyof FormularioNoticia, string>>;

/** Mensaje que aparece sobre el formulario despues de crear o editar. */
interface Aviso {
  texto: string;
  noticia: Noticia;
}

/** Opcion del selector de imagen: las imagenes locales de public/img o una URL externa. */
const URL_EXTERNA = '__url__';

/**
 * Pagina Gestion de noticias: CRUD de noticias (caracteristica 6 del proyecto).
 *  - Crear: formulario con validaciones y two-way binding [(ngModel)].
 *  - Leer: lista con todas las noticias visibles.
 *  - Editar: el boton "Editar" carga la noticia en el mismo formulario.
 *  - Eliminar: boton por fila, con confirmacion.
 * Los cambios se guardan en localStorage a traves del NoticiasService.
 */
@Component({
  selector: 'app-gestion',
  imports: [FormsModule, RouterLink],
  templateUrl: './gestion.component.html',
})
export class GestionComponent {
  protected readonly noticias = inject(NoticiasService);

  protected readonly categorias = CATEGORIAS;
  protected readonly URL_EXTERNA = URL_EXTERNA;
  protected readonly imagenesLocales = [
    { ruta: 'img/ia-generativa.jpg', nombre: 'Inteligencia artificial (cerebro digital)' },
    { ruta: 'img/spacex-marte.jpg', nombre: 'Lanzamiento espacial' },
    { ruta: 'img/ciberataque-global.jpg', nombre: 'Ciberseguridad (pantalla de código)' },
    { ruta: 'img/tesla-model-omega.jpg', nombre: 'Vehículo eléctrico' },
    { ruta: 'img/computacion-cuantica.jpg', nombre: 'Computación cuántica' },
    { ruta: 'img/realidad-mixta-quirofano.jpg', nombre: 'Tecnología médica' },
    { ruta: 'img/hero.jpg', nombre: 'Circuito tecnológico (portada)' },
  ];

  protected form: FormularioNoticia = this.vacio();
  protected readonly errores = signal<ErroresNoticia>({});
  protected readonly aviso = signal<Aviso | null>(null);
  /** Noticia que se esta editando; null cuando el formulario esta en modo "crear". */
  protected readonly editando = signal<Noticia | null>(null);

  protected readonly badgeClass = badgeClass;

  /** Ruta final de la imagen segun la opcion elegida. */
  protected get imagenFinal(): string {
    return this.form.imagen === URL_EXTERNA ? this.form.imagenUrl.trim() : this.form.imagen;
  }

  private validar(f: FormularioNoticia): ErroresNoticia {
    const e: ErroresNoticia = {};
    if (f.title.trim().length < 10) e.title = 'El título debe tener al menos 10 caracteres.';
    if (f.subtitle.trim().length < 20) e.subtitle = 'La descripción breve debe tener al menos 20 caracteres.';
    if (!f.category) e.category = 'Selecciona una categoría.';
    if (!f.author.trim()) e.author = 'El autor es obligatorio.';
    if (!f.minutos || f.minutos < 1 || f.minutos > 60) e.minutos = 'Indica un tiempo de lectura entre 1 y 60 minutos.';
    if (f.imagen === URL_EXTERNA && !/^https?:\/\/.+/i.test(f.imagenUrl.trim())) {
      e.imagenUrl = 'Escribe una URL válida que empiece por http:// o https://';
    }
    if (f.cuerpo.trim().length < 50) e.cuerpo = 'El contenido debe tener al menos 50 caracteres.';
    return e;
  }

  /** Convierte el formulario en los datos que espera el servicio. */
  private aDatos(f: FormularioNoticia): NuevaNoticia {
    return {
      title: f.title.trim(),
      subtitle: f.subtitle.trim(),
      category: f.category,
      author: f.author.trim(),
      readTime: `${f.minutos} min`,
      image: this.imagenFinal,
      featured: f.featured,
      // Cada linea en blanco separa un parrafo del cuerpo de la noticia.
      body: f.cuerpo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    };
  }

  /** CRUD - Crear o Editar, segun el modo del formulario (event binding (ngSubmit)). */
  protected guardar(): void {
    const errores = this.validar(this.form);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) {
      document.getElementById(`n-${Object.keys(errores)[0]}`)?.focus();
      return;
    }

    const datos = this.aDatos(this.form);
    const enEdicion = this.editando();
    if (enEdicion) {
      const editada = this.noticias.actualizar(enEdicion.id, datos);
      if (editada) this.aviso.set({ texto: 'Cambios guardados en', noticia: editada });
    } else {
      this.aviso.set({ texto: 'Noticia creada:', noticia: this.noticias.crear(datos) });
    }
    this.editando.set(null);
    this.form = this.vacio();
  }

  /** CRUD - Editar: carga la noticia en el formulario y lo lleva a la vista. */
  protected editar(noticia: Noticia): void {
    const minutos = parseInt(noticia.readTime, 10);
    const esLocal = this.imagenesLocales.some((img) => img.ruta === noticia.image);
    this.form = {
      title: noticia.title,
      subtitle: noticia.subtitle,
      category: noticia.category,
      author: noticia.author,
      minutos: Number.isNaN(minutos) ? 5 : minutos,
      imagen: esLocal ? noticia.image : URL_EXTERNA,
      imagenUrl: esLocal ? '' : noticia.image,
      // Los parrafos se unen con una linea en blanco, el mismo formato que usa el formulario.
      cuerpo: noticia.body.join('\n\n'),
      featured: noticia.featured,
    };
    this.editando.set(noticia);
    this.errores.set({});
    this.aviso.set(null);
    document.getElementById('form-noticia')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('n-title')?.focus({ preventScroll: true });
  }

  protected cancelarEdicion(): void {
    this.editando.set(null);
    this.limpiarFormulario();
  }

  /** CRUD - Eliminar (con confirmacion, metodo confirm() del objeto window: Lectura fundamental 4) */
  protected eliminar(noticia: Noticia): void {
    if (confirm(`¿Eliminar la noticia "${noticia.title}"?`)) {
      this.noticias.eliminar(noticia.id);
      if (this.aviso()?.noticia.id === noticia.id) this.aviso.set(null);
      if (this.editando()?.id === noticia.id) this.cancelarEdicion();
    }
  }

  protected restaurar(): void {
    if (confirm('¿Deshacer los cambios y eliminaciones hechos sobre las noticias originales?')) {
      this.noticias.restaurarOriginales();
      this.cancelarEdicion();
    }
  }

  protected limpiarError(campo: keyof FormularioNoticia): void {
    if (this.errores()[campo]) {
      this.errores.update((e) => ({ ...e, [campo]: undefined }));
    }
  }

  protected limpiarFormulario(): void {
    this.form = this.vacio();
    this.errores.set({});
  }

  private vacio(): FormularioNoticia {
    return {
      title: '', subtitle: '', category: '', author: '', minutos: 5,
      imagen: 'img/ia-generativa.jpg', imagenUrl: '', cuerpo: '', featured: false,
    };
  }
}
