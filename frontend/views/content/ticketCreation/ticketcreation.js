myApp.controller('TicketCreationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal) {
    $scope.template = TemplateService.getHTML("content/ticketCreation/ticketCreation.html");
    TemplateService.title = "Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.rate = 2;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.newUserModalOpen = function () {
        $scope.addNewUser = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addNewUser.html",
            scope: $scope,
        });
    }
});