// src/routes/rol.routes.ts
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
import { authMiddleware, requireRole } from "../middleware/auth.middleware";

const router = Router();

// SOLO ADMIN puede gestionar roles
router.post("/", authMiddleware, requireRole(['Administrador']), createRol);
router.get("/", authMiddleware, requireRole(['Administrador', 'Operador']), getRoles);
router.get("/:id", authMiddleware, requireRole(['Administrador', 'Operador']), getRolById);
router.put("/:id", authMiddleware, requireRole(['Administrador']), updateRol);
router.delete("/:id", authMiddleware, requireRole(['Administrador']), deleteRol);
router.post("/:id/asignar/:usuario_id", authMiddleware, requireRole(['Administrador']), asignarRolUsuario);
router.get("/:id/usuarios", authMiddleware, requireRole(['Administrador', 'Operador']), getUsuariosByRol);

export default router;