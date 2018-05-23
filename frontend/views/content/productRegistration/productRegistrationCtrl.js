myApp.controller('ProductRegistrationCtrl', function ($scope, TemplateService, $uibModal, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/productRegistration/productRegistration.html");
    TemplateService.title = "product Registration"; //This is the Title of the Website
    TemplateService.landingheader = "";
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    var circle1;
    $scope.activePage = 'circle1';
    $scope.productImages = [];
    $scope.productImages.image = {}
    $scope.makeActive = function (click) {
            $('.' + click).addClass("timeline-active");
            $scope.activePage = click;
            if (click) {
                $('.' + click).nextAll().removeClass("timeline-active");
            }
        },

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
            windowClass: 'app-modal-window'
        });
        $scope.registration.close();
    }
    $scope.saveProduct = function (data) {
            data.productImages = [];
            console.log("inside save product", data);
            _.forEach(data.images, function (img) {
                data.productImages.push({
                    image: img,
                });
            });

            console.log("$scope.productImages.image", data)
            NavigationService.apiCallWithData("Product/save", data, function (res) {
                console.log("after api called")
                $scope.makeActive('circle2');
            });
        },


        $scope.addeduser = [{
            "name": "First Last Name",
            "relation": "Brother",
        }, {
            "name": "First Last Name",
            "relation": "Brother",
        }, {
            "name": "First Last Name",
            "relation": "Brother",
        }, {
            "name": "First Last Name",
            "relation": "Brother",
        }];

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