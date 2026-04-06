import fs from 'fs';
import { comandas } from '../data/comandas.js';
import { camisetas } from '../data/camisetas.js';


//Devuelve un string si hay algun error
function validateComanda(comanda) {
    if (!comanda || typeof comanda !== "object")
        return "Body inválido";


    //Campos obligatorios
    if (!comanda.cliente || !comanda.cliente.nombre || !comanda.cliente.email || !comanda.items)
        return "Faltan campos: cliente.nombre, cliente.email, items";

    if (!comanda.direccion || !comanda.direccion.calle || !comanda.direccion.cp || !comanda.direccion.ciudad) {
        return "Faltan datos de la dirección (calle, cp o ciudad)";
    }

    // Minimo 2 caracteres
    if (comanda.cliente.nombre.trim().length < 2)
        return "El nombre debe tener al menos 2 caracteres";


    // Email con formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(comanda.cliente.email))
        return "Email inválido";


    // Items mínimo 1 elemento
    if (!Array.isArray(comanda.items) || comanda.items.length < 1)
        return "Debe haber al menos un item";


    // Validar cada camiseta de la comanda
    for (let camiseta of comanda.items) {
        const errorMsg = validateCamiseta(camiseta);
        if (errorMsg) return errorMsg;
    }

    return null;
}


//Comprueva si una camiseta existe
//Debe ir en camisetas?
function validateCamiseta(camiseta) {
    // Buscar la camiseta en el catálogo
    const camisetaCatalogo = camisetas.find(c => c.id === camiseta.camisetaId);
    if (!camisetaCatalogo) return `Camiseta ${camiseta.camisetaId} no encontrada`;


    // Comprobar que la talla esté disponible
    if (!camisetaCatalogo.tallas.includes(camiseta.talla))
        return `Talla ${camiseta.talla} no válida para camiseta ${camiseta.camisetaId}`;


    // Comprobar que el color esté disponible
    if (!camisetaCatalogo.colores.includes(camiseta.color))
        return `Color ${camiseta.color} no válido para camiseta ${camiseta.camisetaId}`;


    // Comprobar cantidad >= 1
    if (!Number.isInteger(camiseta.cantidad) || camiseta.cantidad < 1)
        return `Cantidad inválida para camiseta ${camiseta.camisetaId}`;


    return null; // Todo correcto
}


export function create(comandaNew) {
    const validationMsg = validateComanda(comandaNew);


    //Si se ha devuelto algún error
    if (validationMsg) return { error: validationMsg };


    //generate comanda id
    let comandaID = "ORD-" + (comandas.length + 1).toString().padStart(4, "0");


    const comandaToSave = { id: comandaID, ...comandaNew };


    comandas.push(comandaToSave);

    //Guardar comandas en archivo
    try {
        fs.writeFileSync('./data/comandas-guardadas.json', JSON.stringify(comandas, null, 2));
    } catch (err) {
        console.error("Error guardando el archivo de comandas:", err);
    }

    return generarTicket(comandaToSave);
}


function generarTicket(comanda) {
    
    let total = 0
    let objetoTicket = {
        id: comanda.id,
        fecha: new Date().toISOString(),
        estado: "recibida",
        items: []
    }

    comanda.items.forEach(camiseta => {
        let datosCamiseta = camisetas.find(c => c.id === camiseta.camisetaId)
        objetoTicket.items.push({
            camisetaId: camiseta.id,
            nombre: datosCamiseta.nombre,
            talla: camiseta.talla,
            color: camiseta.color,
            cantidad: camiseta.cantidad,
            precioUnitario: datosCamiseta.precioBase,
            subtotal: datosCamiseta.precioBase * camiseta.cantidad
        })
        total += datosCamiseta.precioBase * camiseta.cantidad
    });
    
    objetoTicket.total = Number(total.toFixed(2))


    return objetoTicket
}

export const getAll = () => comandas

export function getById(id) { return comandas.find(comanda => comanda.id === id); }