const ctrlquerys = {};

const pool = require("../database");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

//***** despliega la pagina para el reporte por ZIMC ****
ctrlquerys.zimc = (req, res) => {
  var mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  mfechoy = JSON.stringify(mfechoy);
  const mfechoy1 = mfechoy.substr(1, 10);

  res.render("querys/inputzimc.hbs", { fechoy: mfechoy1 });
};

//***** despliega la pagina para el reporte por ZTE ****
ctrlquerys.zte = (req, res) => {
  var mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  mfechoy = JSON.stringify(mfechoy);
  const mfechoy1 = mfechoy.substr(1, 10);

  res.render("querys/inputzte.hbs", { fechoy: mfechoy1 });
};

//***** despliega la pagina para el rango de fechas del reporte ****
ctrlquerys.fsedes = (req, res) => {
  var mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  mfechoy = JSON.stringify(mfechoy);
  const mfechoy1 = mfechoy.substr(1, 10);

  res.render("querys/fsedes.hbs", { fechoy: mfechoy1 });
};

//***** despliega la pagina para el rango de fechas del reporte ****
ctrlquerys.ffechas = (req, res) => {
  var mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  mfechoy = JSON.stringify(mfechoy);
  const mfechoy1 = mfechoy.substr(1, 10);

  res.render("querys/ffechas.hbs", { fechoy: mfechoy1 });
};

//***** despliega la pagina para el rango de fechas del reporte ****
ctrlquerys.fectotal = (req, res) => {
  var mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  mfechoy = JSON.stringify(mfechoy);
  const mfechoy1 = mfechoy.substr(1, 10);

  res.render("querys/fectotal.hbs", { fechoy: mfechoy1 });
};

//***** despliega la pagina para el rango de fechas por sede ****
ctrlquerys.fecsede = async (req, res) => {
  var mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  mfechoy = JSON.stringify(mfechoy);
  const mfechoy1 = mfechoy.substr(1, 10);

  var sedes = await pool.query(
    "SELECT codsede, nombsede FROM centrospae ORDER BY codmpio"
  );

  res.render("querys/fecsede.hbs", { sedes, fechoy: mfechoy1 });
};

//***** despliega la pagina para el rango de fechas para el resumen del registro mensual  ****
ctrlquerys.fecmensual = async (req, res) => {
  var mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  mfechoy = JSON.stringify(mfechoy);
  const mfechoy1 = mfechoy.substr(1, 10);

  res.render("querys/fecmensual.hbs", { fechoy: mfechoy1 });
};

//***** realiza las operaciones para el reporte por rango de fechas ****
ctrlquerys.listfecsede = async (req, res) => {
  const fdesde = req.body.desde;
  const fhasta = req.body.hasta;
  const cosede = req.body.codsede;
  const { desde, hasta, codsede } = req.body;

  const nombpdf = "alumnossede.pdf";

  const sede = await pool.query("SELECT * FROM vsedespae WHERE codsede = ?", [
    codsede,
  ]);
  const nombsede = sede[0].nombsede;

  mquery = `SELECT asistencia.numero, beneficiario.apellidos, beneficiario.nombres, 
            beneficiario.sexo, beneficiario.tipdoc, beneficiario.fecnac, asistencia.codsede, 
            COUNT(asistencia.fecha) AS total, LEFT(asistencia.curso, 2) AS grado, beneficiario.etnia 
            FROM asistencia 
            INNER JOIN beneficiario 
            ON asistencia.numero = beneficiario.numero 
            WHERE asistencia.codsede = ? 
            AND asistencia.fecha >= ? 
            AND asistencia.fecha <= ? 
            GROUP BY asistencia.numero, beneficiario.nombres 
            ORDER BY grado, beneficiario.apellidos`;

  var datos = await pool.query(mquery, [codsede, desde, hasta]);

  const yy = 100;
  var x = 45;
  const doc = new PDFDocument({ autoFirstPage: false });
  doc
    .addPage({ margin: 45 })
    .font("Helvetica-Bold", 12)
    .text("ALCALDIA MUNICIPAL DE CHIA")
    .font("Helvetica-Bold", 10)
    .text("SECRETARIA DE EDUCACION" + "\n")
    .font("Helvetica-Bold", 7)
    .text(nombsede + "\n")
    .text("Registro y control diario de asistencia" + "\n")
    .text("Desde: " + desde + "  Hasta: " + hasta + "\n\n")
    .font("Helvetica-Bold", 6)
    .text("N°", x + 5, yy)
    .text("TIP DOC", x + 26, yy)
    .text("DOCUMENTO", x + 54, yy)
    .text("NOMBRES TITULAR", x + 103, yy)
    .text("APELLIDOS TITULAR", x + 223, yy)
    .text("FEC NAC", x + 343, yy)
    .text("ETNIA", x + 385, yy)
    .text("SEXO", x + 408, yy)
    .text("GRADO", x + 428, yy)
    .text("TIP COMP", x + 456, yy)
    .text("TOT DIAS", x + 490, yy)

    .rect(x, yy - 5, x + 480, 15)
    .moveTo(x + 25, yy - 5)
    .lineTo(x + 25, yy + 10)

    .moveTo(x + 52, yy - 5)
    .lineTo(x + 52, yy + 10)

    .moveTo(x + 100, yy - 5)
    .lineTo(x + 100, yy + 10)

    .moveTo(x + 220, yy - 5)
    .lineTo(x + 220, yy + 10)

    .moveTo(x + 340, yy - 5)
    .lineTo(x + 340, yy + 10)

    .moveTo(x + 383, yy - 5)
    .lineTo(x + 383, yy + 10)

    .moveTo(x + 406, yy - 5)
    .lineTo(x + 406, yy + 10)

    .moveTo(x + 426, yy - 5)
    .lineTo(x + 426, yy + 10)

    .moveTo(x + 454, yy - 5)
    .lineTo(x + 454, yy + 10)

    .moveTo(x + 488, yy - 5)
    .lineTo(x + 488, yy + 10);

  var y = 110;
  var posy = 0;
  var pos = 0;
  var fila = 0;
  var msexo = "";
  var mtipdoc = "";
  var mfecha;
  var mgrado;
  var metnia;

  for (i = 0; i < datos.length; i++) {
    posy = y + 10 * fila;
    fila++;
    pos++;

    if (datos[i].sexo == "1") {
      msexo = "M";
    } else msexo = "F";

    switch (datos[i].tipdoc) {
      case 1:
        mtipdoc = "RC";
        break;

      case 2:
        mtipdoc = "TI";
        break;

      case 3:
        mtipdoc = "CC";
        break;

      case 4:
        mtipdoc = "CE";
        break;
    }

    switch (datos[i].etnia) {
      case 1:
        metnia = "INDIG";
        break;

      case 2:
        metnia = " AFRO";
        break;

      case 3:
        metnia = "RAIZAL";
        break;

      case 4:
        metnia = " ROM";
        break;

      case 5:
        metnia = "  SP";
        break;
    }

    if (datos[i].grado == "00") {
      mgrado = "P";
    } else mgrado = datos[i].grado;

    mfecha = JSON.stringify(datos[i].fecnac);
    var mfecha1 = mfecha.substr(1, 10);

    doc
      .font("Helvetica", 6)
      .text(i + 1, x + 5, posy + 3)
      .text(mtipdoc, x + 34, posy + 3)
      .text(datos[i].numero, x + 54, posy + 3)
      .text(datos[i].nombres, x + 103, posy + 3)
      .text(datos[i].apellidos, x + 223, posy + 3)
      .text(mfecha1, x + 345, posy + 3)
      .text(metnia, x + 385, posy + 3)
      .text(msexo, x + 414, posy + 3)
      .text(mgrado, x + 436, posy + 3)
      .text(datos[i].total, x + 495, posy + 3)

      .moveTo(x, posy - 5)
      .lineTo(x, posy + 10)

      .moveTo(x + 25, posy - 5)
      .lineTo(x + 25, posy + 10)

      .moveTo(x + 52, posy - 5)
      .lineTo(x + 52, posy + 10)

      .moveTo(x + 100, posy - 5)
      .lineTo(x + 100, posy + 10)

      .moveTo(x + 220, posy - 5)
      .lineTo(x + 220, posy + 10)

      .moveTo(x + 340, posy - 5)
      .lineTo(x + 340, posy + 10)

      .moveTo(x + 383, posy - 5)
      .lineTo(x + 383, posy + 10)

      .moveTo(x + 406, posy - 5)
      .lineTo(x + 406, posy + 10)

      .moveTo(x + 426, posy - 5)
      .lineTo(x + 426, posy + 10)

      .moveTo(x + 454, posy - 5)
      .lineTo(x + 454, posy + 10)

      .moveTo(x + 488, posy - 5)
      .lineTo(x + 488, posy + 10)

      .moveTo(x + 525, posy - 5)
      .lineTo(x + 525, posy + 10)

      .moveTo(x, posy + 10)
      .lineTo(x + 525, posy + 10)

      .stroke();

    if (fila >= 41) {
      x = 45;
      y = 115;
      pos = 0;
      posy = 0;
      fila = 0;

      doc
        .addPage({ margin: 45 })
        .font("Helvetica-Bold", 12)
        .text("ALCALDIA MUNICIPAL DE CHIA")
        .font("Helvetica-Bold", 10)
        .text("SECRETARIA DE EDUCACION" + "\n")
        .font("Helvetica-Bold", 7)
        .text(nombsede + "\n")
        .text("Registro y control diario de asistencia" + "\n")
        .text("Desde: " + desde + "  Hasta: " + hasta + "\n\n")
        .font("Helvetica-Bold", 6)
        .text("N°", x + 5, yy)
        .text("TIP DOC", x + 26, yy)
        .text("DOCUMENTO", x + 54, yy)
        .text("NOMBRES TITULAR", x + 103, yy)
        .text("APELLIDOS TITULAR", x + 223, yy)
        .text("FEC NAC", x + 343, yy)
        .text("ETNIA", x + 385, yy)
        .text("SEXO", x + 408, yy)
        .text("GRADO", x + 428, yy)
        .text("TIP COMP", x + 456, yy)
        .text("TOT DIAS", x + 490, yy)

        .rect(x, yy - 5, x + 480, 15)
        .moveTo(x + 25, yy - 5)
        .lineTo(x + 25, yy + 10)

        .moveTo(x + 52, yy - 5)
        .lineTo(x + 52, yy + 10)

        .moveTo(x + 100, yy - 5)
        .lineTo(x + 100, yy + 10)

        .moveTo(x + 220, yy - 5)
        .lineTo(x + 220, yy + 10)

        .moveTo(x + 340, yy - 5)
        .lineTo(x + 340, yy + 10)

        .moveTo(x + 383, yy - 5)
        .lineTo(x + 383, yy + 10)

        .moveTo(x + 406, yy - 5)
        .lineTo(x + 406, yy + 10)

        .moveTo(x + 426, yy - 5)
        .lineTo(x + 426, yy + 10)

        .moveTo(x + 454, yy - 5)
        .lineTo(x + 454, yy + 10)

        .moveTo(x + 488, yy - 5)
        .lineTo(x + 488, yy + 10)
        .stroke();
    }
  }

  doc.pipe(
    fs.createWriteStream(path.join(__dirname, "../public/pdfs/" + nombpdf))
  );
  doc.end();
  res.render("querys/editor.hbs", { file: nombpdf });
};

