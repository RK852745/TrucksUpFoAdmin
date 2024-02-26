
$(function () {
    GetUserList();
    var start = moment();  //moment().subtract(29, 'days');
    var end = moment();
    cdate = start.format('YYYY/MM/D');
    month = start.format('MM/YYYY');
    function cb(start, end) {
        $('#reportrange span').html(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
        //GetDataForverification(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'), $('#status option:selected').val(), '')
        GetDataForverificationNew(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'), $('#status option:selected').val(), '');
        GetTotalCounts(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'), $('#status option:selected').val(), '');


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

function GetTotalCounts(date) {
    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    var url = "/Verification/MethodGetcounts";
    var data = JSON.stringify({ startdate: startdate, enddate: enddate });
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        debugger;
        var Parseresult = JSON.parse(JsonResult).table;
        $('#TotalSticker').text(Parseresult[0].estimatedcount);
        $('#VerifiedSticker').text(Parseresult[0].totalapprovedcount);       
        $('#RejectedSticker').text(Parseresult[0].totalrejectedcount);
        $('#OvUnverified').text(Parseresult[0].overallunveified);

        $('#Estimatedcost').text(Parseresult[0].estimatedcost);
        $('#EstimatedSmallCost').text(Parseresult[0].totalsmallcost);
        $('#EstimatedMediumCost').text(Parseresult[0].totalmediumcost);
        $('#EstimatedLargeCost').text(Parseresult[0].totallargecost);

        $('#Approvedcost').text(Parseresult[0].totalapprovecost);
        $('#ApprovedSmallCost').text(Parseresult[0].approvedsmallcost);
        $('#ApprovedMediumCost').text(Parseresult[0].approvedmediumcost);
        $('#ApprovedLargeCost').text(Parseresult[0].approvedlargecost);
       

        $('#Rejectecost').text(Parseresult[0].totalrejectcost);
        $('#RejectedSmallCost').text(Parseresult[0].rejectedsmallcost)
        $('#RejectedMediumCost').text(Parseresult[0].rejectedmediumcost)
        $('#RejectedLargeCost').text(Parseresult[0].rejectedlargecost)


        $('#ApprovedSmallCount').text(Parseresult[0].approvedsmallcount);
        $('#ApprovedMediumCount').text(Parseresult[0].approvedmediumcount);
        $('#ApprovedLargeCount').text(Parseresult[0].approvedlargecount);

        $('#RejectedSmallCount').text(Parseresult[0].rejectedsmallcount);
        $('#RejectedMediumCount').text(Parseresult[0].rejectedmediumcount);
        $('#RejectedLargeCount').text(Parseresult[0].rejectedlargecount);

        $('#TotalSmallCount').text(Parseresult[0].totalsmallcount);
        $('#TotalMediumCount').text(Parseresult[0].totalmediumcount);
        $('#TotalLargeCount').text(Parseresult[0].totallargecount);
    }
}


function GetDataForverification(date, status, doneby) {
    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    
    var tr = '<tr> \
            <th>Sr No</th>\
            <th>Status</th>\
            <th>Name</th>\
            <th>Driver No.</th>\
            <th>Operator No.</th>\
            <th>Sticker Image</th>\
            <th>Download Image</th>\
            <th>Sticker Count</th>\
            <th>Sticker Size</th>\
            <th>Vechile Details</th>\
            <th>Lane From-To</th>\
            <th>Done by</th>\
            <th>Verified by</th>\
            <th>Verified on</th>\
            <th>Verify</th>\
             <th>Action</th>\
            </tr>';

    $("#reportDatatable thead").empty();
    $("#reportDatatable tfoot").empty();
    $("#reportDatatable thead").append(tr);
    $("#reportDatatable tfoot").append(tr);

    var url = "/Verification/MethodGetDataforverification";
    var data = JSON.stringify({ startdate: startdate, enddate: enddate, doneby: doneby, status: status });
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
                            var status = '<span class="badge bg-success"><i class="fa fa-check-circle"></i> verified</span>';
                            if (row.verifiedstatus == false && row.verifiedby == "") {
                                status = '<span class="badge bg-warning" style="color:black;"><i class="fa fa-times-circle"></i> not verified</span>';
                            }
                            else if (row.verifiedstatus == false && row.verifiedby != "") {
                                status = '<span class="badge bg-danger"><i class="fa fa-times-circle"></i> rejected </span>';
                            }
                            return "<div>" + status + "</div>";
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
                            return "<div class='btn btn-sm btn-primary' onclick='fnviewstickerimage($(this))' dataimg='" + row.stickerimage + "'>View <i class='fa fa-image'></i></div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            var data = row.stickerimage;
                            var a = "";
                            for (var i = 0; data.length > i; i++) {
                                a = a + '<a href="https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=' + data[i] + '">https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=' + data[i] + '</a>';
                            }

                            return a;
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.stickersize + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            var d = '';
                            if (row.stickerdimension != "undefined" && row.stickerdimension != "") {
                                var size = row.stickerdimension.split("|");
                                for (var s = 0; size.length > s; s++) {
                                    if (size[s] != "") {
                                        d = d + "<span class='sizebox badge bg-info'>" + size[s] + "</span>&nbsp;&nbsp;";
                                    }

                                }
                            }

                            return "<div>" + d + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div class='numberplate' onclick='fnGetvehicleinfo($(this))' vinfo='" + row.vehicletype + "|" + row.vehiclesize + "|" + row.vehiclecapacity + "|" + row.vechilenumber + "'><div class='innerplate'>" + row.vechilenumber + "</div></div>";
                        }
                    },

                    {
                        render: function (data, type, row) {
                            return "<div><span class='badge bg-info'><i class='fa fa-map-marker'></i> " + row.lanefrom + "</span> -- <span class='badge bg-info'><i class='fa fa-map-marker'></i>  " + row.laneto + "</span></div>";
                        }
                    }
                    ,
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.doneby + "</div>";
                        }
                    }
                    ,
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.verifiedby + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.modifieddate + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            var ret = '';
                            if (row.verifiedstatus == false && row.verifiedby == "") {
                                ret = "<div class='btn btn-sm btn-primary'  onclick='fnmarkverifiedbtn($(this)," + row.id + ");'>Mark Verified</div>";
                            }
                            return ret;
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div class='btn btn-sm btn-primary'  onclick='fnEditbtn($(this)," + row.id + ");'>Mark Verified</div>";
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

function GetUserList() {
    var url = "/Verification/MethodGetFieldofficers";
    var data = {};
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        var ParseResult = JSON.parse(JsonResult).table;

        // Sort the ParseResult array alphabetically by the 'name' property
        ParseResult.sort(function (a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            return nameA.localeCompare(nameB);
        });

        var options = "";
        for (var i = 0; ParseResult.length > i; i++) {
            options = options + '<option executiveid="' + ParseResult[i].executiveid + '" value="' + ParseResult[i].userid + '">' + ParseResult[i].name + '</option>';
        }
        //var selectlist = "<label class='mb-0'>Filter by user</label><select class='form-control' id='FoLists'><option selected value=''>--Select Field Officer--</option>"   + options + "</select>"
        var searchInput = '<input type="text" id="nameSearch" class="form-control" placeholder="Search by name" autocomplete="off">';

        var selectlist = "<label class='mb-0'>Filter by user</label><select class='form-control' id='FoLists'><option selected value=''>--Select Field Officer--</option>" + options + "</select>"
        $("#EmployeeType").empty();
        $("#EmployeeType").append(selectlist);

        $("#FoLists").change(function () {
            GetDataForverificationNew($("#reportrange span").text(), $('#status option:selected').val(), $('#FoLists option:selected').val())
        });
    }
}

function fnmarkverifiedbtn(current, id) {
    $("#staticBackdrop2").modal('show');
    $("#btnsubmitverification").attr('onclick', 'UpdateStatusverified(' + id + ',$(this))');

    // Clear the form field and remove the classes when the modal is shown
    $('#exampleFormControlTextarea1').val('');
    $('#approvebtn').removeClass('Abtnactive');
    $('#rejectbtn').removeClass('Rbtnactive');

    // Add click handler for the "Close" button to clear the form field and remove the classes
    $('[data-dismiss="modal"]').click(function () {
        $('#exampleFormControlTextarea1').val('');
        $('#approvebtn').removeClass('Abtnactive');
        $('#rejectbtn').removeClass('Rbtnactive');
    });
}

function UpdateStatusverified(id, current) {
    var status = $('.btnactive').attr('status');
    var comments = $('#exampleFormControlTextarea1').val();

    if (typeof (status) === "undefined") {
        Swal.fire('Saved!', 'Please select status approve or reject ', 'warning');
        return;
    }

    var url = "/Verification/Methodupdatestatus";
    var data = JSON.stringify({ id: id, status: status, comments: comments });
    var JsonResult = doAjax(url, data);

    if (JsonResult != "") {
        var parse = JSON.parse(JsonResult).table;
        $("#staticBackdrop2").modal('hide');
        Swal.fire('Saved!', parse[0].result, 'success')
        // Set the DataTable to the saved page
        table.page(currentPage - 1).draw(false);
        //GetDataForverificationNew($("#reportrange span").text(), $('#status option:selected').val(), $('#FoLists option:selected').val())

        // Clear the form field and remove the classes after it's submitted
        $('#exampleFormControlTextarea1').val('');
        $('#approvebtn').removeClass('Abtnactive');
        $('#rejectbtn').removeClass('Rbtnactive');
    }
}

function fnGetvehicleinfo(current) {
    $("#staticBackdropLabel").text('Vehicle Info');
    var vinfo = current.attr("vinfo");
    var info = vinfo.split("|");
    var vehicletype = info[0], vehiclesize = info[1], vehiclecapacity = info[2], vechilenumber = info[3];

    var datais = "<div class='table-responsive'><table class='table'>\
    <thead>\
    <tr><th>Vechile Number</th><th>Vehicle Type</th><th>Vehicle Size</th><th>Vehicle Capacity</th></tr>\
    </thead>\
     <tbody>\
     <tr><td> <div class='numberplate'><div class='innerplate'>" + vechilenumber + "</div></div></td><td>" + vehicletype + "</td><td>" + vehiclesize + "</td><td>" + vehiclecapacity + "</td></tr>\
     </tbody>\
    </table></div>";
    $("#staticBackdrop #images").empty();
    $("#staticBackdrop #images").append(datais);
    $("#staticBackdrop").modal('show');
}

$("#status").change(function () {
    GetDataForverificationNew($("#reportrange span").text(), $('#status option:selected').val(), $('#FoLists option:selected').val())
});

$(".verif__btn").click(function () {
    $(".verif__btn").removeClass('btnactive');
    if ($(this).hasClass('approvebtn')) {
        $(this).addClass('btnactive');
        $(this).addClass('Abtnactive');
        $(".verif__btn").removeClass('Rbtnactive');
    }
    else {
        $(this).addClass('btnactive');
        $(this).addClass('Rbtnactive');
        $(".verif__btn").removeClass('Abtnactive');
    }
});

//this is verufication for admin side 
var currentPage = 1;
var table;
  function GetDataForverificationNew(date, status, doneby) {
    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    var i = 1;
    var tr = '<tr> \
            <th>Sr No</th>\
            <th>Verify</th>\
            <th>Action</th>\
            <th>Status</th>\
            <th>Sticker Image</th>\
            <th>Download</th>\
            <th>Sticker Count</th>\
            <th>Sticker Size<div class="labeltext d-none" style="padding-left: 10px;"><small>Small</small>&nbsp;&nbsp;<small  style="padding-left: 15px;">Medium</small>&nbsp;&nbsp;<small  style="padding-left: 6px;">Large</small></div></th>\
            <th>Vechile Details</th>\
            <th>Name</th>\
            <th>Driver No.</th>\
            <th>Operator No.</th>\
            <th>Lane From-To</th>\
            <th>Done by</th>\
            <th>Verified by</th>\
            <th>Verified on</th>\
            <th>Uploading on</th>\
            <th>Approval Days</th>\
            </tr>';

    //<th>Uploading on</th>\
    // <th>Approval Days</th>\

    $("#reportDatatable thead").empty();
    $("#reportDatatable tfoot").empty();
    $("#reportDatatable thead").append(tr);
    $("#reportDatatable tfoot").append(tr);
    var imgurl = "";
    $("#reportDatatable").DataTable().clear().destroy();
    table = $('#reportDatatable').DataTable({
        serverSide: true,
        processing: true,
        searching: true,
        //dom: 'Bfrtip',
        ajax: {
            url: '/Verification/MethodGetDataforverification',
            //url: '/TrucksupfoAdmin/Verification/MethodGetDataforverification',
            type: 'POST',
            "data": function (d) {
                d.startdate = startdate;
                d.enddate = enddate;
                d.status = status;
                d.doneby = doneby;
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
                    var ret = '';
                    if (row.verifiedstatus == 'False' && row.verifiedby == "") {
                        ret = "<div class='btn btn-sm btn-primary'  onclick='fnmarkverifiedbtn($(this)," + row.id + ");'>Mark Verified</div>";
                    }
                    return ret;
                }
            },
            //{
            //    render: function (data, type, row) {
            //        return "<div class='btn btn-sm btn-primary editbtn'  onclick='fnEditbtn($(this)," + row.id + ");'>Edit</div>&nbsp;<div class='btn btn-sm btn-primary d-none savebtn'   onclick='fnsavebtn($(this)," + row.id + ");'>Save</div>&nbsp;<div class='btn btn-sm btn-primary d-none cancelbtn'  onclick='fncancelbtn($(this)," + row.id + ");'>Cancel</div>";
            //    }
            //},
            {
                render: function (data, type, row) {
                    var editButton = "";

                    // Check if the item is not verified or rejected
                    if (row.verifiedstatus === 'False' && row.verifiedby === "") {
                        editButton = "<div class='btn btn-sm btn-primary editbtn' onclick='fnEditbtn($(this)," + row.id + ");'>Edit</div>";
                    }

                    var saveButton = "<div class='btn btn-sm btn-primary d-none savebtn' onclick='fnsavebtn($(this)," + row.id + ");'>Save</div>";
                    var cancelButton = "<div class='btn btn-sm btn-primary d-none cancelbtn' onclick='fncancelbtn($(this)," + row.id + ");'>Cancel</div>";

                    return editButton + "&nbsp;" + saveButton + "&nbsp;" + cancelButton;
                }
            },


            {
                render: function (data, type, row) {
                    var statusoption = '<option modifiedby="1"  value="1">verified</option><option modifiedby="0" value="0">not verified</option><option modifiedby="2" value="0">rejected</option>';
                    var status = '<span class="badge bg-success"><i class="fa fa-check-circle"></i> verified</span>';
                    if (row.verifiedstatus == 'False' && row.verifiedby == "") {
                        status = '<span class="badge bg-warning" style="color:black;"><i class="fa fa-times-circle"></i> not verified</span>';
                        statusoption = '<option modifiedby="0" value="0">not verified</option><option modifiedby="1"  value="1">verified</option><option modifiedby="2" value="0">rejected</option>';
                    }
                    else if (row.verifiedstatus == 'False' && row.verifiedby != "") {
                        status = '<span class="badge bg-danger"><i class="fa fa-times-circle"></i> rejected </span>';
                        statusoption = '<option modifiedby="2" value="0">rejected</option><option modifiedby="0" value="0">not verified</option><option modifiedby="1"  value="1">verified</option>';
                    }
                    return "<div class='textdiv'>" + status + "</div><select style='border: 1px solid #ccc;border-radius: 5px;' class='verifystatus textinput d-none'>" + statusoption + "</select>";
                }
            },
            {
                render: function (data, type, row) {
                    imgurl = row.stickerimage;
                    return "<div class='btn btn-sm btn-primary imageloadfirst' onclick='fnviewstickerimage($(this))' actualimage='" + firstImageload(row.stickerimage) + "' dataimg='" + row.stickerimage + "'>View <i class='fa fa-image'></i></div>";

                }
            }, {
                render: function (data, type, row) {
                    var imgur = row.stickerimage;
                    imgur = imgur.split(',');
                    var a = "";
                    for (var i = 0; imgur.length > i; i++) {
                        var comma = "";
                        if (imgur.length > 1) {
                            comma = ",";
                        }
                        a = a + '<a target="_blank" href="https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=' + imgur[i] + '">Image ' + parseFloat(i + 1) + '</a>' + comma;
                    }

                    return a;
                }
            },
            {
                render: function (data, type, row) {
                    return "<div class='textdiv'>" + row.stickersize + "</div><input style='border: 1px solid #ccc;border-radius: 5px;width: 50px;' class='d-none stickersize textinput' value='" + row.stickersize + "'/>";
                }
            },
            {

                render: function (data, type, row) {
                    var d = '';
                    var small = '', medium = '', large = '';

                    if (row.stickerdimension !== "undefined" && row.stickerdimension !== "") {
                        var size = row.stickerdimension.split("|");

                        for (var s = 0; size.length > s; s++) {
                            if (size[s] !== "") {
                                d += "<span class='sizebox badge bg-info'>" + size[s] + "</span>&nbsp;&nbsp;";

                                var sDetails = size[s].split('-');

                                if (sDetails[1] == "Small") {
                                    small = sDetails[0];
                                } else if (sDetails[1] == "Medium") {
                                    medium = sDetails[0];
                                } else if (sDetails[1] == "Large") {
                                    large = sDetails[0];
                                }
                            }
                        }
                    }

                    return "<div class='textdiv'>" + d + "</div><div class='textinput d-none'>" +
                        "<input style='border: 1px solid #ccc;border-radius: 5px; width:40px;' class='d-none smallsize textinput' value='" + small + "'/>&nbsp;" +
                        "<input style='border: 1px solid #ccc;border-radius: 5px;width:40px;' class='d-none mediumsize textinput' value='" + medium + "'/>&nbsp;" +
                        "<input style='border: 1px solid #ccc;border-radius: 5px;width:40px;' class='d-none largesize textinput' value='" + large + "'/></div>";
                }
                 
            },
            {
                render: function (data, type, row) {
                    return "<div class='numberplate textdiv' onclick='fnGetvehicleinfo($(this))' vinfo='" + row.vehicletype + "|" + row.vehiclesize + "|" + row.vehiclecapacity + "|" + row.vechilenumber + "'><div class='innerplate'>" + row.vechilenumber + "</div></div><input style='border: 1px solid #ccc;border-radius: 5px;text-transform: uppercase;'  class='vechilenumber d-none textinput' value='" + row.vechilenumber + "'/>";
                }
            },

            {
                render: function (data, type, row) {
                    return "<div class='textdiv'>" + row.fullname + "</div><input style='border: 1px solid #ccc;border-radius: 5px;' class='d-none fullname textinput' value='" + row.fullname + "'/>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div class='textdiv'>" + row.drivernumber + "</div><input style='border: 1px solid #ccc;border-radius: 5px;' class='d-none drivernumber textinput' value='" + row.drivernumber + "'/>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div class='textdiv'>" + row.operatornumber + "</div><input style='border: 1px solid #ccc;border-radius: 5px;' class='d-none operatornumber textinput' value='" + row.operatornumber + "'/>";
                }
            },



            {
                render: function (data, type, row) {
                    return "<div><span class='badge bg-info'><i class='fa fa-map-marker'></i> " + row.lanefrom + "</span> -- <span class='badge bg-info'><i class='fa fa-map-marker'></i>  " + row.laneto + "</span></div>";
                }
            }
            ,
            {
                render: function (data, type, row) {
                    return "<div>" + row.doneby + "</div>";
                }
            }
            ,
            {
                render: function (data, type, row) {
                    return "<div>" + row.verifiedby + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div>" + row.modifieddate + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div>" + row.createddate + "</div>";
                }
            },
            {
                render: function (data, type, row) {
                    return "<div>" + row.approvelday + "</div>";
                }
            }

        ],
    });
    table.on('page.dt', function () {
        // Update the currentPage variable when the page changes
        currentPage = table.page.info().page + 1;
    });

    firstImageload(imgurl);
}


 function fnEditbtn(current) {
    var tr = current.closest('tr');
    tr.find('.textdiv').hide();
    tr.find('.textinput').removeClass('d-none');
    tr.find('.editbtn').addClass('d-none');
    tr.find('.savebtn').removeClass('d-none');
    tr.find('.cancelbtn').removeClass('d-none');
    $(".labeltext").removeClass('d-none');
}

  function fncancelbtn(current) {
    var tr = current.closest('tr');
    tr.find('.textdiv').show();
    tr.find('.textinput').addClass('d-none');
    tr.find('.editbtn').removeClass('d-none');
    tr.find('.savebtn').addClass('d-none');
    tr.find('.cancelbtn').addClass('d-none');
    $(".labeltext").addClass('d-none');
}


 function fnsavebtn(current, id) {
    var tr = current.closest('tr');

    tr.find('.textdiv').show();
    tr.find('.textinput').addClass('d-none');
    tr.find('.editbtn').removeClass('d-none');
    tr.find('.savebtn').addClass('d-none');
    tr.find('.cancelbtn').addClass('d-none');
    $(".labeltext").addClass('d-none');

    var status = tr.find('.verifystatus option:selected').val();
    var modifiedby = tr.find('.verifystatus option:selected').attr('modifiedby');
    var fullname = tr.find('.fullname').val();
    var drivernumber = tr.find('.drivernumber').val();
    var operatornumber = tr.find('.operatornumber').val();
    var stickersize = tr.find('.stickersize').val();
    var smallsize = tr.find('.smallsize').val();
    var mediumsize = tr.find('.mediumsize').val();
    var vechilenumber = tr.find('.vechilenumber').val();
    var largesize = tr.find('.largesize').val();

    var stickerdimension = "";

    if (smallsize !== null && smallsize !== "" && smallsize !== "0") {
        stickerdimension += smallsize + '-Small | ';
    }

    if (mediumsize !== null && mediumsize !== "" && mediumsize !== "0") {
        stickerdimension += mediumsize + '-Medium | ';
    }

    if (largesize !== null && largesize !== "" && largesize !== "0") {
        stickerdimension += largesize + '-Large';
    }

    if (stickerdimension.endsWith(' | ')) {
        stickerdimension = stickerdimension.slice(0, -3);
    }
    var size = parseInt((smallsize == "" ? 0 : smallsize)) + parseInt((mediumsize == "" ? 0 : mediumsize)) + parseInt((largesize == "" ? 0 : largesize));


    // var stickerdimension = smallsize + 'Small | ' + mediumsize + ' | ' + largesize;
    //var size = parseInt(parseInt(smallsize == "" ? 0 : smallsize) + parseInt(mediumsize == "" ? 0 : mediumsize) + parseInt(largesize == "" ? 0 : largesize));



    var url = "/Verification/MethodUpdateverificationData";
    //var url = "/TrucksupfoAdmin/Verification/MethodUpdateverificationData";

    var data = JSON.stringify({
        modifiedby: modifiedby,
        fullname: fullname,
        drivernumber: drivernumber,
        status: status,
        operatornumber: operatornumber,
        size: size,
        vechilenumber: vechilenumber,
        stickerdimension: stickerdimension,
        id: id
    });

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        contentType: 'application/json; charset=utf-8',
        success: function (JsonResult) {
            if (JsonResult != "") {
                Swal.fire('Saved!', JsonResult, 'success');

                // Set the DataTable to the saved page
                table.page(currentPage - 1).draw(false);
            } else {
                Swal.fire('Error!', 'Something went wrong', 'error');
            }
        },
        error: function () {
            Swal.fire('Error!', 'Something went wrong', 'error');
        }
    });
}

