const ctrlconfig = {};

const requests = require("request");
const pool = require("../database");
const path = require("path");
const { Console } = require("console");

// ************* despliega sms.hbs  **********************
ctrlconfig.list = async (req, res) => {
  var config = await pool.query(
    "SELECT *, CAST(fecha AS CHAR) AS mfecha FROM setting ORDER BY id_ent"
  );

  res.render("config/list.hbs", { config });
};

// *********** adicciona a la BD *****************
ctrlconfig.add = async (req, res) => {
  const { fecha, id_ent } = req.body;
  const mid_ent = req.body.id_ent;

  const config = await pool.query(
    "SELECT * FROM setting WHERE id_ent = ?",
    mid_ent
  );
  const newConfig = {
    fecha,
    id_ent,
  };

  if (config.length > 0) {
    req.flash("message", "Esa entrega YA se realizó");
    res.redirect("/config");
  } else {
    await pool.query("INSERT INTO setting set ?", [newConfig]);
    req.flash("success", "El número de entrega, se Grabo Correctamente");
    res.redirect("/config");
  }
};

// ************* edit  **********************
ctrlconfig.edit = async (req, res) => {
  const { id } = req.params;
  const config = await pool.query(
    "SELECT *, CAST(fecha AS CHAR) AS mfecha FROM setting WHERE id = ?",
    [id]
  );

  res.render("config/edit.hbs", { datos: config[0] });
};

// ********** update *************
ctrlconfig.update = async (req, res) => {
  const { id } = req.params;
  const { fecha, id_ent } = req.body;
  const mid_ent = req.body.id_ent;

  const newConfig = {
    fecha,
    id_ent,
  };

  await pool.query("UPDATE setting set ? WHERE id = ?", [newConfig, id]);
  req.flash("success", "El registro se Actualizado Correctamente");
  res.redirect("/config");
};

// ************** Delete *********************
ctrlconfig.delete = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM setting WHERE id = ?", [id]);
  req.flash("success", "El Registro fue Borrado Correctamente");
  res.redirect("/config");
};

module.exports = ctrlconfig;
