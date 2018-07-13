myApp.controller('ClosedTicketcreationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, ticketService, $stateParams) {
    $scope.template = TemplateService.getHTML("content/closedTicketcreation/closedTicketcreation.html");
    TemplateService.title = "Closed Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.jstrgValue = $.jStorage.get('userData');

    $scope.newUserModalOpen = function () {
        $scope.addNewUser = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addNewUser.html",
            scope: $scope,
        });
    }

    var reminderData = {};
    reminderData.user = $scope.jstrgValue._id;
    NavigationService.apiCallWithData("Reminder/findReminderByUser", reminderData, function (res) {
        if (res.value == true) {
            // console.log("res--111---", res.data);
            $scope.allReminders = res.data;
        }
    });

    NavigationService.apiCallWithData("Reminder/totalNumberOfReminders", reminderData, function (res) {
        if (res.value == true) {
            // console.log("res---222--", res.data);
            $scope.totalReminders = res.data;

        }
    });

    //for ticket block


    ticketService.totalNumberOfTickets(function (data) {
        $scope.totalNumberOfTickets = data;
        // console.log("res--totalNumberOfTickets---", data);
    });

    ticketService.totalNumberOfOpenTickets(function (data) {
        $scope.totalNumberOfOpenTickets = data;
        // console.log("res---totalNumberOfOpenTickets--", data);
    });


    ticketService.totalNumberOfClosedTickets(function (data) {
        $scope.totalNumberOfClosedTickets = data;
        // console.log("res---totalNumberOfClosedTickets--", data);
    });


    ticketService.totalClosedTickets(function (data) {
        $scope.totalClosedTickets = data;
        // console.log("res---totalClosedTickets--", data);
        // console.log("res---totalClosedTickets--", $scope.totalClosedTickets);
        if ($stateParams.id) {
            var ticketData = {};
            ticketData.ticketId = $stateParams.id;
            ticketData.user = $scope.jstrgValue._id;
            NavigationService.apiCallWithData("Ticket/findTicketOfUser", ticketData, function (res) {
                $scope.ticketDetails = res.data;
                console.log("$scope.ticketDetails-----------", res.data);
            });
        } else {
            console.log("res---totalClosedTickets--", $scope.totalClosedTickets[0]);
            $scope.ticketDetails = $scope.totalClosedTickets[0];
        }

    });


});