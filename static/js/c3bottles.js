/*
 * Add an event handler to the buttons over the drop point table in the list
 * to toggle table rows based on classes for the location or state of the
 * drop points.
 *
 * On a click, this function not only toggles the visibility of the table rows
 * affected but also adds/removes classes to the buttons accordingly,
 *
 */
$("body").on("click", "a[data-toggle=collapse]", function () {
    var _self = $(this);
    var _group = _self.parent().parent().parent();
    var _button = _group.children("button");
    var _target = $(_self.attr("data-target"));
    if (_target.hasClass("in")) {
        _self.parent().removeClass("active");
    } else {
        _self.parent().addClass("active");
    }
    if (_group.find("li.active").length > 0) {
        _button.removeClass("btn-default").addClass("btn-primary");
    } else {
        _button.removeClass("btn-primary").addClass("btn-default");
    }
});

/*
 * When showing any of the drop point modals (details, reporting, visiting),
 * all elements displaying details of the drop point in question are filled
 * with the correct details before the modal is made visible to the user.
 *
 * All the details are read from the drop point table.
 *
 */
$(".dp_modal").on("show.bs.modal", function (e) {
    var _tr = $(e.relatedTarget).parent().parent();
    var _details = _tr.data("details");
    for (var key in _details) {
        $(".modal_dp_" + key).text(_details[key]);
    }
    $("#modal_dp_link").attr("href", _tr.data("href"));
});

/*
 * When hiding any of the drop point modals (details, reporting, visiting),
 * the modal must be destroyed to be re-constructed on the next show instead
 * of simply hiding it and displaying the same instance again.
 *
 */
$(".dp_modal").on("hidden.bs.modal", function () {
    $(this).removeData("bs.modal");
});

/*
 * This dict contains all the states for drop points which can be reported. The
 * states are mapped to classes of buttons triggering the respective report.
 *
 */
var report_states = {
    ".report-default": "DEFAULT",
    ".report-nocrates": "NO_CRATES",
    ".report-empty": "EMPTY",
    ".report-somebottles": "SOME_BOTTLES",
    ".report-reasonablyfull": "REASONABLY_FULL",
    ".report-full": "FULL",
    ".report-overflow": "OVERFLOW"
};

/*
 * Add an event handler to all the report buttons.
 *
 */
$.each(report_states, function (cls, state) {
    $(cls).on("click", function () {
        report_dp($(".modal_dp_number").first().text(), state);
    });
});

/*
 * Report a drop point through the AJAX API.
 *
 * The state of the drop point in question is sent through the API and the
 * modal with the buttons is hidden. After the API request has been finished,
 * an alert indicating success or failure is displayed.
 *
 */
function report_dp(num, state) {
    $("#dp_report_modal").modal("hide");
    $.ajax({
        type: "POST",
        url: apiurl,
        data: {
            action: "report",
            dp_number: num,
            state: state
        },
        success: function () {
            var alert = $("<div></div>")
                .addClass("alert alert-success collapse")
                .html("<button type=\"button\" class=\"close alert-hide\">\
                        <span aria-hidden=\"true\">&times;</span></button>\
                        <strong>Thank you!</strong> Your report has been\
                        received successfully and the bottle collection\
                        team is on the way.");
            $("#alerts").append(alert);
            $(".alert-hide").on("click", function () {
                $(this).parent().slideUp();
            });
            alert.slideDown();
        },
        error: function (response) {
            var alert = $("<div></div>")
                .addClass("alert alert-danger collapse")
                .html("<button type=\"button\" class=\"close alert-hide\">\
                        <span aria-hidden=\"true\">&times;</span></button>\
                        <strong>Oh no!</strong> An error occured while\
                        processing your report: " + response.responseText);
            $("#alerts").append(alert);
            $(".alert-hide").on("click", function () {
                $(this).parent().slideUp();
            });
            alert.slideDown();
        }
    });
}
/*
 * This dict contains all actions which can be performed by the bottle
 * collection team when visiting a drop point. The actions are mapped to the
 * classes of buttons triggering the respective action.
 *
 */
var visit_actions = {
    ".visit-emptied": "EMPTIED",
    ".visit-addedcrates": "ADDED_CRATE",
    ".visit-removedcrates": "REMOVED_CRATE",
    ".visit-relocated": "RELOCATED",
    ".visit-removed": "REMOVED",
    ".visit-noaction": "NO_ACTION"
};

/*
 * Add an event handler to all the visit buttons.
 */
$.each(visit_actions, function (cls, action) {
    $(cls).on("click", function () {
        visit_dp($(".modal_dp_number").first().text(), action);
    });
});

/*
 * Log the visit of a drop point through the AJAX API.
 *
 * The action performed when visiting the drop point is sent through the API
 * and the modal with the buttons is hidden. After the API request has been
 * finished, an alert indicating success or failure is displayed.
 *
 */
function visit_dp(num, action) {
    $("#dp_visit_modal").modal("hide");
    $.ajax({
        type: "POST",
        url: apiurl,
        data: {
            action: "visit",
            dp_number: num,
            maintenance: action
        },
        success: function () {
            var alert = $("<div></div>")
                .addClass("alert alert-success collapse")
                .html("<button type=\"button\" class=\"close alert-hide\">\
                        <span aria-hidden=\"true\">&times;</span></button>\
                        <strong>Thank you!</strong> Your visit has been\
                        logged.");
            $("#alerts").append(alert);
            $(".alert-hide").on("click", function () {
                $(this).parent().slideUp();
            });
            alert.slideDown();
        },
        error: function (response) {
            var alert = $("<div></div>")
                .addClass("alert alert-danger collapse")
                .html("<button type=\"button\" class=\"close alert-hide\">\
                        <span aria-hidden=\"true\">&times;</span></button>\
                        <strong>Oh no!</strong> An error occured while\
                        processing your visit: " + response.responseText);
            $("#alerts").append(alert);
            $(".alert-hide").on("click", function () {
                $(this).parent().slideUp();
            });
            alert.slideDown();
        }
    });
}

/* vim: set expandtab ts=4 sw=4: */
