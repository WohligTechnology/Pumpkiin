var mySwiper;
myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $state) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        TemplateService.header = "";
        TemplateService.footer = "";
        TemplateService.cssMain = "main";
        $scope.navigation = NavigationService.getNavigation();
        // $('.select-box').selectpicker({
        //     dropupAuto: false
        // });

        console.log("hey")

        $scope.submitForm = function (data) {
            console.log("This is it");
            return new Promise(function (callback) {
                $timeout(function () {
                    callback();
                }, 5000);
            });
        };
        // if(product1 && product2){
        //     $("#clickSubmit").removeClass("disabled");
        // }

        $scope.openContact = function (product1, product2) {
            $scope.userData = {};
            $scope.userData.subject = "My " + product1 + ",needs " + product2;
            $scope.contactModal = $uibModal.open({
                animation: true,
                templateUrl: "views/modal/contact.html",
                scope: $scope,
                backdrop: 'static'
            });
        }

        $scope.addUser = function (data) {
            console.log("data", data);
            $.jStorage.set("UserName", data);

            NavigationService.apiCallWithData("ContactUs/sendEmail", data, function (result) {
                console.log("result", result);
                if (result.value) {
                    toastr.success("We will Contact you soon")
                    $state.reload();
                }
            })
        }

        $timeout(function () {
            mySwiper = new Swiper('.swiper-container', {
                // Optional parameters
                direction: 'horizontal',
                loop: false,
                slidesPerView: 2,
                slidesPerGroup: 2,
                breakpoints: {
                    // when window width is <= 320px
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 10
                    },
                    // when window width is <= 480px
                    480: {
                      slidesPerView: 1,
                      spaceBetween: 10
                    },
                    // when window width is <= 640px
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20
                    }
                  },
                // Navigation arrows
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            })
        }, 500);

        // $scope.rate = 7;
        // $scope.max = 10;
        // $scope.isReadonly = false;

        // $scope.hoveringOver = function(value) {
        //   $scope.overStar = value;
        //   $scope.percent = 100 * (value / $scope.max);
        // };

        $scope.ratingStates = [{
                stateOn: 'glyphicon-ok-sign',
                stateOff: 'glyphicon-ok-circle'
            },
            {
                stateOn: 'glyphicon-star',
                stateOff: 'glyphicon-star-empty'
            },
            {
                stateOn: 'glyphicon-heart',
                stateOff: 'glyphicon-ban-circle'
            },
            {
                stateOn: 'glyphicon-heart'
            },
            {
                stateOff: 'glyphicon-off'
            }
        ];

        $scope.product = [{
                name: 'AC'
            },
            {
                name: 'Desktop'
            },
            {
                name: 'Geyser'
            },
            {
                name: 'Laptop'
            },
            {
                name: 'Microwave'
            }, {
                name: 'Mobiles'
            }, {
                name: 'Musical instruments'
            }, {
                name: 'Refrigerator'
            }, {
                name: 'Tablet'
            }, {
                name: 'TV'
            }, {
                name: 'Washing Machine'
            }, {
                name: 'Water Purifier'
            }
        ];
        $scope.service = [{
            name: 'Repair'
        }, {
            name: 'Service'
        }]

        $scope.testimonials = [{
            "name": "Shreyas",
            "message": "In such busy times, Pumpkiin is a boon. Loved it!",
            "rate": "5"
        }, {
            "name": "Priti",
            "message": "No more going through IVRs, or coordinating with service personnel. Pumpkiin does it all! Wonderful!",
            "rate": "5"
        }, {
            "name": "Parth",
            "message": "Fantastic service, peace of mind.",
            "rate": "5"
        }, {
            "name": "Priyanka",
            "message": "Just one message, and Pumpkiin took care of the rest. So useful!",
            "rate": "5"
        }]

    })

    .controller('LinksCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/links.html");
        TemplateService.title = "Links"; // This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })

    // Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });