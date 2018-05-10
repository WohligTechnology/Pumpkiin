myApp.controller('ProductDetailRegisteredCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/landing/registered.html");
    TemplateService.title = "Landing"; //This is the Title of the Website
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();

});