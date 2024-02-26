var link = window.location.origin;
window.addEventListener("pageshow", function (event) {
    var historyTraversal = event.persisted ||
        (typeof window.performance != "undefined" &&
            window.performance.navigation.type === 2);
    if (historyTraversal) {
        window.location.reload();
    }
});

function NumberOnly(e) {
    var event = e || window.event

    var key_code = event.keyCode;
    var oElement = e ? e.target : window.event.srcElement;
    if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
        if ((key_code > 47 && key_code < 58) ||
            (key_code > 95 && key_code < 106)) {

            if (key_code > 95)
                key_code -= (95 - 47);
            oElement.value = oElement.value;
        } else if (key_code == 8) {
            oElement.value = oElement.value;
        } else if (key_code != 9) {
            event.returnValue = false;
        }
    }
}

//// for true or false
function isNullOrEmpty(str) {
    var returnValue = false;
    if (!str
        || str == null
        || str === 'null'
        || str === ''
        || str === '{}'
        || str === 'undefined'
        || str.length === 0) {
        returnValue = true;
    }
    return returnValue;
}

/// for var return empty
function getNullOrEmpty(str) {
    var returnValue = $.trim(str);
    if (!str
        || str == null
        || str === 'null'
        || str === ''
        || str === '{}'
        || str === 'undefined'
        || str.length === 0) {
        returnValue = '';
    }
    return returnValue;
}

function doAjax(url, params, method) {
    var Result = "";
      var sUrl = link + url;
     // var sUrl = link + "/TrucksupfoAdmin/" + url;
    $.ajax({
        'async': false,
        url: sUrl,
        type: method || 'POST',
        contentType: "application/json",
        dataType: 'json',
        data: params,
        beforeSend: function () {
            $('.card').addClass("card-load");
            $('.card').append('<div class="card-loader"><i class="fa fa-spinner rotate-refresh"></div>');

        },
        success: function (data) {
            Result = data;
            return Result;
        },
        error: function (jqXHR, exception) {
            if (jqXHR.responseText.indexOf('session') > -1) {
                Logout();
            }
            else {
                if (jqXHR.status === 0) {
                    alert('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    alert('Requested page not found. [404]');
                } else if (jqXHR.status == 500) {
                    alert('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    alert('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    alert('Time out error.');
                } else if (exception === 'abort') {
                    alert('Ajax request aborted.');
                } else {
                    alert('Uncaught Error.\n' + jqXHR.responseText);
                }
            }
        },
        complete: function () {
            setTimeout(function () {
                $('.card').children(".card-loader").remove();
                $('.card').removeClass("card-load");
            }, 1500);
        },
    });
    return Result;
}

//function Logout() {
//    var url = "/Account/LogOut";
//    var data = {};
//    var Result = doAjax(url, data);
//    window.location.href = Result;
//}
function Datatable(Current) {
    $(Current).DataTable({
        dom: 'lBfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
}

function destoryDataTable(Current) {
    if ($.fn.DataTable.isDataTable(Current)) {
        $(Current).DataTable().clear().destroy();
        $(Current).find('thead').empty();
        $(Current).find('tbody').empty();
        $(Current).find('tfoot').empty();
    }
}
