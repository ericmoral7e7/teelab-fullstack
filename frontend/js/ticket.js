import { getTicket } from "./storageManager.js";

document.addEventListener("DOMContentLoaded", () => {
    cargarTicket();
});

function cargarTicket() {
    const infoTicket = getTicket()

    //Actualizar el DOM con la información del ticket
    document.getElementById("ticket-id").innerText = infoTicket.id
    //Fecha formateada a formato español dd/mm/yyyy hh:mm
    document.getElementById("ticket-fecha").innerText = new Date(infoTicket.fecha).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    //Cargar cada camiseta (fila) y meterla en su contenedor
    const contenedor = document.getElementById("ticket-body")
    infoTicket.items.forEach(camiseta => {
        contenedor.appendChild(crearFilaTabla(camiseta))
    });

    //Actualizar el precio total
    document.getElementById("ticket-total").innerText = infoTicket.total + "€";

    document.getElementById("ticket-estado").innerText = infoTicket.estado
}

//Función que crea una fila que representa una camiseta del ticket a partir de un objeto camiseta
function crearFilaTabla(camiseta) {
    const tRow = document.createElement("tr");
    //Cada celda de la fila se crea a partir de las propiedades del objeto camiseta
    tRow.append(
        crearCelda(camiseta.nombre, "ticket-nombre"),
        crearCelda(camiseta.talla),
        crearCelda(camiseta.color),
        crearCelda(camiseta.cantidad),
        crearCelda(camiseta.precioUnitario + "€"),
        crearCelda(camiseta.subtotal + "€", "ticket-subtotal")
    );
    return tRow;
}

//Función que crea td de tabla con un texto dado y una clase opcional
function crearCelda(texto, clase = "") {
    const td = document.createElement("td");
    td.innerText = texto;
    if (clase) td.className = clase;
    return td;
}