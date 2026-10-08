import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { NoticiasService } from '../../services/noticias.service';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiaCardComponent } from '../../components/noticia-card/noticia-card.component';
import { badgeClass } from '../../models/noticia.model';

/**
 * Pagina Detalle de una noticia (antes detalle.html?id=N + js/detalle.js).
 * El ID ahora viene de la ruta /noticia/:id en lugar del parametro ?id= de la URL.
 * Como la ruta es reactiva, al pulsar una sugerencia de la barra lateral la vista
 * cambia de noticia sin recargar la pagina.
 */
@Component({
  selector: 'app-detalle',
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './detalle.component.html',
})
export class DetalleComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly titulo = inject(Title);
  protected readonly noticias = inject(NoticiasService);
  protected readonly favoritos = inject(FavoritosService);

  /** ID numerico leido de la ruta (NaN si no es un numero). */
  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => Number(p.get('id')))), { initialValue: NaN });

  /** Noticia actual o undefined si no existe (o fue eliminada). */
  protected readonly noticia = computed(() => this.noticias.porId(this.id()));

  protected readonly claseBadge = computed(() => badgeClass(this.noticia()?.category ?? ''));
  protected readonly esFavorito = computed(() => this.favoritos.lista().includes(this.id()));

  /** Sugerencias: primero de la misma categoria, luego de otras; maximo 3. */
  protected readonly sugerencias = computed(() => {
    const actual = this.noticia();
    if (!actual) return [];
    const otras = this.noticias.noticias().filter((n) => n.id !== actual.id);
    const misma = otras.filter((n) => n.category === actual.category);
    const distinta = otras.filter((n) => n.category !== actual.category);
    return [...misma.slice(0, 2), ...distinta].slice(0, 3);
  });

  constructor() {
    // Actualiza el titulo de la pestana del navegador con el titulo de la noticia.
    effect(() => {
      const n = this.noticia();
      if (n) this.titulo.setTitle(`${n.title} · TecnoNoticias`);
    });
  }

  protected alternarFavorito(): void {
    this.favoritos.alternar(this.id());
  }
}
