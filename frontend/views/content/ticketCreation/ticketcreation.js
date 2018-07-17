myApp.controller('TicketCreationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, reminderService, $uibModal, $stateParams, $state, ticketService) {
    $scope.template = TemplateService.getHTML("content/ticketCreation/ticketCreation.html");
    TemplateService.title = "Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.rate = 2;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.jstrgValue = $.jStorage.get('userData');

    $scope.attachmentImage = true;

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
        console.log("res--totalNumberOfTickets---", data);
    });

    ticketService.totalNumberOfOpenTickets(function (data) {
        $scope.totalNumberOfOpenTickets = data;
        console.log("res---totalNumberOfOpenTickets--", data);
    });


    ticketService.totalNumberOfClosedTickets(function (data) {
        $scope.totalNumberOfClosedTickets = data;
        console.log("res---totalNumberOfClosedTickets--", data);
    });


    ticketService.totalOpenTickets(function (data) {
        $scope.totalOpenTickets = data;
        // console.log("res---totalOpenTickets--", data);
        if ($stateParams.id) {
            var ticketData = {};
            ticketData.ticketId = $stateParams.id;
            ticketData.user = $scope.jstrgValue._id;
            NavigationService.apiCallWithData("Ticket/findTicketOfUser", ticketData, function (res) {
                $scope.ticketDetails = res.data;
                // console.log("$scope.ticketDetails-----------", res.data);
            });
        } else {
            // console.log("res---totalClosedTickets--", $scope.totalOpenTickets[0]);
            $scope.ticketDetails = $scope.totalOpenTickets[0];
        }
    });


    //for ticket block end


    // console.log("$stateParams.id", $stateParams.id)

    // var ticketData = {};
    // ticketData.ticketId = $stateParams.id;
    // ticketData.user = $scope.jstrgValue._id;
    // NavigationService.apiCallWithData("Ticket/findTicketOfUser", ticketData, function (res) {
    //     $scope.ticketDetails = res.data;
    //     console.log("$scope.ticketDetails-----------", res.data);
    // });

    $scope.addComment = function (data) {
        console.log("data", data);
        // console.log("  $.jStorage.get", $.jStorage.get("userData"));
        var formData = {};
        var dataToSend = {};
        dataToSend.customerChat = [];
        if (!_.isEmpty($.jStorage.get("userData"))) {
            formData.user = $.jStorage.get("userData")._id;
            formData.comment = data.comment;
            $scope.ticketDetails.customerChat.push(formData);
            console.log("dataToSend", $scope.ticketDetails);
            NavigationService.apiCallWithData("Ticket/save", $scope.ticketDetails, function (data) {
                if (data.value == true) {
                    // console.log(data);
                    // $state.reload();
                }
            });
        }
    };


});