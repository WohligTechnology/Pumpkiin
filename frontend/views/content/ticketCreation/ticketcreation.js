myApp.controller('TicketCreationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $stateParams) {
    $scope.template = TemplateService.getHTML("content/ticketCreation/ticketCreation.html");
    TemplateService.title = "Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.rate = 2;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.jstrgValue = $.jStorage.get('userData');

    $scope.newUserModalOpen = function () {
        $scope.addNewUser = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addNewUser.html",
            scope: $scope,
        });
    }

    var reminderData = {};
    reminderData.user = $scope.jstrgValue._id;
    NavigationService.apiCallWithData("Reminder/findReminderByUser", reminderData, function (res) {
        if (res.value == true) {
            // console.log("res--111---", res.data);
            $scope.allReminders = res.data;
        }
    });

    NavigationService.apiCallWithData("Reminder/totalNumberOfReminders", reminderData, function (res) {
        if (res.value == true) {
            // console.log("res---222--", res.data);
            $scope.totalReminders = res.data;

        }
    });

    // console.log("$stateParams.id", $stateParams.id)

    var ticketData = {};
    ticketData.productId = $stateParams.id;
    NavigationService.apiCallWithData("Ticket/findTicketOfUser", ticketData, function (res) {
        console.log("res-----------", res);
    });

    $scope.addComment = function (data) {

        console.log("data", data);
        // console.log("  $.jStorage.get", $.jStorage.get("userData"));

        var formData = {};
        var dataToSend = {};
        dataToSend.customerChat = [];
        if (!_.isEmpty($.jStorage.get("userData"))) {
            formData.user = $.jStorage.get("userData")._id;
            formData.comment = data.comment;
            dataToSend.customerChat.push(formData);
            console.log("dataToSend", dataToSend);
            // NavigationService.apiCallWithData("Photographer/allUpdate", $scope.userData, function (data) {
            //     if (data.value) {
            //         // console.log(data);
            //         $state.reload();
            //     }
            // });
        }
    }


});