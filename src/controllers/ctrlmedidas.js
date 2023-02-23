const ctrlmedidas = {};
const pool = require("../database");
const path = require("path");

// ************* lista  **********************
ctrlmedidas.list = async (req, res) => {
  const mcodsede = req.user.codsede;
  var mrol = req.user.rol;

  var medidas = await pool.query("SELECT * FROM vmedidas WHERE codsede = ?", [
    mcodsede,
  ]);

  res.render("medidas/list.hbs", {
    tomas: medidas,
    mrol: JSON.stringify(mrol),
  });
};

// ************* entregas  **********************
ctrlmedidas.add = async (req, res) => {
  const { estado } = req.body;
  mnumero = req.body.estado;
  console.log(mnumero);
  var mfechoy = new Date();
  mfechoy = JSON.stringify(mfechoy);
  const mfechoy1 = mfechoy.substr(1, 10);

  const tomas = await pool.query("SELECT * FROM valumnos WHERE numero = ?", [
    mnumero,
  ]);
  const mfecnac = JSON.stringify(tomas[0].fecnac);
  const mfecnac1 = mfecnac.substr(1, 10);
  const msexo = tomas[0].sexo;
  const zte = await pool.query("SELECT * FROM te_zscore WHERE sexo = ?", [
    msexo,
  ]);
  const zimc = await pool.query("SELECT * FROM imc_zscore WHERE sexo = ?", [
    msexo,
  ]);
  const zpe = await pool.query("SELECT * FROM pe_zscore WHERE sexo = ?", [
    msexo,
  ]);
  const zpt = await pool.query("SELECT * FROM pt_zscore_02 WHERE sexo = ?", [
    msexo,
  ]);
  const zpt1 = await pool.query("SELECT * FROM pt_zscore_25 WHERE sexo = ?", [
    msexo,
  ]);

  var aZTE = [];
  var aZIMC = [];
  var aZPE = [];
  var aZPT = [];
  var aZPT1 = [];

  for (var i in zte) {
    aZTE.push([
      zte[i].sexo,
      zte[i].meses,
      zte[i].l,
      zte[i].m,
      zte[i].s,
      zte[i].sd3neg,
      zte[i].sd2neg,
      zte[i].sd1neg,
      zte[i].sd0,
      zte[i].sd1,
      zte[i].sd2,
      zte[i].sd3,
    ]);
  }
  const azte = JSON.stringify(aZTE);

  for (var i in zimc) {
    aZIMC.push([
      zimc[i].sexo,
      zimc[i].meses,
      zimc[i].l,
      zimc[i].m,
      zimc[i].s,
      zimc[i].sd3neg,
      zimc[i].sd2neg,
      zimc[i].sd1neg,
      zimc[i].sd0,
      zimc[i].sd1,
      zimc[i].sd2,
      zimc[i].sd3,
    ]);
  }
  const azimc = JSON.stringify(aZIMC);

  for (var i in zpe) {
    aZPE.push([
      zpe[i].sexo,
      zpe[i].meses,
      zpe[i].l,
      zpe[i].m,
      zpe[i].s,
      zpe[i].sd3neg,
      zpe[i].sd2neg,
      zpe[i].sd1neg,
      zpe[i].sd0,
      zpe[i].sd1,
      zpe[i].sd2,
      zpe[i].sd3,
    ]);
  }
  const azpe = JSON.stringify(aZPE);

  for (var i in zpt) {
    aZPT.push([
      zpt[i].sexo,
      zpt[i].talla,
      zpt[i].l,
      zpt[i].m,
      zpt[i].s,
      zpt[i].sd3neg,
      zpt[i].sd2neg,
      zpt[i].sd1neg,
      zpt[i].sd0,
      zpt[i].sd1,
      zpt[i].sd2,
      zpt[i].sd3,
    ]);
  }
  const azpt = JSON.stringify(aZPT);

  for (var i in zpt1) {
    aZPT1.push([
      zpt1[i].sexo,
      zpt1[i].talla,
      zpt1[i].l,
      zpt1[i].m,
      zpt1[i].s,
      zpt1[i].sd3neg,
      zpt1[i].sd2neg,
      zpt1[i].sd1neg,
      zpt1[i].sd0,
      zpt1[i].sd1,
      zpt1[i].sd2,
      zpt1[i].sd3,
    ]);
  }
  const azpt1 = JSON.stringify(aZPT1);

  res.render("medidas/add.hbs", {
    tomas: tomas[0],
    azte,
    azimc,
    azpe,
    azpt,
    azpt1,
    fechoy: mfechoy1,
    fecnac: mfecnac1,
  });
};

