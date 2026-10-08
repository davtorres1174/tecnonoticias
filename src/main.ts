/*
 * Punto de arranque de la aplicacion Angular: monta el componente raiz (AppComponent)
 * en la etiqueta <app-root> de index.html.
 * Creacion de aplicaciones Angular con Angular CLI (ng new, ng serve): visto en
 * Lectura fundamental 7 - Framework Angular. En lugar de un NgModule (Lectura fundamental 8)
 * se usan componentes "standalone", la forma recomendada desde Angular 17.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
