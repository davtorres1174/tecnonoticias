import { Injectable, computed, signal } from '@angular/core';

/** Clave del localStorage donde se guardan los IDs de las noticias favoritas. */
const FAVORITOS_KEY = 'tecnonoticias-favoritos';

/**
 * Servicio de favoritos.
 * Guarda los IDs de las noticias marcadas por el usuario en localStorage para que
 * se conserven al recargar la pagina o cerrar el navegador.
 * Al ser un servicio "root", todos los componentes comparten la misma lista,
 * por eso el contador del header se actualiza en cuanto se guarda una noticia.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  /** Lista reactiva (signal) con los IDs favoritos. */
  private readonly ids = signal<number[]>(this.leer());

  /** Cantidad de favoritos (se muestra como badge en el menu). */
  readonly total = computed(() => this.ids().length);

  /** Copia de solo lectura de los IDs favoritos. */
  readonly lista = this.ids.asReadonly();

  esFavorito(id: number): boolean {
    return this.ids().includes(id);
  }

  /** Agrega o quita una noticia de favoritos. Devuelve true si quedo como favorita. */
  alternar(id: number): boolean {
    const actual = this.ids();
    const quedaFavorito = !actual.includes(id);
    this.guardar(quedaFavorito ? [...actual, id] : actual.filter((f) => f !== id));
    return quedaFavorito;
  }

  /** Quita una noticia de favoritos (se usa cuando la noticia se elimina en Gestion). */
  quitar(id: number): void {
    if (this.esFavorito(id)) {
      this.guardar(this.ids().filter((f) => f !== id));
    }
  }

  private guardar(ids: number[]): void {
    this.ids.set(ids);
    try {
      localStorage.setItem(FAVORITOS_KEY, JSON.stringify(ids));
    } catch {
      // Navegacion privada o almacenamiento bloqueado: la lista sigue funcionando en memoria.
    }
  }

  private leer(): number[] {
    try {
      const raw = localStorage.getItem(FAVORITOS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
