const API =
"https://script.google.com/macros/s/AKfycbwWmHO7LeVWncSBxfmYUGauUUr1_nYPDywnJphT2g-9ZjuskrW5DCunWvsxZY-kk4lq/exec";

let productos = [];
let lineas = [];
let subcategorias = [];
let ofertas = [];

document.addEventListener(
  "DOMContentLoaded",
  iniciar
);

async function iniciar() {

  await cargarLineas();
  await cargarProductos();
  await cargarOfertas();
  await cargarDonYuca();

}

async function obtenerDatos(accion) {

  const respuesta =
    await fetch(
      `${API}?accion=${accion}`
    );

  return await respuesta.json();

}

async function cargarLineas() {

  lineas =
    await obtenerDatos(
      "lineas"
    );

  const contenedor =
    document.getElementById(
      "contenedorLineas"
    );

  contenedor.innerHTML = "";

  lineas.slice(1).forEach(
    linea => {

      const boton =
        document.createElement(
          "button"
        );

      boton.textContent =
        linea[1];

      boton.className =
        "btn-linea";

      contenedor.appendChild(
        boton
      );

    }
  );

}

async function cargarProductos() {

  productos =
    await obtenerDatos(
      "productos"
    );

  const contenedor =
    document.getElementById(
      "contenedorProductos"
    );

  contenedor.innerHTML = "";

  productos.slice(1).forEach(
    producto => {

      if (
        String(producto[10])
        .toUpperCase() !== "SI"
      ) return;

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "producto-card";

      card.innerHTML = `
        <img src="${producto[9]}" alt="${producto[3]}">

        <h3>${producto[3]}</h3>

        <p>${producto[4]}</p>

        <p>
          Desde $${producto[6]}
        </p>

        <button>
          Ver producto
        </button>
      `;

      contenedor.appendChild(
        card
      );

    }
  );

}

async function cargarOfertas() {

  ofertas =
    await obtenerDatos(
      "ofertas"
    );

  const contenedor =
    document.getElementById(
      "contenedorOfertas"
    );

  contenedor.innerHTML = "";

  ofertas.slice(1).forEach(
    oferta => {

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "oferta-card";

      div.innerHTML = `
        <h3>${oferta[0]}</h3>
        <p>$${oferta[1]}</p>
      `;

      contenedor.appendChild(
        div
      );

    }
  );

}

async function cargarDonYuca() {

  const mensajes =
    await obtenerDatos(
      "mensaje"
    );

  if (
    mensajes.length > 1
  ) {

    document.getElementById(
      "mensajeDonYuca"
    ).textContent =
      mensajes[1][0];

  }

}