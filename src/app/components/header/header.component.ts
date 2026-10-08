import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
import { LogoComponent } from '../logo/logo.component';

interface ItemMenu {
  label: string;
  ruta: string;
  /** true solo para Inicio: evita que quede "activo" en todas las rutas. */
  exacta?: boolean;
}

/**
 * Header fijo con el logo y el menu de navegacion (5 paginas).
 * - routerLink / routerLinkActive marcan en rojo la pagina actual.
 * - El badge de Favoritos usa interpolacion {{ }} con el contador del FavoritosService.
 * - En moviles el menu se abre y cierra con un boton (event binding (click)).
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly favoritos = inject(FavoritosService);

  /** Estado del menu movil. */
  protected readonly menuAbierto = signal(false);

  protected readonly items: ItemMenu[] = [
    { label: 'Inicio', ruta: '/', exacta: true },
    { label: 'Noticias', ruta: '/noticias' },
    { label: 'Favoritos', ruta: '/favoritos' },
    { label: 'Gestión', ruta: '/gestion' },
    { label: 'Contacto', ruta: '/contacto' },
  ];

  protected alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
