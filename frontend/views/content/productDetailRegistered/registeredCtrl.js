myApp.controller('ProductDetailRegisteredCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/productDetailRegistered/registered.html");
    TemplateService.title = "Product Detail Registered"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.relation = [{
        "name": "First Last Name",
        "relation": "Brother",
    }, {
        "name": "First Last Name",
        "relation": "Brother",
    }];
    $scope.accessoriesMain = [{
        "name": "Accessories Name",
        "relation": "Accessories",
    }];

});