function fnviewstickerimage(current) {
    $("#staticBackdropLabel").text('Sticker image');
    var str = current.attr('dataimg');

    if (/\d{17}_image\.jpg/.test(str)) {
        var imgkey = str.split(',');
        var imageContainer = $("<div class='row'></div>");

        for (var i = 0; i < imgkey.length; i++) {
            if (imgkey[i] !== "") {
                var imageUrl = 'https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=' + imgkey[i];
                //var imageUrl = 'https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=' + imgkey[i] + '&Position=2';
                preloadImage(imageUrl);
                var image = $('<img width="300" height="300" src="' + imageUrl + '" alt=""/>');
                imageContainer.append(image);
            }
        }

        $("#staticBackdrop #images").empty().append(imageContainer);

        $("#staticBackdrop").modal('show');

        $(".images img").click(function () {
            $("#full-image").attr("src", $(this).attr("src"));
            $('#image-viewer').show();
        });

        $("#image-viewer .close").click(function () {
            $('#image-viewer').hide();
        });
    } else {
        // Handle the case when the image URL doesn't match the pattern
        $("#staticBackdropLabel").text('Sticker image');
        var segments = str.split(',');
        var img = '';
        for (var i = 0; i < segments.length; i++) {
            if (segments[i] != "") {
                img = img + '<img width="300" height="200" src="http://api.ritcologistics.com/TrucksUpFO/uploadedimages/' + segments[i] + '" alt=""/>';
            }
        }

        $("#staticBackdrop #images").empty().append("<div class='row'>" + img + "</div>");
        $("#staticBackdrop").modal('show');

        $(".images img").click(function () {
            $("#full-image").attr("src", $(this).attr("src"));
            $('#image-viewer').show();
        });

        $("#image-viewer .close").click(function () {
            $('#image-viewer').hide();
        });
    }
}

    //function fnviewstickerimage(current) {
