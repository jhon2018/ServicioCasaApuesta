// src/routes/usuario.routes.ts
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
import { authMiddleware, requireRole } from "../middleware/auth.middleware";

const router = Router();

// Registro de usuario (sin auth)
router.post("/", createUsuario);

// Operaciones admin/operador
router.get("/", authMiddleware, requireRole(['admin', 'operador']), getUsuarios);
router.get("/:id", authMiddleware, getUsuarioById); // Usuario puede ver su propio perfil
router.put("/:id", authMiddleware, updateUsuario); // Usuario puede actualizar su perfil
router.patch("/:id/estado", authMiddleware, requireRole(['admin']), updateEstadoUsuario);
router.delete("/:id", authMiddleware, requireRole(['admin']), deleteUsuario);
router.post("/:id/roles", authMiddleware, requireRole(['admin']), updateRolUsuario);

export default router;