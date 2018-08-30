myApp.controller('TermsCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/terms/terms.html");
    TemplateService.title = "Terms & Conditions"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();
    if($.jStorage.get("userData")){
        TemplateService.landingheader = "";
    }
    else{
        TemplateService.header = "";
    }
});