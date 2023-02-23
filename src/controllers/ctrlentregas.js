const ctrlentregas = {};
var mnumero = "";

const pool = require("../database");
const path = require("path");

// ************* lista  **********************
ctrlentregas.list = async (req, res) => {
  const mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  const mfecha = JSON.stringify(mfechoy);
  const mfecha1 = mfecha.substr(1, 10);

  res.render("entregas/list.hbs", { fecha: mfecha1 });
};

// ************* View  **********************
ctrlentregas.view = async (req, res) => {
  const mcodsede = req.user.codsede;
  const mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  const mfecha = JSON.stringify(mfechoy);
  const mfecha1 = mfecha.substr(1, 10);

  datos = await pool.query(
    "SELECT * FROM ventregas WHERE fecha = ? and codsede = ?",
    [mfecha1, mcodsede]
  );

  await pool.query(
    "SELECT * FROM ventregas WHERE fecha = ? and codsede = ?",
    [mfecha1, mcodsede],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// ************* entregas sin huella **********************
ctrlentregas.listnohuella = async (req, res) => {
  const mcodsede = req.user.codsede;
  var mrol = req.user.rol;
  const mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  const mfecha = JSON.stringify(mfechoy);
  const mfecha1 = mfecha.substr(1, 10);

  var datos = await pool.query(
    "SELECT * FROM valumnos WHERE codsede = ? ORDER BY curso, nombre",
    [mcodsede]
  );
  var cursos = await pool.query(
    "SELECT DISTINCT curso FROM beneficiario WHERE codsede = ? ORDER BY curso",
    [mcodsede]
  );

  var adatos = [];
  for (var i in datos) {
    adatos.push([
      datos[i].numero,
      datos[i].tipdoc,
      datos[i].nombres,
      datos[i].apellidos,
      datos[i].sexo,
      datos[i].fecnac,
      datos[i].acudiente,
      datos[i].cedula,
      datos[i].celular,
      datos[i].curso,
    ]);
  }
  const aDatos = JSON.stringify(adatos);

  res.render("entregas/entregassinhuellas.hbs", {
    datos,
    cursos,
    aDatos,
    mrol: JSON.stringify(mrol),
    fecha: mfecha1,
  });
};

// ************* add sin huella **********************
ctrlentregas.addmanual = async (req, res) => {
  const { numero, fecha, acudiente, cedula, curso, codsede, tipo } = req.body;
  const mnumero = req.body.numero;
  const mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  const mfecha = JSON.stringify(mfechoy);
  const mfecha1 = mfecha.substr(1, 10);

  const salidas = await pool.query(
    "SELECT * FROM asistencia WHERE numero = ? AND fecha = ?",
    [mnumero, mfecha1]
  );

  if (salidas.length > 0) {
    req.flash("message", "Al Estudiante YA se le hizo la entrega");
    res.redirect("/entregas");
  } else {
    const newEntrega = {
      numero: mnumero,
      fecha: mfechoy,
      acudiente: req.body.acudiente,
      cedula: req.body.cedula,
      curso: req.body.curso,
      codsede: req.user.codsede,
      tipo: "3"
    };

    await pool.query("INSERT INTO asistencia set ?", [newEntrega]);
    req.flash("success", "La Entrega se guardo Correctamente");
    res.redirect("/entregas");
  }
};

// ************* entregas  **********************
ctrlentregas.add = async (req, res) => {
  const { numero } = req.params;
  mnumero = numero;
  const mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  const mfecha = JSON.stringify(mfechoy);
  const mfecha1 = mfecha.substr(1, 10);

  const salidas = await pool.query(
    "SELECT * FROM asistencia WHERE numero = ? AND fecha = ?",
    [mnumero, mfecha1]
  );

  if (salidas.length > 0) {
    res.send("Fallo");
  } else {
    const datos = await pool.query(
      "SELECT * FROM beneficiario WHERE numero = ?",
      [mnumero]
    );

    const newEntrega = {
      numero: datos[0].numero,
      fecha: mfechoy,
      acudiente: datos[0].acudiente,
      cedula: datos[0].cedula,
      curso: datos[0].curso,
      codsede: req.user.codsede,
      tipo: "3"
    };

    await pool.query("INSERT INTO asistencia set ?", [newEntrega], function (
      error,
      result
    ) {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    });
  }
};

// ************** Delete *********************
ctrlentregas.delete = async (req, res) => {
  const { numero } = req.params;
  const mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  const mfecha = JSON.stringify(mfechoy);
  const mfecha1 = mfecha.substr(1, 10);

  await pool.query(
    "DELETE FROM asistencia WHERE numero = ? AND fecha = ?",
    [numero, mfecha1],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

module.exports = ctrlentregas;
