import * as comandasService from '../services/comandas.service.js';


export function create(req, res) {
    let result = comandasService.create(req.body);

    if (result.error) {
        const status = result.status || 400;
        return res.status(status).json({ message: result.error });
    }

    res.status(201).json(result);
}

export function getAll(req, res) {
    console.log(comandasService.getAll())
    res.json(comandasService.getAll());
}

export function getById(req, res) {
    const comanda = comandasService.getById(req.params.id);

    if(!comanda){
        return res.status(404).json({ error: "Comanda no encontrada" });
    }

    res.json(comanda);
}