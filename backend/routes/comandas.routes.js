import { Router } from 'express';
import * as comandasController from '../controllers/comandas.controller.js';

const router = Router();

router.post("/", comandasController.create); 
router.get("/", comandasController.getAll)
router.get("/:id", comandasController.getById)

export default router;