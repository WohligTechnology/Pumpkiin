myApp.controller('TicketCreationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal, $stateParams, $state, ticketService) {
    $scope.template = TemplateService.getHTML("content/ticketCreation/ticketCreation.html");
    TemplateService.title = "Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.rate = 2;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.jstrgValue = $.jStorage.get('userData');
    
    $scope.attachmentImage=true;

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

    //for ticket block


    ticketService.totalNumberOfTickets(function (data) {
        $scope.totalNumberOfTickets = data;
        console.log("res--totalNumberOfTickets---", data);
    });

    ticketService.totalNumberOfOpenTickets(function (data) {
        $scope.totalNumberOfOpenTickets = data;
        console.log("res---totalNumberOfOpenTickets--", data);
    });


    ticketService.totalNumberOfClosedTickets(function (data) {
        $scope.totalNumberOfClosedTickets = data;
        console.log("res---totalNumberOfClosedTickets--", data);
    });


    ticketService.totalOpenTickets(function (data) {
        $scope.totalOpenTickets = data;
        // console.log("res---totalOpenTickets--", data);
        if ($stateParams.id) {
            var ticketData = {};
            ticketData.ticketId = $stateParams.id;
            ticketData.user = $scope.jstrgValue._id;
            NavigationService.apiCallWithData("Ticket/findTicketOfUser", ticketData, function (res) {
                $scope.ticketDetails = res.data;
                // console.log("$scope.ticketDetails-----------", res.data);
            });
        } else {
            // console.log("res---totalClosedTickets--", $scope.totalOpenTickets[0]);
            $scope.ticketDetails = $scope.totalOpenTickets[0];
        }
    });


    //for ticket block end


    // console.log("$stateParams.id", $stateParams.id)

    // var ticketData = {};
    // ticketData.ticketId = $stateParams.id;
    // ticketData.user = $scope.jstrgValue._id;
    // NavigationService.apiCallWithData("Ticket/findTicketOfUser", ticketData, function (res) {
    //     $scope.ticketDetails = res.data;
    //     console.log("$scope.ticketDetails-----------", res.data);
    // });

    $scope.addComment = function (data) {
        console.log("data", data);
        // console.log("  $.jStorage.get", $.jStorage.get("userData"));
        var formData = {};
        var dataToSend = {};
        dataToSend.customerChat = [];
        if (!_.isEmpty($.jStorage.get("userData"))) {
            formData.user = $.jStorage.get("userData")._id;
            formData.comment = data.comment;
            $scope.ticketDetails.customerChat.push(formData);
            console.log("dataToSend", $scope.ticketDetails);
            NavigationService.apiCallWithData("Ticket/save", $scope.ticketDetails, function (data) {
                if (data.value == true) {
                    // console.log(data);
                    // $state.reload();
                }
            });
        }
    };


});