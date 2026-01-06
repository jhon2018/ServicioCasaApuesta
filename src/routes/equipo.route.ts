import { Router } from "express";
import { 
    createEquipo, 
    getEquipos, 
    getEquipoById, 
    updateEquipo, 
    deleteEquipo 
} from "../controller/equipo.controller";

const router = Router();

router.post("/", createEquipo);
router.get("/", getEquipos);
router.get("/:id", getEquipoById);
router.put("/:id", updateEquipo);
router.delete("/:id", deleteEquipo);

export default router;