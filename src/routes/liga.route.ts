import { Router } from 'express';
import { createLigaController,getLiga,getLigaById,deleteLigaCtrl,updateLigaController } from '../controller/liga.controller';

const router = Router();


router.get('/', getLiga);


router.get('/:id', getLigaById);


router.post('/', createLigaController);


router.put('/:id', updateLigaController);


router.delete('/:id', deleteLigaCtrl);
export default router;
