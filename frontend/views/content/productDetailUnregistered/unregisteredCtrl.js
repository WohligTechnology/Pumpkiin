myApp.controller('ProductDetailUnregisteredCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/productDetailUnregistered/unregistered.html");
    TemplateService.title = "Product Detail Unregistered"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "unregistration";
    $scope.navigation = NavigationService.getNavigation();

});