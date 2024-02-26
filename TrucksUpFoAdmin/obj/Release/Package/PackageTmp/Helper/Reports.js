var cdate = "", month = "";

$(function () {

    var start = moment();  //moment().subtract(29, 'days');
    var end = moment();
    cdate = start.format('YYYY/MM/D');
    month = start.format('MM/YYYY');
    function cb(start, end) {
        $('#reportrange span').html(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
        GetDatabydaterange(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'), $("#EmployeeType option:selected").val());
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);


    $(".ranges ul li").click(function () {
        $("#FoLists").prop("selectedIndex", 0);
        if ($(this).text() == 'Today') {
            cb(moment(), moment());
        }
        else if ($(this).text() == 'Yesterday') {
            cb(moment().subtract(1, 'days'), moment().subtract(1, 'days'));
        }
        else if ($(this).text() == 'Last 7 Days') {
            cb(moment().subtract(6, "days"), moment());
        }
        else if ($(this).text() == 'Last 30 Days') {
            cb(moment().subtract(29, "days"), moment());
        }
        else if ($(this).text() == 'This Month') {
            cb(moment().startOf("month"), moment().endOf("month"));
        }
        else if ($(this).text() == 'Last Month') {
            cb(moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month"));
        }
    });

    cb(start, end);

});

function Logout() {
    var url = "/Reports/LogOut";
    var data = {};
    var Result = doAjax(url, data);
    window.location.href = Result;
}


function GetDatabydaterange(date, type) {
    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    var tr = "";
    if (type == "1") {
        tr = '<tr> \
            <th></th>\
            <th>Name</th>\
            <th>Today Visits  </th>\
            <th>Today Actual download  </th>\
            <th>Monthly Visits </th>\
            <th>Monthly Actual download </th>\
            <th>Total Visits</th>\
            <th>Actual download</th>\
            <th>Stickering</th>\
            <th>Today First Entry</th>\
            <th>Today Last Entry</th> \
            </tr>';
    } else {
        tr = '<tr>\
            <th></th>\
            <th>Name</th>\
            <th>Today Visits  </th>\
            <th>Today Actual download  </th>\
            <th>Monthly Visits </th>\
            <th>Monthly Actual download </th>\
            <th>Total Visits</th>\
            <th>Actual download</th>\
            <th>Stickering</th>\
            <th>Today First Entry</th>\
            <th>Today Last Entry</th> \
            </tr>';
    }
    $("#reportDatatable thead").empty();
    $("#reportDatatable tfoot").empty();
    $("#reportDatatable thead").append(tr);
    $("#reportDatatable tfoot").append(tr);

    var url = "/Reports/MethodGetFieldofficersReports";
    var data = JSON.stringify({ startdate: startdate, enddate: enddate, type: type });
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        var i = 1;
        var ParseResult = JSON.parse(JsonResult).table;

        cdate = ParseResult[0].currentdate;
        month = ParseResult[0].currentmonth;
        $("#reportDatatable").DataTable().clear().destroy();
        $("#reportDatatable").DataTable(
            {
                bLengthChange: true,
                lengthMenu: [[10, 15, -1], [10, 15, "All"]],
                bFilter: true,
                bSort: true,
                bPaginate: true,
                dom: 'Bfrtip',
                data: ParseResult,
                columns: [
                    {
                        render: function (data, type, row) {
                            return "<div>" + i++ + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.name + "</div>";
                        }
                    },

                    {
                        render: function (data, type, row) {
                            return "<div>" + row.todayvisit + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.actualdownloaded + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.monthlytotalvisit + "</div>";
                        }
                    },

                    {
                        render: function (data, type, row) {
                            return "<div>" + row.monthlyactualdownloaded + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.totalvisit + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.gactualdownloaded + "</div>";
                        }
                    },

                    {
                        render: function (data, type, row) {
                            return "<div>" + row.stickeredvisit + "</div>";
                        }
                    }
                    ,
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.todayfirstentry + "</div>";
                        }
                    }
                    ,
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.todaylastentry + "</div>";
                        }
                    }
                ],
                buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    'pdfHtml5'
                ]
            });
    } else {
        $("#reportDatatable").DataTable().clear().destroy();
        $("#reportDatatable").DataTable();
    }

}

$("#EmployeeType").change(function () {
    var type = $("#EmployeeType option:selected").val();
    var date = $('#reportrange span').text();
    GetDatabydaterange(date, type)
});

