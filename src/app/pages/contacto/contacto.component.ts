import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface MensajeContacto {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

type Errores = Partial<Record<keyof MensajeContacto, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pagina Contacto (antes contacto.html + js/contacto.js).
 * Los campos usan two-way binding con [(ngModel)]: lo que el usuario escribe queda
 * en el objeto "datos" y lo que se asigna a "datos" aparece en el campo.
 * Las reglas de validacion son las mismas de la Entrega 2.
 * Data binding en plantillas: visto en Lectura fundamental 7 y Lectura fundamental 8 - Framework Angular.
 */
@Component({
  selector: 'app-contacto',
  imports: [FormsModule],
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  protected datos: MensajeContacto = this.vacio();
  protected readonly errores = signal<Errores>({});
  protected readonly enviado = signal(false);

  /** Validaciones basicas del lado del cliente (campos obligatorios, formato de correo, longitud minima). */
  private validar(d: MensajeContacto): Errores {
    const e: Errores = {};
    if (!d.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    if (!d.email.trim()) e.email = 'El correo es obligatorio.';
    else if (!EMAIL_REGEX.test(d.email)) e.email = 'Introduce un correo válido.';
    if (!d.asunto.trim()) e.asunto = 'El asunto es obligatorio.';
    if (!d.mensaje.trim()) e.mensaje = 'El mensaje es obligatorio.';
    else if (d.mensaje.trim().length < 20) e.mensaje = 'El mensaje debe tener al menos 20 caracteres.';
    return e;
  }

  /** Event binding (ngSubmit): valida y, si todo esta bien, muestra la confirmacion. */
  protected enviar(): void {
    const errores = this.validar(this.datos);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) {
      // Lleva el foco al primer campo con error para que el usuario lo corrija.
      const primero = Object.keys(errores)[0];
      document.getElementById(primero)?.focus();
      return;
    }
    this.enviado.set(true);
  }

  /** Al escribir en un campo se borra su mensaje de error. */
  protected limpiarError(campo: keyof MensajeContacto): void {
    if (this.errores()[campo]) {
      this.errores.update((e) => ({ ...e, [campo]: undefined }));
    }
  }

  protected nuevoMensaje(): void {
    this.datos = this.vacio();
    this.errores.set({});
    this.enviado.set(false);
  }

  private vacio(): MensajeContacto {
    return { nombre: '', email: '', asunto: '', mensaje: '' };
  }
}