//***** realiza las operaciones para el reporte por entregas totales por fechas ****
ctrlquerys.listfectotal = async (req, res) => {
  const fdesde = req.body.desde;
  const fhasta = req.body.hasta;
  const nombMes = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const nombDia = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  const nombpdf = "fectotal.pdf";
  const mquery = `SELECT asistencia.fecha, COUNT(asistencia.fecha) AS total 
                    FROM asistencia  
                    WHERE asistencia.fecha >= ? AND asistencia.fecha <= ?
                    GROUP BY asistencia.fecha 
                    ORDER BY asistencia.fecha`;

  var datos = await pool.query(mquery, [fdesde, fhasta]);

  var x = 45;
  const doc = new PDFDocument({ autoFirstPage: false });
  doc
    .addPage({ margin: 45 })
    .font("Helvetica-Bold", 12)
    .text("ALCALDIA MUNICIPAL DE CHIA")
    .font("Helvetica-Bold", 10)
    .text("SECRETARIA DE EDUCACION" + "\n")
    .text("Reporte de Entregas por Periodo" + "\n")
    .text("Desde: " + fdesde + "  Hasta: " + fhasta + "\n\n")
    .font("Helvetica-Bold", 7)

    .moveTo(x, 95)
    .lineTo(x + 220, 95)
    .stroke();

  var total = 0;
  var y = 100;
  var posy = 0;
  var pos = 0;
  var col = 1;
  var fila = 0;

  for (i = 0; i < datos.length; i++) {
    posy = y + 15 * fila;
    fila++;
    pos++;

    var mfecha = JSON.stringify(datos[i].fecha);
    var mdiaSemana = nombDia[datos[i].fecha.getDay()];
    var mmes = nombMes[datos[i].fecha.getMonth()];

    var sfecha = mfecha.split("-");
    var mdia = sfecha[2];
    var manio = sfecha[0];
    console.log(mdia);
    doc
      .font("Helvetica", 7)
      .text(
        mdiaSemana +
          ", " +
          mdia.substr(0, 2) +
          " " +
          mmes +
          " de " +
          manio.substr(1, 4),
        x + 25,
        posy
      )
      .text(datos[i].total, x + 180, posy);

    total = total + datos[i].total;

    if (fila >= 41) {
      y = 100;
      x = 315;
      posy = 0;
      col = 2;
      fila = 0;

      doc
        .font("Helvetica-Bold", 7)
        .moveTo(x + 50, 95)
        .lineTo(x + 50, x + 205)
        .stroke();
    }

    if (pos % 82 == 0 && col == 2) {
      col = 1;
      x = 45;
      y = 115;
      pos = 0;
      posy = 0;
      fila = 0;

      doc.addPage({ margin: 45 });
      doc
        .font("Helvetica-Bold", 12)
        .text("ALCALDIA MUNICIPAL DE CHIA")
        .font("Helvetica-Bold", 10)
        .text("SECRETARIA DE EDUCACION" + "\n")
        .text("Reporte de Entregas por Periodo" + "\n")
        .text("Desde: " + fdesde + "  Hasta: " + fhasta + "\n\n")
        .font("Helvetica-Bold", 7)

        .moveTo(x + 50, 95)
        .lineTo(x + 50, x + 205)
        .stroke();
    }
  }

  doc.text("TOTAL", x + 140, posy + 30).text(total, x + 180, posy + 30);

  doc.pipe(
    fs.createWriteStream(path.join(__dirname, "../public/pdfs/" + nombpdf))
  );
  doc.end();
  res.render("querys/editor.hbs", { file: nombpdf });
};

//***** realiza las operaciones para el reporte po rango de fechas ****
ctrlquerys.totsedes = async (req, res) => {
  const fdesde = req.body.desde;
  const fhasta = req.body.hasta;

  const nombpdf = "totalsedes.pdf";
  const mquery = `SELECT asistencia.codsede, centrospae.nombsede, COUNT(asistencia.numero) AS total 
                    FROM asistencia INNER JOIN centrospae ON asistencia.codsede = centrospae.codsede 
                    WHERE asistencia.fecha >= ? 
                      AND asistencia.fecha <= ?
                    GROUP BY asistencia.codsede 
                    ORDER BY asistencia.codsede`;

  var datos = await pool.query(mquery, [fdesde, fhasta]);

  var x = 45;
  const doc = new PDFDocument({ autoFirstPage: false });
  doc
    .addPage({ margin: 45 })
    .font("Helvetica-Bold", 12)
    .text("ALCALDIA MUNICIPAL DE CHIA")
    .font("Helvetica-Bold", 10)
    .text("SECRETARIA DE EDUCACION" + "\n")
    .text("Reporte de Entregas por Periodo" + "\n")
    .text("Desde: " + fdesde + "  Hasta: " + fhasta + "\n\n")
    .font("Helvetica-Bold", 7)
    .text("CODIGO", x + 5, 100)
    .text("INSTITUCIONES EDUCATIVAS", x + 55, 100)
    .text("TOTAL", x + 225, 100)

    .rect(x, 95, x + 205, 15)
    .moveTo(x + 50, 95)
    .lineTo(x + 50, 110)

    .moveTo(x + 220, 95)
    .lineTo(x + 220, 110);

  var total = 0;
  var y = 115;
  var posy = 0;
  var pos = 0;
  var col = 1;
  var fila = 0;

  for (i = 0; i < datos.length; i++) {
    posy = y + 15 * fila;
    fila++;
    pos++;

    doc
      .font("Helvetica", 6)
      .text(datos[i].codsede, x + 5, posy)
      .text(datos[i].nombsede, x + 55, posy)
      .text(datos[i].total, x + 223, posy)

      .moveTo(x, posy - 5)
      .lineTo(x, posy + 10)

      .moveTo(x + 50, posy - 5)
      .lineTo(x + 50, posy + 10)

      .moveTo(x + 220, posy - 5)
      .lineTo(x + 220, posy + 10)

      .moveTo(x + 250, posy - 5)
      .lineTo(x + 250, posy + 10)

      .moveTo(x, posy + 10)
      .lineTo(x + 250, posy + 10)
      .stroke();

    total = total + datos[i].total;

    if (fila >= 41) {
      y = 115;
      x = 315;
      posy = 0;
      col = 2;
      fila = 0;

      doc
        .font("Helvetica-Bold", 7)
        .text("CODIGO", x + 5, 100)
        .text("INSTITUCIONES EDUCATIVAS", x + 55, 100)
        .text("TOTAL", x + 225, 100)
        .font("Helvetica", 7)

        .moveTo(x, 95)
        .lineTo(x + 250, 95)

        .moveTo(x, 110)
        .lineTo(x + 250, 110)

        .moveTo(x, 95)
        .lineTo(x, 110)

        .moveTo(x + 50, 95)
        .lineTo(x + 50, 110)

        .moveTo(x + 220, 95)
        .lineTo(x + 220, 110)

        .moveTo(x + 250, 95)
        .lineTo(x + 250, 110)

        .moveTo(x, 110)
        .lineTo(x + 250, 110)
        .stroke();
    }

    if (pos % 82 == 0 && col == 2) {
      col = 1;
      x = 45;
      y = 115;
      pos = 0;
      posy = 0;
      fila = 0;

      doc.addPage({ margin: 45 });
      doc
        .font("Helvetica-Bold", 12)
        .text("ALCALDIA MUNICIPAL DE CHIA")
        .font("Helvetica-Bold", 10)
        .text("SECRETARIA DE EDUCACION" + "\n")
        .text("Reporte de Entregas por Periodo" + "\n")
        .text("Desde: " + fdesde + "  Hasta: " + fhasta + "\n\n")
        .font("Helvetica-Bold", 7)
        .text("CODIGO", x + 5, 100)
        .text("INSTITUCIONES EDUCATIVAS", x + 55, 100)
        .text("TOTAL", x + 225, 100)

        .rect(x, 95, x + 205, 15)
        .moveTo(x + 50, 95)
        .lineTo(x + 50, 110)

        .moveTo(x + 220, 95)
        .lineTo(x + 220, 110)
        .stroke();
    }
  }

  doc.pipe(
    fs.createWriteStream(path.join(__dirname, "../public/pdfs/" + nombpdf))
  );
  doc.end();
  res.render("querys/editor.hbs", { file: nombpdf });
};

