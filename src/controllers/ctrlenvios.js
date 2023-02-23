const ctrlenvios = {};
const config = require("../config");
const requests = require("request");
const pool = require("../database");
const path = require("path");
const { Console } = require("console");

// ************* despliega sms.hbs  **********************
ctrlenvios.list = async (req, res) => {
  var sedes = await pool.query(
    "SELECT codsede, nombsede FROM centrospae ORDER BY codmpio"
  );

  res.render("envios/sms.hbs", { sedes });
};

// ************* envio SMS **********************
ctrlenvios.envio = async (req, res) => {
  const mcodsede = req.body.codsede;
  const mmensaje = req.body.mensaje;

  const alumnos = await pool.query(
    "SELECT acudiente, celular FROM beneficiario WHERE CHARACTER_LENGTH(celular) > 0 AND codsede = ?",
    [mcodsede]
  );
  if (alumnos.length > 0) {
    for (var i in alumnos) {
      var mcelular = alumnos[i].celular;

      var options = {
        method: "POST",
        url: "https://www.onurix.com/api/v1/send-sms",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        formData: {
          key: config.key,
          client: config.client,
          phone: mcelular,
          sms: mmensaje,
          "country-code": "CO",
        },
      };

      //console.log(options);
      requests(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      });
    }
    req.flash("success", "Los mensajes SMS se enviaron Correctamente");
  } else {
    req.flash("message", "No se puedo enviar los mensajes");
  }

  res.redirect("/mensajes");
};

module.exports = ctrlenvios;
