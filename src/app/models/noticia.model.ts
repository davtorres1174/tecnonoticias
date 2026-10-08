/**
 * Modelo de datos de una noticia.
 * Coincide con la estructura de cada objeto en public/data/noticias.json.
 * Tipos de datos (string, number, boolean, arreglos): visto en Lectura fundamental 4 - El Lenguaje JavaScript.
 */
export interface Noticia {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  body: string[];
  /** true si la noticia fue creada por el usuario desde la pagina de Gestion (mini CRUD) */
  custom?: boolean;
}

/** Datos que el formulario de Gestion envia para crear una noticia (el id y la fecha los asigna el servicio). */
export type NuevaNoticia = Omit<Noticia, 'id' | 'date' | 'custom'>;

/** Categorias disponibles en el periodico, en el orden en que se muestran en los filtros. */
export const CATEGORIAS: string[] = [
  'Inteligencia Artificial',
  'Exploración Espacial',
  'Ciberseguridad',
  'Movilidad Eléctrica',
  'Computación Cuántica',
  'MedTech',
];

/** Clase CSS del badge de cada categoria (definidas en src/styles.css). */
export function badgeClass(categoria: string): string {
  const mapa: Record<string, string> = {
    'Inteligencia Artificial': 'badge-ia',
    'Exploración Espacial': 'badge-espacial',
    'Ciberseguridad': 'badge-ciber',
    'Movilidad Eléctrica': 'badge-movilidad',
    'Computación Cuántica': 'badge-cuantica',
    'MedTech': 'badge-medtech',
  };
  return mapa[categoria] ?? 'badge-default';
}
