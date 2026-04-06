
// ================= CARRITO =================
//Guardar carrito
function saveCart(datos) {
    localStorage.setItem('carrito', JSON.stringify(datos));
}

//Cargar información del carrito
export function loadCart() {
    const datos = localStorage.getItem('carrito');
    return datos ? JSON.parse(datos) : [];
}

// Añadir un elemento al carrito
export function addToCart(nuevaCamiseta) {
    let carrito = loadCart(); //Cargar carrito actual

    //Si ya existe el elemento con las caracteristicas exactas, sumar 1 a la cantidad del producto
    const existe = carrito.find(c =>
        c.id === nuevaCamiseta.id &&
        c.talla === nuevaCamiseta.talla &&
        c.color === nuevaCamiseta.color
    );

    if (existe) {
        existe.cantidad += nuevaCamiseta.cantidad;
    } else {
        carrito.push(nuevaCamiseta); //Si no añadir el elemento al carrito
    }

    saveCart(carrito); // Actualizar el carrito con el nuevo carrito
}

export function clearCart() {
    localStorage.removeItem('carrito');
}

//Incrementa la cantidad en el carrito de un producto en 1
export function incrementProductQuantity(id, talla, color) {
    let carrito = loadCart();
    const camisetaEnCarrito = carrito.find(c =>
        c.id === id && c.talla === talla && c.color === color
    );

    if (camisetaEnCarrito) {
        camisetaEnCarrito.cantidad++;
        saveCart(carrito);
    }
}

//Decrementa la cantidad en el carrito de un producto en 1
export function decrementProductQuantity(id, talla, color) {
    let carrito = loadCart();

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
        saveCart(carrito);
    }
}


export function removeCartItem(id, talla, color) {
    let carrito = loadCart();
    carrito = carrito.filter(c =>
        !(c.id === id && c.talla === talla && c.color === color)
    );
    saveCart(carrito);
}


// ================= TICKET =================
export function saveLastTicket(ticket) {
    localStorage.setItem('ultimoTicket', JSON.stringify(ticket));
}

export function getLastTicket(ticket) {
    return JSON.parse(localStorage.getItem('ultimoTicket'));
}