//***** realiza las operaciones para el reporte po rango de fechas ****
ctrlquerys.totfechas = async (req, res) => {
  const fdesde = req.body.desde;
  const fhasta = req.body.hasta;
  const nombMes = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const nombDia = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  const nombpdf = "totalfechas.pdf";
  const mquery = `SELECT asistencia.codsede, centrospae.nombsede, asistencia.fecha, 
        COUNT(asistencia.numero) AS total 
        FROM asistencia INNER JOIN centrospae ON asistencia.codsede = centrospae.codsede 
        WHERE asistencia.fecha >= ? AND asistencia.fecha <= ? 
        GROUP BY asistencia.codsede , asistencia.fecha 
        ORDER BY asistencia.codsede, asistencia.fecha`;

  var datos = await pool.query(mquery, [fdesde, fhasta]);
  var y = 100;
  var y1 = 100;
  var x = 45;
  var posy = 0;
  var pos = 1;
  var col = 1;

  const doc = new PDFDocument({ autoFirstPage: false });
  doc
    .addPage({ margin: 45 })
    .font("Helvetica-Bold", 12)
    .text("ALCALDIA MUNICIPAL DE CHIA")
    .font("Helvetica-Bold", 10)
    .text("SECRETARIA DE EDUCACION" + "\n")
    .text("Reporte de Entregas por Periodo" + "\n")
    .text("Desde: " + fdesde + "  Hasta: " + fhasta + "\n\n")
    .font("Helvetica-Bold", 8)
    .moveTo(x, 95)
    .lineTo(x + 220, 95)
    .stroke();

  var subtotal = 0;
  var total = 0;
  var mcodsede = datos[0].codsede;
  var mnombsede = datos[0].nombsede;
  doc.text(mnombsede, x, y);

  for (i = 0; i < datos.length; i++) {
    posy = y + 10 * pos;
    var mfecha = JSON.stringify(datos[i].fecha);
    var mdiaSemana = nombDia[datos[i].fecha.getDay()];
    var mmes = nombMes[datos[i].fecha.getMonth()];

    var sfecha = mfecha.split("-");
    var mdia = sfecha[2];
    var manio = sfecha[0];
    total = total + datos[i].total;

    if (datos[i].codsede != mcodsede) {
      doc
        .font("Helvetica-Bold", 8)
        .text("SUB-TOTAL", x + 35, posy)
        .text(subtotal, x + 180, posy);

      pos = pos + 2;
      posy = y + 10 * pos;

      subtotal = 0;
      mcodsede = datos[i].codsede;
      mnombsede = datos[i].nombsede;

      doc
        .font("Helvetica-Bold", 8)
        .text(mnombsede, x, posy)
        .font("Helvetica", 8);

      pos++;
      posy = y + 10 * pos;

      doc
        .font("Helvetica", 7)
        .text(
          mdiaSemana +
            ", " +
            mdia.substr(0, 2) +
            " " +
            mmes +
            " de " +
            manio.substr(1, 4),
          x + 25,
          posy
        )
        .text(datos[i].total, x + 180, posy);

      subtotal = subtotal + datos[i].total;
      pos++;
    } else {
      doc
        .font("Helvetica", 8)
        .text(
          mdiaSemana +
            ", " +
            mdia.substr(0, 2) +
            " " +
            mmes +
            " de " +
            manio.substr(1, 4),
          x + 25,
          posy
        )
        .text(datos[i].total, x + 180, posy);

      subtotal = subtotal + datos[i].total;
      pos++;
    }

    if (pos > 60) {
      y = 100;
      x = 315;
      col = 2;
      pos = 1;
    }

    if (pos % 60 == 0 && col == 2) {
      col = 1;
      x = 45;
      y = 100;
      pos = 1;
      doc
        .addPage({ margin: 45 })
        .font("Helvetica-Bold", 12)
        .text("ALCALDIA MUNICIPAL DE CHIA")
        .font("Helvetica-Bold", 10)
        .text("SECRETARIA DE EDUCACION" + "\n")
        .text("Reporte de Entregas por Periodo" + "\n")
        .text("Desde: " + fdesde + "  Hasta: " + fhasta + "\n\n")
        .font("Helvetica-Bold", 8)
        .moveTo(x, 95)
        .lineTo(x + 220, 95)
        .stroke();
    }
  }

  doc
    .font("Helvetica-Bold", 8)
    .text("SUB-TOTAL", x + 35, posy + 10)
    .text(subtotal, x + 180, posy + 10);

  doc.text("TOTAL", x + 45, posy + 30).text(total, x + 180, posy + 30);

  doc.pipe(
    fs.createWriteStream(path.join(__dirname, "../public/pdfs/" + nombpdf))
  );
  doc.end();
  res.render("querys/editor.hbs", { file: nombpdf });
};

