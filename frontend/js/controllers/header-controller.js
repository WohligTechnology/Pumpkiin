myApp.controller('headerCtrl', function ($scope, TemplateService, $uibModal, $state, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });
    $.fancybox.close(true);
    $scope.data = {};
    $scope.productList = [{
        name: "Samsung s7 in Mobile",
        img: "../img/ticketCreation/warranty.png"
    }, {
        name: "Samsung s7 in Mobile Black"
    }, {
        name: "Samsung s7 edge"
    }];
    $scope.currentState = $state.current.name;
    $scope.reminderModalOpen = function (data) {
        if (data) {
            $scope.getReminder(data);
        }
        $scope.addReminder = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addReminder.html",
            scope: $scope,
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
            data.user = $scope.jstrgValue._id;
            data.status = "Pending";
            NavigationService.apiCallWithData("Reminder/save", data, function (res) {
                console.log("res.data", res.data);
                toastr.success("Reminder Added Successfully");
                $scope.addReminder.close();
                $state.reload();
            });
        }
    }

});