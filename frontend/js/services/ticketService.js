myApp.service('ticketService', function (NavigationService) {


    var presentUser = $.jStorage.get("userData");

    var ticketData = {};
    ticketData.user = presentUser._id;

    this.totalNumberOfTickets = function (callback) {
        NavigationService.apiCallWithData("Ticket/totalNumberOfTickets", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            } else {
                callback("noData");
            }
        });
    };

    this.totalNumberOfOpenTickets = function (callback) {
        NavigationService.apiCallWithData("Ticket/totalNumberOfOpenTickets", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            } else {
                callback("noData");
            }
        });
    };

    this.totalNumberOfClosedTickets = function (callback) {
        NavigationService.apiCallWithData("Ticket/totalNumberOfClosedTickets", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            } else {
                callback("noData");
            }
        });
    };

    this.totalOpenTickets = function (callback) {
        NavigationService.apiCallWithData("Ticket/totalOpenTickets", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            } else {
                callback("noData");
            }
        });
    };

    this.totalClosedTickets = function (callback) {
        NavigationService.apiCallWithData("Ticket/totalClosedTickets", ticketData, function (res) {
            if (res.value == true) {
                callback(res.data);
            } else {
                callback("noData");
            }
        });
    };

})