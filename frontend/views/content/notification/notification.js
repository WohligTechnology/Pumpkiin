myApp.controller('NotificationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal) {
    $scope.template = TemplateService.getHTML("content/notification/notification.html");
    TemplateService.landingheader = "";
    TemplateService.title = "Notification"; //This is the Title of the Website
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
});