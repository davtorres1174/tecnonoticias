import { Component, input } from '@angular/core';

/**
 * Logo de la marca: cuadro rojo + "TECNO" + palabra en rojo.
 * Se reutiliza en el header ("TECNONOTICIAS") y en el footer ("TECNOPRESS"),
 * igual que en los mockups de Figma.
 * Property binding de entrada: <app-logo texto="PRESS" />
 */
@Component({
  selector: 'app-logo',
  template: `
    <span class="brand-mark" aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="0" y="0" width="4" height="4" fill="white" />
        <rect x="6" y="0" width="4" height="4" fill="white" />
        <rect x="0" y="6" width="4" height="4" fill="white" />
        <rect x="6" y="6" width="4" height="4" fill="white" />
      </svg>
    </span>
    <span class="brand-text">TECNO<span>{{ texto() }}</span></span>
  `,
  styles: `:host { display: inline-flex; align-items: center; gap: 0.5rem; }`,
})
export class LogoComponent {
  /** Palabra que va en rojo despues de "TECNO". */
  readonly texto = input('NOTICIAS');
}
