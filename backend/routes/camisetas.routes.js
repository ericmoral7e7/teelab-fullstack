import { Router } from 'express';
import * as camisetasController from '../controllers/camisetas.controller.js';

const router = Router();

router.get("/", camisetasController.get); //camisetas filtradas
router.get("/:id", camisetasController.getById); //camiseta especifica

export default router;