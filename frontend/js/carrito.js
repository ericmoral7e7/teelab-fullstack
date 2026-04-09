import * as storageManager from "./storageManager.js";

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

//Función que renderiza el carrito en la página a partir de los datos guardados en el localStorage
function renderCart() {
    let carrito = storageManager.loadCart();

    //Vaciamos el contenedor antes de renderizar los productos de nuevo
    let contenedor = document.getElementById("carrito-items");
    contenedor.innerHTML = "";

    let totalPrecio = 0; //Acumulador de precio total

    //Si el carrito está vacío, mostramos un mensaje y un enlace para volver
    if (carrito.length === 0) {
        contenedor.append(carritoVacio());
        actualizarResumen(totalPrecio);
        return
    }

    //Si el carrito tiene productos, recorremos el listado de camisetas y las añadimos al DOM
    carrito.forEach(camiseta => {
        totalPrecio += camiseta.precio * camiseta.cantidad //Sumar el precio de esta camiseta al total
        contenedor.appendChild(crearFilaCarrito(camiseta))
    });

    actualizarResumen(totalPrecio);
}

//Función que crea los elementos del DOM para mostrar el carrito vacío
function carritoVacio() {
    const div = document.createElement("div");
    const advertencia = crearParrafo("", "No hay ningun elemento en el carrito", false)
    const a = document.createElement('a')
    a.innerText = "Seguir comprando"
    a.href = "../index.html"
    div.append(advertencia, a)
    return div
}

//Función que crea los elementos del DOM para mostrar UNA sola camiseta en el carrito
function crearFilaCarrito(camiseta) {
    const divFila = document.createElement("div");
    divFila.className = "carrito-fila";

    const img = document.createElement("img");
    img.src = "../" + camiseta.imagen;

    divFila.append(
        img,
        crearInfoProducto(camiseta),
        crearBotonesCantidad(camiseta),
        crearParrafo("carrito-precio", `${camiseta.precio} €`),
        crearBotonEliminar(camiseta)
    );
    return divFila;
}

//Funciones auxiliares para crear elementos del DOM de forma más sencilla
//Función para crear un párrafo o un div con una clase y un texto determinado. Si html es true, el texto se interpretará como código HTML
function crearParrafo(clase, texto, html = false) {
    const p = document.createElement(html ? "div" : "p");
    p.className = clase;
    if (html) p.innerHTML = texto; else p.innerText = texto;
    return p;
}

//Función que crea unicamente el bloque de INFORMACIÓN de una camiseta (nombre, color, talla) 
function crearInfoProducto(camiseta) {
    const divInfo = document.createElement("div");
    divInfo.className = "carrito-info";

    const h3 = document.createElement("h3");
    h3.innerText = camiseta.nombre;

    const detalles = `Color: ${camiseta.color} &nbsp;|&nbsp; Talla: ${camiseta.talla}`;
    divInfo.append(h3, crearParrafo("carrito-detalle", detalles, true));
    return divInfo;
}

//Función que crea los botones de cantidad (+ y -) para cada camiseta en el carrito
function crearBotonesCantidad(camiseta) {
    //Crear div 
    const div = document.createElement("div");
    div.className = "carrito-cantidad";

    //Boton menos
    const btnMenos = document.createElement("button");
    btnMenos.innerText = "-";
    //Al hacer click en el boton menos, se llama a la función para decrementar la cantidad y se vuelve a renderizar el carrito
    btnMenos.addEventListener('click', () => { storageManager.decrementProductQuantity(camiseta.id, camiseta.talla, camiseta.color); renderCart(); })

    //Span que muestra la cantidad actual
    const span = document.createElement("span");
    span.innerText = camiseta.cantidad;

    //Boton mas
    const btnMas = document.createElement("button");
    btnMas.innerText = "+";
    //Al hacer click en el boton mas, se llama a la función para incrementar la cantidad y se vuelve a renderizar el carrito
    btnMas.addEventListener('click', () => { storageManager.incrementProductQuantity(camiseta.id, camiseta.talla, camiseta.color); renderCart(); })

    //Añadir al div y retornarlo
    div.append(btnMenos, span, btnMas);
    return div;
}

//Función que crea el botón de eliminar una camiseta del carrito
function crearBotonEliminar(camiseta) {
    //Crear el boton
    const btn = document.createElement("button");
    btn.className = "btn-eliminar";
    btn.innerText = "✕";

    //Al hacer click en el boton eliminar, se llama a la función para eliminar completamente esa camiseta del carrito y se vuelve a renderizar el carrito
    btn.addEventListener('click', () => { storageManager.removeCartItem(camiseta.id, camiseta.talla, camiseta.color); renderCart() })
    return btn;
}

//Actualiza el resumen del precio 
function actualizarResumen(totalPrecio) {
    const textoSubtotal = document.getElementById("subtotal");
    const textoTotal = document.getElementById("total");
    textoSubtotal.innerText = `Subtotal: ${totalPrecio.toFixed(2)} €`;
    textoTotal.innerText = `Total: ${totalPrecio.toFixed(2)} €`;
}

//Boton vaciar carrito
document.getElementById("btn-vaciar").addEventListener("click", () => {
    storageManager.clearCart();
    renderCart();
});



// ============== BOTON COMPRAR ==============
//Funcion que se llamara al hacer click en el boton comprar. 
document.getElementById("btn-comprar").addEventListener("click", async () => {

    //Obtener json de la comanda a partir del carrito actual
    let comanda = crearJsonComanda()

    //Si no hay camisetas en el carrtio, no hacemos la petición a la API y mostramos un mensaje de alerta
    if (comanda.items.length === 0) {
        alert("No hay ningún elemento en el carrito")
        return
    }

    //Si hay camisetas en el carrito, hacemos la petición POST a la API para crear la comanda y obtener el ticket
    const respuesta = await fetch('http://localhost:3001/api/comandas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comanda)
    });

    //Obtener el ticket, guardarlo en para mostrarlo en la página de ticket y vaciar el carrito
    const ticket = await respuesta.json()
    storageManager.saveLastTicket(ticket)
    storageManager.clearCart()

    renderCart();

    //Pasar a pàgina ticket
    window.location.href = '../html/ticket.html'
})

//Funcion que crea el json necesario para crear una comanda en la api a partir de nuestro carrito actual
function crearJsonComanda() {
    const carrito = storageManager.loadCart();

    let comanda = {
        cliente: {
            nombre: "Alex",
            email: "alex.dev@example.com"
        },
        direccion: {
            calle: "Carrer de Mar 45",
            cp: "08911",
            ciudad: "Badalona"
        },

        items: carrito.map(camisetaCarrito => ({
            camisetaId: camisetaCarrito.id,
            talla: camisetaCarrito.talla,
            color: camisetaCarrito.color,
            cantidad: camisetaCarrito.cantidad
        }))
    }

    return comanda
}