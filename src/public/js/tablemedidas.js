$(document).ready(function () {
  $('#tab-medidas').DataTable({
    language: {
      "lengthMenu": "Mostrar _MENU_ registros",
      "zeroRecords": "No se encontraron resultados",
      "info": "Registros del _START_ al _END_ de  _TOTAL_",
      "infoEmpty": "Encontrados 0 ",
      "infoFiltered": "(de _MAX_ registros)",
      "sSearch": "Buscar:",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Sig",
        "sPrevious": "Ant"
      },
      "sProcessing": "Procesando...",
    },
    stateSave: true,
    //para usar los botones   
    responsive: "true",
    dom: 'Bfrtilp',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="fas fa-file-excel"></i> ',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i> ',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        title: 'Listado de Medidas Antropometricas',
        customize: function (doc) {
          doc.defaultStyle.fontSize = 8;
        },

        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Listado de Medidas Antropometricas',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          //stripHtml : false
        }
      },
    ]
  });

  $('#capturaHuella').on('show.bs.modal', function () {          //Abrir Modal
    openModal()
  })

  $("#capturaHuella").on('hidden.bs.modal', function () {        //Cerrar Modal
    closeModal()
  });

  $(document).on("click", ".btnCaptura", function () {
    extraerFace()
    $('#capturaHuella').modal('hide');
  });

});