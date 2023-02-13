import { exit } from "node:process";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import { Precio, Categoria, Usuario } from "../models/index.js";

const importarDtaos = async () => {
  try {
    //Autenticar
    await db.authenticate();

    //Generar las columnas
    await db.sync();

    //Insertar los datos
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
      Usuario.bulkCreate(usuarios),
    ]);

    console.log("Datos Importados Correctamente");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const eliminarDatos = async () => {
  try {
    //Limpiar la tabla
    // await Promise.all([
    //   Categoria.destroy({ where: {}, truncate: true }),
    //   Precio.destroy({ where: {}, truncate: true }),
    // ]);
    await db.sync({ force: true });
    console.log("Datos Eliminados Correctamente");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDtaos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