//***** realiza las operaciones para el reorte po zimc ****
ctrlquerys.listzte = async (req, res) => {
  const fdesde = req.body.desde;
  const fhasta = req.body.hasta;
  const msexo = req.body.sexo;
  const mcorte = req.body.corte;
  const nombpdf = "reportzte.pdf";
  var part2 = "";
  var mesini = 0;
  var mesfin = 0;

  if (mcorte == "1") {
    mesini = 0;
    mesfin = 60;
    var rangoedad = "de 0 a 5 años)";
  } else {
    mesini = 60;
    mesfin = 216;
    var rangoedad = "de 5 a 17 años)";
  }

  const part1 = `SELECT 
      beneficiario.codsede, centrospae.nombsede, 
      SUM(if(CAST(zte AS DECIMAL(6,2)) >= -1.0, 1, 0)) AS normal, 
      SUM(if(CAST(zte AS DECIMAL(6,2)) >= -2.0 AND CAST(zte AS DECIMAL(6,2)) < -1.0, 1 , 0)) AS riesgo, 
      SUM(if(CAST(zte AS DECIMAL(6,2)) < -2.0, 1, 0)) AS baja, 
      COUNT(zte) AS total 
    FROM 
      beneficiario INNER JOIN medidas ON beneficiario.numero = medidas.numero 
      INNER JOIN centrospae ON beneficiario.codsede = centrospae.codsede 
    WHERE `;

  if (msexo == "1" || msexo == "2") {
    var part2 = `beneficiario.sexo = ${msexo} AND `;
    if (msexo == "1") {
      rangoedad = "(Niños " + rangoedad;
    } else {
      rangoedad = "Niñas " + rangoedad;
    }
  } else {
    rangoedad = "(Niños y Niñas " + rangoedad;
  }

  const part3 = `medidas.fvisita >= ? 
      AND medidas.fvisita <= ? 
      AND medidas.meses > ?
      AND medidas.meses < ?
      AND medidas.fvisita = (SELECT MAX(fvisita) FROM medidas WHERE medidas.numero = beneficiario.numero) 
      AND zte != '' 
    GROUP BY centrospae.codsede, centrospae.nombsede 
    ORDER BY centrospae.codsede`;

  var mquery = part1 + part2 + part3;
  var datos = await pool.query(mquery, [fdesde, fhasta, mesini, mesfin]);

  var y = 125;
  var x = 45;
  var fila = 0;
  var posy = 0;
  var tnormal = 0;
  var triesgo = 0;
  var tbaja = 0;
  var ttotal = 0;

  const doc = new PDFDocument({ autoFirstPage: false });
  doc
    .addPage({ margin: 45 })
    .font("Helvetica-Bold", 12)
    .text("ALCALDIA MUNICIPAL DE CHIA")
    .font("Helvetica-Bold", 10)
    .text("SECRETARIA DE EDUCACION" + "\n")
    .text("Talla para la Edad " + rangoedad + "\n\n")
    .font("Helvetica-Bold", 7)
    .text("INSTITUCIONES EDUCATIVAS", x + 5, 100)
    .text("Talla Adecuada", x + 233, 95)
    .text("Riesgo Talla Baja", x + 318, 95)
    .text("Talla Baja para Edad", x + 395, 95)
    .text("Total", x + 480, 100)

    .rect(x, 90, 520, 30)
    .moveTo(x + 220, 105)
    .lineTo(x + 470, 105)

    .moveTo(x + 220, 90)
    .lineTo(x + 220, 120)
    .moveTo(x + 262, 105)
    .lineTo(x + 262, 120)
    .text("Total", x + 232, 110)
    .text("%", x + 280, 110)

    .moveTo(x + 303, 90)
    .lineTo(x + 303, 120)
    .moveTo(x + 345, 105)
    .lineTo(x + 345, 120)
    .text("Total", x + 315, 110)
    .text("%", x + 363, 110)

    .moveTo(x + 386, 90)
    .lineTo(x + 386, 120)
    .moveTo(x + 428, 105)
    .lineTo(x + 428, 120)
    .text("Total", x + 398, 110)
    .text("%", x + 446, 110)

    .moveTo(x + 470, 90)
    .lineTo(x + 470, 120)
    .stroke();

  for (i = 0; i < datos.length; i++) {
    posy = y + 15 * fila;

    tnormal = tnormal + datos[i].normal;
    triesgo = triesgo + datos[i].riesgo;
    tbaja = tbaja + datos[i].baja;
    ttotal = ttotal + datos[i].total;

    var porc1 = parseFloat((datos[i].normal * 100) / datos[i].total).toFixed(1);
    var porc2 = parseFloat((datos[i].riesgo * 100) / datos[i].total).toFixed(1);
    var porc3 = parseFloat((datos[i].baja * 100) / datos[i].total).toFixed(1);

    doc
      .font("Helvetica", 7)
      .text(datos[i].nombsede, x + 5, posy)
      .text(datos[i].normal.toString(), x + 233, posy)
      .text(porc1.toString(), x + 1 + 275, posy)

      .text(datos[i].riesgo.toString(), x + 315, posy)
      .text(porc2.toString(), x + 1 + 358, posy)

      .text(datos[i].baja.toString(), x + 400, posy)
      .text(porc3.toString(), x + 1 + 440, posy)

      .text(datos[i].total.toString(), x + 485, posy)

      .moveTo(x, posy - 5)
      .lineTo(x, posy + 10)

      .moveTo(x + 220, posy - 5)
      .lineTo(x + 220, posy + 10)
      .moveTo(x + 262, posy - 5)
      .lineTo(x + 262, posy + 10)

      .moveTo(x + 303, posy - 5)
      .lineTo(x + 303, posy + 10)
      .moveTo(x + 345, posy - 5)
      .lineTo(x + 345, posy + 10)

      .moveTo(x + 386, posy - 5)
      .lineTo(x + 386, posy + 10)
      .moveTo(x + 428, posy - 5)
      .lineTo(x + 428, posy + 10)

      .moveTo(x + 470, posy - 5)
      .lineTo(x + 470, posy + 10)
      .moveTo(x + 520, posy - 5)
      .lineTo(x + 520, posy + 10)

      .moveTo(x, posy + 10)
      .lineTo(565, posy + 10)
      .stroke();
    fila++;

    if (fila > 60) {
      y = 125;
      doc
        .addPage({ margin: 45 })
        .font("Helvetica-Bold", 12)
        .text("ALCALDIA MUNICIPAL DE CHIA")
        .font("Helvetica-Bold", 10)
        .text("SECRETARIA DE EDUCACION" + "\n")
        .text("Talla para la Edad " + rangoedad + "\n\n")
        .font("Helvetica-Bold", 7)
        .text("INSTITUCIONES EDUCATIVAS", x + 5, 100)
        .text("Talla Adecuada", x + 233, 95)
        .text("Riesgo Talla Baja", x + 318, 95)
        .text("Talla Baja para Edad", x + 395, 95)
        .text("Total", x + 480, 100)

        .rect(x, 90, 520, 30)
        .moveTo(x + 220, 105)
        .lineTo(x + 470, 105)

        .moveTo(x + 220, 90)
        .lineTo(x + 220, 120)
        .moveTo(x + 262, 105)
        .lineTo(x + 262, 120)
        .text("Total", x + 232, 110)
        .text("%", x + 280, 110)

        .moveTo(x + 303, 90)
        .lineTo(x + 303, 120)
        .moveTo(x + 345, 105)
        .lineTo(x + 345, 120)
        .text("Total", x + 315, 110)
        .text("%", x + 363, 110)

        .moveTo(x + 386, 90)
        .lineTo(x + 386, 120)
        .moveTo(x + 428, 105)
        .lineTo(x + 428, 120)
        .text("Total", x + 398, 110)
        .text("%", x + 446, 110)

        .moveTo(x + 470, 90)
        .lineTo(x + 470, 120)
        .stroke();

      fila = 0;
    }
  }

  doc
    .font("Helvetica-Bold", 7)
    .text("T O T A L E S", x + 50, posy + 15)
    .text(tnormal.toString(), x + 233, posy + 15)
    .text(
      parseFloat((tnormal * 100) / ttotal)
        .toFixed(1)
        .toString(),
      x + 1 + 275,
      posy + 15
    )

    .text(triesgo.toString(), x + 315, posy + 15)
    .text(
      parseFloat((triesgo * 100) / ttotal)
        .toFixed(1)
        .toString(),
      x + 1 + 358,
      posy + 15
    )

    .text(tbaja.toString(), x + 400, posy + 15)
    .text(
      parseFloat((tbaja * 100) / ttotal)
        .toFixed(1)
        .toString(),
      x + 1 + 440,
      posy + 15
    )

    .text(ttotal.toString(), x + 485, posy + 15)

    .moveTo(x, posy + 25)
    .lineTo(565, posy + 25)

    .moveTo(x + 220, posy + 10)
    .lineTo(x + 220, posy + 25)
    .moveTo(x + 262, posy + 10)
    .lineTo(x + 262, posy + 25)

    .moveTo(x + 303, posy + 10)
    .lineTo(x + 303, posy + 25)
    .moveTo(x + 345, posy + 10)
    .lineTo(x + 345, posy + 25)

    .moveTo(x + 386, posy + 10)
    .lineTo(x + 386, posy + 25)
    .moveTo(x + 428, posy + 10)
    .lineTo(x + 428, posy + 25)

    .moveTo(x + 470, posy + 10)
    .lineTo(x + 470, posy + 25)

    .moveTo(x, posy + 10)
    .lineTo(x, posy + 25)

    .moveTo(x + 520, posy + 10)
    .lineTo(x + 520, posy + 25)
    .stroke();

  doc.pipe(
    fs.createWriteStream(path.join(__dirname, "../public/pdfs/" + nombpdf))
  );
  doc.end();
  res.render("querys/editor.hbs", { file: nombpdf });
};

