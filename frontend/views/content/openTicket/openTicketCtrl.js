myApp.controller('OpenTicketCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/openTicket/openTicket.html");
    TemplateService.landingheader = "";
    TemplateService.title = "Open Ticket"; //This is the Title of the Website
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();

});