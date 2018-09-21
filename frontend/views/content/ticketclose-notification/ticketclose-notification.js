myApp.controller('TicketcloseNotificationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, reminderService, $uibModal, $stateParams, $state, ticketService) {
    $scope.template = TemplateService.getHTML("content/ticketclose-notification/ticketclose-notification.html");
    TemplateService.title = "Ticketclose Notification"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "notification-main"
    $scope.navigation = NavigationService.getNavigation();
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();

    //REMINDER SECTION

    reminderService.findReminderOfPendingSnoozeByUser(function (data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
    });


    reminderService.totalNumberOfReminders(function (data) {
        $scope.totalReminders = data;
        // console.log("$scope.totalReminders", $scope.totalReminders);
    });

    reminderService.totalNumberOfCompletedReminders(function (data) {
        $scope.totalCompletedReminder = data;
        // console.log("res---totalCompletedReminder--", $scope.totalCompletedReminder);
    });


    reminderService.totalNumberOfPendingReminders(function (data) {
        $scope.totalPendingReminders = data;
        // console.log("$scope.totalPendingReminders--", $scope.totalPendingReminders);
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

    ticketService.totalOpenTickets(function (data) {
        // $scope.ticketDetails = data;
        $scope.ticketDetails = _.slice(data, 0, 5);
        console.log(" $scope.ticketDetails --", $scope.ticketDetails);

    });

    // ticketService.totalClosedTickets(function (data) {
    //     $scope.ticketDetails = data;
    // });

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


    $scope.getClosedTickets = function () {
        ticketService.totalClosedTickets(function (data) {
            // $scope.ticketDetails = data;
            $scope.ticketDetails = _.slice(data, 0, 5);
        });
    }


    $scope.getOpenTickets = function () {
        ticketService.totalOpenTickets(function (data) {
            // $scope.ticketDetails = data;
            // console.log("----109----", data.results);
            $scope.ticketDetails = _.slice(data.results, 0, 5);

        });
    }



    ticketService.totalClosedTickets(function (data) {
        $scope.ticketData = data;
    });


    $scope.askRegistration = function () {
        $scope.productCheck = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/productCheck.html",
            scope: $scope,
            backdrop: 'static',
            windowClass: 'app-modal-window'
        });
    }


    $scope.data = {};
    $scope.yesno = function () {
        $scope.yes = true;

        var user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Product/ticketNotGenerated", {
            user: user
        }, function (data) {
            $scope.remainingProduct = data.data;
            console.log("hjhsakf", $scope.remainingProduct)
        })
    }
    //for ticket block end

    $scope.deleteReminder = function (data) {
        $scope.accordianNotification.close();
        $scope.delete = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/cofirmDelete.html",
            scope: $scope,
            windowClass: 'app-modal-window',
            backdrop: 'static',
        });
        $scope.accordianNotification.close();
        $scope.confirmDelete = function () {
            var changeStatusData = {};
            changeStatusData._id = data;
            NavigationService.apiCallWithData("Reminder/delete", changeStatusData, function (res) {
                if (res.value == true) {
                    $state.reload();
                }
            });
        }
    }

});