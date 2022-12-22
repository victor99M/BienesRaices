import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Inicar sesion",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};

const registrar = async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.json(usuario);
};

const formularOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu acceso a Bienes Raices",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularOlvidePassword,
  registrar,
};
