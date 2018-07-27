myApp.controller('TicketCreationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, reminderService, $uibModal, $stateParams, $state, ticketService) {
    $scope.template = TemplateService.getHTML("content/ticketCreation/ticketCreation.html");
    TemplateService.title = "Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.rate = 2;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.jstrgValue = $.jStorage.get('userData');

    $scope.chatData = {};
    $scope.ticketId = {};
    var productData = {};


    $scope.attachmentImage = true;

    $scope.newUserModalOpen = function () {
        $scope.addNewUser = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addNewUser.html",
            scope: $scope,
        });
    }

    //REMINDER SECTION

    reminderService.findReminderOfPendingSnoozeByUser(function (data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
    });


    reminderService.totalNumberOfReminders(function (data) {
        $scope.totalReminders = data;
        // console.log("$scope.totalReminders", $scope.totalReminders);
    });

    reminderService.totalNumberOfCompletedReminders(function (data) {
        $scope.totalCompletedReminder = data;
        // console.log("res---totalCompletedReminder--", $scope.totalCompletedReminder);
    });


    reminderService.totalNumberOfPendingReminders(function (data) {
        $scope.totalPendingReminders = data;
        // console.log("$scope.totalPendingReminders--", $scope.totalPendingReminders);
    });


    $scope.completedReminders = function (data) {
        reminderService.findReminderOfCompletedByUser(function (data) {
            $scope.allReminders = data;
            $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
        });
    }

    $scope.pendingReminders = function (data) {
        reminderService.findReminderOfPendingSnoozeByUser(function (data) {
            $scope.allReminders = data;
            $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
        });
    }

    //REMINDER SECTION END



    //for ticket block

    $scope.getTicket = function () {
        ticketService.totalOpenTickets(function (data) {
            $scope.totalOpenTickets = data;
            $scope.showLessOpenTickets = _.slice($scope.totalOpenTickets, 0, 5);
            // console.log("res---totalOpenTickets--", data);
            if (!_.isEmpty($stateParams.id)) {
                var ticketData = {};
                // ticketData.ticketId = $scope.ticketId;
                ticketData.user = $scope.jstrgValue._id;
                ticketData.product = $stateParams.id;
                // console.log("$scope.ticketData-----------", ticketData);
                NavigationService.apiCallWithData("Ticket/findActiveTicketOfUser", ticketData, function (res) {
                    $scope.ticketDetails = res.data;
                    console.log("$scope.ticketDetails-----------", $scope.ticketDetails);

                });

                productData._id = $stateParams.id;
                NavigationService.apiCallWithData("Product/getOne", productData, function (res) {
                    $scope.productDetails = res.data;
                    // console.log("$scope.productDetails-----------", $scope.productDetails);
                });

            } else {
                if ($scope.totalOpenTickets[0]) {
                    // console.log("res---totalOpenTickets--", $scope.totalOpenTickets[0]);
                    $scope.ticketDetails = $scope.totalOpenTickets[0];
                    productData._id = $scope.totalOpenTickets[0].product._id;
                    NavigationService.apiCallWithData("Product/getOne", productData, function (res) {
                        $scope.productDetails = res.data;
                        // console.log("$scope.productDetails-----------", $scope.productDetails);
                    });
                }
            }
        });

        ticketService.totalNumberOfTickets(function (data) {
            $scope.totalNumberOfTickets = data;
            // console.log("res--totalNumberOfTickets---", data);
        });

        ticketService.totalNumberOfOpenTickets(function (data) {
            $scope.totalNumberOfOpenTickets = data;
            // console.log("res---totalNumberOfOpenTickets--", data);
        });


        ticketService.totalNumberOfClosedTickets(function (data) {
            $scope.totalNumberOfClosedTickets = data;
            // console.log("res---totalNumberOfClosedTickets--", data);
        });
    }

    $scope.getTicket();


    //for ticket block end

    $scope.ticketChatSocket = function (data) {
        if (data) {
            $scope.ticketDetails = data.ticketChatData;
            // console.log("$scope.ticketData$$$$$$$$$$------- ", $scope.ticketDetails);
            $scope.$apply();
        }
    }

    $scope.ticketChatSocket();
    io.socket.on("ticketChat", $scope.ticketChatSocket);


    $scope.addComment = function (data) {
        // console.log("data", data);
        // console.log("  $.jStorage.get", $.jStorage.get("userData"));
        // console.log("$scope.ticketDetails-----------", $scope.ticketDetails);
        // console.log("$scope.ticketDetails-----------", _.isEmpty($scope.ticketDetails));

        var formData = {};
        var dataToSend = {};
        dataToSend.customerChat = [];
        if (!_.isEmpty($.jStorage.get("userData")) && $scope.ticketDetails == 'No Data Found') {
            formData.user = $.jStorage.get("userData")._id;
            formData.comment = data.comment;
            formData.file = data.image;
            dataToSend.customerChat.push(formData);
            dataToSend.user = $scope.jstrgValue._id;
            dataToSend.product = $stateParams.id;
            // console.log("dataToSend", dataToSend);
            NavigationService.apiCallWithData("Ticket/createNewTicket", dataToSend, function (data) {
                console.log("data", data);
                if (data.value == true) {
                    $scope.ticketId = data.data._id;
                    // $scope.ticketDetails = data.data;
                    $scope.chatData.comment = null;
                    $scope.chatData.image = null;
                    $scope.getTicket();
                }
            });
        } else {
            formData.user = $.jStorage.get("userData")._id;
            formData.comment = data.comment;
            formData.file = data.image;
            $scope.ticketDetails.customerChat.push(formData);
            // console.log(" $scope.ticketDetails", $scope.ticketDetails);
            NavigationService.apiCallWithData("Ticket/addToChat", $scope.ticketDetails, function (data) {
                $scope.chatData.comment = null;
                $scope.chatData.image = null;
                if (data.value == true) {
                    $scope.getTicket();
                }
            });
        }
    };


});