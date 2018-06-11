myApp.controller('headerCtrl', function ($scope, TemplateService, $uibModal) {
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
    $scope.reminderModalOpen = function () {
        $scope.addReminder = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addReminder.html",
            scope: $scope,
        });
    }
});