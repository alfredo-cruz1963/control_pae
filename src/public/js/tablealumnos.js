$(document).ready(function () {
  let opcion = null;
  let numero,
    tipdoc,
    nombres,
    apellidos,
    nombre,
    curso,
    sexo,
    fecnac,
    etnia,
    acudiente,
    cedula,
    celular,
    anos,
    fila,
    cursos,
    myCedula;
  var datoSet;

  //MOSTRAR
  let tablaAlumnos = $("#tab-alumnos").DataTable({
    processing: true,
    ajax: {
      url: "/alumnos/view",
      method: "GET",
      dataSrc: "",
    },
    rowId: "staffId",
    columns: [
      { data: "numero" },
      { data: "nombre" },
      { data: "anos" },
      { data: "curso" },
      { data: "acudiente" },
      { data: "cedula" },
      { data: "celular" },
      {
        defaultContent: `<a href="#" class="material-icons btnEditar text-primary" title="Actualizar">create</a>
                         <a href="#" class="material-icons btnBorrar text-danger" title="Eliminar">delete</a>
                         <a href="#" class="material-icons btnFinger text-success" title="Capturar Rostro">perm_identity</a>`,
      },
    ],
    columnDefs: [
      { width: "8%", targets: 0 },
      { width: "35%", targets: 1 },
      { width: "5%", targets: 2 },
      { width: "5%", targets: 3 },
      { width: "25%", targets: 4 },
      { width: "5%", targets: 5 },
      { width: "5%", targets: 6 },
      { width: "13%", targets: 7 },
    ],
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "Registros del _START_ al _END_ de un total de  _TOTAL_",
      infoEmpty: "Encontrados 0 ",
      infoFiltered: "(de _MAX_ registros)",
      sSearch: "Buscar:",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Sig",
        sPrevious: "Ant",
      },
      sProcessing: "Procesando...",
    },
    stateSave: true,
    //para usar los botones
    responsive: "true",
    order: [
      [3, "asc"],
      [1, "asc"],
    ],
    dom: "Bfrtilp",
    select: true,
    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: "Exportar a Excel",
        className: "btn btn-success",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: "Exportar a PDF",
        className: "btn btn-danger",
        title: "Listado de Alumnos",
        customize: function (doc) {
          doc.defaultStyle.fontSize = 7;
        },
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6],
          //stripHtml : false
        },
      },
      {
        extend: "print",
        text: '<i class="fa fa-print"></i> ',
        titleAttr: "Imprimir",
        className: "btn btn-info",
        title: "Listado de Alumnos",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6],
          //stripHtml : false
        },
      },
    ],
  });

  $("#capturaHuella").on("show.bs.modal", function () {
    //Abrir Modal
    openModal();
  });

  $("#capturaHuella").on("hidden.bs.modal", function () {
    //Cerrar Modal
    closeModal();
  });

  //CREAR
  $("#btnCrear").click(function () {
    opcion = "new";
    numero = null;
    $("#formAlumnos").trigger("reset");
    $("#numero").attr("readonly", false);
    $("#numero").attr("autofocus", true);
    $(".modal-header").css("background-color", "#23272b");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Add Alumno");
    $(".btnGrabar").text("Grabar");
    $("#modalAlumnos").modal("show");
  });

  //CAPTURA ROSTRO
  $(document).on("click", ".btnFinger", function () {
    fila = $(this).closest("tr");
    $("#estado").attr("readonly", true);
    numero = fila.find("td:eq(0)").text();

    $("#estado").val(numero);
    myCedula = numero;

    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Capturar Rostro");
    $("#capturaHuella").modal("show");
  });

  //GRABAR ROSTRO
  $(document).on("click", ".btnCaptura", function () {
    $(".faceAdd").css("background-color", "#28a745");
    $(".faceAdd").css("color", "white");
    $(".nameAdd").text("Enroll Usuario");

    extraerFace();

    $("#modalGrabarFace").modal("show");
  });

  //EDITAR
  $("#tab-alumnos tbody").on("click", "tr", function () {
    var id = tablaAlumnos.row(this).index();
    datoSet = tablaAlumnos.row(this).data();
  });

  $(document).on("click", ".btnEditar", function () {
    opcion = "edit";
    fila = $(this).closest("tr");
    $("#numero").attr("readonly", true);
    numero = fila.find("td:eq(0)").text();
    //tipdoc = parseInt(datoSet.tipdoc);
    tipdoc = datoSet.tipdoc;
    nombres = datoSet.nombres;
    apellidos = datoSet.apellidos;
    curso = fila.find("td:eq(3)").text();
    sexo = datoSet.sexo;
    fecnac = datoSet.fecnac;
    etnia = datoSet.etnia;
    acudiente = fila.find("td:eq(4)").text();
    cedula = fila.find("td:eq(5)").text();
    celular = fila.find("td:eq(6)").text();

    var fecnac1 = fecnac.substr(0, 10);
    var fecha = fecnac1.split("-");
    var mfecnac = fecha[0] + "-" + fecha[1] + "-" + fecha[2];

    $("#numero").val(numero);
    $('input[name="tipdoc"]').val([tipdoc]);
    $("#nombres").val(nombres);
    $("#apellidos").val(apellidos);
    $('input[name="sexo"]').val([sexo]);
    $("#fecnac").val(mfecnac);
    $('input[name="etnia"]').val([etnia]);
    $("#acudiente").val(acudiente);
    $("#cedula").val(cedula);
    $("#celular").val(celular);
    $("#curso").val(curso);

    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Editar Alumno");
    $(".btnGrabar").text("Actualizar");
    $("#modalAlumnos").modal("show");
  });

  //BORRAR
  $(document).on("click", ".btnBorrar", function () {
    fila = $(this);
    numero = $(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
      title: "Desea eliminar el Alumno?",
      text: datoSet.nombre,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/alumnos/delete/" + numero,
          method: "GET",
          data: { numero: numero },
          success: function () {
            tablaAlumnos.row(fila.parents("tr")).remove().draw();
          },
        });
        //Swal.fire('Registro Eliminado!', '', 'success');
      }
    });
  });

  //submit para CREAR y EDITAR
  $("#formAlumnos").submit(function (e) {
    e.preventDefault();
    numero = $.trim($("#numero").val());
    tipdoc = $('[type=radio][name="tipdoc"]:checked').attr("value");
    nombres = $.trim($("#nombres").val());
    apellidos = $.trim($("#apellidos").val());
    sexo = $('[type=radio][name="sexo"]:checked').attr("value");
    fecnac = $.trim($("#fecnac").val());
    etnia = $('[type=radio][name="etnia"]:checked').attr("value");
    acudiente = $.trim($("#acudiente").val());
    cedula = $.trim($("#cedula").val());
    celular = $.trim($("#celular").val());
    curso = $.trim($("#curso").val());

    if (opcion == "new") {
      $.ajax({
        url: "/alumnos/add/",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          numero: numero,
          tipdoc: tipdoc,
          nombres: nombres,
          apellidos: apellidos,
          sexo: sexo,
          fecnac: fecnac,
          etnia: etnia,
          acudiente: acudiente,
          cedula: cedula,
          celular: celular,
          curso: curso,
        }),
        success: function (data) {
          if (data === "Fallo") {
            Swal.fire("El Alumno YA existe!", "", "error");
          } else {
            tablaAlumnos.ajax.reload(null, false);
            Swal.fire("El Alumno se Grabo Correctamente!", "", "success");
          }
        },
      });
    }

    if (opcion == "edit") {
      const btnEnabled = $.ajax({
        url: "/alumnos/update/" + numero,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          numero: numero,
          tipdoc: tipdoc,
          nombres: nombres,
          apellidos: apellidos,
          sexo: sexo,
          fecnac: fecnac,
          etnia: etnia,
          acudiente: acudiente,
          cedula: cedula,
          celular: celular,
          curso: curso,
        }),
        success: function (data) {
          tablaAlumnos.ajax.reload(null, false);
          //console.log(data)
        },
      });
      Swal.fire("El Alumno se Actualizo Correctamente!", "", "success");
    }
    $("#modalAlumnos").modal("hide");
  });
});
