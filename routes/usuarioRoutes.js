import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  formularOlvidePassword,
  registrar,
} from "../controllers/usuarioControllers.js";

const router = express.Router();

router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/olvide-password", formularOlvidePassword);

export default router;
