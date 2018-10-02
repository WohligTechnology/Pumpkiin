myApp.controller('headerCtrl', function ($scope, TemplateService, $uibModal, $state, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });

    $scope.currentState = $state.current.name;
    var stateArray = ['login', 'verifyemail', 'privacy', 'terms'];
    var stateIndex = _.findIndex(stateArray, function (state) {
        return state == $scope.currentState;
    })
    if (_.isEmpty($.jStorage.get("userData")) && stateIndex == -1) {
        $state.go('home');
    }
    $.fancybox.close(true);
    $scope.data = {};
    // $scope.productList = [{
    //     name: "Samsung s7 in Mobile",
    //     img: "../img/ticketCreation/warranty.png"
    // }, {
    //     name: "Samsung s7 in Mobile Black"
    // }, {
    //     name: "Samsung s7 edge"
    // }];
    $scope.userInfo = $.jStorage.get('userData');
    // console.log("$scope.userInfo", $scope.userInfo)
    $scope.reminderModalOpen = function (data) {
        if (data) {
            $scope.getReminder(data);
        }
        $scope.addReminder = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addReminder.html",
            scope: $scope,
            backdrop: 'static'
        });
    }


    $scope.getReminder = function (data) {
        console.log("----------", data);
        var getReminder = {};
        getReminder._id = data;
        NavigationService.apiCallWithData("Reminder/getOne", getReminder, function (res) {
            console.log("res.data", res.data);
            $scope.data = res.data;
            if (res.data.dateOfReminder) {
                $scope.data.dateOfReminder = new Date(res.data.dateOfReminder)
            }
        });
    }

    $scope.saveReminder = function (data) {
        // console.log("----------", data);
        if ($scope.data._id) {
            $scope.data.status = 'Snooze';
            console.log("-----$scope.data-----", $scope.data);
            NavigationService.apiCallWithData("Reminder/save", $scope.data, function (res) {
                console.log("res.data", res.data);
                toastr.success("Reminder Snoozed Successfully");
                $scope.addReminder.close();
                $state.reload();
            });
        } else {
            // console.log("-----$scope.data-----", data);
            data.user = $scope.userInfo._id;
            data.name = $scope.userInfo.name;
            data.email = $scope.userInfo.email;
            data.status = "Pending";
            NavigationService.apiCallWithData("Reminder/sendReminderMail", data, function (res) {
                console.log("res.data", res.data);
                toastr.success("Reminder Added Successfully");
                $scope.addReminder.close();
                $state.reload();
            });
        }
    }

    $scope.searchData = function (data) {
        $scope.productList = []
        if (data.length > 0) {
            var dataToSend = {};
            dataToSend.keyword = data;
            dataToSend.user = $scope.userInfo._id;
            NavigationService.apiCallWithData("Product/getSearchProductAndBrand", dataToSend, function (response) {
                console.log("Search data", response.data)
                if (response.value) {
                    _.each(response.data, function (n) {
                        var now = moment(new Date()),
                            end = moment(n.warrantyExpDate),
                            months = end.diff(now, 'months');

                        if (months < 1) {
                            n.ribbon = true;
                            days = end.diff(now, 'days');
                            n.daysLeft = days;
                        } else {
                            n.months = months;
                            n.ribbon = false;
                        }
                        console.log("----days-----", days)
                    });
                    $scope.productList = response.data;
                }
            });
        }
    };

    $scope.logout = function (data) {
        $.jStorage.flush();
        $state.go("home");
    };

    //for footer
    $scope.scrollTop = function () {
        $('html, body').animate({
            scrollTop: $('body,html').offset().top - 100
        }, 1000);
    }
    $scope.showMenu = false;
    $scope.toggleMenu = function () {
        $scope.showMenu = !$scope.showMenu;
        console.log("inside menu");
    };
    $scope.closeMenu = function () {
        $scope.showMenu = false;
    };
});