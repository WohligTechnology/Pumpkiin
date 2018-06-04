var mySwiper;
myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        TemplateService.header = "";
        $scope.navigation = NavigationService.getNavigation();

        $scope.submitForm = function (data) {
            console.log("This is it");
            return new Promise(function (callback) {
                $timeout(function () {
                    callback();
                }, 5000);
            });
        };

        $timeout(function () {
            mySwiper = new Swiper('.swiper-container', {
                // Optional parameters
                width: '700',
                direction: 'horizontal',
                loop: true,
                slidesPerView:2,
                slidesPerGroup:2,

                // Navigation arrows
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            })
        }, 500);

        $scope.rate = 7;
        $scope.max = 10;
        $scope.isReadonly = false;

        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

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
        $scope.countries=[{name: 'Afghanistan'}, 
        {name: 'Åland Islands'}, 
        {name: 'Albania'}, 
        {name: 'Algeria'}, 
        {name: 'American Samoa'}, 
        {name: 'AndorrA'}, 
        {name: 'Angola'}, 
        {name: 'Anguilla'}, 
        {name: 'Antarctica'}, 
        {name: 'Antigua and Barbuda'}]

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