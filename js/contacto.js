/* ============================================================
   TecnoNoticias - Pagina Contacto
   Validaciones basicas del formulario en el lado del cliente.

   El manejo de formularios (etiquetas <form>, <input>, <textarea>,
   <label>, <button>) fue visto en Lectura fundamental 2 - HTML
   (seccion "Construccion de Formularios").
   ============================================================ */

(function initContacto() {
  const form = document.getElementById("contact-form");
  const rightCol = document.getElementById("contact-right");
  if (!form) return;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Valida los campos y devuelve un objeto {campo: mensaje} con los errores.
   * @param {Object} data
   */
  function validar(data) {
    const errors = {};
    if (!data.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!data.email.trim()) errors.email = "El correo es obligatorio.";
    else if (!EMAIL_REGEX.test(data.email)) errors.email = "Introduce un correo válido.";
    if (!data.asunto.trim()) errors.asunto = "El asunto es obligatorio.";
    if (!data.mensaje.trim()) errors.mensaje = "El mensaje es obligatorio.";
    else if (data.mensaje.trim().length < 20) errors.mensaje = "El mensaje debe tener al menos 20 caracteres.";
    return errors;
  }

  /** Aplica o quita clases de error visualmente */
  function mostrarErrores(errors) {
    form.querySelectorAll(".form-field").forEach(field => {
      const name = field.getAttribute("data-field");
      const errEl = field.querySelector(".form-error");
      if (errors[name]) {
        field.classList.add("has-error");
        errEl.textContent = errors[name];
      } else {
        field.classList.remove("has-error");
        errEl.textContent = "";
      }
    });
  }

  /** Limpia el error de un campo cuando el usuario escribe */
  form.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
      const field = input.closest(".form-field");
      if (!field) return;
      field.classList.remove("has-error");
      const errEl = field.querySelector(".form-error");
      if (errEl) errEl.textContent = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      asunto: form.asunto.value,
      mensaje: form.mensaje.value,
    };

    const errors = validar(data);
    if (Object.keys(errors).length > 0) {
      mostrarErrores(errors);
      // Focus al primer campo con error
      const firstBad = form.querySelector(".has-error input, .has-error textarea");
      if (firstBad) firstBad.focus();
      return;
    }

    // Exito: reemplaza el formulario por el mensaje de confirmacion
    rightCol.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3>Mensaje recibido</h3>
        <p>Gracias por contactar con TecnoPress. Nuestro equipo editorial revisará tu mensaje y te responderá en un plazo de 24 a 48 horas.</p>
        <button type="button" class="btn btn-outline" id="btn-otro">Enviar otro mensaje</button>
      </div>
    `;

    document.getElementById("btn-otro").addEventListener("click", () => {
      window.location.reload();
    });
  });
})();
