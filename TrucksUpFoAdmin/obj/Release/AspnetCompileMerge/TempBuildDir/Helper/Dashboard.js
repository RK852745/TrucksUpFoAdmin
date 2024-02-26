function Logout() {
    var url = "/Admin/LogOut";
    var data = {};
    var Result = doAjax(url, data);
    window.location.href = Result;
}

$(function () {

    var start = moment().subtract(6, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
        GetAdminDashboardNew(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'), '', '', '', '');
        //GetAdminDashboard(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'), '', '', '', '');
        //GetDatataleresult(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'), '', '', '', '');
        GetTotalCounts(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
        $("#appendSelections").text("All Field Officers");
        GetFieldOfficers();

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

    $(".ranges ul li").click(function (e) {
        e.preventDefault();
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


function GetTotalCounts(date) {
    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    var url = "/Admin/MethodGetcounts";
    var data = JSON.stringify({ startdate: startdate, enddate: enddate });
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        debugger;
        var Parseresult = JSON.parse(JsonResult).table;
        $('#Totalvisit').text(Parseresult[0].totalvisit);
        $('#Stickeredvisit').text(Parseresult[0].stickeredvisit);
        $('#TotalOwner').text(Parseresult[0].totalowner);
        $('#TotalSME').text(Parseresult[0].totalsme);
        $('#TotalBroker').text(Parseresult[0].totalbroker);
        $('#TotalUNION').text(Parseresult[0].totalunion);

        $('#TotalFollowUp').text(Parseresult[0].followup);
        $('#TotalDownload').text(Parseresult[0].downloaded);
        $('#TotalNotIntrested').text(Parseresult[0].notinterested);
        $('#TotalActualDownloads').text(Parseresult[0].actualdownloads);
        $("#TotalOverallDownload").text(Parseresult[0].overalldownloads);

    }
}
function GetAdminDashboard(date, foid, tvisit, owntype, Status) {
    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    var url = "/Admin/DashboardData";
    var data = JSON.stringify({
        startdate: startdate,
        enddate: enddate,
        foid: foid,
        tvisit: tvisit,
        owntype: owntype,
        Status: Status
    });
    var JsonResult = doAjax(url, data);
    debugger;
    if (JsonResult != "") {
        $('.card').children(".card-loader").remove();
        $('.card').removeClass("card-load");
        var i = 1;
        var ParseResult = JsonResult;
        $("#Datatable1").DataTable().clear().destroy();
        $("#Datatable1").DataTable(
            {
                bProcessing: true,
                bLengthChange: true,
                lengthMenu: [[10, 15, -1], [10, 15, "All"]],
                bfilter: true,
                bSort: true,
                bPaginate: true,
                dom: 'Bfrtip',
                data: ParseResult,
                columns: [
                    {
                        render: function (data, type, row) {
                            return "<div>" + i++ + "</div>";
                        }
                    }, {
                        render: function (data, type, row) {
                            return "<div><strong>" + row.Name + "</strong></div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            var verified = "<i class='fa fa-times-circle text-danger'></i>";
                            if (row.IsMobileVerified == "Y") {
                                verified = "<i class='fa fa-check-circle text-success'></i>"
                            }
                            return "<div><strong>" + verified + "&nbsp;" + row.Mobile + "</strong></div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.StickeringStatus + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.Status + " </div><div>(<small>" + row.Remarks + "</small>)</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            var downloadstatus = '<div class="downsts"><i class="fa fa-times text-danger" aria-hidden="true"></i>&nbsp;No</div>';
                            if (row.downloadapp == "Y") {
                                downloadstatus = '<div class="downsts"><i class="fa fa-check text-success" aria-hidden="true"></i>&nbsp;Yes</div>';
                            }
                            return "<div>" + downloadstatus + "</div>";
                        }
                    },

                    {
                        render: function (data, type, row) {
                            return "<div>" + row.EmailId + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.Address + "</div>";
                        }
                    },

                    {
                        render: function (data, type, row) {
                            return "<div style='text-transform:capitalize;'>" + row.OwnType + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.Company + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div>" + row.VisitDate + "&nbsp;&nbsp;" + row.VisitTime + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div class='createdby'>" + row.createdbyname + "</div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div onclick='fnGetVehicleData($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fas fa-truck'></i>&nbsp;&nbsp;View&nbsp;&nbsp;" + row.VehicleCount + "</button></div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div onclick='fnGetpreflocationData($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fa fa-map-marker'></i>&nbsp;&nbsp;View</button></div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            var btn = "";
                            if (row.imagecounts > 0) {
                                btn = "<div onclick='fnGetImagesData($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fa fa-folder-open'></i>&nbsp;&nbsp;View</button></div>";
                            } else {
                                btn = "<div class='tablebtns' style='background-color: #b7b7b7;border-color: #afafaf;'><button class='btn btn-default btn-sm' style='font-size: 11px;'><i class='fa fa-folder-open'></i>&nbsp;&nbsp;View</button></div>";
                            }
                            return btn;
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div onclick='fnupdatefieldofficermodal($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'>Update</button></div>";
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
        $("#Datatable1").DataTable().clear().destroy();
        $("#Datatable1").DataTable();
    }

    return false;
}

function fnGetdatabycard(current) {
    $(".countercards").removeClass("C_active");
    current.addClass("C_active");
    var cardtype = current.attr('cardtype');
    var date = $("#reportrange span").text();
    if (cardtype == "tvisit") {
        GetAdminDashboardNew(date, '', '', '', '')
        return;
    }
    else if (cardtype == "svisit") {
        GetAdminDashboardNew(date, '', '', 'svisit', '');
        return;
    }
    else if (cardtype == "FollowUp" || cardtype == "Downloaded " || cardtype == "NotIntrested") {
        GetAdminDashboardNew(date, '', '', '', cardtype);
        return;
    }
    else {
        GetAdminDashboardNew(date, '', '', cardtype, '');
        return;
    }

}

function fnGetVehicleData(current, fovmid) {
    var url = "/Admin/MethodGetVehicleInfo";
    var data = JSON.stringify({ fovmid: fovmid });
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        $("#DynamicModal .modal-dialog").addClass('modal-lg');
        $("#DynamicModalTitle").text('Vehicle Information');
        var ParseResult = JSON.parse(JsonResult).table;
        var tr = "";
        for (var i = 0; ParseResult.length > i; i++) {
            tr = tr + '<tr>\
                       <td style="text-transform: capitalize;">'+ ParseResult[i].owntype + '</td>\
                       <td style="text-transform: capitalize;">'+ ParseResult[i].vehicletype + '</td>\
                       <td style="text-transform: capitalize;">'+ ParseResult[i].vehiclecapacity + '</td>\
                       <td style="text-transform: capitalize;">'+ ParseResult[i].vehiclesize + '</td>\
                       <td style="text-transform: capitalize;">'+ ParseResult[i].vehiclecount + '</td>\
                       </tr>';
        }
        var table = '<table  class="table table-striped" style="width: 100%"><thead>\
        <tr><th>Own Type</th><th>Vehicle Type</th><th>Vehicle Capacity</th><th>Vehicle Size</th><th>Vehicle Count</th></tr></thead><tbody>'+ tr + '</tbody>\
        </table>';

        $("#appendModalBodyData").empty();
        $("#appendModalBodyData").append(table);
        $("#DynamicModal").modal('show');
    }
}

function fnGetpreflocationData(current, fovmid) {
    var url = "/Admin/MethodGetPrefLocationData";
    var data = JSON.stringify({ fovmid: fovmid });
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        $("#DynamicModal .modal-dialog").removeClass('modal-lg');
        $("#DynamicModalTitle").text('Preferred Locations');
        var ParseResult = JSON.parse(JsonResult).table;
        var tr = "";
        for (var i = 0; ParseResult.length > i; i++) {
            tr = tr + '<tr>\
                       <td style="text-transform: capitalize;">'+ ParseResult[i].fromloction + '</td>\
                       <td style="text-transform: capitalize;">'+ ParseResult[i].tolocation + '</td></tr>';
        }
        var table = '<table  class="table table-striped" style="width: 100%"><thead>\
        <tr><th>From City</th><th>To City</th></tr></thead><tbody>'+ tr + '</tbody>\
        </table>';

        $("#appendModalBodyData").empty();
        $("#appendModalBodyData").append(table);
        $("#DynamicModal").modal('show');
    }
}

function fnGetImagesData(current, fovmid) {
    var url = "/Admin/MethodGetAllimages";
    var data = JSON.stringify({ fovmid: fovmid });
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        var ParseResult = JSON.parse(JsonResult).table;
        var image = "";
        for (var i = 0; ParseResult.length > i; i++) {
            image = image + '<div class="col-sm-4"><img onclick="fnviewImage($(this))" class="galleryimg" style="width: 100%" src="uploadedimages/' + ParseResult[i].imageurl + '" /></div>';
        }
        $(".ViewLargeImage").empty();
        $("#appendGallery").empty();
        $("#appendGallery").append(image);
        $("#ImageGalleryModal").modal('show');
    }

}

function fnviewImage(Current) {
    $(".ViewLargeImage").empty();
    var imguri = '<img src="' + Current.attr('src') + '" style="width:100%;"/>';
    $(".ViewLargeImage").append(imguri);
}

function btnActions() {
    $('.foclass').click(function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $(this).toggleClass('activefo');
        $(this).find('.tickcirlce').toggleClass('d-none');
    });
}


function fngetdatabyfoid(current) {
    if ($(".foclass").hasClass('activefo')) {
        var ids = [];
        $(".activefo").each(function () {
            ids.push({
                userid: $(this).attr('value'),
            })
        });
        var counts = ids.length;
        if (counts == 0) {
            $("#appendSelections").text("All Field Officers");
            GetAdminDashboardNew($("#reportrange span").text(), '', '', '')
        } else {
            $("#appendSelections").text(counts + " Selected");
            var date = $("#reportrange span").text();
            date = date.split("-");
            var startdate = date[0];
            var enddate = date[1];
            var url = "/Admin/MethodGetDataforAdminbyuserid";
            var data = JSON.stringify({
                startdate: startdate,
                enddate: enddate,
                Useridlist: ids
            });
            var JsonResult = doAjax(url, data);
            if (JsonResult != "") {
                var i = 1;
                var ParseResult = JSON.parse(JsonResult).table;
                $("#Datatable1").DataTable().clear().destroy();
                $("#Datatable1").DataTable(
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
                            }, {
                                render: function (data, type, row) {
                                    return "<div><strong>" + row.name + "</strong></div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    var verified = "<i class='fa fa-times-circle text-danger'></i>";
                                    if (row.ismobileverified == "Y") {
                                        verified = "<i class='fa fa-check-circle text-success'></i>"
                                    }
                                    return "<div><strong>" + verified + "&nbsp;" + row.mobile + "</strong></div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.stickeringstatus + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.status + " </div><div>(<small>" + row.remarks + "</small>)</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    var downloadstatus = '<div class="downsts"><i class="fa fa-times text-danger" aria-hidden="true"></i>&nbsp;No</div>';
                                    if (row.downloadapp == "Y") {
                                        downloadstatus = '<div class="downsts"><i class="fa fa-check text-success" aria-hidden="true"></i>&nbsp;Yes</div>';
                                    }
                                    return "<div>" + downloadstatus + "</div>";
                                }
                            },

                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.emailid + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.address + "</div>";
                                }
                            },

                            {
                                render: function (data, type, row) {
                                    return "<div style='text-transform:capitalize;'>" + row.owntype + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.company + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.visitdate + "&nbsp;&nbsp;" + row.visittime + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div class='createdby'>" + row.createdbyname + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div onclick='fnGetVehicleData($(this)," + row.fovmid + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fas fa-truck'></i>&nbsp;&nbsp;View&nbsp;&nbsp;" + row.vehiclecount + "</button></div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div onclick='fnGetpreflocationData($(this)," + row.fovmid + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fa fa-map-marker'></i>&nbsp;&nbsp;View</button></div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    var btn = "";
                                    if (row.imagecounts > 0) {
                                        btn = "<div onclick='fnGetImagesData($(this)," + row.fovmid + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fa fa-folder-open'></i>&nbsp;&nbsp;View</button></div>";
                                    } else {
                                        btn = "<div class='tablebtns' style='background-color: #b7b7b7;border-color: #afafaf;'><button class='btn btn-default btn-sm' style='font-size: 11px;'><i class='fa fa-folder-open'></i>&nbsp;&nbsp;View</button></div>";
                                    }
                                    return btn;
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div onclick='fnupdatefieldofficermodal($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'>Update</button></div>";
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
                $("#Datatable1").DataTable().clear().destroy();
                $("#Datatable1").DataTable();
            }

        }
    }
}


function fnclearfilters(current) {
    $("#appendSelections").text("All Field Officers");
    $('.foclass').removeClass('activefo');
    $('.foclass').find('.tickcirlce').addClass('d-none');
    //GetAdminDashboard($("#reportrange span").text(), '', '', '', '');
}

function GetFieldOfficers() {
    var url = "/Admin/MethodGetFieldofficers";
    var data = {};
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        var ParseResult = JSON.parse(JsonResult).table;
        var options = ""; var list = "";
        for (var i = 0; ParseResult.length > i; i++) {
            options = options + '<option executiveid="' + ParseResult[i].executiveid + '" value="' + ParseResult[i].userid + '">' + ParseResult[i].name + '</option>';
            list = list + "<li><div executiveid='" + ParseResult[i].executiveid + "' value='" + ParseResult[i].userid + "' class='foclass'>" + ParseResult[i].name + "<i class='fa fa-check-circle tickcirlce d-none'></i></div></li>";
        }
        var selectlist = "<label>Filter by field officer</label><select class='form-control pull-right'' id='FoLists'><option selected value=''>--Select Field Officer--</option>" + options + "</select>"
        $("#appendfieldOfficerList").empty();
        $("#appendfieldOfficerList").append(selectlist);
        $("#folists").empty();
        $("#folists").append(selectlist);



        $("#multiselectmodalapppendlist").empty();
        $("#multiselectmodalapppendlist").append(list);

        $("#FoLists").change(function () {
            var date = $("#reportrange span").text();
            var fomid = $("#FoLists option:selected").val();
            GetAdminDashboardNew(date, fomid, '', '', '')
        });

        btnActions();
    }
}

function btnActions() {
    $('.foclass').click(function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $(this).toggleClass('activefo');
        $(this).find('.tickcirlce').toggleClass('d-none');
    });
}


function fngetdatabyfoid(current) {
    if ($(".foclass").hasClass('activefo')) {
        var ids = [];
        $(".activefo").each(function () {
            ids.push({
                userid: $(this).attr('value'),
            })
        });
        var counts = ids.length;
        if (counts == 0) {
            $("#appendSelections").text("All Field Officers");
            GetAdminDashboardNew($("#reportrange span").text(), '', '', '')
        } else {
            $("#appendSelections").text(counts + " Selected");
            var date = $("#reportrange span").text();
            date = date.split("-");
            var startdate = date[0];
            var enddate = date[1];
            var url = "/Admin/MethodGetDataforAdminbyuserid";
            var data = JSON.stringify({
                startdate: startdate,
                enddate: enddate,
                Useridlist: ids
            });
            var JsonResult = doAjax(url, data);
            if (JsonResult != "") {
                var i = 1;
                var ParseResult = JSON.parse(JsonResult).table;
                $("#Datatable1").DataTable().clear().destroy();
                $("#Datatable1").DataTable(
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
                            }, {
                                render: function (data, type, row) {
                                    return "<div><strong>" + row.name + "</strong></div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    var verified = "<i class='fa fa-times-circle text-danger'></i>";
                                    if (row.ismobileverified == "Y") {
                                        verified = "<i class='fa fa-check-circle text-success'></i>"
                                    }
                                    return "<div><strong>" + verified + "&nbsp;" + row.mobile + "</strong></div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.stickeringstatus + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.status + " </div><div>(<small>" + row.remarks + "</small>)</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    var downloadstatus = '<div class="downsts"><i class="fa fa-times text-danger" aria-hidden="true"></i>&nbsp;No</div>';
                                    if (row.downloadapp == "Y") {
                                        downloadstatus = '<div class="downsts"><i class="fa fa-check text-success" aria-hidden="true"></i>&nbsp;Yes</div>';
                                    }
                                    return "<div>" + downloadstatus + "</div>";
                                }
                            },

                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.emailid + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.address + "</div>";
                                }
                            },

                            {
                                render: function (data, type, row) {
                                    return "<div style='text-transform:capitalize;'>" + row.owntype + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.company + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div>" + row.visitdate + "&nbsp;&nbsp;" + row.visittime + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div class='createdby'>" + row.createdbyname + "</div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div onclick='fnGetVehicleData($(this)," + row.fovmid + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fas fa-truck'></i>&nbsp;&nbsp;View&nbsp;&nbsp;" + row.vehiclecount + "</button></div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div onclick='fnGetpreflocationData($(this)," + row.fovmid + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fa fa-map-marker'></i>&nbsp;&nbsp;View</button></div>";
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    var btn = "";
                                    if (row.imagecounts > 0) {
                                        btn = "<div onclick='fnGetImagesData($(this)," + row.fovmid + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fa fa-folder-open'></i>&nbsp;&nbsp;View</button></div>";
                                    } else {
                                        btn = "<div class='tablebtns' style='background-color: #b7b7b7;border-color: #afafaf;'><button class='btn btn-default btn-sm' style='font-size: 11px;'><i class='fa fa-folder-open'></i>&nbsp;&nbsp;View</button></div>";
                                    }
                                    return btn;
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    return "<div onclick='fnupdatefieldofficermodal($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'>Update</button></div>";
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
                $("#Datatable1").DataTable().clear().destroy();
                $("#Datatable1").DataTable();
            }

        }
    }
}


function fnclearfilters(current) {
    $("#appendSelections").text("All Field Officers");
    $('.foclass').removeClass('activefo');
    $('.foclass').find('.tickcirlce').addClass('d-none');
    //GetAdminDashboard($("#reportrange span").text(), '', '', '', '');
}

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

function fnupdatefieldofficermodal(current, fovid) {
    var fromfo = current.closest('tr').find('.createdby').text();
    $("#fromFo").val(fromfo);
    var url = "/Admin/MethodGetFieldofficers";
    var data = {};
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        var ParseResult = JSON.parse(JsonResult).table;
        var options = ""; var list = "";
        for (var i = 0; ParseResult.length > i; i++) {
            options = options + '<option executiveid="' + ParseResult[i].executiveid + '" value="' + ParseResult[i].userid + '">' + ParseResult[i].name + '</option>';
        }
        var selectlist = "<label>To Selected FO</label><select class='form-control pull-right'' id='FoLists'><option selected value=''>--Select Field Officer--</option>" + options + "</select>"
        $("#folists").empty();
        $("#folists").append(selectlist);
        $("#UpdateDownloadedby").modal('show');
        $("#updatebtn").attr('fovmid', fovid);
    }

}

$("#updatebtn").click(function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    var userid = $("#FoLists option:selected").val();
    var fovmid = $(this).attr('fovmid');
    var remarks = $("#downloadremarks").val();

    if (userid == "") {
        Swal.fire(
            'warning!',
            'Please select field officer',
            'warning'
        )
        return
    }
    else if (fovmid == "") {
        Swal.fire(
            'warning!',
            'Please select field officer',
            'warning'
        )
        return
    } else if (remarks == "") {
        Swal.fire(
            'warning!',
            'Please enter remarks.',
            'warning'
        )
        return
    }
    else {
        var Data = JSON.stringify({ userid: userid, fovmid: fovmid, remarks: remarks })
        var url = "/Admin/MethodUpdateDownloadedby";
        var data = Data;
        var JsonResult = doAjax(url, data);
        if (JsonResult != "") {
            Swal.fire(
                'success!',
                'Data Updated successfully',
                'success'
            )
        } else {
            Swal.fire(
                'error!',
                'Something went wrong please try again',
                'error'
            )
        }
    }


});

function GetAdminDashboardNew(date, foid, tvisit, owntype, Status) {

    $('.card').addClass("card-load");
    $('.card').append('<div class="card-loader"><i class="fa fa-spinner rotate-refresh"></div>');

    date = date.split("-");
    var startdate = date[0];
    var enddate = date[1];
    var i = 1;
    $("#Datatable1").DataTable().clear().destroy();
    $("#Datatable1").DataTable(
        {
            serverSide: true,
            processing: true,
            ajax: {
                url: '/Admin/DashboardData',
                type: 'POST',
                "data": function (d) {
                    d.startdate = startdate;
                    d.enddate = enddate;
                    d.foid = foid;
                    d.tvisit = tvisit;
                    d.owntype = owntype;
                    d.Status = Status;
                }
            },
            columns: [
                {
                    render: function (data, type, row) {
                        return "<div>" + i++ + "</div>";
                    }
                }, {
                    render: function (data, type, row) {
                        return "<div><strong>" + row.Name + "</strong></div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        var verified = "<i class='fa fa-times-circle text-danger'></i>";
                        if (row.IsMobileVerified == "Y") {
                            verified = "<i class='fa fa-check-circle text-success'></i>"
                        }
                        return "<div><strong>" + verified + "&nbsp;" + row.Mobile + "</strong></div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div>" + row.StickeringStatus + "</div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div>" + row.Status + " </div><div>(<small>" + row.Remarks + "</small>)</div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        var downloadstatus = '<div class="downsts"><i class="fa fa-times text-danger" aria-hidden="true"></i>&nbsp;No</div>';
                        if (row.downloadapp == "Y") {
                            downloadstatus = '<div class="downsts"><i class="fa fa-check text-success" aria-hidden="true"></i>&nbsp;Yes</div>';
                        }
                        return "<div>" + downloadstatus + "</div>";
                    }
                },

                {
                    render: function (data, type, row) {
                        return "<div>" + row.EmailId + "</div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div>" + row.Address + "</div>";
                    }
                },

                {
                    render: function (data, type, row) {
                        return "<div style='text-transform:capitalize;'>" + row.OwnType + "</div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div>" + row.Company + "</div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div>" + row.VisitDate + "&nbsp;&nbsp;" + row.VisitTime + "</div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div class='createdby'>" + row.createdbyname + "</div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div onclick='fnGetVehicleData($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fas fa-truck'></i>&nbsp;&nbsp;View&nbsp;&nbsp;" + row.VehicleCount + "</button></div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div onclick='fnGetpreflocationData($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fa fa-map-marker'></i>&nbsp;&nbsp;View</button></div>";
                    }
                },
                {
                    render: function (data, type, row) {
                        var btn = "";
                        if (row.imagecounts > 0) {
                            btn = "<div onclick='fnGetImagesData($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'><i class='fa fa-folder-open'></i>&nbsp;&nbsp;View</button></div>";
                        } else {
                            btn = "<div class='tablebtns' style='background-color: #b7b7b7;border-color: #afafaf;'><button class='btn btn-default btn-sm' style='font-size: 11px;'><i class='fa fa-folder-open'></i>&nbsp;&nbsp;View</button></div>";
                        }
                        return btn;
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<div onclick='fnupdatefieldofficermodal($(this)," + row.FovmId + ")' class='tablebtns'><button class='btn btn-primary btn-sm' style='font-size: 11px;'>Update</button></div>";
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
    setTimeout(function () {
        $('.card').children(".card-loader").remove();
        $('.card').removeClass("card-load");
    }, 1500);
}



