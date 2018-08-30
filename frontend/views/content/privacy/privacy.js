myApp.controller('PrivacyCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/privacy/privacy.html");
    TemplateService.title = "Privacy Policy"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();
    if($.jStorage.get("userData")){
        TemplateService.landingheader = "";
    }
    else{
        TemplateService.header = "";
    }
});