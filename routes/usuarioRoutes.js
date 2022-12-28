import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularOlvidePassword,
  resetPassword,
} from "../controllers/usuarioControllers.js";

const router = express.Router();

router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/confirmar/:token", confirmar);

router.get("/olvide-password", formularOlvidePassword);

router.post("/olvide-password", resetPassword);
export default router;
