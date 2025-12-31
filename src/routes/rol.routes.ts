//Ruta: src/routes/rol.routes.ts
import { Router } from "express";
import { 
    createRol, 
    getRoles, 
    getRolById, 
    updateRol, 
    deleteRol,
    asignarRolUsuario,
    getUsuariosByRol 
} from "../controller/rol.controller";

const router = Router();

router.post("/", createRol);
router.get("/", getRoles);
router.get("/:id", getRolById);
router.put("/:id", updateRol);
router.delete("/:id", deleteRol);
router.post("/:id/asignar/:usuario_id", asignarRolUsuario);
router.get("/:id/usuarios", getUsuariosByRol);

export default router;