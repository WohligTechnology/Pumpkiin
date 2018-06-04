myApp.controller('ProfileCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/profile/profile.html");
    TemplateService.title = "Profile"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.relation = [{
        "name": "First Last Name",
        "relation": "Brother",
    }, {
        "name": "First Last Name",
        "relation": "Brother",
    }];
});