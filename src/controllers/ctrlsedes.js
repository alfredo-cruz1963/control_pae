const ctrlsedes = {};

const pool = require("../database");

// ********** despliega la pagina para adiccionar *************
ctrlsedes.add = async (req, res) => {
  const ciudades = await pool.query("SELECT codigo, mpio FROM dane");
  res.render("sedes/add.hbs", { ciudades });
};

// *********** adicciona a la BD *****************
ctrlsedes.new = async (req, res) => {
  const { codsede, nombsede, codmpio, cupo } = req.body;
  const mcodsede = req.body.codsede;
  const campo = await pool.query(
    "SELECT codsede FROM centrospae WHERE codsede = ?",
    mcodsede
  );
  const newSede = {
    codsede,
    nombsede,
    codmpio,
    cupo,
  };

  if (campo.length > 0) {
    req.flash("message", "Sede con el código " + mcodsede + ", YA existe.");
    res.redirect("/sedes/add");
  } else {
    newSede.nombsede = newSede.nombsede.toUpperCase();
    await pool.query("INSERT INTO centrospae set ?", [newSede]);
    req.flash("success", "Sede Pae Grabada Correctamente");
    res.redirect("/sedes");
  }
};

// ************* lista  **********************
ctrlsedes.list = async (req, res) => {
  const sedes = await pool.query("SELECT * FROM vsedespae");
  res.render("sedes/list.hbs", { sedes });
};

// ************** Delete *********************
ctrlsedes.delete = async (req, res) => {
  const { codsede } = req.params;
  await pool.query("DELETE FROM centrospae WHERE codsede = ?", [codsede]);
  req.flash("success", "Sede Pae Borrada Correctamente");
  res.redirect("/sedes");
};

// *********** trae el registro que va a editar ***********************
ctrlsedes.edit = async (req, res) => {
  const { codsede } = req.params;
  const datos = await pool.query("SELECT * FROM vsedespae WHERE codsede = ?", [
    codsede,
  ]);
  const ciudad = await pool.query("SELECT codigo, mpio FROM dane");

  res.render("sedes/edit.hbs", { ciudad: ciudad, datos: datos[0] });
};

// ****************** actualiza en la BD ********************
ctrlsedes.update = async (req, res) => {
  //const { codsede } = req.params;
  const { codsede, nombsede, codmpio, cupo } = req.body;
  const newSede = {
    codsede,
    nombsede,
    codmpio,
    cupo,
  };

  newSede.nombsede = newSede.nombsede.toUpperCase();
  await pool.query("UPDATE centrospae set ? WHERE codsede = ?", [
    newSede,
    codsede,
  ]);
  req.flash("success", "Sede Pae se Actualizado Correctamente");
  res.redirect("/sedes");
};

module.exports = ctrlsedes;
