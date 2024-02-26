$(function () {
    GetFieldOffiecersdata();
});
function Logout() {
    var url = "/Registration/LogOut";
    var data = {};
    var Result = doAjax(url, data);
    window.location.href = Result;
}
function fnSubmitBtn(current) {
    current.attr('disabled', 'disabled');

    var name = $.trim($("#Name").val());
    var mobile = $.trim($("#Mobile").val());
    var altmob = $.trim($("#AlternateMobile").val());
    var email = $.trim($("#email").val());
    var address = $.trim($("#Address").val());
    var empid = $.trim($("#EmployeeID").val());
    var usertype = $.trim($("#Usertypeis option:selected").val());
    if (name.length == 0) {
        alert('Please enter Name');
        return;
    }
    else if (mobile.length < 10) {
        alert('Please enter 10 digit mobile number');
        return;
    } else {

        var Data = JSON.stringify({
            name: name,
            mobile: mobile,
            altmob: altmob,
            email: email,
            address: address,
            empid: empid,
            usertype: usertype
        })
        var url = "/Registration/MethodAddNewFieldOfficer";
        var data = Data;
        var JsonResult = doAjax(url, data);
        if (JsonResult == "Y") {
            Swal.fire(
                'Success!',
                'Field Officer added successfull!',
                'success'
            )
            GetFieldOffiecersdata();
            $("#addnewusermodal").modal('hide');
        } else {
            Swal.fire(
                'Error!',
                'Something went wrong!',
                'error'
            )
        }
    }
}

function GetFieldOffiecersdata() {
    var url = "/Registration/MethodgetFieldOfficerdata";
    var data = {};
    var JsonResult = doAjax(url, data);
    if (JsonResult != "") {
        var ParseResult = JSON.parse(JsonResult).table;
        $("#FODetails").DataTable().clear().destroy();
        $("#FODetails").DataTable(
            {
                bLengthChange: true,
                //lengthMenu: [[10, 15, -1], [10, 15, "All"]],
                // bFilter: true,
                // bSort: true,
                //  bPaginate: true,
                // dom: 'Bfrtip',
                data: ParseResult,
                columns: [
                    {
                        render: function (data, type, row) {
                            return "<div class='labels'>" + row.employeeid + "</div><input class='inputs empid' type='text' value='" + row.employeeid + "'/>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div class='labels'>" + row.name + "</div><input class='inputs foname' type='text' value='" + row.name + "'/>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div class='labels'>" + row.mobile + "</div><input class='inputs mobile' type='text' value='" + row.mobile + "'/>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div class='labels'>" + row.altmobile + "</div><input class='inputs altmob' type='text' value='" + row.altmobile + "'/>";
                        }
                    },

                    {
                        render: function (data, type, row) {
                            return "<div class='labels'>" + row.email + "</div><input class='inputs mailid' type='text' value='" + row.email + "'/>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div class='labels'>" + row.fulladdress + "</div><input class='inputs address' type='text' value='" + row.fulladdress + "'/>";
                        }
                    },

                    {
                        render: function (data, type, row) {
                            return "<div class='labels'>" + row.username + "</div><input class='inputs uname' type='text' value='" + row.username + "'/>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div class='labels password'>" + row.password + "</div><input class='inputs pass' type='text' value='" + row.password + "'/>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div><a class='actionbtns editbtn' onclick='fnEditrow($(this))'><i class='fa fa-edit'></i></a>\
                                    <a class='actionbtns checkbtn' onclick='fnUpdaterow($(this)," + row.executiveid + ")'><i class='fa fa-check'></i></a>\
                                    <a class='actionbtns cancelbtn' onclick='fnCancelrow($(this))'><i class='fa fa-times'></i></a></div>";
                        }
                    },
                    {
                        render: function (data, type, row) {
                            return "<div><a class='actionbtns deletebtn' onclick='fndeleterow($(this)," + row.executiveid + ")'><i class='fa fa-trash'></i></a></div>";
                        }
                    }
                ]
            });
    } else {
        $("#FODetails").DataTable().clear().destroy();
        $("#FODetails").DataTable();
    }
}


function fnEditrow(current) {
    var tr = current.closest("tr");
    var checkbtn = tr.find('.checkbtn'),
        cancelbtn = tr.find('.cancelbtn'),
        inputs = tr.find('.inputs'),
        labels = tr.find('.labels'),
        editbtn = tr.find('.editbtn');
    checkbtn.show();
    cancelbtn.show();
    editbtn.hide();
    inputs.show();
    labels.hide();
}

function fnCancelrow(current) {
    var tr = current.closest("tr");
    var checkbtn = tr.find('.checkbtn'),
        cancelbtn = tr.find('.cancelbtn'),
        inputs = tr.find('.inputs'),
        labels = tr.find('.labels'),
        editbtn = tr.find('.editbtn');
    checkbtn.hide();
    cancelbtn.hide();
    editbtn.show();
    inputs.hide();
    labels.show();
}

function fnUpdaterow(current, updateid) {
    var tr = current.closest("tr");
    var checkbtn = tr.find('.checkbtn'),
        cancelbtn = tr.find('.cancelbtn'),
        inputs = tr.find('.inputs'),
        labels = tr.find('.labels'),
        editbtn = tr.find('.editbtn');

    var employeeid = tr.find('.empid').val(),
        fullname = tr.find('.foname').val(),
        mobile = tr.find('.mobile').val(),
        altmobile = tr.find('.altmob').val(),
        emailid = tr.find('.mailid').val(),
        address = tr.find('.address').val(),
        username = tr.find('.uname').val(),
        password = tr.find('.pass').val();

    var Data = JSON.stringify({
        employeeid: employeeid,
        fullname: fullname,
        mobile: mobile,
        altmobile: altmobile,
        emailid: emailid,
        address: address,
        username: username,
        password: password,
        updateid: updateid
    })
    var url = "/Registration/MethodUpdateOfficerdata";
    var data = Data;
    var JsonResult = doAjax(url, data);
    if (JsonResult == "Y") {
        Swal.fire(
            'Success!',
            'FO Updated successfully!',
            'success'
        )
        checkbtn.hide();
        cancelbtn.hide();
        editbtn.show();
        inputs.hide();
        labels.show();
        GetFieldOffiecersdata();
    } else {
        Swal.fire(
            'Error!',
            'Something went wrong!',
            'error'
        )
    }

}

function fndeleterow(current, deleteid) {
    var url = "/Registration/MethodDeleteOfficerdata";
    var data = JSON.stringify({ deleteid: deleteid });
    var JsonResult = doAjax(url, data);
    if (JsonResult == "Y") {
        Swal.fire(
            'Success!',
            'FO Deleted successfully!',
            'success'
        )
        GetFieldOffiecersdata();
    } else {
        Swal.fire(
            'Error!',
            'Something went wrong!',
            'error'
        )
    }
}