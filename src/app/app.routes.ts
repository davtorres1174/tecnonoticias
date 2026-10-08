import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { GestionComponent } from './pages/gestion/gestion.component';

/**
 * Rutas del aplicativo. Cada ruta reemplaza a uno de los archivos HTML de la Entrega 2:
 *   index.html -> ''   noticias.html -> 'noticias'   detalle.html?id=N -> 'noticia/N'
 *   favoritos.html -> 'favoritos'   contacto.html -> 'contacto'
 * La ruta 'gestion' es nueva: mini CRUD para crear y eliminar noticias.
 */
export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'TecnoNoticias · El futuro, hoy' },
  { path: 'noticias', component: NoticiasComponent, title: 'Todas las noticias · TecnoNoticias' },
  { path: 'noticia/:id', component: DetalleComponent, title: 'Detalle · TecnoNoticias' },
  { path: 'favoritos', component: FavoritosComponent, title: 'Mis favoritos · TecnoNoticias' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto · TecnoNoticias' },
  { path: 'gestion', component: GestionComponent, title: 'Gestión de noticias · TecnoNoticias' },
  { path: '**', redirectTo: '' },
];
