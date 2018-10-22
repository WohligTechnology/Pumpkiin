myApp.controller('OpenTicketCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $state) {
    $scope.template = TemplateService.getHTML("content/openTicket/openTicket.html");
    TemplateService.landingheader = "";
    TemplateService.title = "Open Ticket"; //This is the Title of the Website
    TemplateService.cssMain = "openticket"
    $scope.navigation = NavigationService.getNavigation();
    $scope.jstrgValue = $.jStorage.get('userData');

    $scope.askRegistration = function () {
        $scope.productCheck = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/productCheck.html",
            scope: $scope,
            backdrop: 'static',
            windowClass: 'app-modal-window'
        });
    }


    $scope.data = {};
    $scope.yesno = function () {
        $scope.yes = true;

        var user = $.jStorage.get("userData")._id;
        NavigationService.apiCallWithData("Product/getAllProducts", {
            user: user
        }, function (data) {
            $scope.remainingProduct = data.data;
            console.log("hjhsakf", $scope.remainingProduct)
        })
    }
    // $scope.reminderModalOpen = function () {
    //     $scope.addReminder = $uibModal.open({
    //         animation: true,
    //         templateUrl: "views/modal/addReminder.html",
    //         scope: $scope,
    //         windowClass: 'app-modal-window'
    //     });
    // }

    // $scope.saveReminder = function (data) {
    //     // console.log("----------", data);
    //     data.user = $scope.jstrgValue._id;
    //     data.status = "Pending";
    //     NavigationService.apiCallWithData("Reminder/save", data, function (res) {
    //         // console.log("res.data", res.data);
    //         $state.go("productListing");
    //     });
    // }
});