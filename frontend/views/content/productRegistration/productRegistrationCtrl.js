myApp.controller('ProductRegistrationCtrl', function ($scope, TemplateService, $uibModal, NavigationService, $timeout, toastr, $http, $state) {
    $scope.template = TemplateService.getHTML("content/productRegistration/productRegistration.html");
    TemplateService.title = "product Registration"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "main"
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    var circle1;
    $scope.activePage = 'circle1';
    $scope.productImages = [];
    $scope.productImages.image = {};
    $scope.userData = {};
    $scope.addeduser = [];
    $scope.data = {};
    $scope.jstrgValue = $.jStorage.get('userData');


    $scope.makeActive = function (click) {
        console.log("click", click);
        $('.' + click).addClass("timeline-active");
        $scope.activePage = click;

        if (click) {
            $('.' + click).nextAll().removeClass("timeline-active");
        }
    };

    $scope.relationsForUser = ["Son", "Daughter", "Father", "Mother", "Grand Father", "Grand Mother", "Aunt", "Uncle", "Niece", "Nephew"]


    $scope.registration = $uibModal.open({
        animation: true,
        templateUrl: "views/modal/registration.html",
        scope: $scope,
        windowClass: 'app-modal-window',
        backdrop: 'static'
    });

    $scope.pumpkinRegistration = function () {
        $scope.pumpRegistration = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/pumpRegistration.html",
            scope: $scope,
            backdrop: 'static',
            windowClass: 'app-modal-window'
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

    // if ($scope.jstrgValue._id) {

    $scope.getUserData = function () {
        var data = {};
        data._id = $scope.jstrgValue._id;
        NavigationService.apiCallWithData("User/getOne", data, function (response) {
            if (response.value == true) {
                $scope.userDataForRegist = response.data;
                // console.log("$scope.userDataForRegist ", $scope.userDataForRegist);
            }
        });
    }

    $scope.getUserData();

    $scope.saveProduct = function (product) {
        // $scope.product_id = {};

        console.log("saveProduct-------------------", product)
        console.log("$scope.product_id-------------------", $scope.product_id)
        // product.productImages = [];
        // product.productImages = product.images;
        product.user = $scope.jstrgValue._id;
        // product.brand = product.brand._id;
        if ($scope.product_id) {
            product._id = $scope.product_id;
            console.log("product id when back", $scope.product_id)
            NavigationService.apiCallWithData("Product/saveProduct", product, function (res) {
                $scope.product_id = res.data._id;
                console.log("if", res.data);
                $scope.activePage = 'circle2';
                // $scope.makeActive('circle2');
                $scope.checkmark1 = true;
            });
        } else {
            NavigationService.apiCallWithData("Product/save", product, function (res) {
                console.log("else", res);
                $scope.product_id = res.data._id;
                console.log("res.data", res.data);
                $scope.activePage = 'circle2';
                // $scope.makeActive('circle2');
                $scope.checkmark1 = true;
            });
        }
    }

    $scope.addUser = function () {
        // console.log("$scope.product_id", $scope.product_id);
        $scope.userData._id = $scope.jstrgValue._id;
        console.log("datae", $scope.userData);

        // data.productId = $scope.product_id;
        NavigationService.apiCallWithData("User/addRelation", $scope.userData, function (response) {
            $scope.userData = {};
            console.log("response", response);
            if (response.value == true) {
                toastr.success("Relation added successfully");
                $scope.getUserData();
            } else {
                toastr.error("The Mobile Number is already a user");
            }
        });
    }

    $scope.savepurchaseDetails = function (purchase) {
        if (purchase) {
            purchase.relatedUser = [];
            console.log("purchase.Users----", purchase.Users)
            // _.each(purchase.Users, function (x) {
            //     var dataToSend = {};
            //     dataToSend.relationType = null;
            //     dataToSend.user = x._id;
            //     purchase.relatedUser.push(dataToSend);
            // });
            purchase.relatedUser = purchase.Users;
            delete purchase.Users;
            console.log("purchase----", purchase)
            // console.log("$scope.product_id", $scope.product_id);
            purchase._id = $scope.product_id;
            NavigationService.apiCallWithData("Product/saveProduct", purchase, function (res) {
                console.log("savepurchaseDetails---", res)
                $scope.makeActive('circle3');
                $scope.checkmark2 = true;
            });
        }
    }

    $scope.goToNxtTab = function (data) {
        console.log("data---", data);
        if ($scope.product_id) {
            data._id = $scope.product_id;
            NavigationService.apiCallWithData("Product/saveProduct", data, function (res) {
                console.log("res.data", res.data);
                $scope.makeActive('circle4');
                $scope.checkmark3 = true;
            });
        }

        var dataForReminderWarranty = {};
        dataForReminderWarranty.user = $scope.jstrgValue._id;
        dataForReminderWarranty.email = $scope.jstrgValue.email;
        dataForReminderWarranty.name = $scope.jstrgValue.name;
        dataForReminderWarranty.title = "Warranty expiry";
        dataForReminderWarranty.status = "Pending";
        dataForReminderWarranty.description = "End of warranty period";
        dataForReminderWarranty.dateOfReminder = data.warrantyExpDate;
        NavigationService.apiCallWithData("Reminder/reminderMail", dataForReminderWarranty, function (res) {});

        var dataForReminderInsurance = {};
        dataForReminderInsurance.user = $scope.jstrgValue._id;
        dataForReminderWarranty.email = $scope.jstrgValue.email;
        dataForReminderWarranty.name = $scope.jstrgValue.name;
        dataForReminderInsurance.title = "Insurance expiry";
        dataForReminderInsurance.status = "Pending";
        dataForReminderInsurance.description = "End of insurance period";
        dataForReminderInsurance.dateOfReminder = data.insuranceExpDate;
        NavigationService.apiCallWithData("Reminder/reminderMail", dataForReminderInsurance, function (res) {});
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
    }

    $scope.addProduct = function () {
        // console.log("$scope.accessoriesMain", $scope.accessoriesMain);
        var accessoriesToSave = {};
        accessoriesToSave._id = $scope.product_id;
        accessoriesToSave.productAccessory = $scope.accessoriesMain;
        accessoriesToSave.status = 'Confirmed';
        accessoriesToSave.name = $scope.jstrgValue.name;
        accessoriesToSave.email = $scope.jstrgValue.email;
        NavigationService.apiCallWithData("Product/saveFinalProduct", accessoriesToSave, function (res) {
            toastr.success("Accessory added successfully");
            $state.go("productListing");
        });
    }

    $scope.callProduct = function () {
        $scope.dataToGet = {};
        $scope.dataToGet._id = $scope.product_id;
        NavigationService.apiCallWithData("Product/getOne", $scope.dataToGet, function (res) {
            $scope.data = res.data;
            console.log("$scope.data")
            if (res.data.purchaseDate) {
                $scope.data.purchaseDate = new Date(res.data.purchaseDate);
            }
            if (res.data.productImages) {
                $scope.data.getImages = res.data.productImages;
            }
            if (res.data.purchaseProof) {
                $scope.data.purchaseProof = res.data.purchaseProof;
            }
            if (res.data.insuranceExpDate) {
                $scope.data.insuranceExpDate = new Date(res.data.insuranceExpDate);
            }
            if (res.data.warrantyExpDate) {
                $scope.data.warrantyExpDate = new Date(res.data.warrantyExpDate);
            }
        });
    }


    $scope.submitDocuments = function (docs) {
        $scope.productInvoicePRError = false;
        if (docs.productInvoicePR) {
            // console.log("*************", docs);
            docs.status = "Pending";
            NavigationService.apiCallWithData("Product/save", docs, function (res) {
                // console.log("inside submit documents api", res);
                $scope.pumpRegistration.close();
                $scope.thanks = $uibModal.open({
                    animation: true,
                    templateUrl: "views/modal/upload-thanks.html",
                    scope: $scope,
                    windowClass: 'app-modal-window'
                });
            });
        } else {
            $scope.productInvoicePRError = true;
        }
    }

    // }

});