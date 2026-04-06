import * as storageManager from "./storageManager.js";

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

function renderCart() {
    let carrito = storageManager.loadCart();

    let contenedor = document.getElementById("carrito-items");
    contenedor.innerHTML = "";

    let totalPrecio = 0;

    if(carrito.length === 0) {
        const advertencia = crearParrafo("", "No hay ningun elemento en el carrito", false)
        const a = document.createElement('a')
        a.innerText = "Seguir comprando"
        a.href = "tienda.html"

        contenedor.append(advertencia, a)
        return
    }    

    carrito.forEach(camiseta => {
        totalPrecio += camiseta.precio * camiseta.cantidad
        contenedor.appendChild(crearFilaCarrito(camiseta))
    });

    actualizarResumen(totalPrecio);
}

function crearFilaCarrito(camiseta) {
    const divFila = document.createElement("div");
    divFila.className = "carrito-fila";

    const img = document.createElement("img");
    img.src = camiseta.imagen;

    divFila.append(
        img,
        crearInfoProducto(camiseta),
        crearControlesCantidad(camiseta),
        crearParrafo("carrito-precio", `${camiseta.precio} €`),
        crearBotonEliminar(camiseta)
    );
    return divFila;
}

function crearParrafo(clase, texto, html = false) {
    const p = document.createElement(html ? "div" : "p");
    p.className = clase;
    if (html) p.innerHTML = texto; else p.innerText = texto;
    return p;
}

function crearInfoProducto(camiseta) {
    const divInfo = document.createElement("div");
    divInfo.className = "carrito-info";
    const h3 = document.createElement("h3");
    h3.innerText = camiseta.nombre;
    const detalles = `Color: ${camiseta.color} &nbsp;|&nbsp; Talla: ${camiseta.talla}`;
    divInfo.append(h3, crearParrafo("carrito-detalle", detalles, true));
    return divInfo;
}

function crearControlesCantidad(camiseta) {
    const div = document.createElement("div");
    div.className = "carrito-cantidad";
    const btnMenos = document.createElement("button");
    btnMenos.innerText = "-";
    btnMenos.addEventListener('click', () => { storageManager.decrementProductQuantity(camiseta.id, camiseta.talla, camiseta.color); renderCart(); })

    const span = document.createElement("span");
    span.innerText = camiseta.cantidad;

    const btnMas = document.createElement("button");
    btnMas.innerText = "+";
    btnMas.addEventListener('click', () => { storageManager.incrementProductQuantity(camiseta.id, camiseta.talla, camiseta.color); renderCart(); })

    div.append(btnMenos, span, btnMas);
    return div;
}

function crearBotonEliminar(camiseta) {
    const btn = document.createElement("button");
    btn.className = "btn-eliminar";
    btn.innerText = "✕";
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

document.getElementById("btn-comprar").addEventListener("click", async () => {
    let comanda = crearJsonComanda()

    console.log(comanda)
    console.log(comanda.items)
    if(comanda.items.length === 0){
        alert("No hay ningún elemento en el carrito")
        return
    }

    const respuesta = await fetch('http://localhost:3001/api/comandas', {
        method: 'POST', // Le decimos que vamos a enviar datos
        headers: {
            'Content-Type': 'application/json' // Avisamos al servidor que le enviamos un JSON
        },
        body: JSON.stringify(comanda) // Convertimos tu objeto JavaScript a texto JSON
    });

    const ticket = await respuesta.json()

    storageManager.clearCart()
    renderCart();

    //Cargar pàgina ticket
    storageManager.saveLastTicket(ticket)
    window.location.href = 'ticket.html'
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