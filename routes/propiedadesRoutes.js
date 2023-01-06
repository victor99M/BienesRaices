import express from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadController.js";
const router = express.Router();

router.get("/mis-propiedades", admin);
router.get("/propiedades/crear", crear);
router.post(
  "/propiedades/crear",
  body("titulo").notEmpty().withMessage("El Titulo del Anuncio es Obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La Descripcion no puede quedar vacia")
    .isLength({ max: 200 })
    .withMessage("La descripcion es demaciada larga"),
  body("categoria").isNumeric().withMessage("Selecciona una categoria"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precio"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona un numero de habiatciones"),
  body("estacionamineto")
    .isNumeric()
    .withMessage("Selecciona numero de estacionaminetos"),
  body("wc").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),

  guardar
);

export default router;