//***** realiza las operaciones para el reorte po zimc ****
ctrlquerys.listzimc = async (req, res) => {
  const fdesde = req.body.desde;
  const fhasta = req.body.hasta;
  const msexo = req.body.sexo;
  const mcorte = req.body.corte;
  const nombpdf = "reportzimc.pdf";
  var part1 = "";
  var part2 = "";
  var mesini = 0;
  var mesfin = 0;

  if (mcorte == "1") {
    mesini = 0;
    mesfin = 60;
    var rangoedad = "de 0 a 5 años)";

    part1 = `SELECT
      beneficiario.codsede, centrospae.nombsede,
      SUM(IF(CAST(zimc AS DECIMAL (6 , 2 )) > 1.0 AND CAST(zimc AS DECIMAL (6 , 2 )) <= 2.0,1,0)) AS normal,
      SUM(IF(CAST(zimc AS DECIMAL (6 , 2 )) > 2.0 AND CAST(zimc AS DECIMAL (6 , 2 )) <= 3.0,1,0)) AS sobrep,
      SUM(IF(CAST(zimc AS DECIMAL (6 , 2 )) > 3.0,1,0)) AS obeso,
      COUNT(zimc) AS total
    FROM
      beneficiario INNER JOIN
      medidas ON beneficiario.numero = medidas.numero
        INNER JOIN centrospae ON beneficiario.codsede = centrospae.codsede
    WHERE `;
  } else {
    mesini = 60;
    mesfin = 216;
    var rangoedad = "de 5 a 17 años)";

    part1 = `SELECT
      beneficiario.codsede, centrospae.nombsede,
      SUM(IF(CAST(zimc AS DECIMAL (6 , 2 )) < - 2.0, 1, 0)) AS delg,
      SUM(IF(CAST(zimc AS DECIMAL (6 , 2 )) >= - 2.0 AND CAST(zimc AS DECIMAL (6 , 2 )) < -1.0, 1, 0)) AS rdelg,
      SUM(IF(CAST(zimc AS DECIMAL (6 , 2 )) >= -1.0 AND CAST(zimc AS DECIMAL (6 , 2 )) <= 1.0,1,0)) AS normal,
      SUM(IF(CAST(zimc AS DECIMAL (6 , 2 )) > 1.0 AND CAST(zimc AS DECIMAL (6 , 2 )) <= 2.0,1,0)) AS sobrep,
      SUM(IF(CAST(zimc AS DECIMAL (6 , 2 )) > 2.0,1,0)) AS obeso,
      COUNT(zimc) AS total
    FROM
      beneficiario INNER JOIN
      medidas ON beneficiario.numero = medidas.numero
        INNER JOIN centrospae ON beneficiario.codsede = centrospae.codsede
    WHERE `;
  }

  if (msexo == "1" || msexo == "2") {
    var part2 = `beneficiario.sexo = ${msexo} AND `;
    if (msexo == "1") {
      rangoedad = "(Niños " + rangoedad;
    } else {
      rangoedad = "Niñas " + rangoedad;
    }
  } else {
    rangoedad = "(Niños y Niñas " + rangoedad;
  }

  const part3 = `medidas.fvisita >= ? 
      AND medidas.fvisita <= ? 
      AND medidas.meses > ?
      AND medidas.meses < ?
      AND medidas.fvisita = (SELECT MAX(fvisita) FROM medidas WHERE medidas.numero = beneficiario.numero) 
      AND zimc != '' 
    GROUP BY centrospae.codsede, centrospae.nombsede 
    ORDER BY centrospae.codsede`;

  var mquery = part1 + part2 + part3;
  var datos = await pool.query(mquery, [fdesde, fhasta, mesini, mesfin]);

  var y = 125;
  var x = 45;
  var fila = 0;
  var posy = 0;

  var tdelg = 0;
  var trdel = 0;
  var tnorm = 0;
  var tspes = 0;
  var tobes = 0;
  var ttot = 0;
  var subtot = 0;

  const doc = new PDFDocument({ autoFirstPage: false });

  if (mcorte == "1") {
    doc
      .addPage({ margin: 45 })
      .font("Helvetica-Bold", 12)
      .text("ALCALDIA MUNICIPAL DE CHIA")
      .font("Helvetica-Bold", 10)
      .text("SECRETARIA DE EDUCACION" + "\n")
      .text("IMC para la Edad " + rangoedad + "\n\n")
      .font("Helvetica-Bold", 7)
      .text("INSTITUCIONES EDUCATIVAS", x + 5, 100)
      .text("Riesgo Sobrepeso", x + 230, 95)
      .text("Sobrepeso", x + 325, 95)
      .text("Obesidad", x + 412, 95)
      .text("Total", x + 480, 100)

      .rect(x, 90, 520, 30)
      .moveTo(x + 220, 105)
      .lineTo(x + 470, 105)

      .moveTo(x + 220, 90)
      .lineTo(x + 220, 120)
      .moveTo(x + 262, 105)
      .lineTo(x + 262, 120)
      .text("Total", x + 232, 110)
      .text("%", x + 280, 110)

      .moveTo(x + 303, 90)
      .lineTo(x + 303, 120)
      .moveTo(x + 345, 105)
      .lineTo(x + 345, 120)
      .text("Total", x + 315, 110)
      .text("%", x + 363, 110)

      .moveTo(x + 386, 90)
      .lineTo(x + 386, 120)
      .moveTo(x + 428, 105)
      .lineTo(x + 428, 120)
      .text("Total", x + 398, 110)
      .text("%", x + 446, 110)

      .moveTo(x + 470, 90)
      .lineTo(x + 470, 120)
      .stroke();

    for (i = 0; i < datos.length; i++) {
      posy = y + 15 * fila;

      tnorm = tnorm + datos[i].normal;
      tspes = tspes + datos[i].sobrep;
      tobes = tobes + datos[i].obeso;
      //subtot = tnorm + tspes + tobes;
      subtot = datos[i].total;
      ttot = ttot + subtot;

      var porc1 = parseFloat((datos[i].normal * 100) / subtot).toFixed(1);
      var porc2 = parseFloat((datos[i].sobrep * 100) / subtot).toFixed(1);
      var porc3 = parseFloat((datos[i].obeso * 100) / subtot).toFixed(1);

      doc
        .font("Helvetica", 7)
        .text(datos[i].nombsede, x + 5, posy)
        .text(datos[i].normal.toString(), x + 233, posy)
        .text(porc1.toString(), x + 1 + 275, posy)

        .text(datos[i].sobrep.toString(), x + 315, posy)
        .text(porc2.toString(), x + 1 + 358, posy)

        .text(datos[i].obeso.toString(), x + 400, posy)
        .text(porc3.toString(), x + 1 + 440, posy)

        .text(subtot.toString(), x + 485, posy)

        .moveTo(x, posy - 5)
        .lineTo(x, posy + 10)

        .moveTo(x + 220, posy - 5)
        .lineTo(x + 220, posy + 10)
        .moveTo(x + 262, posy - 5)
        .lineTo(x + 262, posy + 10)

        .moveTo(x + 303, posy - 5)
        .lineTo(x + 303, posy + 10)
        .moveTo(x + 345, posy - 5)
        .lineTo(x + 345, posy + 10)

        .moveTo(x + 386, posy - 5)
        .lineTo(x + 386, posy + 10)
        .moveTo(x + 428, posy - 5)
        .lineTo(x + 428, posy + 10)

        .moveTo(x + 470, posy - 5)
        .lineTo(x + 470, posy + 10)
        .moveTo(x + 520, posy - 5)
        .lineTo(x + 520, posy + 10)

        .moveTo(x, posy + 10)
        .lineTo(565, posy + 10)
        .stroke();
      fila++;

      if (fila > 60) {
        y = 125;
        doc
          .addPage({ margin: 45 })
          .font("Helvetica-Bold", 12)
          .text("ALCALDIA MUNICIPAL DE CHIA")
          .font("Helvetica-Bold", 10)
          .text("SECRETARIA DE EDUCACION" + "\n")
          .text("Talla para la Edad " + rangoedad + "\n\n")
          .font("Helvetica-Bold", 7)
          .text("INSTITUCIONES EDUCATIVAS", x + 5, 100)
          .text("R Sobrepeso", x + 233, 95)
          .text("Sobrepeso", x + 318, 95)
          .text("Obesidad", x + 395, 95)
          .text("Total", x + 480, 100)

          .rect(x, 90, 520, 30)
          .moveTo(x + 220, 105)
          .lineTo(x + 470, 105)

          .moveTo(x + 220, 90)
          .lineTo(x + 220, 120)
          .moveTo(x + 262, 105)
          .lineTo(x + 262, 120)
          .text("Total", x + 232, 110)
          .text("%", x + 280, 110)

          .moveTo(x + 303, 90)
          .lineTo(x + 303, 120)
          .moveTo(x + 345, 105)
          .lineTo(x + 345, 120)
          .text("Total", x + 315, 110)
          .text("%", x + 363, 110)

          .moveTo(x + 386, 90)
          .lineTo(x + 386, 120)
          .moveTo(x + 428, 105)
          .lineTo(x + 428, 120)
          .text("Total", x + 398, 110)
          .text("%", x + 446, 110)

          .moveTo(x + 470, 90)
          .lineTo(x + 470, 120)
          .stroke();

        fila = 0;
      }
    }

    doc
      .font("Helvetica-Bold", 7)
      .text("T O T A L E S", x + 50, posy + 15)
      .text(tnorm.toString(), x + 233, posy + 15)
      .text(
        parseFloat((tnorm * 100) / ttot)
          .toFixed(1)
          .toString(),
        x + 1 + 275,
        posy + 15
      )

      .text(tspes.toString(), x + 315, posy + 15)
      .text(
        parseFloat((tspes * 100) / ttot)
          .toFixed(1)
          .toString(),
        x + 1 + 358,
        posy + 15
      )

      .text(tobes.toString(), x + 400, posy + 15)
      .text(
        parseFloat((tobes * 100) / ttot)
          .toFixed(1)
          .toString(),
        x + 1 + 440,
        posy + 15
      )

      .text(ttot.toString(), x + 485, posy + 15)

      .moveTo(x, posy + 25)
      .lineTo(565, posy + 25)

      .moveTo(x + 220, posy + 10)
      .lineTo(x + 220, posy + 25)
      .moveTo(x + 262, posy + 10)
      .lineTo(x + 262, posy + 25)

      .moveTo(x + 303, posy + 10)
      .lineTo(x + 303, posy + 25)
      .moveTo(x + 345, posy + 10)
      .lineTo(x + 345, posy + 25)

      .moveTo(x + 386, posy + 10)
      .lineTo(x + 386, posy + 25)
      .moveTo(x + 428, posy + 10)
      .lineTo(x + 428, posy + 25)

      .moveTo(x + 470, posy + 10)
      .lineTo(x + 470, posy + 25)

      .moveTo(x, posy + 10)
      .lineTo(x, posy + 25)

      .moveTo(x + 520, posy + 10)
      .lineTo(x + 520, posy + 25)
      .stroke();
  } else {
    doc
      .addPage({ margin: 45 })
      .font("Helvetica-Bold", 12)
      .text("ALCALDIA MUNICIPAL DE CHIA")
      .font("Helvetica-Bold", 10)
      .text("SECRETARIA DE EDUCACION" + "\n")
      .text("IMC para la Edad " + rangoedad + "\n\n")
      .font("Helvetica-Bold", 7)
      .text("INSTITUCIONES EDUCATIVAS", x + 5, 100)
      .text("Delgadez", x + 230, 95)
      .text("R. Delgadez", x + 275, 95)
      .text("Adecuado", x + 328, 95)
      .text("Sobrepeso", x + 378, 95)
      .text("Obecidad", x + 430, 95)
      .text("Total", x + 480, 100)

      .rect(x, 90, 520, 30)
      .moveTo(x + 220, 105)
      .lineTo(x + 470, 105)

      .moveTo(x + 220, 90)
      .lineTo(x + 220, 120)
      .moveTo(x + 245, 105)
      .lineTo(x + 245, 120)
      .text("Total", x + 225, 110)
      .text("%", x + 255, 110)

      .moveTo(x + 270, 90)
      .lineTo(x + 270, 120)
      .moveTo(x + 295, 105)
      .lineTo(x + 295, 120)
      .text("Total", x + 275, 110)
      .text("%", x + 305, 110)

      .moveTo(x + 320, 90)
      .lineTo(x + 320, 120)
      .moveTo(x + 345, 105)
      .lineTo(x + 345, 120)
      .text("Total", x + 325, 110)
      .text("%", x + 355, 110)

      .moveTo(x + 370, 90)
      .lineTo(x + 370, 120)
      .moveTo(x + 395, 105)
      .lineTo(x + 395, 120)
      .text("Total", x + 375, 110)
      .text("%", x + 405, 110)

      .moveTo(x + 420, 90)
      .lineTo(x + 420, 120)
      .moveTo(x + 445, 105)
      .lineTo(x + 445, 120)
      .text("Total", x + 425, 110)
      .text("%", x + 455, 110)

      .moveTo(x + 470, 90)
      .lineTo(x + 470, 120)
      .stroke();

    for (i = 0; i < datos.length; i++) {
      posy = y + 15 * fila;
      tdelg = tdelg + datos[i].delg;
      trdel = trdel + datos[i].rdelg;
      tnorm = tnorm + datos[i].normal;
      tspes = tspes + datos[i].sobrep;
      tobes = tobes + datos[i].obeso;
      //subtot = tdelg+trdel+tnorm+tspes+tobes;
      subtot = datos[i].total;
      ttot = ttot + subtot;

      var porc1 = parseFloat((datos[i].delg * 100) / subtot).toFixed(1);
      var porc2 = parseFloat((datos[i].rdelg * 100) / subtot).toFixed(1);
      var porc3 = parseFloat((datos[i].normal * 100) / subtot).toFixed(1);
      var porc4 = parseFloat((datos[i].sobrep * 100) / subtot).toFixed(1);
      var porc5 = parseFloat((datos[i].obeso * 100) / subtot).toFixed(1);

      doc
        .font("Helvetica", 6)
        .text(datos[i].nombsede, x + 5, posy)
        .text(datos[i].delg.toString(), x + 225, posy)
        .text(porc1.toString(), x + 1 + 248, posy)

        .text(datos[i].rdelg.toString(), x + 275, posy)
        .text(porc2.toString(), x + 1 + 298, posy)

        .text(datos[i].normal.toString(), x + 325, posy)
        .text(porc3.toString(), x + 1 + 348, posy)

        .text(datos[i].sobrep.toString(), x + 375, posy)
        .text(porc4.toString(), x + 1 + 398, posy)

        .text(datos[i].obeso.toString(), x + 425, posy)
        .text(porc5.toString(), x + 1 + 448, posy)

        .text(subtot.toString(), x + 485, posy)

        .moveTo(x, posy - 5)
        .lineTo(x, posy + 10)

        .moveTo(x + 220, posy - 5)
        .lineTo(x + 220, posy + 10)
        .moveTo(x + 245, posy - 5)
        .lineTo(x + 245, posy + 10)

        .moveTo(x + 270, posy - 5)
        .lineTo(x + 270, posy + 10)
        .moveTo(x + 295, posy - 5)
        .lineTo(x + 295, posy + 10)

        .moveTo(x + 270, posy - 5)
        .lineTo(x + 270, posy + 10)
        .moveTo(x + 295, posy - 5)
        .lineTo(x + 295, posy + 10)

        .moveTo(x + 320, posy - 5)
        .lineTo(x + 320, posy + 10)
        .moveTo(x + 345, posy - 5)
        .lineTo(x + 345, posy + 10)

        .moveTo(x + 370, posy - 5)
        .lineTo(x + 370, posy + 10)
        .moveTo(x + 395, posy - 5)
        .lineTo(x + 395, posy + 10)

        .moveTo(x + 420, posy - 5)
        .lineTo(x + 420, posy + 10)
        .moveTo(x + 445, posy - 5)
        .lineTo(x + 445, posy + 10)

        .moveTo(x + 470, posy - 5)
        .lineTo(x + 470, posy + 10)
        .moveTo(x + 520, posy - 5)
        .lineTo(x + 520, posy + 10)

        .moveTo(x, posy + 10)
        .lineTo(565, posy + 10)
        .stroke();

      fila++;

      if (fila > 60) {
        y = 125;
        doc
          .addPage({ margin: 45 })
          .font("Helvetica-Bold", 12)
          .text("ALCALDIA MUNICIPAL DE CHIA")
          .font("Helvetica-Bold", 10)
          .text("SECRETARIA DE EDUCACION" + "\n")
          .text("IMC para la Edad " + rangoedad + "\n\n")
          .font("Helvetica-Bold", 7)
          .text("INSTITUCIONES EDUCATIVAS", x + 5, 100)
          .text("Delgadez", x + 230, 95)
          .text("R. Delgadez", x + 275, 95)
          .text("Adecuado", x + 328, 95)
          .text("Sobrepeso", x + 378, 95)
          .text("Obecidad", x + 430, 95)
          .text("Total", x + 480, 100)

          .rect(x, 95, 520, 30)
          .moveTo(x + 220, 105)
          .lineTo(x + 470, 105)

          .moveTo(x + 220, 95)
          .lineTo(x + 220, 120)
          .moveTo(x + 245, 105)
          .lineTo(x + 245, 120)
          .text("Total", x + 225, 110)
          .text("%", x + 255, 110)

          .moveTo(x + 270, 95)
          .lineTo(x + 270, 120)
          .moveTo(x + 295, 105)
          .lineTo(x + 295, 120)
          .text("Total", x + 275, 110)
          .text("%", x + 305, 110)

          .moveTo(x + 320, 95)
          .lineTo(x + 320, 120)
          .moveTo(x + 345, 105)
          .lineTo(x + 345, 120)
          .text("Total", x + 325, 110)
          .text("%", x + 355, 110)

          .moveTo(x + 370, 95)
          .lineTo(x + 370, 120)
          .moveTo(x + 395, 105)
          .lineTo(x + 395, 120)
          .text("Total", x + 375, 110)
          .text("%", x + 405, 110)

          .moveTo(x + 420, 95)
          .lineTo(x + 420, 120)
          .moveTo(x + 445, 105)
          .lineTo(x + 445, 120)
          .text("Total", x + 425, 110)
          .text("%", x + 455, 110)

          .moveTo(x + 470, 95)
          .lineTo(x + 470, 120)

          .stroke();
        fila = 0;
      }
    }

    doc
      .font("Helvetica-Bold", 6)
      .text("T O T A L E S", x + 50, posy + 15)
      .text(tdelg.toString(), x + 225, posy + 15)
      .text(
        parseFloat((tdelg * 100) / ttot)
          .toFixed(1)
          .toString(),
        x + 1 + 248,
        posy + 15
      )

      .text(trdel.toString(), x + 275, posy + 15)
      .text(
        parseFloat((trdel * 100) / ttot)
          .toFixed(1)
          .toString(),
        x + 1 + 298,
        posy + 15
      )

      .text(tnorm.toString(), x + 325, posy + 15)
      .text(
        parseFloat((tnorm * 100) / ttot)
          .toFixed(1)
          .toString(),
        x + 1 + 348,
        posy + 15
      )

      .text(tspes.toString(), x + 375, posy + 15)
      .text(
        parseFloat((tspes * 100) / ttot)
          .toFixed(1)
          .toString(),
        x + 1 + 398,
        posy + 15
      )

      .text(tobes.toString(), x + 425, posy + 15)
      .text(
        parseFloat((tobes * 100) / ttot)
          .toFixed(1)
          .toString(),
        x + 1 + 448,
        posy + 15
      )

      .text(ttot.toString(), x + 485, posy + 15)

      .moveTo(x, posy + 25)
      .lineTo(565, posy + 25)

      .moveTo(x + 220, posy + 10)
      .lineTo(x + 220, posy + 25)
      .moveTo(x + 245, posy + 10)
      .lineTo(x + 245, posy + 25)

      .moveTo(x + 270, posy + 10)
      .lineTo(x + 270, posy + 25)
      .moveTo(x + 295, posy + 10)
      .lineTo(x + 295, posy + 25)

      .moveTo(x + 320, posy + 10)
      .lineTo(x + 320, posy + 25)
      .moveTo(x + 345, posy + 10)
      .lineTo(x + 345, posy + 25)

      .moveTo(x + 370, posy + 10)
      .lineTo(x + 370, posy + 25)
      .moveTo(x + 395, posy + 10)
      .lineTo(x + 395, posy + 25)

      .moveTo(x + 420, posy + 10)
      .lineTo(x + 420, posy + 25)
      .moveTo(x + 445, posy + 10)
      .lineTo(x + 445, posy + 25)

      .moveTo(x + 470, posy + 10)
      .lineTo(x + 470, posy + 25)

      .moveTo(x, posy + 10)
      .lineTo(x, posy + 25)

      .moveTo(x + 520, posy + 10)
      .lineTo(x + 520, posy + 25)
      .stroke();
  }

  doc.pipe(
    fs.createWriteStream(path.join(__dirname, "../public/pdfs/" + nombpdf))
  );
  doc.end();
  res.render("querys/editor.hbs", { file: nombpdf });
};

