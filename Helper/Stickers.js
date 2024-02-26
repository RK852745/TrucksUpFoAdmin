$(function () {

    var start = moment();  //moment().subtract(29, 'days');
    var end = moment();
    cdate = start.format('YYYY/MM/D');
    month = start.format('MM/YYYY');
    function cb(start, end) {
        $('#reportrange span').html(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
         //GetDatabydaterange(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
        GetDatatbleDatafromServerSide(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
        GetCounts(start.format('YYYY/MM/D'), end.format('YYYY/MM/D'))
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
//function GetDatabydaterange(date) {
//    date = date.split("-");
//    var startdate = date[0];
//    var enddate = date[1];
//    var tr = '<tr> \
//            <th></th>\
//            <th>FullName</th>\
//            <th>Driver Number</th>\
//            <th>Operator Number</th>\
//            <th>Downloads</th>\
//            <th>StickerImage</th>\
//            <th>Lane</th>\
//            <th>Vehicle Info</th>\
//            <th>DoneBy</th>\
//            <th>VerifiedStatus</th>\
//             <th>VerifiedBy</th>\
//             <th>CreatedDate</th>\
//             <th></th>\
//            </tr>';

//    $("#reportDatatable thead").empty();
//    $("#reportDatatable tfoot").empty();
//    $("#reportDatatable thead").append(tr);
//    $("#reportDatatable tfoot").append(tr);

//    var url = "/Reports/MethodGetStickerData";
//    var data = JSON.stringify({ startdate: startdate, enddate: enddate });
//    var JsonResult = doAjax(url, data);
//    if (JsonResult != "") {
//        var i = 1;
//        var ParseResult =  JsonResult;
//      $("#TotalStickerVists").val(JsonResult.length); 
//        $("#reportDatatable").DataTable().clear().destroy();
//        $("#reportDatatable").DataTable(
//            {
//                bLengthChange: true,
//                lengthMenu: [[10, 15, -1], [10, 15, "All"]],
//                bFilter: true,
//                bSort: true,
//                bPaginate: true,
//                dom: 'Bfrtip',
//                data: ParseResult,
//                stateSave: true,
//                columns: [
//                    {
//                        render: function (data, type, row) {
//                            return "<div>" + i++ + "</div>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) {
//                            return "<div>" + row.fullname + "</div>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) {

//                            return "<div>" + row.drivernumber + "</div>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) {

//                            return "<div>" + row.operatornumber + "</div>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) {
//                            return "<div>" + row.downloads + "</div>";
//                        }
//                    }, 
//                    {
//                        render: function (data, type, row) {
//                            return "<a onclick='fnviewstickerimage($(this))' class='btn btn-primary btn-sm text-white' dataimg='" + row.stickerimage + "'>View Image</a>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) {
//                            return "<div>" + row.lanefrom + "-" + row.laneto + "</div>";
//                        }
//                    }
//                    ,
//                    {
//                        render: function (data, type, row) {
//                            return "<a onclick='fnGetvehicleinfo($(this))' vinfo='" + row.vehicletype + "|" + row.vehiclesize + "|" + row.vehiclecapacity + "|" + row.vechilenumber + "' class='btn btn-primary btn-sm text-white' style='text-transform: uppercase;'>" + row.vechilenumber + "&nbsp;<i class='fa fa-info-circle'></i></a>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) {
//                            return "<div>" + row.doneby + "</div>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) {
//                            var status = '<span class="badge bg-success">verified</span>';
//                            if (row.verifiedstatus == 'False' && row.verifiedby == "") {
//                                status = '<span class="badge bg-warning"><i class="fa fa-times-circle"></i> not verified</span>';
//                            }
//                            else if (row.verifiedstatus == 'False' && row.verifiedby != "") {
//                                status = '<span class="badge bg-danger"><i class="fa fa-times-circle"></i> rejected </span>';
//                            }
//                            return "<div>" + status + "</div>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) {
//                            return "<div>" + row.verifiedby + "</div>";
//                        }
//                    }
//                    ,
//                    {
//                        render: function (data, type, row) {
//                            return "<div>" + row.createddate + "</div>";
//                        }
//                    },
//                    {
//                        render: function (data, type, row) { 
//                            if (row.verifiedstatus == 'False' && row.verifiedby == "") {
//                                return "<a onclick='fnmarkverifiedbtn($(this)," + row.id + ");' class='btn btn-sm btn-success text-white'><i class='fa fa-check-circle'></i>&nbsp;Mark Verified</a>";
//                            }
//                            return "";
//                        }
//                    }
//                ],
//                buttons: [
//                    'copyHtml5',
//                    'excelHtml5',
//                    'csvHtml5',
//                    'pdfHtml5'
//                ]
//            });
//    } else {
//        $("#reportDatatable").DataTable().clear().destroy();
//        $("#reportDatatable").DataTable();
//    }
//}
 
function fnGetvehicleinfo(current) {
    $("#staticBackdropLabel").text('Vehicle image');
    var vinfo = current.attr("vinfo");
    var info = vinfo.split("|");
    var vehicletype = info[0], vehiclesize = info[1], vehiclecapacity = info[2], vechilenumber = info[3];

    var datais = "<div class='table-responsive'><table class='table'>\
    <thead>\
    <tr><th>Vehicle Type</th><th>Vehicle Size</th><th>Vehicle Capacity</th><th>Vechile Number</th></tr>\
    </thead>\
     <tbody>\
     <tr><td>"+ vehicletype + "</td><td>" + vehiclesize + "</td><td>" + vehiclecapacity + "</td><td>" + vechilenumber + "</td></tr>\
     </tbody>\
    </table></div>";
    $("#staticBackdrop .modal-body").empty();
    $("#staticBackdrop .modal-body").append(datais);
    $("#staticBackdrop").modal('show');
}

//function fnviewstickerimage(current) {
//    $("#staticBackdropLabel").text('Sticker image');
//    var str = current.attr('dataimg');
//    str.slice(0, -1);
//    if (str.indexOf(',') != -1) {
//        var segments = str.split(',');
//        var img = '';
//        for (var i = 0; segments.length > i; i++) {
//            if (segments[i]!="") {
//                img = img + '<div class="col-sm-6"><img style="width:100%;height: 100%;" src="http://api.ritcologistics.com/TrucksUpFO/uploadedimages/' + segments[i] + '" alt=""/></div>';
//            }
           
//        }
//        $("#staticBackdrop .modal-body").empty();
//        $("#staticBackdrop .modal-body").append("<div class='row'>" + img + "</div>");
//        $("#staticBackdrop").modal('show');
//    } else {
//        var image = '<img style="width:100%;height: 100%;" src="http://api.ritcologistics.com/TrucksUpFO/uploadedimages/' + current.attr('dataimg') + '" alt=""/>';
//        $("#staticBackdrop .modal-body").empty();
//        $("#staticBackdrop .modal-body").append(image);
//        $("#staticBackdrop").modal('show');
//    }


//}



function jsonAjax(url, Data) {
    var Result = '';
    $.ajax({
        'async': false,
        type: "POST",
        url: url,
        contentType: 'application/json',
        dataType: "jsonp",
        data: Data,
        success: function (response) {
            Result = response;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == '200') {
                Result = jqXHR.responseText;
            }
        }
    })
    return Result;
}

 //function makeAjaxRequest(url, Data) {
//    var Result; // Initialize the variable to store the result

//    // Make the AJAX request using jQuery
//    $.ajax({
//        url: url,
//        contentType: 'application/json',
//        dataType: "json",
//        data: Data,
//        success: function (response) {
//            Result = response; // Store the response in the Result variable on success
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            if (jqXHR.status == 200) {
//                Result = jqXHR.responseText; // Store the responseText on error if the status is 200
//            }
//        }
//    });

//    return Result; // Return the result (Note: This may not be immediately available due to the asynchronous nature of AJAX)
//}

 

//function GetDatatbleDatafromServerSide(date) {
//    date = date.split("-");
//    var startdate = date[0];
//    var enddate = date[1];
//    var i = 1;
//    var tr = '<tr> \
//            <th></th>\
//            <th>FullName</th>\
//            <th>Driver Number</th>\
//            <th>Operator Number</th>\
//            <th>Downloads</th>\
//            <th>StickerImage</th>\]\
//            <th>Lane</th>\
//            <th>Vehicle Info</th>\
//            <th>DoneBy</th>\
//            <th>VerifiedStatus</th>\
//             <th>VerifiedBy</th>\
//             <th>CreatedDate</th>\
//             <th></th>\
//            </tr>';

//    $("#reportDatatable thead").empty();
//    $("#reportDatatable tfoot").empty();
//    $("#reportDatatable thead").append(tr);
//    $("#reportDatatable tfoot").append(tr);
//    $("#reportDatatable").DataTable().clear().destroy();
//    $('#reportDatatable').DataTable({
        
//        serverSide: true,
//        processing: true, 
//        zx: {
//            url: '/Reports/MethodGetStickerData',
//            type: 'POST',
//            "data": function (d) {
//                d.startdate = startdate;
//                d.enddate = enddate;
//            }
//        },
//        columns: [
//            {
//                render: function (data, type, row) {
//                    return "<div>" + i++ + "</div>";
//                }
//            },
//            {
//                render: function (data, type, row) {
//                    return "<div>" + row.fullname + "</div>";
//                }
//            },
//            {
//                render: function (data, type, row) {

//                    return "<div>" + row.drivernumber + "</div>";
//                }
//            },
//            {
//                render: function (data, type, row) {

//                    return "<div>" + row.operatornumber + "</div>";
//                }
//            },
//            {
//                render: function (data, type, row) {
//                    return "<div>" + row.downloads + "</div>";
//                }
//            },
//            {
//                render: function (data, type, row) {
//                    return "<a onclick='fnviewstickerimage($(this))' class='btn btn-primary btn-sm text-white' dataimg='" + row.stickerimage + "'>View Image</a>";
//                }
//            },
//            {
//                render: function (data, type, row) {
//                    return "<div>" + row.lanefrom + "-" + row.laneto + "</div>";
//                }
//            }
//            ,
//            {
//                render: function (data, type, row) {
//                    return "<a onclick='fnGetvehicleinfo($(this))' vinfo='" + row.vehicletype + "|" + row.vehiclesize + "|" + row.vehiclecapacity + "|" + row.vechilenumber + "' class='btn btn-primary btn-sm text-white' style='text-transform: uppercase;'>" + row.vechilenumber + "&nbsp;<i class='fa fa-info-circle'></i></a>";
//                }
//            },
//            {
//                render: function (data, type, row) {
//                    return "<div>" + row.doneby + "</div>";
//                }
//            },
//            {
//                render: function (data, type, row) {
//                    var status = '<span class="badge bg-success">verified</span>';
//                    if (row.verifiedstatus == '0' && row.verifiedby == "") {
//                        status = '<span class="badge bg-warning"><i class="fa fa-times-circle"></i> not verified</span>';
//                    }
//                    else if (row.verifiedstatus == '0' && row.verifiedby != "") {
//                        status = '<span class="badge bg-danger"><i class="fa fa-times-circle"></i> rejected </span>';
//                    }
//                    return "<div>" + status + "</div>";
//                }
//            },
//            {
//                render: function (data, type, row) {
//                    return "<div>" + row.verifiedby + "</div>";
//                }
//            }
//            ,
//            {
//                render: function (data, type, row) {
//                    return "<div>" + row.createddate + "</div>";
//                }
//            },
//            {
//                render: function (data, type, row) {
//                    if (row.verifiedstatus == '0' && row.verifiedby == "") {
//                        return "<a onclick='fnmarkverifiedbtn($(this)," + row.id + ");' class='btn btn-sm btn-success text-white'><i class='fa fa-check-circle'></i>&nbsp;Mark Verified</a>";
//                    }
//                    return "";
//                }
//            }
//        ], 
//    });
//} 

function GetCounts(startdate, enddate) {
    var url = "/Reports/GetCountsByDateRange";
    var data = JSON.stringify({ startdate: startdate, enddate: enddate });
    var Result = doAjax(url, data);
    if (Result != "") {
        $("#TotalStickerVists").val(Result);

    } else {
        $("#TotalStickerVists").val('0');
    }

    }

    function GetDatatbleDatafromServerSide(date) {
    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    var i = 1;
    var tr = '<tr> \
            <th></th>\
            <th>FullName</th>\
            <th>Driver Number</th>\
            <th>Operator Number</th>\
            <th>Downloads</th>\
            <th>StickerImage</th>\
            <th>StickerSize</th>\
            <th>Lane</th>\
            <th>Vehicle Info</th>\
            <th>DoneBy</th>\
            <th>VerifiedStatus</th>\
            <th>VerifiedBy</th>\
           <th>CreatedDate</th>\
            <th></th>\
            </tr>';
        //<th>CreatedDate</th>\
    $("#reportDatatable thead").empty();
    $("#reportDatatable tfoot").empty();
    $("#reportDatatable thead").append(tr);
    $("#reportDatatable tfoot").append(tr);
    $("#reportDatatable").DataTable().clear().destroy();
    $('#reportDatatable').DataTable({
        
        serverSide: true,
        processing: true,
        searching: true,

        ajax: {
            url: '../Reports/MethodGetStickerData',
            //url: '/TrucksupfoAdmin/Reports/MethodGetStickerData',
            type: 'POST',
            "data": function (d) {
                d.startdate = startdate;
                d.enddate = enddate;
            }
        },
        columns: [
            {
                render: function (data, type, row) {
                    return "<div>" + i++ + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div>" + row.fullname + "</div>";
                }
            },
            {
                render: function (data, type, row) {

                    return "<div>" + row.drivernumber + "</div>";
                }
            },
            {
                render: function (data, type, row) {

                    return "<div>" + row.operatornumber + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div>" + row.downloads + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<a onclick='fnviewstickerimage($(this))' class='btn btn-primary btn-sm text-white' dataimg='" + row.stickerimage + "'>View Image</a>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div>" + row.stickersize + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div>" + row.lanefrom + "-" + row.laneto + "</div>";
                }
            }
            ,
            //{
            //    render: function (data, type, row) {
            //        return "<a onclick='fnGetvehicleinfo($(this))' vinfo='" + row.vehicletype + "|" + row.vehiclesize + "|" + row.vehiclecapacity + "|" + row.vechilenumber + "' class='btn btn-primary btn-sm text-white' style='text-transform: uppercase;'>" + row.vechilenumber + "&nbsp;<i class='fa fa-info-circle'></i></a>";
            //    }
            //},
            {
                render: function (data, type, row) {
                    return "<a onclick='fnGetvehicleinfo($(this))' vinfo='" + row.vehicletype + "|" + row.vehiclesize + "|" + row.vehiclecapacity + "|" + row.vechilenumber + "' class='btn btn-primary btn-sm' style='background-color: #FFD700; color: black; border: 1px solid black; border-radius: 5px; text-transform: uppercase; width: 100px;'>" + row.vechilenumber + "</a>";
                }
            }
,

            {
                render: function (data, type, row) {
                    return "<div>" + row.doneby + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    var status = '<span class="badge bg-success">verified</span>';
                    if (row.verifiedstatus == '0' && row.verifiedby == "") {
                        status = '<span class="badge bg-warning" style="color-black;"><i class="fa fa-times-circle"></i> not verified</span>';
                    }
                    else if (row.verifiedstatus == '0' && row.verifiedby != "") {
                        status = '<span class="badge bg-danger"><i class="fa fa-times-circle"></i> rejected </span>';
                    }
                    return "<div>" + status + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div>" + row.verifiedby + "</div>";
                }
            }
            ,
            {
                render: function (data, type, row) {
                    return "<div>" + row.createddate + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    if (row.verifiedstatus == '0' && row.verifiedby == "") {
                        return "<a onclick='fnmarkverifiedbtn($(this)," + row.id + ");' class='btn btn-sm btn-success text-white'><i class='fa fa-check-circle'></i>&nbsp;Mark Verified</a>";
                    }
                    return "";
                }
            }
        ], 

    });
} 

function GetDatabydaterange(date) {
    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    var tr = '<tr> \
            <th></th>\
            <th>FullName</th>\
            <th>Driver Number</th>\
            <th>Operator Number</th>\
            <th>Downloads</th>\
            <th>StickerImage</th>\
            <th>StickerSize</th>\
            <th>Lane</th>\
            <th>Vehicle Info</th>\
            <th>DoneBy</th>\
            <th>VerifiedStatus</th>\
            <th>VerifiedBy</th>\
           <th>CreatedDate</th>\
            < th ></th>\
            </tr>';
    $("#reportDatatable thead").empty();
    $("#reportDatatable tfoot").empty();
    $("#reportDatatable thead").append(tr);
    $("#reportDatatable tfoot").append(tr);

    var url = "/Reports/MethodGetStickerData";
    var data = JSON.stringify({ startdate: startdate, enddate: enddate });
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        var i = 1;
        var ParseResult = JsonResult;
        $("#TotalStickerVists").val(JsonResult.length); 
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
                stateSave: true,
                columns: [
                    {
                        render: function (data, type, row) {
                            return "<div>" + i++ + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.fullname + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.drivernumber + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.operatornumber + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.downloads + "</div>";
                        }
                    }, 
                    {
                        render: function (data, type, row) {
                            return "<a onclick='fnviewstickerimage($(this))' class='btn btn-primary btn-sm text-white' dataimg='" + row.stickerimage + "'>View Image</a>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.stickersize + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.lanefrom + "-" + row.laneto + "</div>";
                        }
                    }
                    ,
                    {
                        render: function (data, type, row) {
                            return "<a onclick='fnGetvehicleinfo($(this))' vinfo='" + row.vehicletype + "|" + row.vehiclesize + "|" + row.vehiclecapacity + "|" + row.vechilenumber + "' class='btn btn-primary btn-sm text-white' style='text-transform: uppercase;'>" + row.vechilenumber + "&nbsp;<i class='fa fa-info-circle'></i></a>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.doneby + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            var status = '<span class="badge bg-success">verified</span>';
                            if (row.verifiedstatus == '0' && row.verifiedby == "") {
                                status = '<span class="badge bg-warning"><i class="fa fa-times-circle"></i> not verified</span>';
                            }
                            else if (row.verifiedstatus == '0' && row.verifiedby != "") {
                                status = '<span class="badge bg-danger"><i class="fa fa-times-circle"></i> rejected </span>';
                            }
                            return "<div>" + status + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.verifiedby + "</div>";
                        }
                    }
                    ,
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.createddate + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.stickersize + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) { 
                            if (row.verifiedstatus == '0' && row.verifiedby == "") {
                                return "<a onclick='fnmarkverifiedbtn($(this)," + row.id + ");' class='btn btn-sm btn-success text-white'><i class='fa fa-check-circle'></i>&nbsp;Mark Verified</a>";
                            }
                            return "";
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


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("Searchbox");
    const dataTable = document.getElementById("reportDatatable");
    const tableRows = dataTable.getElementsByTagName("tr");

     
    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();

        
        for (let i = 1; i < tableRows.length; i++) {
            const row = tableRows[i];
            const rowData = row.getElementsByTagName("td");

            let foundMatch = false;

            
            for (let j = 0; j < rowData.length; j++) {
                const cellData = rowData[j].textContent.toLowerCase();

                if (cellData.includes(searchTerm)) {
                    foundMatch = true;
                    break;
                }
            }

             
            if (foundMatch) {
                row.style.display = "table-row";  
            } else {
                row.style.display = "none";  
            }
        }
    });
});




function fnviewstickerimage(current) {
    $("#staticBackdropLabel").text('Sticker image');
    var str = current.attr('dataimg');
    var segments = str.split(',');

    // Create a variable to store the HTML for all images
    var imagesHtml = '';

    var imagesFound = false; // Flag to track if any images were found

    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i].trim(); // Remove any leading/trailing spaces
        var apiUrl = '';

        // Check if the filename matches the pattern "07102023104918277_image.jpg"
        if (segment.match(/\d{17}_image\.jpg/)) {

            apiUrl = 'https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=' + segment;

            if (apiUrl != null)
            {
                apiUrl = 'https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=' + segment;
                //apiUrl = 'https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=' + segment + '&Position=2';
            }
            
        } else {
            // Handle other image names
            apiUrl = 'http://api.ritcologistics.com/TrucksUpFO/uploadedimages/' + segment;
        }


        var image = '<div class="col-sm-6"><img class="zoomable-image" style="width:100%;height: 100%;" src="' + apiUrl + '" alt=""/></div>';


        imagesHtml += image;


        imagesFound = true;
    }

    // Clear the modal body and append all the images or a message
    $("#staticBackdrop .modal-body").empty();

    if (imagesFound) {
        $("#staticBackdrop .modal-body").append("<div class='row'>" + imagesHtml + "</div>");
    } else {
        $("#staticBackdrop .modal-body").text("Image not available");
    }

    $("#staticBackdrop").modal('show');
}




