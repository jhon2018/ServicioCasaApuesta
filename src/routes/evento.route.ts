import { Router } from "express";
import { 
    createEvento, 
    getEventos, 
    getEventoById, 
    updateEvento, 
    deleteEvento 
} from "../controller/evento.controller";

const router = Router();

router.post("/", createEvento);
router.get("/", getEventos);
router.get("/:id", getEventoById);
router.put("/:id", updateEvento);
router.delete("/:id", deleteEvento);

export default router;