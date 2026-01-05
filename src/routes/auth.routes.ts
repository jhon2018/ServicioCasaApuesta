// src/routes/auth.routes.ts
// Objetivo: Definir las rutas de autenticación y gestión de usuarios.

import { Router } from "express";
import { 
    registro, 
    login, 
    refresh, 
    logout, 
    recuperarPassword, 
    cambiarPassword,
    perfil 
} from "../controller/auth.controller";

const router = Router();

router.post("/registro", registro);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/recuperar-password", recuperarPassword);
router.post("/cambiar-password", cambiarPassword);
router.get("/perfil", perfil);

export default router;