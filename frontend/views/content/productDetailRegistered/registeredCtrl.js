myApp.controller('ProductDetailRegisteredCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $stateParams, $state) {
    $scope.template = TemplateService.getHTML("content/productDetailRegistered/registered.html");
    TemplateService.title = "Product Detail Registered"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    var usersData = [];
    $scope.jstrgValue = $.jStorage.get('userData');
    $scope.userData = {};

    $scope.relation = [{
        "name": "Andrew John",
        "relation": "Brother",
    }, {
        "name": "Anther Bruter",
        "relation": "Brother",
    }];

    if ($scope.jstrgValue._id) {
        $scope.addUser = function (data) {
            // console.log("datae", data);
            data._id = $scope.jstrgValue._id;
            data.productId = $scope.productDetails._id;
            NavigationService.apiCallWithData("User/addUserRelationMember", data, function (response) {
                console.log("response", response);
                if (response.value == true) {
                    toastr.success("Relation added successfully");
                    $scope.userData = null;
                    $scope.getProduct();
                }
            });
        }
    }

    $scope.getProduct = function () {
        var dataToSend = {};
        dataToSend._id = $stateParams.id
        NavigationService.apiCallWithData("Product/getOne", dataToSend, function (res) {
            if (res.value == true) {
                $scope.productDetails = res.data;
                console.log("$scope.productDetails", $scope.productDetails);
                if (res.data.purchaseDate) {
                    $scope.productDetails.purchaseDate = new Date(res.data.purchaseDate);
                }
                if (res.data.insuranceExpDate) {
                    $scope.productDetails.insuranceExpDate = new Date(res.data.insuranceExpDate);
                }
                if (res.data.warrantyExpDate) {
                    $scope.productDetails.warrantyExpDate = new Date(res.data.warrantyExpDate);
                }
                // console.log(" $scope.productDetails", $scope.productDetails)
            }
        });
    }

    $scope.getProduct();


    $scope.makeEditable = function () {
        document.getElementById('productName').readOnly = false;
        document.getElementById('serialNumber').readOnly = false;
        document.getElementById('purchaseDate').readOnly = false;
        document.getElementById('purchasePrice').readOnly = false;
    }


    NavigationService.apiCallWithoutData("Brand/getAllBrand", function (res) {
        if (res.value == true) {
            $scope.brandsData = res.data;
            // console.log("$scope.brandsData-----", $scope.brandsData)
        }
    });

    NavigationService.apiCallWithoutData("Retailer/getAllRetailer", function (res) {
        if (res.value == true) {
            $scope.retaillersData = res.data;
            // console.log("$scope.retaillersData-----", $scope.retaillersData);
        }
    });

    $scope.updateData = function (data, data1) {


        if (!_.isEmpty(data1)) {
            _.each(data1.Users, function (x) {
                var sendData1 = {};
                sendData1.relationType = x.relationType;
                sendData1.user = x.user._id;
                usersData.push(sendData1);
            });

            data.relatedUser = usersData;
            if (data1.brand) {
                data.brand = data1.brand._id;
            }
            if (data1.retailer) {
                data.retailer = data1.retailer._id;
            }
        }
        // console.log("------------", data);
        NavigationService.apiCallWithData("Product/saveProduct", data, function (response) {
            console.log("response", response);
            $state.reload();
        });
    }

    $scope.accessoriesMain = [];
    $scope.addAccessories = function (data) {
        if (data.accessories) {
            $scope.accessoriesMain.push(data.accessories);
            data.accessories = "";
        }
    }
    $scope.remove = function (index) {
        $scope.accessoriesMain.splice(index, 1);
    };

    $scope.addProduct = function () {
        $scope.productDetails.productAccessory = $scope.accessoriesMain;
        console.log(" $scope.productDetails", $scope.productDetails);
        NavigationService.apiCallWithData("Product/saveProduct", $scope.productDetails, function (res) {
            $state.reload();
        });
    }

});