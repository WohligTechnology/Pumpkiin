myApp.controller('ClosedTicketcreationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/closedTicketcreation/closedTicketcreation.html");
    TemplateService.title = "Closed Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
});