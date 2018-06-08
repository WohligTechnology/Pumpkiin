myApp.controller('ProductRegistrationCtrl', function ($scope, TemplateService, $uibModal, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/productRegistration/productRegistration.html");
    TemplateService.title = "product Registration"; //This is the Title of the Website
    TemplateService.landingheader = "";
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    var circle1;
    $scope.activePage = 'circle1';
    $scope.productImages = [];
    $scope.productImages.image = {};
    $scope.makeActive = function (click) {
        $('.' + click).addClass("timeline-active");
        $scope.activePage = click;
        if (click) {
            $('.' + click).nextAll().removeClass("timeline-active");
        }
    };

    $scope.registration = $uibModal.open({
        animation: true,
        templateUrl: "views/modal/registration.html",
        scope: $scope,
        windowClass: 'app-modal-window'
    });

    $scope.pumpkinRegistration = function () {
        $scope.pumpRegistration = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/pumpRegistration.html",
            scope: $scope,
            // windowClass: 'app-modal-window'
        });
        $scope.registration.close();
    }
    NavigationService.apiCallWithoutData("Brand/getAllBrand", function (res) {

    });
    NavigationService.apiCallWithoutData("Retailer/getAllRetailer", function (res) {

    });

    $scope.saveProduct = function (product) {
        $scope.makeActive('circle2');
        $scope.callProduct();
        // product.productImages = [];
        // _.forEach(product.images, function (img) {
        //     product.productImages.push({
        //         image: img,
        //     });
        // });
        // if ($scope.product_id) {
        //     product._id = $scope.product_id;
        //     NavigationService.apiCallWithData("Product/saveProduct", product, function (res) {
        //         $scope.product_id = res.data._id;
        //         $scope.makeActive('circle2');
        //         $scope.callProduct();
        //     });
        // } else {
        //     NavigationService.apiCallWithData("Product/save", product, function (res) {
        //         $scope.product_id = res.data._id;
        //         $scope.makeActive('circle2');
        //         $scope.callProduct();
        //     });
        // }

    }
    $scope.data = {};
    $scope.callProduct = function () {
        $scope.dataToGet = {};
        $scope.insuranceDetails = {};
        $scope.warrantyDetails = {};
        $scope.dataToGet._id = $scope.product_id;
        NavigationService.apiCallWithData("Product/getOne", $scope.dataToGet, function (res) {
            $scope.data = res.data;
            if (res.data.purchasedate) {
                $scope.data.purchasedate = new Date(res.data.purchasedate);
            }
            if (res.data.productImages) {
                $scope.data.getImages = res.data.productImages;
            }
            if (res.data.purchaseproof) {
                $scope.data.getPurchaseImages = res.data.purchaseproof;
            }
            if (res.data.insuranceExpDate) {
                $scope.data.insuranceExpDate = new Date(res.data.insuranceExpDate);
            }
            if (res.data.warrantyExpDate) {
                $scope.data.warrantyExpDate = new Date(res.data.warrantyExpDate);
            }
        });
    }

    $scope.userData = {};
    $scope.addeduser = [];
    $scope.addUser = function (data) {
        NavigationService.apiCallWithData("WebUser/save", data, function (res) {
            if (res.value == true) {
                $scope.updateUser = {};
                $scope.updateUser.userId = "5b00213f78dcc437c34cc815";
                $scope.updateUser.memberId = res.data._id;
                NavigationService.apiCallWithData("WebUser/addUserRelationMember", $scope.updateUser, function (response) {
                    $scope.userData = {};
                    $scope.addeduser.push({
                        name: data.name,
                        relation: data.relation,
                        mobile: data.mobile
                    });

                });
            }
        });
    };

    $scope.removedUser = function (id, $index) {
            $scope.addeduser.splice($index, 1);
            $scope.removeMember = {};
            $scope.removeMember.mobile = id.mobile;
            $scope.removeMember.userId = "5b00213f78dcc437c34cc815";
            NavigationService.apiCallWithData("WebUser/removeUserRelationMember", $scope.removeMember, function (response) {


            });
        },
        $scope.savepurchaseDetails = function (purchase) {
            $scope.makeActive('circle3');
            $scope.callProduct();
            // purchase.purchaseproof = [];
            // purchase._id = $scope.product_id;
            // _.forEach(purchase.images, function (img) {
            //     purchase.purchaseproof.push({
            //         proofImage: img,
            //     });
            // });
            // NavigationService.apiCallWithData("Product/saveProduct", purchase, function (res) {
            //     $scope.product_id = res.data._id;
            //     $scope.makeActive('circle3');
            //     $scope.callProduct();
            // });
        },

        $scope.addWarrantyDetails = function (Warranty) {
            Warranty._id = $scope.product_id;
            NavigationService.apiCallWithData("Product/saveProduct", Warranty, function (res) {
                $scope.callProduct();
            });
        },
        $scope.addInsuranceDetails = function (insurance) {
            insurance._id = $scope.product_id;
            NavigationService.apiCallWithData("Product/saveProduct", insurance, function (res) {
                $scope.callProduct();
            });
        },
        $scope.goToNxtTab = function () {
            $scope.dataTosave = {};
            $scope.dataTosave._id = $scope.product_id;
            $scope.dataTosave.doneBy = "User";
            $scope.dataTosave.status = "Confirmed";
            NavigationService.apiCallWithData("Product/saveProduct", $scope.dataTosave, function (res) {
                $scope.callProduct();
            });
            $scope.makeActive('circle4');
        },
        $scope.submitDocuments = function (docs) {
            console.log("*************", docs);

            docs.purchaseproof = [];
            docs.purchaseproof.push({
                proofImage: docs.purchaseproof1
            });
            docs.status = "Pending";
            NavigationService.apiCallWithData("Product/save", docs, function (res) {
                console.log("inside submit documents api", res);
            });
        },
        $scope.accessoriesMain = [{
            "name": "Accessories Name",
            "relation": "Accessories",
        }, {
            "name": "Accessories Name",
            "relation": "Accessories",
        }, {
            "name": "Accessories Name",
            "relation": "Accessories",
        }, {
            "name": "Accessories Name",
            "relation": "Accessories",
        }];
});