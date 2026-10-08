import { Component, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Noticia, badgeClass } from '../../models/noticia.model';
import { FavoritosService } from '../../services/favoritos.service';

export type VarianteCard = 'default' | 'featured' | 'compact';

/**
 * Tarjeta de noticia reutilizable. Reemplaza la funcion cardHTML() de la Entrega 2,
 * que armaba el HTML como texto; ahora la tarjeta es un componente con su propia plantilla.
 *
 * Uso (property binding de entrada):
 *   <app-noticia-card [noticia]="n" variante="featured" />
 *
 * Variantes:
 *   featured -> tarjeta grande de la Portada (Inicio)
 *   default  -> tarjeta del catalogo, "Mas noticias" y Favoritos
 *   compact  -> fila pequena de la barra lateral del Detalle
 */
@Component({
  selector: 'app-noticia-card',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './noticia-card.component.html',
  styles: `
    :host { display: block; }
    :host > article { height: 100%; }
  `,
})
export class NoticiaCardComponent {
  private readonly favoritos = inject(FavoritosService);

  // Entradas del componente: input() es la forma actual del decorador @Input, que recibe
  // datos del componente padre mediante data binding. Visto en Lectura fundamental 8 (Entrada y Salida).
  readonly noticia = input.required<Noticia>();
  readonly variante = input<VarianteCard>('default');

  /** Se recalcula solo cuando cambia la lista de favoritos o la noticia. */
  protected readonly esFavorito = computed(() => this.favoritos.lista().includes(this.noticia().id));
  protected readonly claseBadge = computed(() => badgeClass(this.noticia().category));

  /** Event binding: el corazon guarda o quita la noticia sin abrir el detalle. */
  protected alternarFavorito(evento: Event): void {
    evento.preventDefault();
    evento.stopPropagation();
    this.favoritos.alternar(this.noticia().id);
  }
}
