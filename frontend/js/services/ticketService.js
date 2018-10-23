myApp.service('ticketService', function (NavigationService) {


    var ticketData = {};
    this.totalNumberOfTickets = function (callback) {
        ticketData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Ticket/totalNumberOfTickets", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.totalNumberOfOpenTickets = function (callback) {
        ticketData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Ticket/totalNumberOfOpenTickets", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            } else {
                callback(null);
            }
        });
    };

    this.totalNumberOfClosedTickets = function (callback) {
        ticketData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Ticket/totalNumberOfClosedTickets", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

    this.totalOpenTickets1 = function (data, callback) {
        // console.log("totalOpenTickets-------------", callback);
        if (data) {
            ticketData.page = data;
        }
        if ($.jStorage.get("userData")) {
            ticketData.user = $.jStorage.get("userData")._id;
            NavigationService.apiCallWithData("Ticket/totalOpenTickets", ticketData, function (res) {
                if (res.value == true) {
                    // console.log("----------------res----", res);
                    callback(res.data);
                }
            });
        }
    };

    this.totalOpenTickets = function (callback) {
        if ($.jStorage.get("userData")) {
            ticketData.user = $.jStorage.get("userData")._id;
            NavigationService.apiCallWithData("Ticket/getallOpenTicktes", ticketData, function (res) {
                if (res.value == true) {
                    callback(res.data);
                }
            });
        }

    };

    this.totalClosedTickets1 = function (data, callback) {
        if (data) {
            ticketData.page = data;
        }
        if ($.jStorage.get("userData")) {
            ticketData.user = $.jStorage.get("userData")._id;
            console.log("------->>>>>>>>>>>>>>>>>", ticketData);
            NavigationService.apiCallWithData("Ticket/totalClosedTickets1", ticketData, function (res) {
                if (res.value == true) {
                    console.log("----------------res----", res);
                    callback(res.data);
                }
            });
        }
    };

    this.totalClosedTickets = function (callback) {
        ticketData.user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Ticket/getallClosedTicktes", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            }
        });
    };

})