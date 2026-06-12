const API =
"https://script.google.com/macros/s/AKfycbx_6n0PRVL6ELrLinI1vaws3WRnn1D0g2IwtN5lgDJoGaEA5C9VW9jMUKBeRW6Fbdky/exec";

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

}


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
  onclick="verImagen('${producto[9]}')"
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

   let htmlMini = `

<table style="
width:100%;
border-collapse:collapse;
font-size:14px;
">

<tr>
<th>PRODUCTO</th>
<th>CANT.</th>
<th>SUBTOTAL</th>
</tr>
`;

carrito.forEach(item=>{

htmlMini += `
<tr>

<td>${item.nombre}</td>

<td style="text-align:center">
${item.cantidad}
</td>

<td style="text-align:right">
$${item.subtotal.toFixed(2)}
</td>

</tr>
`;

});

htmlMini += `

<tr>

<td colspan="2">
<b>TOTAL</b>
</td>

<td style="text-align:right">

<b>
${totalHTML.textContent}
</b>

</td>

</tr>

</table>
`;

document
.getElementById(
"miniCarritoContenido"
)
.innerHTML =
htmlMini;

document
.getElementById(
"miniCarritoContenido"
)
.innerHTML =
htmlMini;

document
.getElementById(
  "miniCarritoContenido"
)
.innerHTML =
htmlMini;

    document.getElementById(
"contadorCarrito"
).textContent =
carrito.length;

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

/*
=================================
VER IMAGEN GRANDE
=================================
*/

function verImagen(url){

  document
    .getElementById(
      "imagenGrande"
    )
    .src = url;

  document
    .getElementById(
      "modalImagen"
    )
    .style.display =
    "flex";

}

document
  .getElementById(
    "cerrarModal"
  )
  .addEventListener(
    "click",
    function(){

      document
        .getElementById(
          "modalImagen"
        )
        .style.display =
        "none";

    }
  );

  /*
=================================
GPS
=================================
*/

const btnMapa =
document.getElementById("btnMapa");

if(btnMapa){


}

function obtenerGPS(){

  if(
    !navigator.geolocation
  ){
    alert(
      "GPS NO DISPONIBLE"
    );
    return;
  }

  navigator.geolocation
  .getCurrentPosition(

    function(posicion){

      const lat =
        posicion.coords.latitude;

      const lng =
        posicion.coords.longitude;

      document
.getElementById(
  "gps"
)
.value =
"https://maps.google.com/?q="
+
lat
+
","
+
lng;

   alert(    
  "UBICACION COMPARTIDA"
  )
    },

    function(){

      alert(
        "NO SE PUDO OBTENER GPS"
      );

    }

  );

}

let carritoAbierto =
false;

document
.getElementById(
"carritoFlotante"
)
.addEventListener(
"click",
function(){

const mini =
document.getElementById(
"miniCarrito"
);

carritoAbierto =
!carritoAbierto;

mini.style.display =
carritoAbierto
?
"block"
:
"none";

});

/*
=================================
ENVIAR PEDIDO
=================================
*/

document
.getElementById(
  "formPedido"
)
.addEventListener(
  "submit",
  enviarPedido
);

async function enviarPedido(e){

  e.preventDefault();

  if(
    carrito.length === 0
  ){

    alert(
      "AGREGA PRODUCTOS AL CARRITO"
    );

    return;

  }

  const total =
    document
    .getElementById(
      "total"
    )
    .textContent
    .replace("$","");

  const pedido = {

    cliente:
      document
      .getElementById(
        "clienteNombre"
      )
      .value
      .toUpperCase(),

    telefono:
      document
      .getElementById(
        "clienteTelefono"
      )
      .value,

    direccion:
      document
      .getElementById(
        "clienteDireccion"
      )
      .value
      .toUpperCase(),

    gps:
      document
      .getElementById(
        "gps"
      )
      .value,

    total:
      total,

    tipo:
      "TIENDA WEB",

    formaPago:
      document
      .getElementById(
        "formaPago"
      )
      .value,

    productos:
      carrito.map(item=>({

        nombre:
          item.nombre,

        cantidad:
          item.cantidad,

        precioUnitario:
          item.precio,

        subtotal:
          item.subtotal

      }))

  };

  try{

    const respuesta =
await fetch(
  API,
  {
    method:"POST",

    body:
    JSON.stringify(
      pedido
    )
  }
);

    const resultado =
      await respuesta.json();

    if(
      resultado.success
    ){

      pedidoWhatsApp(
        resultado.folio
      );

    }else{

      alert(
        "ERROR AL GUARDAR"
      );

    }

  }catch(error){

    console.error(
      error
    );

    alert(
      "ERROR DE CONEXION"
    );

  }

}

/*
=================================
WHATSAPP
=================================
*/

function pedidoWhatsApp(
  folio
){

  let mensaje =

`*NUEVO PEDIDO BIAXAL*

FOLIO:
${folio}

`;

  carrito.forEach(item=>{

    mensaje +=

`${item.nombre}
${item.cantidad} ${item.unidad}

`;

  });

  mensaje +=

`
TOTAL:
${document.getElementById("total").textContent}

CLIENTE:
${document.getElementById("clienteNombre").value}

TELEFONO:
${document.getElementById("clienteTelefono").value}

DIRECCION:
${document.getElementById("clienteDireccion").value}

GPS:
${document.getElementById("gps").value}
`;

  window.open(

    "https://wa.me/525514020332?text="

    +

    encodeURIComponent(
      mensaje
    ),

    "_blank"

  );

  alert(
    "PEDIDO ENVIADO"
  );

}

document
.getElementById(
"btnMapa"
)
.addEventListener(
"click",
function(){

window.open(

"https://www.google.com/maps",

"_blank"

);

});

let mapa;
let marcador;

document
.getElementById("btnMapa")
.addEventListener("click",()=>{

document
.getElementById("mapaEntrega")
.style.display="block";

if(mapa) return;

mapa=L.map("mapaEntrega")
.setView([19.4326,-99.1332],13);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(mapa);

mapa.on("click",(e)=>{

if(marcador){
mapa.removeLayer(marcador);
}

marcador=L.marker(e.latlng)
.addTo(mapa);

document
.getElementById("gps")
.value=
e.latlng.lat+
","+
e.latlng.lng;

document
.getElementById(
"ubicacionSeleccionada"
).innerHTML=
"Ubicación seleccionada ✓";

});

});

const carritoBtn =
document.getElementById(
"carritoFlotante"
);

const miniCarrito =
document.getElementById(
"miniCarrito"
);

carritoBtn.addEventListener(
"click",
()=>{

if(
miniCarrito.style.display==="block"
){

miniCarrito.style.display="none";

}else{

miniCarrito.style.display="block";

}

});

