myApp.controller('NotificationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $state) {
    $scope.template = TemplateService.getHTML("content/notification/notification.html");
    TemplateService.landingheader = "";
    TemplateService.title = "Notification"; //This is the Title of the Website
    $scope.jstrgValue = $.jStorage.get('userData');

    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    $scope.reminderModalOpen = function () {
        $scope.addReminder = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addReminder.html",
            scope: $scope,
            windowClass: 'app-modal-window'
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