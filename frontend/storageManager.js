export function guardarCarrito(datos) {
    localStorage.setItem('carrito', JSON.stringify(datos));
}

export function obtenerCarrito() {
    const datos = localStorage.getItem('carrito');
    return datos ? JSON.parse(datos) : [];
}

export function anadirElementoCarrito(nuevaCamiseta) {
    let carrito = obtenerCarrito();

    const existe = carrito.find(c =>
        c.id === nuevaCamiseta.id &&
        c.talla === nuevaCamiseta.talla &&
        c.color === nuevaCamiseta.color
    );

    if (existe) {
        existe.cantidad += nuevaCamiseta.cantidad;
    } else {
        carrito.push(nuevaCamiseta);
    }

    guardarCarrito(carrito);
}

export function vaciarCarrito() {
    localStorage.removeItem('carrito');
}

export function sumarUnProducto(id, talla, color) {
    let carrito = obtenerCarrito();
    const camisetaEnCarrito = carrito.find(c =>
        c.id === id && c.talla === talla && c.color === color
    );

    if (camisetaEnCarrito) {
        camisetaEnCarrito.cantidad++;
        guardarCarrito(carrito);
    }
}

export function eliminarUnProducto(id, talla, color) {
    let carrito = obtenerCarrito();

    const camisetaEnCarrito = carrito.find(c =>
        c.id === id && c.talla === talla && c.color === color
    );

    if (camisetaEnCarrito) {
        if (camisetaEnCarrito.cantidad > 1) {
            camisetaEnCarrito.cantidad--;
        } else {
            // Si llega a 0, la borramos del carrito
            carrito = carrito.filter(c => c !== camisetaEnCarrito);
        }
        guardarCarrito(carrito);
    }
}


export function eliminarElementoCarrito(id, talla, color) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(c =>
        !(c.id === id && c.talla === talla && c.color === color)
    );
    guardarCarrito(carrito);
}