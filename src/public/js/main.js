$(document).ready(function () {
  $('#tab-alumnos1').DataTable({
    //"serverSide": true,  
    /*          columnDefs: [
                {
                    "targets": [ 1 ],
                    "visible": false,
                    "searchable": false
                }
            ], */
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
    "order": [[3, "desc"], [1, "desc"]],
    dom: 'Bfrtilp',
    select: true,
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
        title: 'Listado de Alumnos',
        customize: function (doc) {
          doc.defaultStyle.fontSize = 8;
        },

        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
          //stripHtml : false
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Listado de Alumnos',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
          //stripHtml : false
        }
      },
    ],
  });
});

//************************************************************************************** */
$(document).ready(function () {
  $('#tab-entrega-manual').DataTable({
    //"serverSide": true,  
    /*          columnDefs: [
                {
                    "targets": [ 1 ],
                    "visible": false,
                    "searchable": false
                }
            ], */
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
    "order": [[3, "desc"], [1, "desc"]]
  });
});

//************************************************************************************** */

$(document).ready(function () {
  const mfechoy = new Date();
  mfechoy.setHours(mfechoy.getHours() - 5);
  const mfecha = JSON.stringify(mfechoy);
  const mfecha1 = mfecha.substr(1, 10);
  $('#table-entregas1').DataTable({
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
        title: 'Reporte de Entregas del: ' + mfecha1,
        customize: function (doc) {
          doc.defaultStyle.fontSize = 8;
        },

        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Reporte de Entregas del: ' + mfecha1,
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
          //stripHtml : false
        }
      },
    ]
  });
});

//************************************************************************************** */
$(document).ready(function () {
  $('#table-sedes').DataTable({
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
        title: 'Listado de Instituciones Educativas - Sedes PAE',
        customize: function (doc) {
          doc.defaultStyle.fontSize = 9;
        },

        exportOptions: {
          columns: [0, 1, 2, 3]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Listado de Instituciones Educativas - Sedes PAE',
        exportOptions: {
          columns: [0, 1, 2, 3]
          //stripHtml : false
        }
      },
    ]
  });
});

//************************************************************************************** */
$(document).ready(function () {
  $('#tab-medidas1').DataTable({
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
        title: 'Listado de Instituciones Educativas - Sedes PAE',
        customize: function (doc) {
          doc.defaultStyle.fontSize = 9;
        },

        exportOptions: {
          columns: [0, 1, 2, 3]
        }
      },
      {
        extend: 'print',
        text: '<i class="fa fa-print"></i> ',
        titleAttr: 'Imprimir',
        className: 'btn btn-info',
        title: 'Listado de Instituciones Educativas - Sedes PAE',
        exportOptions: {
          columns: [0, 1, 2, 3]
          //stripHtml : false
        }
      },
    ]
  });
});

//************************************************************************************** */
$(document).ready(function () {
  $('#example1').DataTable({
    "createdRow": function (row, data, index) {
      if (data[2].replace(/[\$,]/g, '') * 1 > 1500000) {
        $('td', row).eq(2).addClass('highlight');
      }
    },
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
    //para usar los botones   
    responsive: "true"


  });
});


/*
$(document).ready(function() {
    $('#example').DataTable( {
        "createdRow": function ( row, data, index ) {
            if ( data[5].replace(/[\$,]/g, '') * 1 > 150000 ) {
                $('td', row).eq(5).addClass('highlight');
            }
        }
    } );
} );

 script.
    $('#dataTables-example').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
             {
                extend: 'excelHtml5',
                title: 'Almacen',
                exportOptions: {
                    columns: [ 0, 1, 2 ]
                }
            },
            {
                extend: 'pdf',
                title: 'Almacen',
                exportOptions: {
                    columns: [ 0, 1, 2 ]
                }
            }
                        {
                text: '<i class="fa fa-plus-square" aria-hidden="true"></i>',
                titleAttr: 'Agregar Alumnos',
                action: function (e, dt, node, config ){
                    miFuncionPersonalizada();
                },
                className: 'btn_personalizado'
            },
        ]
    });
    
    
    */