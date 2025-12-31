// src/routes/usuario.routes.ts
// objetivos: Definir las rutas para las operaciones relacionadas con usuarios.
import { Router } from "express";
import { 
    createUsuario, 
    getUsuarios, 
    getUsuarioById, 
    updateUsuario,
    updateEstadoUsuario,
    deleteUsuario,
    updateRolUsuario
} from "../controller/usuario.controller";

const router = Router();

router.post("/", createUsuario);
router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.patch("/:id/estado", updateEstadoUsuario);
router.delete("/:id", deleteUsuario);
router.post("/:id/roles", updateRolUsuario);

export default router;