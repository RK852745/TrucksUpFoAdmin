var cdate = "";
var month = "";
var $reportDatatable = $("#reportDatatable");
var $reportrangeSpan = $('#reportrange span');
var $employeeType = $("#EmployeeType");

$(function () {
    var start = moment();
    var end = moment();
    cdate = start.format('YYYY/MM/D');
    month = start.format('MM/YYYY');

    function cb(start, end) {
        $reportrangeSpan.html(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
        GetDatabydaterange(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'), $employeeType.val());
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
        $employeeType.prop("selectedIndex", 0);
        var rangeText = $(this).text();
        var startDate, endDate;
        switch (rangeText) {
            case 'Today':
                startDate = moment();
                endDate = moment();
                break;
            case 'Yesterday':
                startDate = moment().subtract(1, 'days');
                endDate = moment().subtract(1, 'days');
                break;
            case 'Last 7 Days':
                startDate = moment().subtract(6, 'days');
                endDate = moment();
                break;
            case 'Last 30 Days':
                startDate = moment().subtract(29, 'days');
                endDate = moment();
                break;
            case 'This Month':
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
                break;
            case 'Last Month':
                startDate = moment().subtract(1, 'month').startOf('month');
                endDate = moment().subtract(1, 'month').endOf('month');
                break;
        }
        cb(startDate, endDate);
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
    var dateParts = date.split("-");
    var startdate = dateParts[0];
    var enddate = dateParts[1];
    var tr = "<tr> \
                <th>Sno</th>\
                <th>Name</th>\
                <th>Visits</th>\
                <th>Download</th>\
                <th>MonthlyVisit</th>\
             </tr>";

    $reportDatatable.find("thead, tfoot").empty().append(tr);

    var url = "/Reports/MethodGetFieldofficersReports";
    var data = JSON.stringify({ startdate: startdate, enddate: enddate, type: type });
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        var i = 1;
        var ParseResult = JSON.parse(JsonResult).table;

        cdate = ParseResult[0].currentdate;
        month = ParseResult[0].currentmonth;
        $reportDatatable.DataTable().clear().destroy();
        $reportDatatable.DataTable({
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
            ],
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
            ]
        });
    } else {
        $reportDatatable.DataTable().clear().destroy();
        $reportDatatable.DataTable();
    }
}

$employeeType.change(function () {
    var type = $employeeType.val();
    var date = $reportrangeSpan.text();
    GetDatabydaterange(date, type)
});
