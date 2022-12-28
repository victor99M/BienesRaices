import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistros } from "../helpers/emails.js";
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Inicar sesion",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  //validacion
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);

  await check("email").isEmail().withMessage("Eso no parece un email").run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("Debe ded ser de almenos 6 caracteres")
    .run(req);

  await check("repetir_password")
    .equals("password")
    .withMessage("Los password no son iguales")
    .run(req);

  let resultado = validationResult(req);

  //verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  //Extraer los datos
  const { nombre, email, password } = req.body;
  //verificar el correo duplicado
  const existeUsuario = await Usuario.findOne({
    where: { email },
  });
  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya esta registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  //Almacenar un usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  });
  //Envia email de confirmacion
  emailRegistros({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //Mostrar mensaje de confrimación
  res.render("templates/mensaje", {
    pagina: "Cuneta Creada Correctamente",
    mensaje: "Hemos Enviado un Email de Confimación, presiona en el enlace",
  });
};
//Funcion que compueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  //Verficar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  } else {
    //Confimar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render("auth/confirmar-cuenta", {
      pagina: "Cuenta confirmada",
      mensaje: "La cuenta se confrimo correctamente",
    });
  }
};

const formularOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu acceso a Bienes Raices",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  //validacion
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);

  let resultado = validationResult(req);

  //verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  //Buscar el usaurio
};

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularOlvidePassword,
  resetPassword,
};
