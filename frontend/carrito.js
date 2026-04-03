import * as storageManager from "./storageManager.js";

function mostrarCarrito() {
    let carrito = storageManager.obtenerCarrito();
    let contenedor = document.getElementById("carrito-items");
    contenedor.innerHTML = "";

    carrito.forEach(camiseta => {

        const divFila = document.createElement("div");
        divFila.className = "carrito-fila";

        // 2. Imagen
        const img = document.createElement("img");
        img.src = camiseta.imagen;
        img.alt = "Camiseta";

        const divInfo = document.createElement("div");
        divInfo.className = "carrito-info";

        const h3 = document.createElement("h3");
        h3.innerText = camiseta.nombre;

        const pDetalle = document.createElement("p");
        pDetalle.className = "carrito-detalle";
        
        pDetalle.innerHTML = `Color: ${camiseta.color} &nbsp;|&nbsp; Talla: ${camiseta.talla}`;

        divInfo.appendChild(h3);
        divInfo.appendChild(pDetalle);

        const divCantidad = document.createElement("div");
        divCantidad.className = "carrito-cantidad";

        const btnMenos = document.createElement("button");
        btnMenos.innerText = "-";
        btnMenos.addEventListener("click", () => {
            storageManager.eliminarUnProducto(camiseta.id, camiseta.talla, camiseta.color);
            mostrarCarrito(); 
        });

        
        const spanCantidad = document.createElement("span");
        spanCantidad.innerText = camiseta.cantidad;

        const btnMas = document.createElement("button");
        btnMas.innerText = "+";
        btnMas.addEventListener("click", () => {
            storageManager.sumarUnProducto(camiseta.id, camiseta.talla, camiseta.color);
            mostrarCarrito(); 
        });

        divCantidad.appendChild(btnMenos);
        divCantidad.appendChild(spanCantidad);
        divCantidad.appendChild(btnMas);

        const pPrecio = document.createElement("p");
        pPrecio.className = "carrito-precio";
        pPrecio.innerText = `${camiseta.precio} €`;

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn-eliminar";
        btnEliminar.innerText = "✕";
        btnEliminar.addEventListener("click", () => {
            storageManager.eliminarElementoCarrito(camiseta.id, camiseta.talla, camiseta.color);
            mostrarCarrito(); // Repintamos
        });

        // 7. Añadimos todas las piezas al div principal de la fila
        divFila.appendChild(img);
        divFila.appendChild(divInfo);
        divFila.appendChild(divCantidad);
        divFila.appendChild(pPrecio);
        divFila.appendChild(btnEliminar);

        // 8. Añadimos la fila completa al contenedor de la página
        contenedor.appendChild(divFila); 
    });
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});

document.getElementById("btn-vaciar").addEventListener("click", () => {
        storageManager.vaciarCarrito();
        mostrarCarrito();
    });