//    $("#staticBackdropLabel").text('Sticker image');
//    var str = current.attr('dataimg');

//    if (/\d{17}_image\.jpg/.test(str)) {
//        var imgkey = str.split(',');
//        var imageContainer = $("<div class='row'></div>");

//        for (var i = 0; i < imgkey.length; i++) {
//            if (imgkey[i] !== "") {
//                var igl = GetImageFromS3bucket(imgkey[i]);
//                var image = $('<img width="300" height="300" src="' + igl + '" alt=""/>');
//                imageContainer.append(image);
//            }
//        }

//        $("#staticBackdrop #images").empty().append(imageContainer);

//        $("#staticBackdrop").modal('show');

//        $(".images img").click(function () {
//            $("#full-image").attr("src", $(this).attr("src"));
//            $('#image-viewer').show();
//        });

//        $("#image-viewer .close").click(function () {
//            $('#image-viewer').hide();
//        });
//    } else {
//        //// Handle the case when the image URL doesn't match the pattern
//        //$("#staticBackdropLabel").text('Sticker image');
//        //var segments = str.split(',');
//        //var img = '';
//        //for (var i = 0; i < segments.length; i++) {
//        //    if (segments[i] != "") {
//        //        var igl = GetImageFromS3bucket(segments[i]);
//        //        img = img + '<img width="300" height="200" src="' + igl + '" alt=""/>';
//        //    }
//        // Handle the case when the image URL doesn't match the pattern
//        $("#staticBackdropLabel").text('Sticker image');
//        var segments = str.split(',');
//        var img = '';
//        for (var i = 0; i < segments.length; i++) {
//            if (segments[i] != "") {
//                img = img + '<img width="300" height="200" src="http://api.ritcologistics.com/TrucksUpFO/uploadedimages/' + segments[i] + '" alt=""/>';
//            }
//        }

