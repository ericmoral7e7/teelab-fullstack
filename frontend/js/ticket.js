import { getLastTicket } from "./storageManager.js";

document.addEventListener("DOMContentLoaded", () => {
    cargarTicket();
});

function cargarTicket() {
    const infoTicket = getLastTicket()

    document.getElementById("ticket-id").innerText = infoTicket.id
    document.getElementById("ticket-fecha").innerText = new Date(infoTicket.fecha).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });


    const contenedor = document.getElementById("ticket-body")

    infoTicket.items.forEach(camiseta => {
        contenedor.appendChild(crearFilaTabla(camiseta))
    });

    document.getElementById("ticket-total").innerText = infoTicket.total + "€";
}

function crearFilaTabla(camiseta) {
    const tRow = document.createElement("tr");
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

function crearCelda(texto, clase = "") {
    const td = document.createElement("td");
    td.innerText = texto;
    if (clase) td.className = clase;
    return td;
}