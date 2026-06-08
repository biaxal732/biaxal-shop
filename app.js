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

  await cargarDestacados();

  await cargarOfertas();

  await cargarDonYuca();

  activarBuscador();

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

const todos =
  document.createElement(
    "button"
  );

todos.textContent =
  "TODOS";

todos.className =
  "btn-linea";

todos.addEventListener(
  "click",
  cargarProductos
);

contenedor.appendChild(
  todos
);

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
      
      boton.addEventListener(
  "click",
  () => {

    filtrarLinea(
      linea[1]
    );

  }
);

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

      crearTarjetaProducto(
  producto,
  contenedor
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

function filtrarProductos(
  texto
){

  const contenedor =
    document.getElementById(
      "contenedorProductos"
    );

  contenedor.innerHTML = "";

  productos
    .slice(1)
    .forEach(producto => {

      if(
        String(producto[10])
        .toUpperCase()
        !== "SI"
      ) return;

      const nombre =
        String(producto[3])
        .toUpperCase();

      const descripcion =
  String(producto[4])
  .toUpperCase();

const linea =
  String(producto[1])
  .toUpperCase();

const subcategoria =
  String(producto[2])
  .toUpperCase();

     if(
  nombre.includes(texto)
  ||
  descripcion.includes(texto)
  ||
  linea.includes(texto)
  ||
  subcategoria.includes(texto)
){

  crearTarjetaProducto(
    producto,
    contenedor
  );

}

});

/*
=================================
TARJETA PRODUCTO
=================================
*/

function crearTarjetaProducto(
  producto,
  contenedor
){

  const card =
    document.createElement(
      "div"
    );

  card.className =
    "producto-card";

  card.innerHTML = `
    <img
      src="${producto[9]}"
      alt="${producto[3]}"
    >

    <h3>
      ${producto[3]}
    </h3>

    <p>
      ${producto[4]}
    </p>

    <p>
      Desde $${producto[6]}
    </p>

   <button
  onclick="agregarAlCarrito('${producto[0]}')"
>
  AGREGAR AL CARRITO
</button>
  `;

  contenedor.appendChild(
    card
  );

}

/*
=================================
CARRITO BIAXAL
=================================
*/

let carrito = [];

function obtenerPrecioProducto(
  producto,
  cantidad
){

  if(cantidad >= 20){
    return Number(producto[8]);
  }

  if(cantidad >= 6){
    return Number(producto[7]);
  }

  return Number(producto[6]);

}

function agregarAlCarrito(
  productoId
){

  const producto =
    productos.find(
      p => p[0] === productoId
    );

  if(!producto){
    return;
  }

  let cantidad = 1;

  if(
    String(producto[5])
    .toUpperCase()
    === "L"
    ||
    String(producto[5])
    .toUpperCase()
    === "KG"
  ){
    cantidad = 0.5;
  }

  const precio =
    obtenerPrecioProducto(
      producto,
      cantidad
    );

  const existente =
    carrito.find(
      item =>
      item.id === productoId
    );

  if(existente){

    existente.cantidad +=
      cantidad;

    existente.subtotal =
      existente.cantidad *
      obtenerPrecioProducto(
        producto,
        existente.cantidad
      );

  }else{

    carrito.push({

      id: producto[0],

      nombre: producto[3],

      unidad: producto[5],

      cantidad: cantidad,

      precio: precio,

      subtotal:
        cantidad * precio

    });

  }

  actualizarCarrito();

}

function actualizarCarrito(){

  const lista =
    document.getElementById(
      "listaCarrito"
    );

  const subtotalHTML =
    document.getElementById(
      "subtotal"
    );

  const envioHTML =
    document.getElementById(
      "envio"
    );

  const totalHTML =
    document.getElementById(
      "total"
    );

  lista.innerHTML = "";

  let subtotal = 0;

  carrito.forEach(item => {

    subtotal +=
      item.subtotal;

    const div =
      document.createElement(
        "div"
      );

    div.innerHTML = `
      ${item.nombre}
      -
      ${item.cantidad}
      ${item.unidad}
      -
      $${item.subtotal.toFixed(2)}
    `;

    lista.appendChild(div);

  });

  let envio = 30;

  if(subtotal >= 50){
    envio = 0;
  }

  const total =
    subtotal + envio;

  subtotalHTML.textContent =
    "$" +
    subtotal.toFixed(2);

  envioHTML.textContent =
    "$" +
    envio.toFixed(2);

  totalHTML.textContent =
    "$" +
    total.toFixed(2);

}

/*
=================================
FILTRO POR LINEA
=================================
*/

function filtrarLinea(
  nombreLinea
){

  const contenedor =
    document.getElementById(
      "contenedorProductos"
    );

  contenedor.innerHTML = "";

  productos
    .slice(1)
    .forEach(producto => {

      if(
        String(producto[10])
        .toUpperCase() !== "SI"
      ) return;

      if(
  String(producto[1]).trim().toUpperCase()
  !==
  String(nombreLinea).trim().toUpperCase()
) return;
        
      crearTarjetaProducto(
        producto,
        contenedor
      );

    });

}

/*
=================================
PRODUCTOS DESTACADOS
=================================
*/

async function cargarDestacados(){

  if(!productos.length){
  return;
}

  const contenedor =
    document.getElementById(
      "contenedorDestacados"
    );

  contenedor.innerHTML = "";

  productos
    .slice(1)
    .forEach(producto => {

      if(
        String(producto[10])
        .toUpperCase() !== "SI"
      ) return;

      if(
        String(producto[11])
        .toUpperCase() !== "SI"
      ) return;

      crearTarjetaProducto(
        producto,
        contenedor
      );

    });

}

/*
=================================
MINIMIZAR DON YUCA
=================================
*/

document.addEventListener(
  "click",
  function(e){

    if(
      e.target.id ===
      "btnMinimizarDonYuca"
    ){

      document
      .getElementById(
        "donYuca"
      )
      .classList
      .toggle(
        "donYucaMinimizado"
      );

    }

  }
);

/*
=================================
BUSCADOR
=================================
*/

function activarBuscador(){

  const buscador =
    document.getElementById(
      "buscarProducto"
    );

  if(!buscador) return;

  buscador.addEventListener(
    "keyup",
    function(){

      const texto =
        this.value
        .toUpperCase()
        .trim();

      filtrarProductos(
        texto
      );

    }
  );

}