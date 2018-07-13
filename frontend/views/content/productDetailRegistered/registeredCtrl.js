myApp.controller('ProductDetailRegisteredCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $stateParams) {
    $scope.template = TemplateService.getHTML("content/productDetailRegistered/registered.html");
    TemplateService.title = "Product Detail Registered"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();

    $scope.relation = [{
        "name": "Andrew John",
        "relation": "Brother",
    }, {
        "name": "Anther Bruter",
        "relation": "Brother",
    }];
    $scope.accessoriesMain = ["Headset", "Accessories Name"];
    $scope.addAccessories = function (data) {
    if (data.accessories) {
        $scope.accessoriesMain.push(data.accessories);
        data.accessories = "";
    }
}
$scope.remove = function (index) {
    $scope.accessoriesMain.splice(index, 1);
};

    $scope.makeEditable = function () {
        document.getElementById('productName').readOnly = false;
        document.getElementById('brandName').readOnly = false;
        document.getElementById('serialNumber').readOnly = false;
        document.getElementById('purchaseDate').readOnly = false;
        document.getElementById('purchasePrice').readOnly = false;
        document.getElementById('Retailer').readOnly = false;
    }

    var dataToSend = {};
    dataToSend._id = $stateParams.id
    NavigationService.apiCallWithData("Product/getOne", dataToSend, function (res) {
        if (res.value == true) {
            $scope.productDetails = res.data;
            console.log(" $scope.productDetails", $scope.productDetails)
        }
    });

    $scope.changeName = function (data, data1) {
        console.log("data---------", data);
        console.log("data1---------", data1);
        // var dataToSend = {};
        // dataToSend._id = $stateParams.id
        // NavigationService.apiCallWithData("Product/getOne", dataToSend, function (res) {
        //     if (res.value == true) {
        //         $scope.productDetails = res.data;
        //         console.log(" $scope.productDetails", $scope.productDetails)
        //     }
        // });

    }

});