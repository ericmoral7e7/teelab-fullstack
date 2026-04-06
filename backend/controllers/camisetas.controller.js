import * as camisetasService from '../services/camisetas.service.js';

export function get(req, res) {

    const filters = req.query; // Filtros que llegan con query params

    let camisetas = camisetasService.getCamisetas(filters); //obtener camisetas filtradas

    //Si se ha pasado un filtro de ordenamiento ordenar
    if (req.query.sort) {
        camisetas = camisetasService.ordenarCamisetas(camisetas, req.query.sort)

        //Si se detecta un error en el ordenamiento
        if (camisetas.error) {
            return res.status(camisetas.status).json({ message: camisetas.error });
        }
    }
    
    res.json(camisetas);
}

export function getById(req, res) {
    const camiseta = camisetasService.getById(req.params.id);
    if (!camiseta) return res.status(404).json({ message: "Camiseta no trobada" });

    res.json(camiseta);
}