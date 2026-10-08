import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { NoticiaCardComponent } from '../../components/noticia-card/noticia-card.component';

/**
 * Pagina de Inicio (antes index.html + js/home.js).
 * Las noticias destacadas y el resto se obtienen del NoticiasService, que ya las separa;
 * la plantilla solo las recorre con @for y las pinta con <app-noticia-card>.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly noticias = inject(NoticiasService);
}
