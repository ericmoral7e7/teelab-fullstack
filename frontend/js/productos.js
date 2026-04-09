import * as storageManager from "./storageManager.js";
const linkCamisetas = "http://localhost:3001/api/camisetas" // URL del endpoint de camisetas

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  let camisetas = await obtenerCamisetas(linkCamisetas); // Llamar a la API para obtener las camisetas

  mostrarCamisetas(camisetas);

  aplicarEventListeners();
}

//Llama a la api para obtener el catalogo de camisetas
async function obtenerCamisetas(link) {
  try {
    let response = await fetch(link);
    let data = await response.json(); // Convertir a JSON, objeto
    return data;
  } catch (error) {
    console.error("Error al obtener datos", error);
  }
}

//Muestra/recarga la lista de camisetas según el resultado de la petición a la api 
function mostrarCamisetas(camisetas) {
  let contenedor = document.getElementById("tshirts");
  contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar las camisetas

  camisetas.forEach(camiseta => {
    contenedor.appendChild(crearTarjetaCamiseta(camiseta)) // Por cada camiseta crea una tarjeta 
  });
}

//Función que crea el HTML de UNA camiseta a partir de un objeto camiseta
function crearTarjetaCamiseta(camiseta) {
  //Crear el articulo principal
  let articulo = document.createElement("article");
  articulo.className = "camiseta"

  //Crear selectores
  const selectorTallas = crearSelect(camiseta.tallas)
  const selectorColores = crearSelect(camiseta.colores)
  const inputCantidad = crearInputCantidad()

  articulo.append( // crea cada uno de los elementos con funciones que los fabrican y los añade a un articulo
    crearElementoTexto('img', '', camiseta.imagenes[camiseta.colores[0]]),
    crearElementoTexto('h3', '', camiseta.nombre),
    crearElementoTexto('p', '', camiseta.descripcion),
    selectorTallas, selectorColores, inputCantidad,
    crearElementoTexto('p', 'precio', `${camiseta.precioBase}€`),
    crearBotonAnadir(camiseta, selectorTallas, selectorColores, inputCantidad)
  )

  return articulo
}

//============= EVENT LISTENERS =============
function aplicarEventListeners() {
  document.getElementById("limpiarFiltros").addEventListener("click", limpiarFiltros);

  //Añadir event listener a cada filtro para que al cambiar su valor, se apliquen los filtros
  ["filtroTexto", "filtroColor", "filtroTalla", "filtroOrdenar"].forEach(id => {
    document.getElementById(id).addEventListener("change", aplicarFiltros);
  });
}

// =============== FABRICADORES =============== 
// Crean objetos, de manera que se pueda reutilizar el codigo y evitar codigo repetido

//Crear elemento de texto o imagen
function crearElementoTexto(etiqueta, clase, contenido) {
  const elemento = document.createElement(etiqueta) // crear elemento
  if (clase) elemento.className = clase;
  if (etiqueta === 'img') elemento.src = contenido // setear contenido
  else elemento.innerText = contenido

  return elemento
}

//Crea un selector
function crearSelect(opciones) {
  const select = document.createElement("select") // Crear select

  opciones.forEach(opcion => { //Setear propiedades
    select.innerHTML += `<option value="${opcion}">${opcion.toUpperCase()}</option>`
  })

  return select
}

//Crea un input de cantidad
function crearInputCantidad() {
  const input = document.createElement("input") // crear input

  input.type = "number"; //Setear propiedades
  input.min = "1";
  input.value = "1";
  input.className = "input-cantidad";

  return input
}

//Crea un boton de añadir al carrito 
function crearBotonAnadir(camiseta, selectorTalla, selectorColores, inputCantidad) {
  const boton = document.createElement('button') //Crear boton

  boton.innerText = "Añadir al carrito" //Setear propiedades
  boton.addEventListener('click', () => {
    storageManager.addToCart({
      id: camiseta.id,
      nombre: camiseta.nombre,
      imagen: camiseta.imagenes[camiseta.colores[0]],
      precio: camiseta.precioBase,
      talla: selectorTalla.value,
      color: selectorColores.value,
      cantidad: parseInt(inputCantidad.value)
    });
    mostrarNotificacion("¡Se ha añadido al carrito!");
  })

  return boton
}

// ============================= NOTIFICACIONES =============================
function mostrarNotificacion(mensaje) {
  const toast = document.createElement("div");
  toast.className = "toast-notificacion";
  toast.innerText = mensaje;

  document.body.appendChild(toast);

  // Mini-retraso para que la animación CSS funcione correctamente
  setTimeout(() => toast.classList.add("mostrar"), 10);

  // A los 3 segundos, lo ocultamos y lo eliminamos del HTML
  setTimeout(() => {
    toast.classList.remove("mostrar");
    setTimeout(() => toast.remove(), 300); // Espera a que termine la animación
  }, 3000);
}

// ============================= FILTROS =============================
//Función que aplica filtros, recargando la pagina con los nuevos resultados
async function aplicarFiltros() {
  const filtros = calcularFiltros();
  const camisetas = await obtenerCamisetas(linkCamisetas + filtros);
  mostrarCamisetas(camisetas);
}

function limpiarFiltros() {
  document.getElementById("filtroTexto").value = "";
  document.getElementById("filtroColor").value = "";
  document.getElementById("filtroTalla").value = "";
  document.getElementById("filtroOrdenar").value = "";
  aplicarFiltros();
}

//Función que genera la url (con query params) para la petición con filtros que queremos 
function calcularFiltros() {
  let filtroTexto = document.getElementById("filtroTexto");
  let filtroColor = document.getElementById("filtroColor");
  let filtroTalla = document.getElementById("filtroTalla");
  let filtroOrdenar = document.getElementById("filtroOrdenar");

  let filtros = "?"
  if (filtroTexto.value) {
    filtros += `q=${filtroTexto.value}&`;
  }

  if (filtroColor.value) {
    filtros += `color=${filtroColor.value}&`;
  }

  if (filtroTalla.value) {
    filtros += `talla=${filtroTalla.value}&`;
  }

  if (filtroOrdenar.value) {
    filtros += `sort=${filtroOrdenar.value}&`;
  }

  if (filtros.endsWith('&')) {
    filtros = filtros.slice(0, -1); // Eliminar el último '&'
  }

  return filtros;
}