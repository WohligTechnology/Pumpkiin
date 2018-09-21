myApp.controller('ProductDetailRegisteredCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $stateParams, $state) {
    $scope.template = TemplateService.getHTML("content/productDetailRegistered/registered.html");
    TemplateService.title = "Product Detail Registered"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "registration";
    $scope.navigation = NavigationService.getNavigation();
    var usersData = [];
    $scope.jstrgValue = $.jStorage.get('userData');
    $scope.userData = {};
    $scope.productDetails = {};

    $scope.relation = [{
        "name": "Andrew John",
        "relation": "Brother"
    }, {
        "name": "Anther Bruter",
        "relation": "Brother"
    }];

    $scope.relationsForUser = ["Son", "Daughter", "Father", "Mother", "Grand Father", "Grand Mother", "Aunt", "Uncle", "Niece", "Nephew"]


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

    var ticketDataToSend = {};
    ticketDataToSend.user = $scope.jstrgValue._id;
    NavigationService.apiCallWithData("Ticket/getAllTickets", ticketDataToSend, function (res) {
        if (res.value == true) {
            $scope.ticketData = res.data;
            // console.log("$scope.ticketData-----", $scope.ticketData);
        }
    });


    if ($scope.jstrgValue._id) {

        $scope.getProduct = function () {
            var dataToSend = {};
            dataToSend._id = $stateParams.id
            NavigationService.apiCallWithData("Product/getOne", dataToSend, function (res) {
                if (res.value == true) {
                    $scope.productDetails = res.data;
                    if ($scope.productDetails.productImages) {
                        $scope.setImg = $scope.productDetails.productImages[0];
                    }
                    // console.log("$scope.productDetails", $scope.productDetails);
                    if (res.data.purchaseDate) {
                        $scope.productDetails.purchaseDate = new Date(res.data.purchaseDate);
                    }
                    if (res.data.insuranceExpDate) {
                        $scope.productDetails.insuranceExpDate = new Date(res.data.insuranceExpDate);
                    }
                    if (res.data.warrantyExpDate) {
                        $scope.productDetails.warrantyExpDate = new Date(res.data.warrantyExpDate);
                    }
                    // console.log(" $scope.productDetails", $scope.productDetails);

                    var now = moment(new Date()),
                        end = moment($scope.productDetails.warrantyExpDate),
                        days = end.diff(now, 'days');
                    // console.log("----days-----", days)
                    if (days <= 30) {
                        $scope.productDetails.ribbon = true;
                    } else {
                        $scope.productDetails.ribbon = false;
                    }

                    console.log("days left", $scope.productDetails.ribbon)

                    var getUserDetails = {};
                    getUserDetails._id = $scope.productDetails.user._id;
                    NavigationService.apiCallWithData("User/getOne", getUserDetails, function (res) {
                        if (res.value == true) {
                            $scope.userDetails = res.data;
                            // console.log("  $scope.userDetails", $scope.userDetails);

                        }
                    });
                }
            });
        }

        $scope.getProduct();


        $scope.addUser = function (data) {
            data._id = $scope.jstrgValue._id;
            console.log("datae", data);

            // data.productId = $scope.productDetails._id;
            NavigationService.apiCallWithData("User/addRelation", data, function (response) {
                // console.log("response", response);
                if (response.value == true) {
                    toastr.success("Relation added successfully");
                    $scope.userData = null;
                    $scope.getProduct();
                } else {
                    toastr.error("Check The Mobile Number");
                }
            });
        }


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
                    console.log("IF data.brand", data.brand);
                }
                if (data1.retailer) {
                    data.retailer = data1.retailer._id;
                    console.log("IF data.retailer", data.retailer);
                }
            }
            // console.log("------------", data);
            NavigationService.apiCallWithData("Product/saveProduct", data, function (response) {
                console.log("response", response);
                $state.reload();
            });
        }


        $scope.productDetails.productAccessory = [];
        $scope.addAccessories = function (data) {
            if (data.accessories) {
                $scope.productDetails.productAccessory.push(data.accessories);
                data.accessories = "";
            }
        }

        $scope.remove = function (index) {
            $scope.productDetails.productAccessory.splice(index, 1);
        };

        $scope.addProduct = function () {
            // console.log(" $scope.productDetails", $scope.productDetails);
            NavigationService.apiCallWithData("Product/saveProduct", $scope.productDetails, function (res) {
                $state.reload();
            });
        }

        $scope.setImage = function (data) {
            // console.log("data", data);
            $scope.setImg = data;
        }

        $scope.removeRelation = function (data) {
            // console.log("data", data)
            _.remove($scope.productDetails.relatedUser, function (n) {
                return n._id == data;
            });
            // console.log("$scope.productDetails.relatedUser", $scope.productDetails.relatedUser);
            NavigationService.apiCallWithData("Product/save", $scope.productDetails, function (response) {
                if (response.value == true) {
                    toastr.success("User removed from Product");
                }
            });
        }

    }

});