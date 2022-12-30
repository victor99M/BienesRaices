import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import ususarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import db from "./config/db.js";
//crear la app
const app = express();

//Hablitar letrua de datos de formulario
app.use(express.urlencoded({ extended: true }));

//Hablitar Cookie Parser
app.use(cookieParser());

//Habilitar CSRF
app.use(csrf({ cookie: true }));

//conexion a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log("Conexion correcta a la base de datos");
} catch (error) {
  console.log(error);
}

//Hablitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//carpeta Publica
app.use(express.static("public"));

//Routing
app.use("/auth", ususarioRoutes);
app.use("/", propiedadesRoutes);

//definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`el servidor esta funcionando en el puerto ${port}`);
});
