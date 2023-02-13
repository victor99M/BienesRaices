import bcrypt from "bcrypt";
const usuarios = [
  {
    nombre: "Victor",
    email: "victor@victor.com",
    confirmado: 1,
    password: bcrypt.hashSync("password", 10),
  },
];

export default usuarios;
