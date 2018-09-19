myApp.controller('TicketopenNotificationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, reminderService, $uibModal, $stateParams, $state, ticketService) {
    $scope.template = TemplateService.getHTML("content/ticketopen-notification/ticketopen-notification.html");
    TemplateService.title = "Ticketopen Notification"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "notification-main"
    $scope.navigation = NavigationService.getNavigation();
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    $scope.ticketService = ticketService;
    $scope.pageNumber = 1;
    // $scope.maxRow = 5;

    $scope.changePage = function (pageno) {
        console.log("hey")
        $scope.currentPage = pageno;

        var start = (pageno - 1) * $scope.maxRow;
        var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
        // $scope.ticketDetails.page = pageno;
        $scope.ticketDetails = _.slice($scope.ticketData, start, end);
        // console.log(" $scope.ticketDetails", $scope.ticketData);
        $scope.pageNumber = pageno;
        $scope.getTickets();
    }

    $scope.yesno = function () {
        $scope.yes = true;
    }

    $scope.askRegistration = function () {
        console.log("hey");
        $scope.productCheck = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/productCheck.html",
            scope: $scope,
            backdrop: 'static',
            windowClass: 'app-modal-window'
        });
    }
    $scope.pumpkinRegistration = function () {
        $scope.pumpRegistration = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/pumpRegistration.html",
            scope: $scope,
            backdrop: 'static',
            windowClass: 'app-modal-window'
        });
        $scope.productCheck.close();
    }

    $scope.submitDocuments = function (docs) {
        // console.log("*************", docs);
        docs.status = "Pending";
        NavigationService.apiCallWithData("Product/save", docs, function (res) {
            // console.log("inside submit documents api", res);
            $scope.pumpRegistration.close();
            $scope.thanks = $uibModal.open({
                animation: true,
                templateUrl: "views/modal/upload-thanks.html",
                scope: $scope,
                windowClass: 'app-modal-window'
            });
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
        $scope.totalCompletedReminder = data;
        console.log("res---totalCompletedReminder--", $scope.totalCompletedReminder);
    });


    reminderService.totalNumberOfPendingReminders(function (data) {
        $scope.totalPendingReminders = data;
        console.log("$scope.totalPendingReminders--", $scope.totalPendingReminders);
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

    ticketService.totalOpenTickets(function (data) {
        // $scope.ticketDetails = data;
        console.log("----109----", data.results);
        $scope.ticketDetails = _.slice(data.results, 0, 5);
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
            console.log("========2=======", data)
            // $scope.ticketDetails = data;
            $scope.ticketDetails = _.slice(data, 0, 5);
            console.log(" 3 ", $scope.ticketDetails);

        });
    }


    $scope.getTickets = function () {
        // if (!pageData) {
        //     pageData = undefined;
        // }
        var pageData = $scope.pageNumber;
        ticketService.totalOpenTickets1(pageData, function (data) {
            console.log("ticketData", data)
            $scope.ticketData = data.results;
            $scope.ticketDetails = _.slice(data.results, 0, 5);
            $scope.totalitems = data.total;
            $scope.maxRow = data.options.count;
        });
    }
    $scope.getTickets();

    $scope.notificationmodalOpen = function (notification) {
        $scope.singleNotification = notification;
        $scope.accordianNotification = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/notificationaccordian.html",
            scope: $scope,
            backdrop: 'static'
        });
    }
    $scope.openmodalOpen = function (tickets) {
        $scope.singleTicket = tickets;
        $scope.openTicket = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/openticket.html",
            scope: $scope,
            backdrop: 'static'
        });
    }

    //for ticket block end
    // $scope.checkifRead = function (data) {
    //     console.log("data", $scope.ticketDetails);
    //     if ($scope.ticketDetails._id = data) {
    //         $scope.read = true;
    //     } else if ($scope.showLessReminders._id = data) {
    //         $scope.read = true;
    //     }
    // }
});