// ************** Delete *********************
ctrlmedidas.delete = async (req, res) => {
  const { numero } = req.params;

  const mfvisita = numero.substr(0, 10);
  const mnumero = numero.substr(10);

  await pool.query("DELETE FROM medidas WHERE numero = ? AND fvisita = ?", [
    mnumero,
    mfvisita,
  ]);
  req.flash("success", "La medida fue Borrada Correctamente");
  res.redirect("/medidas");
};

// ************** graba las medidas *********************
ctrlmedidas.save = async (req, res) => {
  const { numero } = req.params;
  const { fvisita, peso, talla, meses, zpt, zpe, zte, zimc } = req.body;

  const newToma = {
    numero,
    fvisita: fvisita,
    fecnac: fvisita,
    talla: talla,
    peso: peso,
    medido: 2,
    meses: meses,
    zpt: zpt,
    zpe: zpe,
    zte: zte,
    zimc: zimc,
    imc: 0,
  };

  const datos = await pool.query(
    "SELECT * FROM beneficiario WHERE numero = ?",
    [numero]
  );
  var mfecnac = JSON.stringify(datos[0].fecnac);
  mfecnac = mfecnac.substr(1, 10);
  var lnimc = parseFloat(peso) / Math.pow(parseFloat(talla) / 100, 2);
  var lnimc = parseFloat(lnimc).toFixed(2);
  newToma.imc = lnimc;
  newToma.fecnac = mfecnac;

  const toma = await pool.query(
    "SELECT * FROM medidas WHERE numero = ? AND fvisita = ?",
    [numero, fvisita]
  );

  if (toma.length > 0) {
    req.flash(
      "message",
      "Con Fecha " +
        fvisita +
        ", se le hicieron las tomas de medidas al alumno."
    );
    res.redirect("/medidas");
  } else {
    await pool.query("INSERT INTO medidas set ?", [newToma]);
    req.flash("success", "Las medidas se grabaron Correctamente");
    res.redirect("/medidas");
  }
};

