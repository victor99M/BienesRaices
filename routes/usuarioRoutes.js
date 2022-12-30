import express from "express";
import {
  formularioLogin,
  autenticar,
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
router.post("/login", autenticar);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/confirmar/:token", confirmar);

router.get("/olvide-password", formularOlvidePassword);

router.post("/olvide-password", resetPassword);

//Almacena el nuevo password
router.get("/olvide-password/:token", comprobarToken);
router.post("/olvide-password/:token", nuevoPassword);
export default router;
