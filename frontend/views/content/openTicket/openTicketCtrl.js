myApp.controller('OpenTicketCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $state) {
    $scope.template = TemplateService.getHTML("content/openTicket/openTicket.html");
    TemplateService.landingheader = "";
    TemplateService.title = "Open Ticket"; //This is the Title of the Website
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    $scope.jstrgValue = $.jStorage.get('userData');

    // $scope.reminderModalOpen=function(){
    //     $scope.addReminder = $uibModal.open({
    //         animation: true,
    //         templateUrl: "views/modal/addReminder.html",
    //         scope: $scope,
    //         windowClass: 'app-modal-window'
    //     });
    // }

    // $scope.saveReminder = function (data) {
    //     console.log("----------", data);
    //     data.user = $scope.jstrgValue._id;
    //     data.status = "Pending";
    //     NavigationService.apiCallWithData("Reminder/save", data, function (res) {
    //         console.log("res.data", res.data);
    //         $state.go("productListing");
    //     });
    // }
});