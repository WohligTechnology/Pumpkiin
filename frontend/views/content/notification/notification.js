myApp.controller('NotificationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $state, reminderService) {
    $scope.template = TemplateService.getHTML("content/notification/notification.html");
    TemplateService.landingheader = "";
    TemplateService.title = "Notification"; //This is the Title of the Website
    $scope.jstrgValue = $.jStorage.get('userData');

    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();

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
        console.log("data", data);
        var changeStatusData = {};
        changeStatusData._id = data;
        NavigationService.apiCallWithData("Reminder/delete", changeStatusData, function (res) {
            if (res.value == true) {
                $state.reload();
            }
        });
    }

});