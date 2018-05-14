myApp.controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/login/login.html");
    TemplateService.title = "Login"; //This is the Title of the Website
    TemplateService.header = "";
    TemplateService.footer = "";
    $scope.navigation = NavigationService.getNavigation();

});