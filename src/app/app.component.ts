import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

/**
 * Componente raiz. Arma el esqueleto comun de todas las paginas:
 * header fijo, contenido de la ruta actual (<router-outlet>) y footer.
 * En la Entrega 2 este esqueleto se repetia en cada archivo HTML; ahora se define una sola vez.
 * Definicion de componentes con el decorador @Component (selector, template, imports):
 * visto en Lectura fundamental 7 - Framework Angular y Lectura fundamental 8 - Framework Angular Parte 2.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class AppComponent {}