//*********************************************************************

//***** realiza las operaciones para el reorte po zimc ****
ctrlquerys.listregmensual = async (req, res) => {
  const fdesde = req.body.desde;
  const fhasta = req.body.hasta;
  const nombpdf = "regmensual.pdf";
  var mesini = 0;
  var mesfin = 0;

  //const query = 'call traerdatos(?, ?)';
  var regs = await pool.query("call traedatos(?, ?)", [fdesde, fhasta]);
  var datos = regs[0];

  var y = 125;
  var x = 45;
  var fila = 0;
  var posy = 0;

  const doc = new PDFDocument({ autoFirstPage: false });
  doc
    .addPage({
      margin: 45,
      //size: "LEGAL",
      layout: "landscape",
    })
    .font("Helvetica-Bold", 12)
    .text("ALCALDIA MUNICIPAL DE CHIA")
    .font("Helvetica-Bold", 10)
    .text("SECRETARIA DE EDUCACION" + "\n")
    .text("Resumen del Registro de Atención Mensual" + "\n")
    .font("Helvetica-Bold", 7)
    .text("Desde: " + fdesde + "  Hasta: " + fhasta + "\n\n")
    .font("Helvetica-Bold", 8)

    .rect(x, 95, 700, 105)
    .text("Edad/Grado", x + 5, 100)
    //linea h1
    .moveTo(x, 110)
    .lineTo(x + 700, 110)
    .text("Menos de 3 años", x + 5, 115)
    //linea h2
    .moveTo(x, 125)
    .lineTo(x + 700, 125)
    .text("Entre 4 y 6 años", x + 5, 130)
    //linea h3
    .moveTo(x, 140)
    .lineTo(x + 700, 140)
    .text("Entre 7 y 12 años", x + 5, 145)
    //linea h4
    .moveTo(x, 155)
    .lineTo(x + 700, 155)
    .text("Entre 13 y 17 años", x + 5, 160)
    //linea h5
    .moveTo(x, 170)
    .lineTo(x + 700, 170)
    .text("Mayores de 18 años", x + 5, 175)
    //linea h6
    .moveTo(x, 185)
    .lineTo(x + 700, 185)
    .text("Numero Total", x + 5, 190)

    //1
    .font("Helvetica-Bold", 6)
    .moveTo(x + 105, 95)
    .lineTo(x + 105, 200)
    .text("ACELERAC", x + 106, 100)
    //2
    .moveTo(x + 140, 95)
    .lineTo(x + 140, 200)
    .text("JARDIN", x + 145, 100)
    //3
    .moveTo(x + 175, 95)
    .lineTo(x + 175, 200)
    .text("TRANSIC", x + 179, 100)
    //4
    .moveTo(x + 210, 95)
    .lineTo(x + 210, 200)
    .text("PRIMERO", x + 213, 100)
    //5
    .moveTo(x + 245, 95)
    .lineTo(x + 245, 200)
    .text("SEGUNDO", x + 247, 100)
    //6
    .moveTo(x + 280, 95)
    .lineTo(x + 280, 200)
    .text("TERCERO", x + 282, 100)
    //7
    .moveTo(x + 315, 95)
    .lineTo(x + 315, 200)
    .text("CUARTO", x + 320, 100)
    //8
    .moveTo(x + 350, 95)
    .lineTo(x + 350, 200)
    .text("QUINTO", x + 355, 100)
    //9
    .moveTo(x + 385, 95)
    .lineTo(x + 385, 200)
    .text("SEXTO", x + 392, 100)
    //10
    .moveTo(x + 420, 95)
    .lineTo(x + 420, 200)
    .text("SEPTIMO", x + 424, 100)
    //11
    .moveTo(x + 455, 95)
    .lineTo(x + 455, 200)
    .text("OCTAVO", x + 460, 100)
    //12
    .moveTo(x + 490, 95)
    .lineTo(x + 490, 200)
    .text("NOVENO", x + 495, 100)
    //13
    .moveTo(x + 525, 95)
    .lineTo(x + 525, 200)
    .text("DIEZ", x + 535, 100)
    //14
    .moveTo(x + 560, 95)
    .lineTo(x + 560, 200)
    .text("ONCE", x + 570, 100)
    //15
    .moveTo(x + 595, 95)
    .lineTo(x + 595, 200)
    .text("12NORMAL", x + 596, 100)
    //16
    .moveTo(x + 630, 95)
    .lineTo(x + 630, 200)
    .text("13NORMAL", x + 631, 100)
    //total
    .moveTo(x + 665, 95)
    .lineTo(x + 665, 200)
    .text("TOTAL", x + 670, 100)
    .stroke();

  let tgrd99 = 0,
    tgrd00 = 0,
    tgrd01 = 0,
    tgrd02 = 0,
    tgrd03 = 0,
    tgrd04 = 0,
    tgrd05 = 0,
    tgrd06 = 0;
  let tgrd07 = 0,
    tgrd08 = 0,
    tgrd09 = 0,
    tgrd10 = 0,
    tgrd11 = 0,
    tgrd12 = 0,
    tgrd13 = 0,
    ttotal = 0;

  let mgrd99r0 = 0,
    mgrd00r0 = 0,
    mgrd01r0 = 0,
    mgrd02r0 = 0,
    mgrd03r0 = 0,
    mgrd04r0 = 0,
    mgrd05r0 = 0,
    mgrd06r0 = 0;
  let mgrd07r0 = 0,
    mgrd08r0 = 0,
    mgrd09r0 = 0,
    mgrd10r0 = 0,
    mgrd11r0 = 0,
    mgrd12r0 = 0,
    mgrd13r0 = 0,
    mtotalr0 = 0;

  let mgrd99r1 = 0,
    mgrd00r1 = 0,
    mgrd01r1 = 0,
    mgrd02r1 = 0,
    mgrd03r1 = 0,
    mgrd04r1 = 0,
    mgrd05r1 = 0,
    mgrd06r1 = 0;
  let mgrd07r1 = 0,
    mgrd08r1 = 0,
    mgrd09r1 = 0,
    mgrd10r1 = 0,
    mgrd11r1 = 0,
    mgrd12r1 = 0,
    mgrd13r1 = 0,
    mtotalr1 = 0;

  let mgrd99r2 = 0,
    mgrd00r2 = 0,
    mgrd01r2 = 0,
    mgrd02r2 = 0,
    mgrd03r2 = 0,
    mgrd04r2 = 0,
    mgrd05r2 = 0,
    mgrd06r2 = 0;
  let mgrd07r2 = 0,
    mgrd08r2 = 0,
    mgrd09r2 = 0,
    mgrd10r2 = 0,
    mgrd11r2 = 0,
    mgrd12r2 = 0,
    mgrd13r2 = 0,
    mtotalr2 = 0;

  let mgrd99r3 = 0,
    mgrd00r3 = 0,
    mgrd01r3 = 0,
    mgrd02r3 = 0,
    mgrd03r3 = 0,
    mgrd04r3 = 0,
    mgrd05r3 = 0,
    mgrd06r3 = 0;
  let mgrd07r3 = 0,
    mgrd08r3 = 0,
    mgrd09r3 = 0,
    mgrd10r3 = 0,
    mgrd11r3 = 0,
    mgrd12r3 = 0,
    mgrd13r3 = 0,
    mtotalr3 = 0;

  let mgrd99r4 = 0,
    mgrd00r4 = 0,
    mgrd01r4 = 0,
    mgrd02r4 = 0,
    mgrd03r4 = 0,
    mgrd04r4 = 0,
    mgrd05r4 = 0,
    mgrd06r4 = 0;
  let mgrd07r4 = 0,
    mgrd08r4 = 0,
    mgrd09r4 = 0,
    mgrd10r4 = 0,
    mgrd11r4 = 0,
    mgrd12r4 = 0,
    mgrd13r4 = 0,
    mtotalr4 = 0;

  for (i = 0; i < datos.length; i++) {
    if (datos[i].edad >= 0 && datos[i].edad < 4) {
      mgrd99r0 = mgrd99r0 + datos[i].grd99;
      mgrd00r0 = mgrd00r0 + datos[i].grd00;
      mgrd01r0 = mgrd01r0 + datos[i].grd01;
      mgrd02r0 = mgrd02r0 + datos[i].grd02;
      mgrd03r0 = mgrd03r0 + datos[i].grd03;
      mgrd04r0 = mgrd04r0 + datos[i].grd04;
      mgrd05r0 = mgrd05r0 + datos[i].grd05;
      mgrd06r0 = mgrd06r0 + datos[i].grd06;
      mgrd07r0 = mgrd07r0 + datos[i].grd07;
      mgrd08r0 = mgrd08r0 + datos[i].grd08;
      mgrd09r0 = mgrd09r0 + datos[i].grd09;
      mgrd10r0 = mgrd10r0 + datos[i].grd10;
      mgrd11r0 = mgrd11r0 + datos[i].grd11;
      mgrd12r0 = mgrd12r0 + datos[i].grd12;
      mgrd13r0 = mgrd13r0 + datos[i].grd13;
      mtotalr0 = mtotalr0 + datos[i].total;
    }

    if (datos[i].edad >= 4 && datos[i].edad < 7) {
      mgrd99r1 = mgrd99r1 + datos[i].grd99;
      mgrd00r1 = mgrd00r1 + datos[i].grd00;
      mgrd01r1 = mgrd01r1 + datos[i].grd01;
      mgrd02r1 = mgrd02r1 + datos[i].grd02;
      mgrd03r1 = mgrd03r1 + datos[i].grd03;
      mgrd04r1 = mgrd04r1 + datos[i].grd04;
      mgrd05r1 = mgrd05r1 + datos[i].grd05;
      mgrd06r1 = mgrd06r1 + datos[i].grd06;
      mgrd07r1 = mgrd07r1 + datos[i].grd07;
      mgrd08r1 = mgrd08r1 + datos[i].grd08;
      mgrd09r1 = mgrd09r1 + datos[i].grd09;
      mgrd10r1 = mgrd10r1 + datos[i].grd10;
      mgrd11r1 = mgrd11r1 + datos[i].grd11;
      mgrd12r1 = mgrd12r1 + datos[i].grd12;
      mgrd13r1 = mgrd13r1 + datos[i].grd13;
      mtotalr1 = mtotalr1 + datos[i].total;
    }

    if (datos[i].edad >= 7 && datos[i].edad < 13) {
      mgrd99r2 = mgrd99r2 + datos[i].grd99;
      mgrd00r2 = mgrd00r2 + datos[i].grd00;
      mgrd01r2 = mgrd01r2 + datos[i].grd01;
      mgrd02r2 = mgrd02r2 + datos[i].grd02;
      mgrd03r2 = mgrd03r2 + datos[i].grd03;
      mgrd04r2 = mgrd04r2 + datos[i].grd04;
      mgrd05r2 = mgrd05r2 + datos[i].grd05;
      mgrd06r2 = mgrd06r2 + datos[i].grd06;
      mgrd07r2 = mgrd07r2 + datos[i].grd07;
      mgrd08r2 = mgrd08r2 + datos[i].grd08;
      mgrd09r2 = mgrd09r2 + datos[i].grd09;
      mgrd10r2 = mgrd10r2 + datos[i].grd10;
      mgrd11r2 = mgrd11r2 + datos[i].grd11;
      mgrd12r2 = mgrd12r2 + datos[i].grd12;
      mgrd13r2 = mgrd13r2 + datos[i].grd13;
      mtotalr2 = mtotalr2 + datos[i].total;
    }

    if (datos[i].edad >= 13 && datos[i].edad < 18) {
      mgrd99r3 = mgrd99r3 + datos[i].grd99;
      mgrd00r3 = mgrd00r3 + datos[i].grd00;
      mgrd01r3 = mgrd01r3 + datos[i].grd01;
      mgrd02r3 = mgrd02r3 + datos[i].grd02;
      mgrd03r3 = mgrd03r3 + datos[i].grd03;
      mgrd04r3 = mgrd04r3 + datos[i].grd04;
      mgrd05r3 = mgrd05r3 + datos[i].grd05;
      mgrd06r3 = mgrd06r3 + datos[i].grd06;
      mgrd07r3 = mgrd07r3 + datos[i].grd07;
      mgrd08r3 = mgrd08r3 + datos[i].grd08;
      mgrd09r3 = mgrd09r3 + datos[i].grd09;
      mgrd10r3 = mgrd10r3 + datos[i].grd10;
      mgrd11r3 = mgrd11r3 + datos[i].grd11;
      mgrd12r3 = mgrd12r3 + datos[i].grd12;
      mgrd13r3 = mgrd13r3 + datos[i].grd13;
      mtotalr3 = mtotalr3 + datos[i].total;
    }

    if (datos[i].edad >= 18 && datos[i].edad < 100) {
      mgrd99r4 = mgrd99r4 + datos[i].grd99;
      mgrd00r4 = mgrd00r4 + datos[i].grd00;
      mgrd01r4 = mgrd01r4 + datos[i].grd01;
      mgrd02r4 = mgrd02r4 + datos[i].grd02;
      mgrd03r4 = mgrd03r4 + datos[i].grd03;
      mgrd04r4 = mgrd04r4 + datos[i].grd04;
      mgrd05r4 = mgrd05r4 + datos[i].grd05;
      mgrd06r4 = mgrd06r4 + datos[i].grd06;
      mgrd07r4 = mgrd07r4 + datos[i].grd07;
      mgrd08r4 = mgrd08r4 + datos[i].grd08;
      mgrd09r4 = mgrd09r4 + datos[i].grd09;
      mgrd10r4 = mgrd10r4 + datos[i].grd10;
      mgrd11r4 = mgrd11r4 + datos[i].grd11;
      mgrd12r4 = mgrd12r4 + datos[i].grd12;
      mgrd13r4 = mgrd13r4 + datos[i].grd13;
      mtotalr4 = mtotalr4 + datos[i].total;
    }

    tgrd99 = tgrd99 + datos[i].grd99;
    tgrd00 = tgrd00 + datos[i].grd00;
    tgrd01 = tgrd01 + datos[i].grd01;
    tgrd02 = tgrd02 + datos[i].grd02;
    tgrd03 = tgrd03 + datos[i].grd03;
    tgrd04 = tgrd04 + datos[i].grd04;
    tgrd05 = tgrd05 + datos[i].grd05;
    tgrd06 = tgrd06 + datos[i].grd06;
    tgrd07 = tgrd07 + datos[i].grd07;
    tgrd08 = tgrd08 + datos[i].grd08;
    tgrd09 = tgrd09 + datos[i].grd09;
    tgrd10 = tgrd10 + datos[i].grd10;
    tgrd11 = tgrd11 + datos[i].grd11;
    tgrd12 = tgrd12 + datos[i].grd12;
    tgrd13 = tgrd13 + datos[i].grd13;
    ttotal = ttotal + datos[i].total;
  }

  doc
    .font("Helvetica-Bold", 7)
    .text(mgrd99r0, x + 111, 115)
    .text(mgrd00r0, x + 184, 115)
    .text(mgrd01r0, x + 218, 115)
    .text(mgrd02r0, x + 252, 115)
    .text(mgrd03r0, x + 285, 115)
    .text(mgrd04r0, x + 320, 115)
    .text(mgrd05r0, x + 355, 115)
    .text(mgrd06r0, x + 392, 115)
    .text(mgrd07r0, x + 424, 115)
    .text(mgrd08r0, x + 460, 115)
    .text(mgrd09r0, x + 495, 115)
    .text(mgrd10r0, x + 530, 115)
    .text(mgrd11r0, x + 565, 115)
    .text(mgrd12r0, x + 601, 115)
    .text(mgrd13r0, x + 636, 115)
    .text(mtotalr0, x + 670, 115)

    .text(mgrd99r1, x + 111, 130)
    .text(mgrd00r1, x + 184, 130)
    .text(mgrd01r1, x + 218, 130)
    .text(mgrd02r1, x + 252, 130)
    .text(mgrd03r1, x + 285, 130)
    .text(mgrd04r1, x + 320, 130)
    .text(mgrd05r1, x + 355, 130)
    .text(mgrd06r1, x + 392, 130)
    .text(mgrd07r1, x + 424, 130)
    .text(mgrd08r1, x + 460, 130)
    .text(mgrd09r1, x + 495, 130)
    .text(mgrd10r1, x + 530, 130)
    .text(mgrd11r1, x + 565, 130)
    .text(mgrd12r1, x + 601, 130)
    .text(mgrd13r1, x + 636, 130)
    .text(mtotalr1, x + 670, 130)

    .text(mgrd99r2, x + 111, 145)
    .text(mgrd00r2, x + 184, 145)
    .text(mgrd01r2, x + 218, 145)
    .text(mgrd02r2, x + 252, 145)
    .text(mgrd03r2, x + 285, 145)
    .text(mgrd04r2, x + 320, 145)
    .text(mgrd05r2, x + 355, 145)
    .text(mgrd06r2, x + 392, 145)
    .text(mgrd07r2, x + 424, 145)
    .text(mgrd08r2, x + 460, 145)
    .text(mgrd09r2, x + 495, 145)
    .text(mgrd10r2, x + 530, 145)
    .text(mgrd11r2, x + 565, 145)
    .text(mgrd12r2, x + 601, 145)
    .text(mgrd13r2, x + 636, 145)
    .text(mtotalr2, x + 670, 145)

    .text(mgrd99r3, x + 111, 160)
    .text(mgrd00r3, x + 184, 160)
    .text(mgrd01r3, x + 218, 160)
    .text(mgrd02r3, x + 252, 160)
    .text(mgrd03r3, x + 285, 160)
    .text(mgrd04r3, x + 320, 160)
    .text(mgrd05r3, x + 355, 160)
    .text(mgrd06r3, x + 392, 160)
    .text(mgrd07r3, x + 424, 160)
    .text(mgrd08r3, x + 460, 160)
    .text(mgrd09r3, x + 495, 160)
    .text(mgrd10r3, x + 530, 160)
    .text(mgrd11r3, x + 565, 160)
    .text(mgrd12r3, x + 601, 160)
    .text(mgrd13r3, x + 636, 160)
    .text(mtotalr3, x + 670, 160)

    .text(mgrd99r4, x + 111, 175)
    .text(mgrd00r4, x + 184, 175)
    .text(mgrd01r4, x + 218, 175)
    .text(mgrd02r4, x + 252, 175)
    .text(mgrd03r4, x + 285, 175)
    .text(mgrd04r4, x + 320, 175)
    .text(mgrd05r4, x + 355, 175)
    .text(mgrd06r4, x + 392, 175)
    .text(mgrd07r4, x + 424, 175)
    .text(mgrd08r4, x + 460, 175)
    .text(mgrd09r4, x + 495, 175)
    .text(mgrd10r4, x + 530, 175)
    .text(mgrd11r4, x + 565, 175)
    .text(mgrd12r4, x + 601, 175)
    .text(mgrd13r4, x + 636, 175)
    .text(mtotalr4, x + 670, 175)

    .text(tgrd99, x + 111, 190)
    .text(tgrd00, x + 184, 190)
    .text(tgrd01, x + 218, 190)
    .text(tgrd02, x + 252, 190)
    .text(tgrd03, x + 285, 190)
    .text(tgrd04, x + 320, 190)
    .text(tgrd05, x + 355, 190)
    .text(tgrd06, x + 392, 190)
    .text(tgrd07, x + 424, 190)
    .text(tgrd08, x + 460, 190)
    .text(tgrd09, x + 495, 190)
    .text(tgrd10, x + 530, 190)
    .text(tgrd11, x + 565, 190)
    .text(tgrd12, x + 601, 190)
    .text(tgrd13, x + 636, 190)
    .text(ttotal, x + 670, 190);

  doc.pipe(
    fs.createWriteStream(path.join(__dirname, "../public/pdfs/" + nombpdf))
  );
  doc.end();
  res.render("querys/editor.hbs", { file: nombpdf });
};
//*********************************************************************
module.exports = ctrlquerys;
