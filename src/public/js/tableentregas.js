$(document).ready(function () {
  let opcion = null;
  let numero, fecha, nombre, edad, curso, acudiente, cedula, fila, myCedula;
  var datoSet;

  //MOSTRAR
  let tablaEntregas = $("#tab-entregas").DataTable({
    processing: true,
    ajax: {
      url: "/entregas/view",
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
      {
        defaultContent: `<a href="#" class="material-icons btn-xs btn-white btnBorrar text-danger" title="Eliminar">delete</a>`,
      },
    ],
    columnDefs: [
      { width: "8%", targets: 0 },
      { width: "35%", targets: 1 },
      { width: "8%", targets: 2 },
      { width: "8%", targets: 3 },
      { width: "25%", targets: 4 },
      { width: "8%", targets: 5 },
      { width: "8%", targets: 6 },
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
    responsive: "true",
    order: [
      [3, "asc"],
      [1, "asc"],
    ],
    select: true,
  });

  $("#capturaHuella").on("show.bs.modal", function () {
    //Abrir Modal
    openModal();
  });

  $("#capturaHuella").on("hidden.bs.modal", function () {
    //Cerrar Modal
    closeModal();
  });

  //EDITAR
  $("#tab-entregas tbody").on("click", "tr", function () {
    var id = tablaEntregas.row(this).index();
    datoSet = tablaEntregas.row(this).data();
  });

  //BORRAR
  $(document).on("click", ".btnBorrar", function () {
    fila = $(this);
    numero = $(this).closest("tr").find("td:eq(0)").text();
    nombre = $(this).closest("tr").find("td:eq(1)").text();
    Swal.fire({
      title: "Desea eliminar la Entrega al Alumno?",
      text: nombre,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/entregas/delete/" + numero,
          method: "GET",
          data: { numero: numero },
          success: function () {
            tablaEntregas.row(fila.parents("tr")).remove().draw();
          },
        });
        //Swal.fire('Registro Eliminado!', '', 'success');
      }
    });
  });

  $(document).on("click", ".btnCaptura", function () {
    extraerFace();
    $("#capturaHuella").modal("hide");
  });

  //submit para ADD una Entrega
  $("#formGrabarRostro").submit(function (e) {
    e.preventDefault();
    let estado = $.trim($("#estado").val());

    $.ajax({
      url: "/entregas/add/" + estado,
      method: "POST",
      contentType: "application/json",
      success: function (data) {
        if (data === "Fallo") {
          Swal.fire("Ya se le hizo la entrega al Alumno!", "", "error");
        } else {
          tablaEntregas.ajax.reload(null, false);
          Swal.fire("La Entrega se hizo Correctamente!", "", "success");
        }
      },
    });
    $("#modalMostrarFace").modal("hide");
  });
});
