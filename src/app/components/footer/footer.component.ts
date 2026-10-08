import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIAS } from '../../models/noticia.model';
import { LogoComponent } from '../logo/logo.component';

/** Pie de pagina comun a todas las vistas: marca, secciones, categorias y creditos. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, LogoComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  /** Solo se muestran las 4 primeras categorias, como en el mockup. */
  protected readonly categorias = CATEGORIAS.slice(0, 4);
  protected readonly anio = new Date().getFullYear();
}
