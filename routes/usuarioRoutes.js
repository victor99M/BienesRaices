import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularOlvidePassword,
} from "../controllers/usuarioControllers.js";

const router = express.Router();

router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/confirmar/:token", confirmar);

router.get("/olvide-password", formularOlvidePassword);

export default router;