//        $("#staticBackdrop #images").empty().append("<div class='row'>" + img + "</div>");
//        $("#staticBackdrop").modal('show');

//        $(".images img").click(function () {
//            $("#full-image").attr("src", $(this).attr("src"));
//            $('#image-viewer').show();
//        });

//        $("#image-viewer .close").click(function () {
//            $('#image-viewer').hide();
//        });
//        }

//        $("#staticBackdrop #images").empty().append("<div class='row'>" + img + "</div>");
//        $("#staticBackdrop").modal('show');

//        $(".images img").click(function () {
//            $("#full-image").attr("src", $(this).attr("src"));
//            $('#image-viewer').show();
//        });

//        $("#image-viewer .close").click(function () {
//            $('#image-viewer').hide();
//        });
// }


function GetImageFromS3bucket(imageLink) {
    var url = "/Home/GetimagefromS3bucket";
    var data = JSON.stringify({
        imgkey: imageLink
    });
    var Result = doAjax(url, data);
    if (Result != '') {
        return Result;
    }
}
 

function preloadImage(url) {
    var img = new Image();
    img.src = url;
}


function firstImageload(url) {
    var result = "";
    var settings = {
        "url": "https://sslapi.trucksups.in/S3ImageAPI/get-imagefile?fileName=" + url + "",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        result = response;
        return result;
    });
    return result;
}

 
 function Getdata() {
    $("#loadingGif").show();
    var dateRange = $("#reportrange span").text();
    var status = $("#status").val();
    var doneby = "";
    var dates = dateRange.split("-");
    var startdate = dates[0];
    var enddate = dates[1];
    var Url = '/Verification/GetAllDataAndExportToExcel';
   //var Url = '/TrucksupfoAdmin/Verification/GetAllDataAndExportToExcel';

    $.ajax({
        url: Url,
        type: 'post',
        data: {
            startdate: startdate,
            enddate: enddate,
            doneby: doneby,
            status: status,
            start: 0,
            length: 10,
        },
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            $("#loadingGif").hide();
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = 'VerificationData.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },
        error: function () {
            $("#loadingGif").hide();
            console.log('An error occurred while exporting data.');
        }
    });
}

