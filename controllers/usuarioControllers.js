import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistros, emailOlvidePassword } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Inicar sesion",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  // Validacion
  await check("email")
    .isEmail()
    .withMessage("El Email es Obligatorio")
    .run(req);

  await check("password")
    .notEmpty()
    .withMessage("El Password es Obligatorio")
    .run(req);
  //verificar que el resultado este vacio
  let resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  const { email, password } = req.body;
  //comprobar si el usuario existe
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El Usuario No Existe" }],
    });
  }
  //confirmar si el usuairo esta confrimado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "Tu cuenta no ha sido Confirmada" }],
    });
  }
  //Revisar el Password
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El Password es Incorrecto" }],
    });
  }
  //Autenticar el password
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });
  console.log(token);

  //Almacenar en un cookie
  return res
    .cookie("_token", token, {
      httpOnly: true,
      //expires:
      //secure: true,
      //sameSite:true,
    })
    .redirect("/mis-propiedades");
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

  const { email } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });

  console.log(usuario);
  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El Email no existe" }],
    });
  }

  //Generar un token y envia email
  usuario.token = generarId();
  await usuario.save();

  //enviar un email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });
  //Renderizar un mensaje
  res.render("templates/mensaje", {
    pagina: "Reestabelece tu Password",
    mensaje: "Hemos Enviado un Email con las instrucciones",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    res.render("auth/confirmar-cuenta", {
      pagina: "Reestabelce tu password",
      mensaje: "Hubo un error al Validar tu informacion, intenta de nuevo",
      error: true,
    });
  }

  //mostrar formulario para modificar password

  res.render("auth/reset-password", {
    pagina: "Restabelece tu password",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  //Validar el passowrd
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Debe ded ser de almenos 6 caracteres")
    .run(req);
  let resultado = validationResult(req);
  //verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/reset-password", {
      pagina: "Restablece tu password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;
  //Identifcar quien hace el cambio
  const usuario = await Usuario.findOne({ where: { token } });

  //Hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;
  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "password restabelecido",
    mensaje: "El Password se guardo correctamente",
  });
};

export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  confirmar,
  formularOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
