import * as storageManager from "./storageManager.js";
const linkCamisetas = "http://localhost:3001/api/camisetas" // URL del endpoint de camisetas

async function init() {
  let camisetas = await obtenerCamisetas(linkCamisetas); // Llamar a la API

  mostrarCamisetas(camisetas);
}

async function aplicarFiltros() {
  const filtros = calcularFiltros();
  const camisetas = await obtenerCamisetas(linkCamisetas + filtros);
  mostrarCamisetas(camisetas);
}


function calcularFiltros() {
  let filtroTexto = document.getElementById("filtroTexto");
  let filtroColor = document.getElementById("filtroColor");
  let filtroTalla = document.getElementById("filtroTalla");

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

  if (filtros.endsWith('&')) {
    filtros = filtros.slice(0, -1); // Eliminar el último '&'
  }

  return filtros;
}

async function obtenerCamisetas(link) {
  try {
    let response = await fetch(link);
    let data = await response.json(); // Convertir a JSON, objeto
    return data;
  } catch (error) {
    console.error("Error al obtener datos", error);
  }
}


function mostrarCamisetas(camisetas) {
  let contenedor = document.getElementById("tshirts");

  contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar las camisetas

  camisetas.forEach(camiseta => {

    console.log(camiseta);

    let articulo = document.createElement("article");
    articulo.className = "camiseta"

    let imagen = document.createElement('img')
    let primerColor = camiseta.colores[0];
    imagen.setAttribute('src', camiseta.imagenes[primerColor]);

    let titulo = document.createElement('h3')
    titulo.innerText = camiseta.nombre

    let descripcion = document.createElement('p')
    descripcion.innerText = camiseta.descripcion

    let precio = document.createElement('p')
    precio.className = "precio"
    precio.innerText = `${camiseta.precioBase}€`

    //TALLA
    let selectTallas = document.createElement('select')
    let tallas = camiseta.tallas
    tallas.forEach(talla => {
      selectTallas.innerHTML += `<option value="${talla}">${talla}</option>`
    });

    //Colores
    let selectColores = document.createElement('select')
    let colores = camiseta.colores
    colores.forEach(color => {
      selectColores.innerHTML += `<option value="${color}">${color.toUpperCase()}</option>`
    });

    //Boton
    let boton = document.createElement('button')
    boton.innerText = "Añadir al carrito"
    boton.addEventListener('click', () => {
      storageManager.anadirElementoCarrito({
        id: camiseta.id,
        nombre: camiseta.nombre,
        imagen: camiseta.imagenes[selectColores.value],
        precio: camiseta.precioBase,
        talla: selectTallas.value,
        color: selectColores.value,
        cantidad: 1
      });
    });

    articulo.appendChild(imagen)
    articulo.appendChild(titulo)
    articulo.appendChild(descripcion)
    articulo.appendChild(selectTallas)
    articulo.appendChild(selectColores)
    articulo.appendChild(precio)
    articulo.appendChild(boton)

    contenedor.appendChild(articulo)
  });
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  document.getElementById("btnFiltrar").addEventListener("click", aplicarFiltros);
});