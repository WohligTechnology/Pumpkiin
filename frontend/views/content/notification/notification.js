myApp.controller('NotificationCtrl', function ($scope, TemplateService, ticketService, NavigationService, $timeout, toastr, $http, $uibModal, $state, reminderService) {
    $scope.template = TemplateService.getHTML("content/notification/notification.html");
    TemplateService.landingheader = "";
    TemplateService.title = "Notification"; //This is the Title of the Website
    $scope.jstrgValue = $.jStorage.get('userData');

    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    $scope.maxRow = 5;
    //REMINDER SECTION
    $scope.changePage = function (pageno) {
        $scope.currentPage = pageno;
        var start = (pageno - 1) * $scope.maxRow;
        var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
        $scope.showLessReminders = _.slice($scope.allReminders, start, end);
        console.log(" $scope.showLessReminders", $scope.showLessReminders);
    }
    reminderService.findReminderOfPendingSnoozeByUser(function (data) {
        $scope.allReminders = data;
        $scope.changePage(1);
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
            $scope.ticketDetails = _.slice(data, 0, 5);
        });
    }

    //for ticket block end


    $scope.chnageStatus = function (data) {
        console.log("data", data);
        var changeStatusData = {};
        changeStatusData.status = 'Completed';
        changeStatusData._id = data;
        NavigationService.apiCallWithData("Reminder/save", changeStatusData, function (res) {
            if (res.value == true) {
                $state.reload();
            }
        });
    }

    $scope.deleteReminder = function (data) {
        $scope.delete = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/cofirmDelete.html",
            scope: $scope,
            windowClass: 'app-modal-window',
            backdrop: 'static'
        });
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
    $scope.selectedReminders = [];
    $scope.checkCircle = function (data) {
        console.log("id", data);
        console.log("$scope.showLessReminders", $scope.showLessReminders);

        for (i = 0; i < 4; i++) {
            if ($scope.showLessReminders[i]._id == data) {
                $scope.selectedReminders.push(data);
                console.log("$scope.selectedReminders", $scope.selectedReminders);
                $(".blue-circle").toggleClass("selected");
            }
        }
    }
});