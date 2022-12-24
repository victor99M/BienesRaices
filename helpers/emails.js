import nodemailer from "nodemailer";

const emailRegistros = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log(datos);
  const { email, nombre, token } = datos;

  //Enviar el Email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confrima tu Cuenta en BienesRaices.com",
    text: "Confrima tu Cuenta de BienesRaices.com",
    html: `
    <p>Hola ${nombre},comprueba tu cuenta en BienesRaices.com<p>
    <p> Tu cuenta ya esta lista, solo debes confrimala en el sienguiente enlace:
    <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirmar/${token}">Confrimar Cuenta</a></p>

    <p>Si tu no creaste esta cuenta, puedes ignroar el mensaje.</p>
    `,
  });
};

export { emailRegistros };
