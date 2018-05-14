myApp.controller('ProductDetailUnRegisteredCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/landing/unregistered.html");
    TemplateService.title = "Landing"; //This is the Title of the Website
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();

});