myApp.controller('ClosedTicketcreationCtrl', function ($scope, TemplateService, reminderService, NavigationService, $timeout, toastr, $http, $uibModal, ticketService, $stateParams) {
    $scope.template = TemplateService.getHTML("content/closedTicketcreation/closedTicketcreation.html");
    TemplateService.title = "Closed Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.jstrgValue = $.jStorage.get('userData');

    $scope.newUserModalOpen = function () {
        $scope.addNewUser = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addNewUser.html",
            scope: $scope,
        });
    }
    $scope.notificationmodalOpen = function (notification) {
        $scope.singleNotification = notification;
        $scope.accordianNotification = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/notificationaccordian.html",
            scope: $scope,
            backdrop: 'static'
        });
    }
    //REMINDER SECTION

    reminderService.findReminderOfPendingSnoozeByUser(function (data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
    });


    reminderService.totalNumberOfReminders(function (data) {
        $scope.totalReminders = data;
        console.log("$scope.totalReminders", $scope.totalReminders);
    });

    reminderService.totalNumberOfCompletedReminders(function (data) {
        $scope.showGreenImage = true;
        $scope.totalCompletedReminder = data;
        console.log("res---totalCompletedReminder--", $scope.totalCompletedReminder);
    });


    reminderService.totalNumberOfPendingReminders(function (data) {
        $scope.totalPendingReminders = data;
        console.log("$scope.totalPendingReminders--", $scope.totalPendingReminders);
    });


    $scope.completedReminders = function (data) {
        $scope.showGreenImage = false;
        reminderService.findReminderOfCompletedByUser(function (data) {
            $scope.allReminders = data;
            $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
        });
    }

    $scope.pendingReminders = function (data) {
        $scope.showGreenImage = true;
        reminderService.findReminderOfPendingSnoozeByUser(function (data) {
            $scope.allReminders = data;
            $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
        });
    }

    //REMINDER SECTION END

    //for ticket block

    $scope.callTickets = function () {

        ticketService.totalOpenTickets(function (data) {
            // $scope.ticketDetails = data;
            console.log("----109----", data.results);
            // $scope.ticketDetails = _.slice(data.results, 0, 5);
            console.log(" 1 ", $scope.ticketDetails);

        });

        // ticketService.totalClosedTickets(function (data) {
        //     $scope.ticketDetails = data;
        // });

        ticketService.totalNumberOfTickets(function (data) {
            $scope.totalNumberOfTickets = data;
            console.log("res--totalNumberOfTickets---", data);
        });

        ticketService.totalNumberOfOpenTickets(function (data) {
            $scope.totalNumberOfOpenTickets = data;
            // console.log("res---totalNumberOfOpenTickets--", data);
        });

        ticketService.totalNumberOfClosedTickets(function (data) {
            $scope.totalNumberOfClosedTickets = data;
            // console.log("res---totalNumberOfClosedTickets--", data);
        });


        $scope.getClosedTickets = function () {
            ticketService.totalClosedTickets(function (data) {
                // $scope.ticketDetails = data;
                $scope.ticketDetails = _.slice(data, 0, 5);
                console.log(" 2 ", $scope.ticketDetails);

            });
        }

        $scope.getOpenTickets = function () {
            ticketService.totalOpenTickets(function (data) {
                // $scope.ticketDetails = data;
                console.log("----109----", data.results);
                $scope.ticketDetails = _.slice(data.results, 0, 5);

            });
        }

    }
    $scope.callTickets();
    $scope.getClosedTickets();
    $scope.getOpenTickets();



    ticketService.totalClosedTickets(function (data) {
        $scope.totalClosedTickets = data;
        $scope.showLessClosedTickets = _.slice($scope.totalClosedTickets, 0, 5);

        console.log("res---totalClosedTickets--", data);
        // console.log("res---totalClosedTickets--", $scope.totalClosedTickets);
        if ($stateParams.id) {
            var ticketData = {};
            ticketData.ticketId = $stateParams.id;
            ticketData.user = $scope.jstrgValue._id;
            console.log("------------", $stateParams.id)
            NavigationService.apiCallWithData("Ticket/findClosedTicketOfUser", ticketData, function (res) {
                $scope.ticketDetails = res.data;
                console.log("$scope.ticketDetails-----------", res);
            });
        } else {
            // console.log("res---totalClosedTickets--", $scope.totalClosedTickets[0]);
            $scope.ticketDetails = $scope.totalClosedTickets[0];
        }
    });

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
        NavigationService.apiCallWithData("Product/ticketNotGenerated", {
            user: user
        }, function (data) {
            $scope.remainingProduct = data.data;
            console.log("hjhsakf", $scope.remainingProduct)
        })
    }


    $scope.openmodalOpen = function (tickets, index) {
        console.log("tickets------------------", tickets);
        $scope.singleTicket = tickets;
        $scope.openTicket = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/openticket.html",
            scope: $scope,
            backdrop: 'static'
        });

        if (!tickets.isRead) {
            var changeisRead = {};
            changeisRead.id = tickets._id;
            changeisRead.isRead = true;

            console.log("changeisRead", changeisRead)

            NavigationService.apiCallWithData("Ticket/changeIsReadStatus", changeisRead, function (data) {
                console.log("changeIsReadStatus", data);
                if (data.value) {
                    // if (modal) {
                    $scope.callTickets();
                    // } else {
                    //     $scope.showLessReminders[index].isRead = true;
                    // }
                }
            })
        }
    }


});