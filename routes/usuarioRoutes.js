import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
} from "../controllers/usuarioControllers.js";

const router = express.Router();

router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/confirmar/:token", confirmar);

router.get("/olvide-password", formularOlvidePassword);

router.post("/olvide-password", resetPassword);

//Almacena el nuevo password
router.get("/auth/olvide-password/:token", comprobarToken);
router.post("/auth/olvide-password/:token", nuevoPassword);
export default router;
