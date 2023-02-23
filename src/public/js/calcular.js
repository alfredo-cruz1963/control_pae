function Changed_Fecha(txt) {
  //var mFecVis = document.getElementById('<%=TxtFecVis.ClientID %>').value;
  var mFecvis = txt.value;
  var mFecnac = document.getElementById("<%=TxtFecNac.ClientID %>").value;
  var mFecnac = document.getElementById("<%=TxtFecNac.ClientID %>").value;

  var lnUnAno = 365.25;
  var lnUnMes = 30.475;
  var aFecvis = mFecvis.split("/");
  var aFecnac = mFecnac.split("/");
  var dFecvis = Date.UTC(aFecvis[2], aFecvis[1] - 1, aFecvis[0]);
  var dFecnac = Date.UTC(aFecnac[2], aFecnac[1] - 1, aFecnac[0]);
  var dif = dFecvis - dFecnac;
  var lnDias = Math.floor(dif / (1000 * 60 * 60 * 24));
  var lnAnos = Math.floor(lnDias / lnUnAno);
  var lnMesAux = Math.floor((lnDias - lnAnos * lnUnAno) / lnUnMes);
  var lnEdad = Math.floor(lnDias / lnUnMes);
  var mEdad =
    "Edad: " +
    lnAnos.toString() +
    " a " +
    lnMesAux.toString() +
    "m (" +
    lnEdad.toString() +
    "m)";
  $("#<%=LblEdad.ClientID%>").html(mEdad);
}

