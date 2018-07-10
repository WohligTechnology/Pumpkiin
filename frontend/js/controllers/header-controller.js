myApp.controller('headerCtrl', function ($scope, TemplateService, $uibModal, $state, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });
    $.fancybox.close(true);
    $scope.productList = [{
        name: "Samsung s7 in Mobile",
        img: "../img/ticketCreation/warranty.png"
    }, {
        name: "Samsung s7 in Mobile Black"
    }, {
        name: "Samsung s7 edge"
    }];
    $scope.currentState = $state.current.name;
    $scope.reminderModalOpen = function () {
        $scope.addReminder = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addReminder.html",
            scope: $scope,
        });
    }

    $scope.saveReminder = function (data) {
        // console.log("----------", data);
        data.user = $scope.jstrgValue._id;
        data.status = "Pending";
        NavigationService.apiCallWithData("Reminder/save", data, function (res) {
            console.log("res.data", res.data);
            toastr.success("Reminder Added Successfully");
            $scope.addReminder.close();
            $state.reload()
        });
    }
});