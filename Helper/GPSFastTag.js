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
        minDate: moment('2024-02-01'), // Set the minimum selectable date
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
            <th>S.No</th>\
            <th>Name</th>\
            <th>Vehicle No</th>\
            <th>Mobile Number</th>\
            <th>Code</th>\
            <th>Product Category</th>\
            <th>Product Name</th>\
            <th>Service Provider</th>\
            <th>MRP</th>\
            <th>Qty</th>\
            <th>Discount Amount</th>\
            <th>Amount</th>\
            <th>Address Line 1</th >\
            <th>City</th>\
            <th>State</th>\
            <th>Pincode</th>\
            <th>Created By</th>\
            <th>Created Date</th>\
           </tr > ";

    $reportDatatable.find("thead, tfoot").empty().append(tr);

    var url = "/GPSandFastTag/GPSandFastTag";
    var data = JSON.stringify({ startdate: startdate, enddate: enddate });
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
                { data: null, render: function (data, type, row) { return "<div>" + i++ + "</div>"; } },
                { data: 'name', render: function (data, type, row) { return "<div>" + row['name'] + "</div>"; } },
               
                { data: 'vehicleno', render: function (data, type, row) { return "<div>" + row['vehicleno'] + "</div>"; } },
                { data: 'mobilenumber', render: function (data, type, row) { return "<div>" + row['mobilenumber'] + "</div>"; } },
                { data: 'code', render: function (data, type, row) { return "<div>" + row['code'] + "</div>"; } },
                { data: 'product category', render: function (data, type, row) { return "<div>" + row['productcategory'] + "</div>"; } },
                { data: 'product name', render: function (data, type, row) { return "<div>" + row['productname'] + "</div>"; } },
                { data: 'serviceprovider', render: function (data, type, row) { return "<div>" + row['serviceprovider'] + "</div>"; } },
                { data: 'mrp', render: function (data, type, row) { return "<div>" + row['mrp'] + "</div>"; } },
                { data: 'qty', render: function (data, type, row) { return "<div>" + row['qty'] + "</div>"; } },
                { data: 'discountamount', render: function (data, type, row) { return "<div>" + row['discountamount'] + "</div>"; } },
                { data: 'amount', render: function (data, type, row) { return "<div>" + row['amount'] + "</div>"; } }, 
                { data: 'addressline1', render: function (data, type, row) { return "<div>" + row['addressline1'] + "</div>"; } },
                { data: 'city', render: function (data, type, row) { return "<div>" + row['city'] + "</div>"; } },
                { data: 'state', render: function (data, type, row) { return "<div>" + row['state'] + "</div>"; } },
                { data: 'pincode', render: function (data, type, row) { return "<div>" + row['pincode'] + "</div>"; } },
                { data: 'createdby', render: function (data, type, row) { return "<div>" + row['createdby'] + "</div>"; } },
                { data: 'createddate', render: function (data, type, row) { return "<div>" + row['createddate'] + "</div>"; } }
              
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
