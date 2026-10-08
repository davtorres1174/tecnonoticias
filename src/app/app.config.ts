import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // HttpClient: permite leer data/noticias.json con peticiones HTTP GET.
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      // Rutas con # (ej: /#/noticias). GitHub Pages solo sirve archivos estaticos y responde 404
      // si se recarga una ruta como /noticias; con el # el navegador siempre pide index.html.
      withHashLocation(),
      // Al cambiar de pagina, la vista vuelve al inicio (como al abrir un HTML nuevo).
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
  ],
};
