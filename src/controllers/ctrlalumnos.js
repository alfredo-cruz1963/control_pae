const ctrlalumnos = {};
const pool = require("../database");
const path = require("path");
const { Console } = require("console");
const { body } = require("express-validator/check");

// ************* lista  **********************
ctrlalumnos.list = async (req, res) => {
  const mcodsede = req.user.codsede;
  var cursos = await pool.query(
    "SELECT DISTINCT curso FROM beneficiario WHERE codsede = ? ORDER BY curso",
    [mcodsede]
  );

  res.render("alumnos/list.hbs", { cursos });
};

// ********** View *************
ctrlalumnos.view = async (req, res) => {
  const mcodsede = req.user.codsede;

  await pool.query(
    "SELECT * FROM valumnos WHERE codsede = ? ORDER BY curso, nombre",
    [mcodsede],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// ********** update *************
ctrlalumnos.update = async (req, res) => {
  const { id } = req.params;
  const {
    numero,
    tipdoc,
    nombres,
    apellidos,
    sexo,
    fecnac,
    etnia,
    acudiente,
    cedula,
    celular,
    curso,
  } = req.body;

  const newAlumno = {
    numero,
    tipdoc,
    nombres,
    apellidos,
    sexo,
    fecnac,
    etnia,
    acudiente,
    cedula,
    celular,
    curso,
  };

  newAlumno.nombres = newAlumno.nombres.toUpperCase();
  newAlumno.apellidos = newAlumno.apellidos.toUpperCase();
  newAlumno.acudiente = newAlumno.acudiente.toUpperCase();

  await pool.query(
    "UPDATE beneficiario set ? WHERE numero = ?",
    [newAlumno, numero],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    }
  );
};

// ********** update Face *************
ctrlalumnos.updateface = async (req, res) => {
  const { numero } = req.params;
  const { src } = req.body;

  const newFace = { cara: src };

  await pool.query(
    "UPDATE beneficiario set ? WHERE numero = ?",
    [newFace, numero],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    }
  );
};

// ************** Delete *********************
ctrlalumnos.delete = async (req, res) => {
  const { numero } = req.params;
  await pool.query(
    "DELETE FROM beneficiario WHERE numero = ?",
    [numero],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
};

// *********** adicciona a la BD *****************
ctrlalumnos.add = async (req, res) => {
  const {
    numero,
    tipdoc,
    nombres,
    apellidos,
    sexo,
    fecnac,
    etnia,
    acudiente,
    cedula,
    celular,
    curso,
    codsede
  } = req.body;
  const mnumero = req.body.numero;
  const datos = await pool.query(
    "SELECT numero FROM beneficiario WHERE numero = ?",
    mnumero
  );
  const newAlumno = {
    numero,
    tipdoc,
    nombres,
    apellidos,
    sexo,
    fecnac,
    etnia,
    acudiente,
    cedula,
    celular,
    curso,
    codsede: req.user.codsede
  };
  newAlumno.nombres = newAlumno.nombres.toUpperCase();
  newAlumno.apellidos = newAlumno.apellidos.toUpperCase();
  newAlumno.acudiente = newAlumno.acudiente.toUpperCase();

  if (datos.length > 0) {
    res.send("Fallo");
  } else {
    await pool.query(
      "INSERT INTO beneficiario set ?",
      [newAlumno],
      function (error, result) {
        if (error) {
          throw error;
        } else {
          res.send(result);
        }
      }
    );
  }
};

// ************* Search  **********************
ctrlalumnos.search = async (req, res) => {
  res.render("alumnos/documento.hbs");
};

// ************** Consultar alumno *********************
ctrlalumnos.consultar = async (req, res) => {
  const { numero } = req.body;
  const datos = await pool.query(
    "SELECT *, CAST(fecnac AS CHAR) AS mfecnac FROM beneficiario WHERE numero = ?",
    [numero]
  );

  console.log(datos)

  if (datos.length == 0) {
    req.flash(
      "message",
      "El Alumno con numero de documento " + numero + ", NO existe."
    );

    res.redirect("/alumnos/search");
  } else {
    const mcodsede = datos[0].codsede;

    const sedes = await pool.query(
      "SELECT * FROM centrospae WHERE codsede = ?",
      [mcodsede]
    );
    const nombsede = sedes[0].nombsede;

    res.render("alumnos/consultar.hbs", { datos: datos[0], sede: nombsede });
  }
};

// ************** Consultar cara *********************
ctrlalumnos.searchFace = async (req, res) => {
  const { codsede } = req.params;

  //console.log("paso")
  //datos = await pool.query('SELECT numero, cara FROM beneficiario WHERE codsede = ?', [codsede])

  await pool.query(
    "SELECT numero, cara FROM beneficiario WHERE codsede = ?",
    [codsede],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    }
  );
};

module.exports = ctrlalumnos;
