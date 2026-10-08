import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiaCardComponent } from '../../components/noticia-card/noticia-card.component';

/**
 * Pagina Favoritos (antes favoritos.html + js/favoritos.js).
 * La lista se calcula cruzando las noticias con los IDs guardados en localStorage.
 * Al quitar un favorito desde una tarjeta, la lista se actualiza sola porque depende de signals;
 * en la Entrega 2 habia que volver a pintar todo con una funcion render().
 */
@Component({
  selector: 'app-favoritos',
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './favoritos.component.html',
})
export class FavoritosComponent {
  private readonly noticias = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);

  protected readonly cargando = this.noticias.cargando;

  protected readonly guardadas = computed(() => {
    const ids = this.favoritos.lista();
    return this.noticias.noticias().filter((n) => ids.includes(n.id));
  });

  /** Texto del subtitulo: "Aun no tienes...", "1 articulo guardado" o "N articulos guardados". */
  protected readonly resumen = computed(() => {
    const total = this.guardadas().length;
    if (total === 0) return 'Aún no tienes artículos guardados.';
    return total === 1 ? '1 artículo guardado' : `${total} artículos guardados`;
  });
}
