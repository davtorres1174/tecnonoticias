/* ============================================================
   TecnoNoticias - Logica de la pagina de inicio (Home)
   Renderiza noticias destacadas y "mas noticias".

   La peticion HTTP para obtener los datos (fetch a data/noticias.json)
   sigue el modelo cliente-servidor visto en
   Lectura fundamental 1 - Introduccion al Desarrollo Web.
   Las etiquetas HTML generadas dinamicamente (article, div, img,
   encabezados, parrafos, enlaces) corresponden a
   Lectura fundamental 2 - HTML.
   ============================================================ */

(async function initHome() {
  const noticias = await cargarNoticias();
  if (noticias.length === 0) return;

  const destacadas = noticias.filter(n => n.featured);
  const resto = noticias.filter(n => !n.featured);

  const contDestacadas = document.getElementById("destacadas");
  const contMas = document.getElementById("mas-noticias");

  if (contDestacadas) {
    contDestacadas.innerHTML = destacadas.map(n => cardHTML(n, "featured")).join("");
    enlazarBotonesFav(contDestacadas);
  }

  if (contMas) {
    contMas.innerHTML = resto.map(n => cardHTML(n, "default")).join("");
    enlazarBotonesFav(contMas);
  }
})();
