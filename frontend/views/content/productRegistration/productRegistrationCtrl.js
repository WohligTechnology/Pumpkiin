myApp.controller('ProductRegistrationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/productRegistration/productRegistration.html");
    TemplateService.title = "product Registration"; //This is the Title of the Website
    TemplateService.landingheader="";
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();

});