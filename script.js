let tipo = "movie";
let paginanueva = 1;
let peticion = false;

window.onload = () => {
  const inputBusqueda = document.getElementById("busqueda");
  let timeout;

  


  inputBusqueda.addEventListener("input", () => {
      const valor = inputBusqueda.value.trim();
      if (valor.length >= 3) {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
              paginanueva = 1;
              peticionAjaxPost();
          }, 300);
      }
  });

  document.getElementById("btn").addEventListener("click", () => {
      paginanueva = 1;
      peticionAjaxPost();
  });

  document.getElementById("peliculas").addEventListener("click", () => {
      tipo = "movie";
      paginanueva = 1;
      peticionAjaxPost();
  });

  document.getElementById("series").addEventListener("click", () => {
      tipo = "series";
      paginanueva = 1;
      peticionAjaxPost();
  });


  // Scroll infinito
  window.addEventListener("scroll", () => {
      const posicionActual = window.scrollY + window.innerHeight;
      const zonaActivar = document.body.offsetHeight * 0.9;
      if (posicionActual >= zonaActivar && !peticion) {
          cargarMas();
      }
  });
};



function activarLoader(show) {
  const loader = document.getElementById("loader");
  if (show) {
      loader.classList.remove("hidden");
  } else {
      loader.classList.add("hidden");
  }
}

// Realizar peticion
function peticionAjaxPost() {
  const busqueda = document.getElementById("busqueda").value.trim();
  if (!busqueda) return;

  activarLoader(true);

  fetch(`https://www.omdbapi.com/?apikey=6e9fdded&s=${busqueda}&type=${tipo}&page=${paginanueva}`)
      .then((res) => res.json())
      .then((data) => {
          activarLoader(false);

          if (data.Response === "True") {
              const milista = document.getElementById("milista");


              if (paginanueva === 1) milista.innerHTML = "";

              data.Search.forEach((pelicula) => {
                  const li = document.createElement("li");

                  const poster = pelicula.Poster !== "N/A" ? pelicula.Poster : "no-image.png";

                  li.innerHTML = `
                      <img src="${poster}" alt="${pelicula.Title}" data-id="${pelicula.imdbID}">
                      <p><strong>${pelicula.Title}</strong> (${pelicula.Year})</p>
                  `;

                  li.querySelector("img").addEventListener("click", () => {
                      mostrarDetalles(pelicula.imdbID);
                  });

                  milista.appendChild(li);
              });
          }})}

// Mostrar los detalles de una película
function mostrarDetalles(imdbID) {
  activarLoader(true);


  fetch(`https://www.omdbapi.com/?apikey=6e9fdded&i=${imdbID}`)
      .then((res) => res.json())
      .then((data) => {
          activarLoader(false);

          if (data.Response === "True") {

              const detallesContent = document.getElementById("detalles-content");
              detallesContent.innerHTML = `
                  <h2>${data.Title} (${data.Year})</h2>
                  <img src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/200x300?text=No+Image"}" alt="${data.Title}">
                  <p><strong>Género:</strong> ${data.Genre}</p>
                  <p><strong>Director:</strong> ${data.Director}</p>
                  <p><strong>Actores:</strong> ${data.Actors}</p>
                  <p><strong>Sinopsis:</strong> ${data.Plot}</p>
                  <p><strong>Calificación:</strong> ${data.imdbRating} / 10</p>
              `;


              const modal = document.getElementById("detalles");
              modal.style.display = "flex";


              modal.querySelector(".close").addEventListener("click", () => {
                  modal.style.display = "none";
              });
          }})}



function cargarMas() {
    if (!peticion) {
        peticion = true;
        paginanueva++;

        peticionAjaxPost();
        peticion = false;
    }
}

