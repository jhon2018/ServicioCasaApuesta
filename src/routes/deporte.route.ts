import { Router } from 'express';
import {
  getDeporteById,
  getDeporte,
  createDeporte,
  deleteDeporteCtrl,
  updateDeporteCtrl
} from '../controller/deporte.controller';
const router = Router();

// GET /api/deportes → Lista todos
router.get('/', getDeporte);

// GET /api/deportes/:id → Obtiene uno por ID
router.get('/:id', getDeporteById);

// POST /api/deportes → Crea uno nuevo
router.post('/', createDeporte);

// PUT /api/deportes/:id → Actualiza
router.put('/:id', updateDeporteCtrl);

// DELETE /api/deportes/:id → Elimina
router.delete('/:id', deleteDeporteCtrl);

export default router;