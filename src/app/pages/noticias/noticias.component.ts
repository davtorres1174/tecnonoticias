import { Component, computed, inject, signal } from '@angular/core';
import { NoticiasService } from '../../services/noticias.service';
import { NoticiaCardComponent } from '../../components/noticia-card/noticia-card.component';
import { CATEGORIAS } from '../../models/noticia.model';

/**
 * Pagina Listado de noticias (antes noticias.html + js/noticias.js).
 * El filtro activo es un signal: al hacer clic en una categoria cambia su valor y
 * la lista filtrada (computed) se recalcula sola, sin recorrer el DOM a mano.
 */
@Component({
  selector: 'app-noticias',
  imports: [NoticiaCardComponent],
  templateUrl: './noticias.component.html',
})
export class NoticiasComponent {
  protected readonly noticias = inject(NoticiasService);

  protected readonly categorias = ['Todas', ...CATEGORIAS];
  protected readonly categoriaActiva = signal('Todas');

  protected readonly filtradas = computed(() => {
    const categoria = this.categoriaActiva();
    const todas = this.noticias.noticias();
    return categoria === 'Todas' ? todas : todas.filter((n) => n.category === categoria);
  });

  /** Event binding (click) de cada boton de filtro. */
  protected filtrar(categoria: string): void {
    this.categoriaActiva.set(categoria);
  }
}
