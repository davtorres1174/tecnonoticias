import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Noticia, NuevaNoticia } from '../models/noticia.model';
import { FavoritosService } from './favoritos.service';

/** Noticias creadas por el usuario desde la pagina de Gestion. */
const CREADAS_KEY = 'tecnonoticias-creadas';
/** IDs de noticias del JSON original que el usuario elimino. */
const ELIMINADAS_KEY = 'tecnonoticias-eliminadas';
/** Versiones editadas de noticias del JSON original, indexadas por ID. */
const EDITADAS_KEY = 'tecnonoticias-editadas';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * Servicio de noticias.
 *
 * - Carga las noticias base desde public/data/noticias.json con una peticion HTTP GET
 *   (modelo cliente-servidor y protocolo HTTP: visto en Lectura fundamental 1 - Introduccion al Desarrollo Web).
 * - Implementa el CRUD de noticias: crear, leer, editar y eliminar. Como el sitio es estatico
 *   (no hay servidor propio), los cambios se guardan en localStorage y se combinan con el JSON base:
 *     noticias visibles = creadas por el usuario + (JSON base - eliminadas, con las ediciones aplicadas)
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly favoritos = inject(FavoritosService);

  private readonly base = signal<Noticia[]>([]);
  private readonly creadas = signal<Noticia[]>(this.leer<Noticia[]>(CREADAS_KEY, []));
  private readonly eliminadas = signal<number[]>(this.leer<number[]>(ELIMINADAS_KEY, []));
  private readonly editadas = signal<Record<number, Noticia>>(this.leer<Record<number, Noticia>>(EDITADAS_KEY, {}));

  /** true mientras se descarga el JSON. */
  readonly cargando = signal(true);
  /** Mensaje de error si el JSON no se pudo cargar. */
  readonly error = signal<string | null>(null);

  /** Todas las noticias visibles: primero las creadas por el usuario (mas recientes), luego las del JSON. */
  readonly noticias = computed<Noticia[]>(() => [
    ...this.creadas(),
    ...this.base()
      .filter((n) => !this.eliminadas().includes(n.id))
      .map((n) => this.editadas()[n.id] ?? n),
  ]);

  /** Noticias marcadas como destacadas (portada del Inicio). */
  readonly destacadas = computed(() => this.noticias().filter((n) => n.featured));

  /** Resto de noticias (seccion "Mas noticias" del Inicio). */
  readonly noDestacadas = computed(() => this.noticias().filter((n) => !n.featured));

  /** Cantidad de noticias del JSON original que fueron eliminadas o editadas. */
  readonly totalModificadas = computed(
    () => this.eliminadas().length + Object.keys(this.editadas()).length,
  );

  constructor() {
    this.http.get<Noticia[]>('data/noticias.json').subscribe({
      next: (datos) => {
        this.base.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las noticias. Intenta recargar la página.');
        this.cargando.set(false);
      },
    });
  }

  /** Busca una noticia visible por su ID. */
  porId(id: number): Noticia | undefined {
    return this.noticias().find((n) => n.id === id);
  }

  /** CRUD - Crear: agrega una noticia nueva y la guarda en localStorage. */
  crear(datos: NuevaNoticia): Noticia {
    const todosLosIds = [...this.base(), ...this.creadas()].map((n) => n.id);
    const nueva: Noticia = {
      ...datos,
      id: Math.max(0, ...todosLosIds) + 1,
      date: this.fechaHoy(),
      custom: true,
    };
    this.creadas.update((lista) => [nueva, ...lista]);
    this.escribir(CREADAS_KEY, this.creadas());
    return nueva;
  }

  /**
   * CRUD - Editar: reemplaza los datos de una noticia conservando su ID y su fecha.
   * Si la noticia la creo el usuario, se actualiza en su lista; si viene del JSON,
   * se guarda una version editada que se aplica encima de la original.
   */
  actualizar(id: number, datos: NuevaNoticia): Noticia | undefined {
    const actual = this.porId(id);
    if (!actual) return undefined;
    const editada: Noticia = { ...actual, ...datos, id: actual.id, date: actual.date };

    if (actual.custom) {
      this.creadas.update((lista) => lista.map((n) => (n.id === id ? editada : n)));
      this.escribir(CREADAS_KEY, this.creadas());
    } else {
      this.editadas.update((mapa) => ({ ...mapa, [id]: editada }));
      this.escribir(EDITADAS_KEY, this.editadas());
    }
    return editada;
  }

  /** CRUD - Eliminar: quita la noticia (creada o del JSON) y la saca de favoritos. */
  eliminar(id: number): void {
    if (this.creadas().some((n) => n.id === id)) {
      this.creadas.update((lista) => lista.filter((n) => n.id !== id));
      this.escribir(CREADAS_KEY, this.creadas());
    } else {
      this.eliminadas.update((lista) => [...lista, id]);
      this.escribir(ELIMINADAS_KEY, this.eliminadas());
    }
    this.favoritos.quitar(id);
  }

  /** Deshace las ediciones y eliminaciones hechas sobre las noticias originales del JSON. */
  restaurarOriginales(): void {
    this.eliminadas.set([]);
    this.editadas.set({});
    this.escribir(ELIMINADAS_KEY, []);
    this.escribir(EDITADAS_KEY, {});
  }

  /** true si la noticia original del JSON fue modificada por el usuario. */
  fueEditada(id: number): boolean {
    return id in this.editadas();
  }

  private fechaHoy(): string {
    const hoy = new Date();
    return `${hoy.getDate()} ${MESES[hoy.getMonth()]} ${hoy.getFullYear()}`;
  }

  private leer<T>(clave: string, porDefecto: T): T {
    try {
      const raw = localStorage.getItem(clave);
      return raw ? (JSON.parse(raw) as T) : porDefecto;
    } catch {
      return porDefecto;
    }
  }

  private escribir(clave: string, valor: unknown): void {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Si el almacenamiento no esta disponible, los cambios duran solo mientras la pagina este abierta.
    }
  }
}
