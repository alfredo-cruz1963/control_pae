const ctrlusers = {};

const pool = require("../database");
const helpers = require("../lib/helpers");

// ********** despliega la pagina para adiccionar *************
ctrlusers.add = async (req, res) => {
  const roles = req.user.rol;

  if (roles == "Administrador") {
    const sedes = await pool.query("SELECT * FROM vsedes");

    res.render("users/add.hbs", { sedes });
  } else {
    res.redirect("/home");
  }
};

// *********** adicciona a la BD *****************
ctrlusers.new = async (req, res) => {
  const { username, fullname, password, email, codsede, cel, rol } = req.body;
  const musuario = req.body.username;
  const usuario = await pool.query(
    "SELECT username FROM users WHERE username = ?",
    musuario
  );

  console.log(codsede);
  const newUser = {
    username,
    fullname: req.body.fullname
      .toLowerCase()
      .trim()
      .split(" ")
      .map((v) => v[0].toUpperCase() + v.substr(1))
      .join(" "),
    password: await helpers.encryptPassword(req.body.username),
    pass: req.body.username,
    email,
    codsede,
    cel,
    rol,
  };

  if (usuario.length > 0) {
    req.flash("message", "El usuario: " + musuario + ", YA existe.");
    res.redirect("/users/add");
  } else {
    await pool.query("INSERT INTO users set ?", [newUser]);
    req.flash("success", "El Usuario fue Guardado Correctamente");
    res.redirect("/users");
  }
};

// ************* lista  **********************
ctrlusers.list = async (req, res) => {
  const usuarios = await pool.query("SELECT * FROM users");
  const roles = req.user.rol;

  if (roles == "Administrador") {
    res.render("users/list.hbs", { usuarios });
  } else {
    res.redirect("/home");
  }
};

// ************** Delete *********************
ctrlusers.delete = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
  req.flash("message", "El Usuario fue Borrado Correctamente");
  res.redirect("/users");
};

// *********** trae el registro que va a editar ***********************
ctrlusers.edit = async (req, res) => {
  const { id } = req.params;
  const usuarios = await pool.query("SELECT * FROM vusers WHERE id = ?", [id]);
  const sedes = await pool.query("SELECT * FROM vsedes");

  res.render("users/edit.hbs", { usuarios: usuarios[0], sedes });
};

// ****************** actualiza en la BD ********************
ctrlusers.update = async (req, res) => {
  const { id } = req.params;
  const { fullname, email, codsede, cel, rol } = req.body;
  const newUser = {
    fullname: req.body.fullname
      .toLowerCase()
      .trim()
      .split(" ")
      .map((v) => v[0].toUpperCase() + v.substr(1))
      .join(" "),
    email,
    codsede,
    cel,
    rol,
  };

  await pool.query("UPDATE users set ? WHERE id = ?", [newUser, id]);
  req.flash("success", "El Usuario se Actualizado Correctamente");
  res.redirect("/users");
};

module.exports = ctrlusers;
