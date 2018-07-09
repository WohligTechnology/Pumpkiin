myApp.controller('ProductDetailRegisteredCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $stateParams) {
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


    var dataToSend = {};
    dataToSend._id = $stateParams.id
    NavigationService.apiCallWithData("Product/getOne", dataToSend, function (res) {
        if (res.value == true) {
            $scope.productDetails = res.data;
            console.log(" $scope.productDetails", $scope.productDetails)
        }
    });

    $scope.changeName = function (data) {
        console.log("data---------", data)
    }

});