// ************* graficas  **********************
ctrlmedidas.view = async (req, res) => {
  const { numero } = req.params;
  const mfvisita = numero.substr(0, 10);
  const mnumero = numero.substr(10);

  const tomas = await pool.query(
    "SELECT * FROM vmedidas WHERE numero = ? AND fvisita = ?",
    [mnumero, mfvisita]
  );
  var msexo = tomas[0].sexo;
  var mmeses = tomas[0].meses;
  var mzpt = tomas[0].zpt;
  var mzpe = tomas[0].zpe;
  var mzte = tomas[0].zte;
  var mzimc = tomas[0].zimc;

  if (mzpt === "") {
    var lczpt = "9999";
  } else {
    var lczpt = tomas[0].zpt;
  }

  if (mzpe === "") {
    var lczpe = "9999";
  } else {
    var lczpe = tomas[0].zpe;
  }

  if (mzte === "") {
    var lczte = "9999";
  } else {
    var lczte = tomas[0].zte;
  }

  if (mzimc === "") {
    var lczimc = "9999";
  } else {
    var lczimc = tomas[0].zimc;
  }

  var mesini = 0;
  var mesfin = 0;

  if (mmeses <= 24) {
    mesini = 0;
    mesfin = 24;
  }

  if (mmeses > 24 && mmeses <= 60) {
    mesini = 24;
    mesfin = 60;
  }

  if (mmeses > 60) {
    mesini = 60;
    mesfin = 228;
  }

  const zte = await pool.query(
    "SELECT * FROM te_zscore WHERE sexo = ? AND meses >= ? AND meses <= ?",
    [msexo, mesini, mesfin]
  );
  const zimc = await pool.query(
    "SELECT * FROM imc_zscore WHERE sexo = ? AND meses >= ? AND meses <= ?",
    [msexo, mesini, mesfin]
  );
  const zpe = await pool.query(
    "SELECT * FROM pe_zscore WHERE sexo = ? AND meses >= ? AND meses <= ?",
    [msexo, mesini, mesfin]
  );
  const zpt = await pool.query("SELECT * FROM pt_zscore_02 WHERE sexo = ?", [
    msexo,
  ]);
  const zpt1 = await pool.query("SELECT * FROM pt_zscore_25 WHERE sexo = ?", [
    msexo,
  ]);

  //console.log(zimc);
  var aZTE = [];
  var aZIMC = [];
  var aZPE = [];
  var aZPT = [];
  var aZPT1 = [];

  for (var i in zte) {
    aZTE.push([
      zte[i].sexo,
      zte[i].meses,
      zte[i].l,
      zte[i].m,
      zte[i].s,
      zte[i].sd3neg,
      zte[i].sd2neg,
      zte[i].sd1neg,
      zte[i].sd0,
      zte[i].sd1,
      zte[i].sd2,
      zte[i].sd3,
    ]);
  }
  const azte = JSON.stringify(aZTE);

  for (var i in zimc) {
    aZIMC.push([
      zimc[i].sexo,
      zimc[i].meses,
      zimc[i].l,
      zimc[i].m,
      zimc[i].s,
      zimc[i].sd3neg,
      zimc[i].sd2neg,
      zimc[i].sd1neg,
      zimc[i].sd0,
      zimc[i].sd1,
      zimc[i].sd2,
      zimc[i].sd3,
    ]);
  }
  const azimc = JSON.stringify(aZIMC);

  for (var i in zpe) {
    aZPE.push([
      zpe[i].sexo,
      zpe[i].meses,
      zpe[i].l,
      zpe[i].m,
      zpe[i].s,
      zpe[i].sd3neg,
      zpe[i].sd2neg,
      zpe[i].sd1neg,
      zpe[i].sd0,
      zpe[i].sd1,
      zpe[i].sd2,
      zpe[i].sd3,
    ]);
  }
  const azpe = JSON.stringify(aZPE);

  for (var i in zpt) {
    aZPT.push([
      zpt[i].sexo,
      zpt[i].talla,
      zpt[i].l,
      zpt[i].m,
      zpt[i].s,
      zpt[i].sd3neg,
      zpt[i].sd2neg,
      zpt[i].sd1neg,
      zpt[i].sd0,
      zpt[i].sd1,
      zpt[i].sd2,
      zpt[i].sd3,
    ]);
  }
  const azpt = JSON.stringify(aZPT);

  for (var i in zpt1) {
    aZPT1.push([
      zpt1[i].sexo,
      zpt1[i].talla,
      zpt1[i].l,
      zpt1[i].m,
      zpt1[i].s,
      zpt1[i].sd3neg,
      zpt1[i].sd2neg,
      zpt1[i].sd1neg,
      zpt1[i].sd0,
      zpt1[i].sd1,
      zpt1[i].sd2,
      zpt1[i].sd3,
    ]);
  }
  const azpt1 = JSON.stringify(aZPT1);

  res.render("medidas/view.hbs", {
    tomas: tomas[0],
    lczpt,
    lczpe,
    lczte,
    lczimc,
    azte,
    azimc,
    azpe,
    azpt,
    azpt1,
  });
};

module.exports = ctrlmedidas;
