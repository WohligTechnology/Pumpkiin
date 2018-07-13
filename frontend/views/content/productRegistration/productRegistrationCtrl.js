myApp.controller('ProductRegistrationCtrl', function ($scope, TemplateService, $uibModal, NavigationService, $timeout, toastr, $http, $state) {
    $scope.template = TemplateService.getHTML("content/productRegistration/productRegistration.html");
    TemplateService.title = "product Registration"; //This is the Title of the Website
    TemplateService.landingheader = "";
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    var circle1;
    $scope.activePage = 'circle1';
    $scope.productImages = [];
    $scope.productImages.image = {};
    $scope.jstrgValue = $.jStorage.get('userData');
    $scope.makeActive = function (click) {
        $('.' + click).addClass("timeline-active");
        $scope.activePage = click;
        if (click) {
            $('.' + click).nextAll().removeClass("timeline-active");
        }
    };

    $scope.availableColors = ["yellow", "blue", "pink"]

    $scope.getUserData = function () {
        var data = {};
        data._id = $scope.jstrgValue._id;
        NavigationService.apiCallWithData("User/getOne", data, function (response) {
            if (response.value == true) {
                $scope.userDataForRegist = response.data;
                console.log("$scope.userDataForRegist ", $scope.userDataForRegist);
            }
        });
    }

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

    $scope.saveProduct = function (product) {
        $scope.makeActive('circle2');
        $scope.callProduct();
        $scope.getUserData();
        // product.productImages = [];
        // product.productImages = product.images;
        // product.user = $scope.jstrgValue._id;
        // product.brand = product.brand._id;
        // if ($scope.product_id) {
        //     product._id = $scope.product_id;
        //     NavigationService.apiCallWithData("Product/saveProduct", product, function (res) {
        //         $scope.product_id = res.data._id;
        //         console.log("res.data", res.data);
        //         $scope.makeActive('circle2');
        //         $scope.callProduct();
        //     });
        // } else {
        //     NavigationService.apiCallWithData("Product/save", product, function (res) {
        //         $scope.product_id = res.data._id;
        //         console.log("res.data", res.data);
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
        // console.log("$scope.jstrgValue", $scope.jstrgValue._id);
        // console.log("datae", data);
        data._id = $scope.jstrgValue._id;
        NavigationService.apiCallWithData("User/addUserRelationMember", data, function (response) {
            // $scope.userData = {};
            console.log("response", response);
            if (response.value == true) {
                toastr.success("Relation added successfully");
                $scope.userData = null;
            } // $scope.addeduser.push({
            //     name: data.name,
            //     relation: data.relation,
            //     mobile: data.mobile
            // });
        });
    };

    $scope.removedUser = function (id, $index) {
            $scope.addeduser.splice($index, 1);
            $scope.removeMember = {};
            $scope.removeMember.mobile = id.mobile;
            $scope.removeMember.userId = "5b00213f78dcc437c34cc815";
            NavigationService.apiCallWithData("User/removeUserRelationMember", $scope.removeMember, function (response) {


            });
        },

        $scope.savepurchaseDetails = function (purchase) {
            console.log("purchase", purchase)
            $scope.makeActive('circle3');
            $scope.callProduct();

            // if (purchase) {
            //     purchase.purchaseProof = [];
            //     purchase.purchaseProof = purchase.images;
            //     purchase.retailer = purchase.retailer._id;
            //     purchase.relatedUser = [];
            //     _.each(purchase.Users, function (x) {
            //         purchase.relatedUser.push(x._id);
            //     });
            //     delete purchase.Users;
            //     delete purchase.images;
            //     console.log("purchase----", purchase)
            //     console.log("$scope.product_id", $scope.product_id);
            //     // if ($scope.product_id) {
            //     //     product._id = $scope.product_id;
            //     //     NavigationService.apiCallWithData("Product/saveProduct", product, function (res) {
            //     //         $scope.product_id = res.data._id;
            //     //         console.log("res.data", res.data);
            //     //         $scope.makeActive('circle3');
            //     //         $scope.callProduct();
            //     //     });
            //     // }
            // }
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


        $scope.goToNxtTab = function (data) {
            console.log("data---", data);
            $scope.makeActive('circle4');

            // if ($scope.product_id) {
            //     data._id = $scope.product_id;
            //     NavigationService.apiCallWithData("Product/saveProduct", data, function (res) {
            //         console.log("res.data", res.data);
            //         $scope.makeActive('circle4');
            //         $scope.callProduct();
            //     });
            // }

            var dataForReminderWarranty = {};
            dataForReminderWarranty.user = $scope.jstrgValue._id;
            dataForReminderWarranty.title = "Warranty expiry";
            dataForReminderWarranty.status = "Pending";
            dataForReminderWarranty.description = "End of warranty period";
            dataForReminderWarranty.dateOfReminder = data.warrantyExpDate;
            NavigationService.apiCallWithData("Reminder/save", dataForReminderWarranty, function (res) {

            });

            var dataForReminderInsurance = {};
            dataForReminderInsurance.user = $scope.jstrgValue._id;
            dataForReminderInsurance.title = "Insurance expiry";
            dataForReminderWarranty.status = "Pending";
            dataForReminderWarranty.description = "End of insurance period";
            dataForReminderInsurance.dateOfReminder = data.insuranceExpDate;
            NavigationService.apiCallWithData("Reminder/save", dataForReminderInsurance, function (res) {

            });

        },


        $scope.submitDocuments = function (docs) {
            console.log("*************", docs);
            // docs.status = "Pending";
            // NavigationService.apiCallWithData("Product/save", docs, function (res) {
            //     console.log("inside submit documents api", res);
            // });
        },

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

});