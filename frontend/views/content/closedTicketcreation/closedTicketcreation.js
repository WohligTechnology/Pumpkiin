myApp.controller('ClosedTicketcreationCtrl', function ($scope, TemplateService, reminderService, NavigationService, $timeout, toastr, $http, $uibModal, ticketService, $stateParams) {
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

    //REMINDER SECTION

    reminderService.findReminderOfPendingSnoozeByUser(function (data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
    });


    reminderService.totalNumberOfReminders(function (data) {
        $scope.totalReminders = data;
        console.log("$scope.totalReminders", $scope.totalReminders);
    });

    reminderService.totalNumberOfCompletedReminders(function (data) {
        $scope.totalCompletedReminder = data;
        console.log("res---totalCompletedReminder--", $scope.totalCompletedReminder);
    });


    reminderService.totalNumberOfPendingReminders(function (data) {
        $scope.totalPendingReminders = data;
        console.log("$scope.totalPendingReminders--", $scope.totalPendingReminders);
    });


    $scope.completedReminders = function (data) {
        reminderService.findReminderOfCompletedByUser(function (data) {
            $scope.allReminders = data;
            $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
        });
    }

    $scope.pendingReminders = function (data) {
        reminderService.findReminderOfPendingSnoozeByUser(function (data) {
            $scope.allReminders = data;
            $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
        });
    }

    //REMINDER SECTION END

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
            NavigationService.apiCallWithData("Ticket/findClosedTicketOfUser", ticketData, function (res) {
                $scope.ticketDetails = res.data;
                console.log("$scope.ticketDetails-----------", res.data);
            });
        } else {
            // console.log("res---totalClosedTickets--", $scope.totalClosedTickets[0]);
            $scope.ticketDetails = $scope.totalClosedTickets[0];
        }

    });


});