function Hacer_Graficas() {
  var opcion = document.getElementById("<%=DDLTipGhap.ClientID %>").value;
  var vlrZPT = "<%=Me.VlrZPT %>";
  var vlrZPE = "<%=Me.VlrZPE %>";
  var vlrZTE = "<%=Me.VlrZTE %>";
  var vlrZIMC = "<%=Me.VlrZIMC %>";
  var miTalla = document.getElementById("<%=SpnTalla.ClientID %>").value;
  var miPeso = document.getElementById("<%=SpnPeso.ClientID %>").value;

  var Xmin = 30;
  var Xmax = 550;
  var Ymin = 20;
  var Ymax = 290;

  switch (opcion) {
    case "1": // Peso / Talla
      var canvas = document.getElementById("canvas1");
      var contexto = canvas.getContext("2d");

      var arrayZPT = vlrZPT.split("#");
      var Regs = aZPT.length;
      mMeses = parseFloat(arrayZPT[2]);

      if (mMeses <= 24) {
        var valorX = 71;
        var valorY = 26;
        var lnResta = 0;
        var peso = 0;
        var talla = 50;
      } else {
        var valorX = 60;
        var valorY = 28;
        var lnResta = 4;
        var peso = 4;
        var talla = 70;
      }

      var scalaX = (Xmax - Xmin) / valorX;
      var scalaY = (Ymax - Ymin) / valorY;

      contexto.beginPath();
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      contexto.lineWidth = 1;
      contexto.strokeStyle = "rgba(0,0,0,5)";

      contexto.moveTo(Xmin, Ymin);
      contexto.lineTo(Xmin, Ymax);
      contexto.moveTo(Xmin, Ymax);
      contexto.lineTo(Xmax, Ymax);
      contexto.moveTo(Xmax, Ymax);
      contexto.lineTo(Xmax, Ymin);
      contexto.moveTo(Xmax, Ymin);
      contexto.lineTo(Xmin, Ymin);
      contexto.stroke();

      contexto.strokeRect(Xmin + 10, Ymin + 10, 190, 20);
      contexto.font = 'bold 9px "Arial"';
      contexto.fillStyle = "rgba(0,0,0,9)";
      contexto.fillText(arrayZPT[1], Xmin + 20, Ymin + 23);
      contexto.fillText(
        "Estándares de la OMS (Nacimiento a 60 meses), referencia de la OMS 2007 (61 meses a 19 años)",
        55,
        13
      );
      contexto.fillText("Talla(cm)", 230, 315);
      contexto.save();
      contexto.translate(10, 140);
      contexto.rotate(-Math.PI / 2);
      contexto.textAlign = "center";
      contexto.fillText("Peso(Kg)", 0, 0);
      contexto.restore();
      contexto.closePath();

      contexto.beginPath();
      contexto.strokeStyle = "rgba(185,185,185,0.1)";

      var lnPeso = peso;
      var i;
      for (i = 0; i <= valorY; i += 1) {
        var y = Ymax - Math.round(i * scalaY);
        contexto.moveTo(Xmin, y); //(Y,X) traza las lineas horizontales
        contexto.lineTo(Xmax, y);
        if (i % 2 == 0) {
          contexto.moveTo(Xmin, y);
          contexto.lineTo(Xmax, y);
          contexto.font = '9px "Arial"';
          contexto.fillText(lnPeso, 15, y + 3);
          lnPeso += 2;
        }
      }

      var lnTalla = talla;
      var i;
      for (i = 0; i <= valorX; i += 1) {
        var x = Xmin + Math.round(i * scalaX);
        contexto.moveTo(x, Ymin); //(Y,X) traza las lineas verticales
        contexto.lineTo(x, Ymax);
        if ((i + 5) % 10 == 0) {
          contexto.moveTo(x, Ymin);
          contexto.lineTo(x, Ymax);
          contexto.font = '9px "Arial"';
          contexto.fillText(lnTalla, x - 5, Ymax + 15);
          lnTalla += 10;
        }
      }
      contexto.lineWidth = 1;
      contexto.stroke();
      contexto.closePath();

      // traza las coordenadas de las medidas
      var arreglo = aZPT[0].split("#");
      var lnAltura = parseFloat(arreglo[1]);
      var lnLong = lnAltura;

      var datoX = miTalla;
      var datoY = miPeso;
      var PuntoX = Xmin + Math.round(scalaX * (datoX - lnLong));
      var PuntoY = Ymax - Math.round(scalaY * (datoY - lnResta));
      contexto.beginPath();
      contexto.strokeStyle = "rgba(0,0,255,0.2)";
      contexto.moveTo(PuntoX, Ymin + 1);
      contexto.lineTo(PuntoX, Ymax - 1);
      contexto.moveTo(Xmin + 1, PuntoY);
      contexto.lineTo(Xmax - 1, PuntoY);
      contexto.lineWidth = 1;
      contexto.stroke();
      contexto.closePath();

      contexto.lineWidth = 1;
      var lnZ3n = parseFloat(arreglo[2]);
      var lnZ2n = parseFloat(arreglo[3]);
      var lnZ1n = parseFloat(arreglo[4]);
      var lnZ0 = parseFloat(arreglo[5]);
      var lnZ1 = parseFloat(arreglo[6]);
      var lnZ2 = parseFloat(arreglo[7]);
      var lnZ3 = parseFloat(arreglo[8]);

      var x0 = Xmin + Math.round(scalaX * (lnAltura - lnLong));
      var y03n = Ymax - Math.round(scalaY * (lnZ3n - lnResta));
      var y03 = Ymax - Math.round(scalaY * (lnZ3 - lnResta));
      var y02n = Ymax - Math.round(scalaY * (lnZ2n - lnResta));
      var y02 = Ymax - Math.round(scalaY * (lnZ2 - lnResta));
      var y01n = Ymax - Math.round(scalaY * (lnZ1n - lnResta));
      var y01 = Ymax - Math.round(scalaY * (lnZ1 - lnResta));
      var y0M = Ymax - Math.round(scalaY * (lnZ0 - lnResta));

      for (i = 1; i <= Regs; i += 1) {
        var arreglo = aZPT[i].split("#");
        var lnAltura = parseFloat(arreglo[1]);
        var lnZ3n = parseFloat(arreglo[2]);
        var lnZ2n = parseFloat(arreglo[3]);
        var lnZ1n = parseFloat(arreglo[4]);
        var lnZ0 = parseFloat(arreglo[5]);
        var lnZ1 = parseFloat(arreglo[6]);
        var lnZ2 = parseFloat(arreglo[7]);
        var lnZ3 = parseFloat(arreglo[8]);
        var x1 = Xmin + Math.round(scalaX * (lnAltura - lnLong));

        // SD3 y -SD3
        contexto.beginPath();
        contexto.strokeStyle = "rgba(255,0,0,0.9)"; // linea roja
        var y3n = Ymax - Math.round(scalaY * (lnZ3n - lnResta));
        contexto.moveTo(x0, y03n);
        contexto.lineTo(x1, y3n);
        var y03n = y3n;
        contexto.stroke();

        var y3 = Ymax - Math.round(scalaY * (lnZ3 - lnResta));
        contexto.moveTo(x0, y03);
        contexto.lineTo(x1, y3);
        var y03 = y3;
        contexto.stroke();
        contexto.closePath();

        // SD2 Y -SD2
        contexto.beginPath();
        contexto.strokeStyle = "rgba(255,0,0,0.3)"; // linea roja mas clara
        var y2n = Ymax - Math.round(scalaY * (lnZ2n - lnResta));
        contexto.moveTo(x0, y02n);
        contexto.lineTo(x1, y2n);
        var y02n = y2n;
        contexto.stroke();

        var y2 = Ymax - Math.round(scalaY * (lnZ2 - lnResta));
        contexto.moveTo(x0, y02);
        contexto.lineTo(x1, y2);
        var y02 = y2;
        contexto.stroke();
        contexto.closePath();

        // SD1 Y -SD1
        contexto.beginPath();
        contexto.strokeStyle = "rgba(210,169,53,0.9)"; // linea amarilla
        var y1n = Ymax - Math.round(scalaY * (lnZ1n - lnResta));
        contexto.moveTo(x0, y01n);
        contexto.lineTo(x1, y1n);
        var y01n = y1n;
        contexto.stroke();

        var y1 = Ymax - Math.round(scalaY * (lnZ1 - lnResta));
        contexto.moveTo(x0, y01);
        contexto.lineTo(x1, y1);
        var y01 = y1;
        contexto.stroke();
        contexto.closePath();

        // MEDIA
        contexto.beginPath();
        contexto.strokeStyle = "rgba(0,128,0,0.9)"; // linea verde
        var yM = Ymax - Math.round(scalaY * (lnZ0 - lnResta));
        contexto.moveTo(x0, y0M);
        contexto.lineTo(x1, yM);
        var y0M = yM;
        contexto.stroke();
        contexto.closePath();

        var x0 = x1;
        if (i == Regs - 1) {
          contexto.font = 'bold 9px "Arial"';
          contexto.fillStyle = "rgba(255,0,0,0.9)";
          contexto.fillText("+3SD", Xmax - 30, y3 + 2);
          contexto.fillText("-3SD", Xmax - 30, y3n + 2);
          contexto.fillStyle = "rgba(255,0,0,0.3)";
          contexto.fillText("+2SD", Xmax - 30, y2 + 2);
          contexto.fillText("-32D", Xmax - 30, y2n + 2);
          contexto.fillStyle = "rgba(210,169,53,0.9)";
          contexto.fillText("+1SD", Xmax - 30, y1 + 2);
          contexto.fillText("-1SD", Xmax - 30, y1n + 2);
          contexto.fillStyle = "rgba(0,128,0,0.9)";
          contexto.fillText("Media", Xmax - 30, yM + 2);
        }
      }
      break;

    case "3": //Talla / Edad
      var canvas = document.getElementById("canvas1");
      var contexto = canvas.getContext("2d");
      var arrayZTE = vlrZTE.split("#");
      var Regs = aZTE.length;

      mMeses = parseInt(arrayZTE[2]);
      var valorX = 250;
      var valorY = 170;

      if (mMeses <= 60) {
        var valorX = 65;
        var valorY = 100;
        var Regs = 60 + 1;
      }

      if (mMeses > 60 && mMeses <= 120) {
        var valorX = 130;
        var valorY = 140;
        var Regs = 120 + 1;
      }

      var scalaX = (Xmax - Xmin) / valorX;
      var scalaY = (Ymax - Ymin) / valorY;

      contexto.beginPath();
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      contexto.lineWidth = 1;
      contexto.strokeStyle = "rgba(0,0,0,5)";

      contexto.moveTo(Xmin, Ymin);
      contexto.lineTo(Xmin, Ymax);
      contexto.moveTo(Xmin, Ymax);
      contexto.lineTo(Xmax, Ymax);
      contexto.moveTo(Xmax, Ymax);
      contexto.lineTo(Xmax, Ymin);
      contexto.moveTo(Xmax, Ymin);
      contexto.lineTo(Xmin, Ymin);
      contexto.stroke();

      contexto.strokeRect(Xmin + 10, Ymin + 10, 190, 20);
      contexto.font = 'bold 9px "Arial"';
      contexto.fillStyle = "rgba(0,0,0,9)";
      contexto.fillText(arrayZTE[1], Xmin + 20, Ymin + 23);
      contexto.fillText(
        "Estándares de la OMS (Nacimiento a 60 meses), referencia de la OMS 2007 (61 meses a 19 años)",
        55,
        13
      );
      contexto.fillText("Edad(meses)", 230, 315);
      contexto.save();
      contexto.translate(10, 160);
      contexto.rotate(-Math.PI / 2);
      contexto.textAlign = "center";
      contexto.fillText("Longitud/Talla(cm)", 0, 0);
      contexto.restore();
      contexto.closePath();

      contexto.beginPath();
      contexto.strokeStyle = "rgba(185,185,185,0.1)";

      var lnTalla = 40;
      var i;
      for (i = 0; i <= valorY; i += 1) {
        var y = Ymax - Math.round(i * scalaY);
        contexto.moveTo(Xmin, y); //(Y,X) traza las lineas horizontales
        contexto.lineTo(Xmax, y);
        if (i % 10 == 0) {
          contexto.moveTo(Xmin, y);
          contexto.lineTo(Xmax, y);
          contexto.font = '9px "Arial"';
          contexto.fillText(lnTalla, 15, y + 3);
          lnTalla += 10;
        }
      }

      var lnMeses = 0;
      var i;
      for (i = 0; i <= valorX; i += 1) {
        var x = Xmin + Math.round(i * scalaX);
        contexto.moveTo(x, Ymin); //(Y,X) traza las lineas verticales
        contexto.lineTo(x, Ymax);
        if (i % 12 == 0) {
          contexto.moveTo(x, Ymin);
          contexto.lineTo(x, Ymax);
          contexto.font = '9px "Arial"';
          contexto.fillText(lnMeses, x - 5, Ymax + 15);
          lnMeses += 12;
        }
      }
      contexto.lineWidth = 1;
      contexto.stroke();
      contexto.closePath();

      // traza las coordenadas de las medidas
      var arreglo = aZTE[0].split("#");
      var lnLong = 40;

      var datoX = mMeses;
      var datoY = miTalla;
      var PuntoX = Xmin + Math.round(scalaX * datoX);
      var PuntoY = Ymax - Math.round(scalaY * (datoY - lnLong));
      contexto.beginPath();
      contexto.strokeStyle = "rgba(0,0,255,0.2)";
      contexto.moveTo(PuntoX, Ymin + 1);
      contexto.lineTo(PuntoX, Ymax - 1);
      contexto.moveTo(Xmin + 1, PuntoY);
      contexto.lineTo(Xmax - 1, PuntoY);
      contexto.lineWidth = 1;
      contexto.stroke();
      contexto.closePath();

      contexto.lineWidth = 1;
      var lnMeses = parseFloat(arreglo[1]);
      var lnZ3n = parseFloat(arreglo[2]);
      var lnZ2n = parseFloat(arreglo[3]);
      var lnZ1n = parseFloat(arreglo[4]);
      var lnZ0 = parseFloat(arreglo[5]);
      var lnZ1 = parseFloat(arreglo[6]);
      var lnZ2 = parseFloat(arreglo[7]);
      var lnZ3 = parseFloat(arreglo[8]);

      var x0 = Xmin + Math.round(scalaX * lnMeses);
      var y03n = Ymax - Math.round(scalaY * (lnZ3n - lnLong));
      var y03 = Ymax - Math.round(scalaY * (lnZ3 - lnLong));
      var y02n = Ymax - Math.round(scalaY * (lnZ2n - lnLong));
      var y02 = Ymax - Math.round(scalaY * (lnZ2 - lnLong));
      var y01n = Ymax - Math.round(scalaY * (lnZ1n - lnLong));
      var y01 = Ymax - Math.round(scalaY * (lnZ1 - lnLong));
      var y0M = Ymax - Math.round(scalaY * (lnZ0 - lnLong));

      for (i = 1; i <= Regs; i += 1) {
        var arreglo = aZTE[i].split("#");
        var lnMeses = parseFloat(arreglo[1]);
        var lnZ3n = parseFloat(arreglo[2]);
        var lnZ2n = parseFloat(arreglo[3]);
        var lnZ1n = parseFloat(arreglo[4]);
        var lnZ0 = parseFloat(arreglo[5]);
        var lnZ1 = parseFloat(arreglo[6]);
        var lnZ2 = parseFloat(arreglo[7]);
        var lnZ3 = parseFloat(arreglo[8]);
        var x1 = Xmin + Math.round(scalaX * lnMeses);

        // SD3 y -SD3
        contexto.beginPath();
        contexto.strokeStyle = "rgba(255,0,0,0.9)"; // linea roja
        var y3n = Ymax - Math.round(scalaY * (lnZ3n - lnLong));
        contexto.moveTo(x0, y03n);
        contexto.lineTo(x1, y3n);
        var y03n = y3n;
        contexto.stroke();

        var y3 = Ymax - Math.round(scalaY * (lnZ3 - lnLong));
        contexto.moveTo(x0, y03);
        contexto.lineTo(x1, y3);
        var y03 = y3;
        contexto.stroke();
        contexto.closePath();

        // SD2 Y -SD2
        contexto.beginPath();
        contexto.strokeStyle = "rgba(255,0,0,0.3)"; // linea roja mas clara
        var y2n = Ymax - Math.round(scalaY * (lnZ2n - lnLong));
        contexto.moveTo(x0, y02n);
        contexto.lineTo(x1, y2n);
        var y02n = y2n;
        contexto.stroke();

        var y2 = Ymax - Math.round(scalaY * (lnZ2 - lnLong));
        contexto.moveTo(x0, y02);
        contexto.lineTo(x1, y2);
        var y02 = y2;
        contexto.stroke();
        contexto.closePath();

        // SD1 Y -SD1
        contexto.beginPath();
        contexto.strokeStyle = "rgba(210,169,53,0.9)"; // linea amarilla
        var y1n = Ymax - Math.round(scalaY * (lnZ1n - lnLong));
        contexto.moveTo(x0, y01n);
        contexto.lineTo(x1, y1n);
        var y01n = y1n;
        contexto.stroke();

        var y1 = Ymax - Math.round(scalaY * (lnZ1 - lnLong));
        contexto.moveTo(x0, y01);
        contexto.lineTo(x1, y1);
        var y01 = y1;
        contexto.stroke();
        contexto.closePath();

        // MEDIA
        contexto.beginPath();
        contexto.strokeStyle = "rgba(0,128,0,0.9)"; // linea verde
        var yM = Ymax - Math.round(scalaY * (lnZ0 - lnLong));
        contexto.moveTo(x0, y0M);
        contexto.lineTo(x1, yM);
        var y0M = yM;
        contexto.stroke();
        contexto.closePath();

        var x0 = x1;
        if (i == Regs - 1) {
          contexto.font = 'bold 9px "Arial"';
          contexto.fillStyle = "rgba(255,0,0,0.9)";
          contexto.fillText("+3SD", Xmax - 30, y3 + 2);
          contexto.fillText("-3SD", Xmax - 30, y3n + 2);
          contexto.fillStyle = "rgba(255,0,0,0.3)";
          contexto.fillText("+2SD", Xmax - 30, y2 + 2);
          contexto.fillText("-32D", Xmax - 30, y2n + 2);
          contexto.fillStyle = "rgba(210,169,53,0.9)";
          contexto.fillText("+1SD", Xmax - 30, y1 + 2);
          contexto.fillText("-1SD", Xmax - 30, y1n + 2);
          contexto.fillStyle = "rgba(0,128,0,0.9)";
          contexto.fillText("Media", Xmax - 30, yM + 2);
        }
      }
      break;

    case "2": // Peso / Edad
      var canvas = document.getElementById("canvas1");
      var contexto = canvas.getContext("2d");
      var Regs = aZPE.length;
      var arrayZPE = vlrZPE.split("#");

      var valorX = 65;
      var valorY = 32;
      var scalaX = (Xmax - Xmin) / valorX;
      var scalaY = (Ymax - Ymin) / valorY;

      contexto.beginPath();
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      contexto.lineWidth = 1;
      contexto.strokeStyle = "rgba(0,0,0,5)";

      contexto.moveTo(Xmin, Ymin);
      contexto.lineTo(Xmin, Ymax);
      contexto.moveTo(Xmin, Ymax);
      contexto.lineTo(Xmax, Ymax);
      contexto.moveTo(Xmax, Ymax);
      contexto.lineTo(Xmax, Ymin);
      contexto.moveTo(Xmax, Ymin);
      contexto.lineTo(Xmin, Ymin);
      contexto.stroke();

      contexto.strokeRect(Xmin + 10, Ymin + 10, 190, 20);
      contexto.font = 'bold 9px "Arial"';
      contexto.fillStyle = "rgba(0,0,0,9)";
      contexto.fillText(arrayZPE[1], Xmin + 20, Ymin + 23);
      contexto.fillText(
        "Estándares de la OMS (Nacimiento a 60 meses), referencia de la OMS 2007 (61 meses a 19 años)",
        55,
        13
      );
      contexto.fillText("Edad(meses)", 230, 315);
      contexto.save();
      contexto.translate(10, 140);
      contexto.rotate(-Math.PI / 2);
      contexto.textAlign = "center";
      contexto.fillText("Peso(Kg)", 0, 0);
      contexto.restore();
      contexto.closePath();

      contexto.beginPath();
      contexto.strokeStyle = "rgba(185,185,185,0.1)";

      var lnPeso = 5;
      var i;
      for (i = 0; i <= valorY; i += 1) {
        var y = Ymax - Math.round(i * scalaY);
        contexto.moveTo(Xmin, y); //(Y,X) traza las lineas horizontales
        contexto.lineTo(Xmax, y);
        if (i % 5 == 0) {
          contexto.moveTo(Xmin, y);
          contexto.lineTo(Xmax, y);
          contexto.font = '9px "Arial"';
          contexto.fillText(lnPeso, 15, y + 3);
          lnPeso += 5;
        }
      }

      var lnMeses = 0;
      var i;
      for (i = 0; i <= valorX; i += 1) {
        var x = Xmin + Math.round(i * scalaX);
        contexto.moveTo(x, Ymin); //(Y,X) traza las lineas verticales
        contexto.lineTo(x, Ymax);
        if (i % 12 == 0) {
          contexto.moveTo(x, Ymin);
          contexto.lineTo(x, Ymax);
          contexto.font = '9px "Arial"';
          contexto.fillText(lnMeses, x - 5, Ymax + 15);
          lnMeses += 12;
        }
      }
      contexto.lineWidth = 1;
      contexto.stroke();
      contexto.closePath();

      // traza las coordenadas de las medidas
      var arreglo = aZPE[0].split("#");
      var lnLong = 8;

      var datoX = mMeses;
      var datoY = miPeso;
      var PuntoX = Xmin + Math.round(scalaX * datoX);
      var PuntoY = Ymax - Math.round(scalaY * datoY);
      contexto.beginPath();
      contexto.strokeStyle = "rgba(0,0,255,0.2)";
      contexto.moveTo(PuntoX, Ymin + 1);
      contexto.lineTo(PuntoX, Ymax - 1);
      contexto.moveTo(Xmin + 1, PuntoY);
      contexto.lineTo(Xmax - 1, PuntoY);
      contexto.lineWidth = 1;
      contexto.stroke();
      contexto.closePath();

      contexto.lineWidth = 1;
      var lnMeses = parseFloat(arreglo[1]);
      var lnZ3n = parseFloat(arreglo[2]);
      var lnZ2n = parseFloat(arreglo[3]);
      var lnZ1n = parseFloat(arreglo[4]);
      var lnZ0 = parseFloat(arreglo[5]);
      var lnZ1 = parseFloat(arreglo[6]);
      var lnZ2 = parseFloat(arreglo[7]);
      var lnZ3 = parseFloat(arreglo[8]);

      var x0 = Xmin + Math.round(scalaX * lnMeses);
      var y03n = Ymax - Math.round(scalaY * lnZ3n);
      var y03 = Ymax - Math.round(scalaY * lnZ3);
      var y02n = Ymax - Math.round(scalaY * lnZ2n);
      var y02 = Ymax - Math.round(scalaY * lnZ2);
      var y01n = Ymax - Math.round(scalaY * lnZ1n);
      var y01 = Ymax - Math.round(scalaY * lnZ1);
      var y0M = Ymax - Math.round(scalaY * lnZ0);

      for (i = 1; i <= Regs; i += 1) {
        var arreglo = aZPE[i].split("#");
        var lnMeses = parseFloat(arreglo[1]);
        var lnZ3n = parseFloat(arreglo[2]);
        var lnZ2n = parseFloat(arreglo[3]);
        var lnZ1n = parseFloat(arreglo[4]);
        var lnZ0 = parseFloat(arreglo[5]);
        var lnZ1 = parseFloat(arreglo[6]);
        var lnZ2 = parseFloat(arreglo[7]);
        var lnZ3 = parseFloat(arreglo[8]);
        var x1 = Xmin + Math.round(scalaX * lnMeses);

        // SD3 y -SD3
        contexto.beginPath();
        contexto.strokeStyle = "rgba(255,0,0,0.9)"; // linea roja
        var y3n = Ymax - Math.round(scalaY * lnZ3n);
        contexto.moveTo(x0, y03n);
        contexto.lineTo(x1, y3n);
        var y03n = y3n;
        contexto.stroke();

        var y3 = Ymax - Math.round(scalaY * lnZ3);
        contexto.moveTo(x0, y03);
        contexto.lineTo(x1, y3);
        var y03 = y3;
        contexto.stroke();
        contexto.closePath();

        // SD2 Y -SD2
        contexto.beginPath();
        contexto.strokeStyle = "rgba(255,0,0,0.3)"; // linea roja mas clara
        var y2n = Ymax - Math.round(scalaY * lnZ2n);
        contexto.moveTo(x0, y02n);
        contexto.lineTo(x1, y2n);
        var y02n = y2n;
        contexto.stroke();

        var y2 = Ymax - Math.round(scalaY * lnZ2);
        contexto.moveTo(x0, y02);
        contexto.lineTo(x1, y2);
        var y02 = y2;
        contexto.stroke();
        contexto.closePath();

        // SD1 Y -SD1
        contexto.beginPath();
        contexto.strokeStyle = "rgba(210,169,53,0.9)"; // linea amarilla
        var y1n = Ymax - Math.round(scalaY * lnZ1n);
        contexto.moveTo(x0, y01n);
        contexto.lineTo(x1, y1n);
        var y01n = y1n;
        contexto.stroke();

        var y1 = Ymax - Math.round(scalaY * lnZ1);
        contexto.moveTo(x0, y01);
        contexto.lineTo(x1, y1);
        var y01 = y1;
        contexto.stroke();
        contexto.closePath();

        // MEDIA
        contexto.beginPath();
        contexto.strokeStyle = "rgba(0,128,0,0.9)"; // linea verde
        var yM = Ymax - Math.round(scalaY * lnZ0);
        contexto.moveTo(x0, y0M);
        contexto.lineTo(x1, yM);
        var y0M = yM;
        contexto.stroke();
        contexto.closePath();

        var x0 = x1;
        if (i == Regs - 1) {
          contexto.font = 'bold 9px "Arial"';
          contexto.fillStyle = "rgba(255,0,0,0.9)";
          contexto.fillText("+3SD", Xmax - 30, y3 + 2);
          contexto.fillText("-3SD", Xmax - 30, y3n + 2);
          contexto.fillStyle = "rgba(255,0,0,0.3)";
          contexto.fillText("+2SD", Xmax - 30, y2 + 2);
          contexto.fillText("-32D", Xmax - 30, y2n + 2);
          contexto.fillStyle = "rgba(210,169,53,0.9)";
          contexto.fillText("+1SD", Xmax - 30, y1 + 2);
          contexto.fillText("-1SD", Xmax - 30, y1n + 2);
          contexto.fillStyle = "rgba(0,128,0,0.9)";
          contexto.fillText("Media", Xmax - 30, yM + 2);
        }
      }
      break;

    case "4":
      var canvas = document.getElementById("canvas1");
      var contexto = canvas.getContext("2d");
      var arrayZIMC = vlrZIMC.split("#");
      var Regs = aZIMC.length;

      mMeses = parseInt(arrayZIMC[2]);
      var valorX = 250;
      var valorY = 32;

      if (mMeses <= 60) {
        var valorX = 65;
        var valorY = 20;
        var Regs = 60 + 1;
      }

      if (mMeses > 60 && mMeses <= 120) {
        var valorX = 130;
        var valorY = 20;
        var Regs = 120 + 1;
      }

      var scalaX = (Xmax - Xmin) / valorX;
      var scalaY = (Ymax - Ymin) / valorY;

      contexto.beginPath();
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      contexto.lineWidth = 1;
      contexto.strokeStyle = "rgba(0,0,0,5)";

      contexto.moveTo(Xmin, Ymin);
      contexto.lineTo(Xmin, Ymax);
      contexto.moveTo(Xmin, Ymax);
      contexto.lineTo(Xmax, Ymax);
      contexto.moveTo(Xmax, Ymax);
      contexto.lineTo(Xmax, Ymin);
      contexto.moveTo(Xmax, Ymin);
      contexto.lineTo(Xmin, Ymin);
      contexto.stroke();

      contexto.strokeRect(Xmin + 10, Ymin + 10, 190, 20);
      contexto.font = 'bold 9px "Arial"';
      contexto.fillStyle = "rgba(0,0,0,9)";
      contexto.fillText(arrayZIMC[1], Xmin + 20, Ymin + 23);
      contexto.fillText(
        "Estándares de la OMS (Nacimiento a 60 meses), referencia de la OMS 2007 (61 meses a 19 años)",
        55,
        13
      );
      contexto.fillText("Edad(meses)", 230, 315);
      contexto.save();
      contexto.translate(10, 160);
      contexto.rotate(-Math.PI / 2);
      contexto.textAlign = "center";
      contexto.fillText("Indice de masa corporal", 0, 0);
      contexto.restore();
      contexto.closePath();

      contexto.beginPath();
      contexto.strokeStyle = "rgba(185,185,185,0.1)";

      var lnTalla = 8;
      var i;
      for (i = 0; i <= valorY; i += 1) {
        var y = Ymax - Math.round(i * scalaY);
        contexto.moveTo(Xmin, y); //(Y,X) traza las lineas horizontales
        contexto.lineTo(Xmax, y);
        if (i % 2 == 0) {
          contexto.moveTo(Xmin, y);
          contexto.lineTo(Xmax, y);
          contexto.font = '9px "Arial"';
          contexto.fillText(lnTalla, 15, y + 3);
          lnTalla += 2;
        }
      }

      var lnMeses = 0;
      var i;
      for (i = 0; i <= valorX; i += 1) {
        var x = Xmin + Math.round(i * scalaX);
        contexto.moveTo(x, Ymin); //(Y,X) traza las lineas verticales
        contexto.lineTo(x, Ymax);
        if (i % 12 == 0) {
          contexto.moveTo(x, Ymin);
          contexto.lineTo(x, Ymax);
          contexto.font = '9px "Arial"';
          contexto.fillText(lnMeses, x - 5, Ymax + 15);
          lnMeses += 12;
        }
      }
      contexto.lineWidth = 1;
      contexto.stroke();
      contexto.closePath();

      // traza las coordenadas de las medidas
      var arreglo = aZIMC[0].split("#");
      var lnLong = 8;

      var datoX = mMeses;
      lnIMC = Math.pow(miTalla / 100, 2);
      lnIMC = miPeso / lnIMC;
      lnIMC = lnIMC.toFixed(2);

      var datoY = lnIMC;
      var PuntoX = Xmin + Math.round(scalaX * datoX);
      var PuntoY = Ymax - Math.round(scalaY * (datoY - lnLong));
      contexto.beginPath();
      contexto.strokeStyle = "rgba(0,0,255,0.2)";
      contexto.moveTo(PuntoX, Ymin + 1);
      contexto.lineTo(PuntoX, Ymax - 1);
      contexto.moveTo(Xmin + 1, PuntoY);
      contexto.lineTo(Xmax - 1, PuntoY);
      contexto.lineWidth = 1;
      contexto.stroke();
      contexto.closePath();

      contexto.lineWidth = 1;
      var lnMeses = parseFloat(arreglo[1]);
      var lnZ3n = parseFloat(arreglo[2]);
      var lnZ2n = parseFloat(arreglo[3]);
      var lnZ1n = parseFloat(arreglo[4]);
      var lnZ0 = parseFloat(arreglo[5]);
      var lnZ1 = parseFloat(arreglo[6]);
      var lnZ2 = parseFloat(arreglo[7]);
      var lnZ3 = parseFloat(arreglo[8]);

      var x0 = Xmin + Math.round(scalaX * lnMeses);
      var y03n = Ymax - Math.round(scalaY * (lnZ3n - lnLong));
      var y03 = Ymax - Math.round(scalaY * (lnZ3 - lnLong));
      var y02n = Ymax - Math.round(scalaY * (lnZ2n - lnLong));
      var y02 = Ymax - Math.round(scalaY * (lnZ2 - lnLong));
      var y01n = Ymax - Math.round(scalaY * (lnZ1n - lnLong));
      var y01 = Ymax - Math.round(scalaY * (lnZ1 - lnLong));
      var y0M = Ymax - Math.round(scalaY * (lnZ0 - lnLong));

      for (i = 1; i <= Regs; i += 1) {
        var arreglo = aZIMC[i].split("#");
        var lnMeses = parseFloat(arreglo[1]);
        var lnZ3n = parseFloat(arreglo[2]);
        var lnZ2n = parseFloat(arreglo[3]);
        var lnZ1n = parseFloat(arreglo[4]);
        var lnZ0 = parseFloat(arreglo[5]);
        var lnZ1 = parseFloat(arreglo[6]);
        var lnZ2 = parseFloat(arreglo[7]);
        var lnZ3 = parseFloat(arreglo[8]);
        var x1 = Xmin + Math.round(scalaX * lnMeses);

        // SD3 y -SD3
        contexto.beginPath();
        contexto.strokeStyle = "rgba(255,0,0,0.9)"; // linea roja
        var y3n = Ymax - Math.round(scalaY * (lnZ3n - lnLong));
        contexto.moveTo(x0, y03n);
        contexto.lineTo(x1, y3n);
        var y03n = y3n;
        contexto.stroke();

        var y3 = Ymax - Math.round(scalaY * (lnZ3 - lnLong));
        contexto.moveTo(x0, y03);
        contexto.lineTo(x1, y3);
        var y03 = y3;
        contexto.stroke();
        contexto.closePath();

        // SD2 Y -SD2
        contexto.beginPath();
        contexto.strokeStyle = "rgba(255,0,0,0.3)"; // linea roja mas clara
        var y2n = Ymax - Math.round(scalaY * (lnZ2n - lnLong));
        contexto.moveTo(x0, y02n);
        contexto.lineTo(x1, y2n);
        var y02n = y2n;
        contexto.stroke();

        var y2 = Ymax - Math.round(scalaY * (lnZ2 - lnLong));
        contexto.moveTo(x0, y02);
        contexto.lineTo(x1, y2);
        var y02 = y2;
        contexto.stroke();
        contexto.closePath();

        // SD1 Y -SD1
        contexto.beginPath();
        contexto.strokeStyle = "rgba(210,169,53,0.9)"; // linea amarilla
        var y1n = Ymax - Math.round(scalaY * (lnZ1n - lnLong));
        contexto.moveTo(x0, y01n);
        contexto.lineTo(x1, y1n);
        var y01n = y1n;
        contexto.stroke();

        var y1 = Ymax - Math.round(scalaY * (lnZ1 - lnLong));
        contexto.moveTo(x0, y01);
        contexto.lineTo(x1, y1);
        var y01 = y1;
        contexto.stroke();
        contexto.closePath();

        // MEDIA
        contexto.beginPath();
        contexto.strokeStyle = "rgba(0,128,0,0.9)"; // linea verde
        var yM = Ymax - Math.round(scalaY * (lnZ0 - lnLong));
        contexto.moveTo(x0, y0M);
        contexto.lineTo(x1, yM);
        var y0M = yM;
        contexto.stroke();
        contexto.closePath();

        var x0 = x1;
        if (i == Regs - 1) {
          contexto.font = 'bold 9px "Arial"';
          contexto.fillStyle = "rgba(255,0,0,0.9)";
          contexto.fillText("+3SD", Xmax - 30, y3 + 2);
          contexto.fillText("-3SD", Xmax - 30, y3n + 2);
          contexto.fillStyle = "rgba(255,0,0,0.3)";
          contexto.fillText("+2SD", Xmax - 30, y2 + 2);
          contexto.fillText("-32D", Xmax - 30, y2n + 2);
          contexto.fillStyle = "rgba(210,169,53,0.9)";
          contexto.fillText("+1SD", Xmax - 30, y1 + 2);
          contexto.fillText("-1SD", Xmax - 30, y1n + 2);
          contexto.fillStyle = "rgba(0,128,0,0.9)";
          contexto.fillText("Media", Xmax - 30, yM + 2);
        }
      }
      break;
  }
}
