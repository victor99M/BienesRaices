import Propiedad from "./Propiedad.js";
import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Usuario from "./Usuario.js";

//Precio.hasOne(Propiedad);

Propiedad.belongsTo(Precio, { foreignKey: "precioId" });
Propiedad.belongsTo(Categoria);
Propiedad.belongsTo(Usuario);

export { Propiedad, Precio, Categoria, Usuario };
