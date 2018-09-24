myApp.controller('NotificationCtrl', function ($scope, TemplateService, ticketService, NavigationService, $timeout, toastr, $http, $uibModal, $state, reminderService) {
    $scope.template = TemplateService.getHTML("content/notification/notification.html");
    TemplateService.landingheader = "";
    TemplateService.cssMain = "notification-main"
    TemplateService.title = "Notification"; //This is the Title of the Website
    $scope.jstrgValue = $.jStorage.get('userData');

    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    $scope.maxRow = 5;
    //REMINDER SECTION
    $scope.closeAccordian = function () {
        $scope.isOpen = false;
    }
    // $scope.closeAccordian();
    $scope.showHide = function () {
        console.log("check");
        $(".hide-on-click").toggleClass("invisible");
    }
    $scope.currentPage = 1;
    $scope.changePage = function (pageno) {
        $scope.currentPage = pageno;
        var start = (pageno - 1) * $scope.maxRow;
        var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
        $scope.showLessReminders = _.slice($scope.allReminders, start, end);
        console.log(" $scope.showLessReminders", $scope.showLessReminders);
    }
    $scope.getReminder = function () {
        reminderService.findReminderOfPendingSnoozeByUser(function (data) {
            $scope.allReminders = data;
            $scope.changePage($scope.currentPage);
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

    }
    $scope.getReminder();
    // reminderService.findReminderOfPendingSnoozeByUser(function (data) {
    //     $scope.allReminders = data;
    //     $scope.changePage(1);
    // });


    // reminderService.totalNumberOfReminders(function (data) {
    //     $scope.totalReminders = data;
    //     console.log("$scope.totalReminders", $scope.totalReminders);
    // });

    // reminderService.totalNumberOfCompletedReminders(function (data) {
    //     $scope.totalCompletedReminder = data;
    //     console.log("res---totalCompletedReminder--", $scope.totalCompletedReminder);
    // });


    // reminderService.totalNumberOfPendingReminders(function (data) {
    //     $scope.totalPendingReminders = data;
    //     console.log("$scope.totalPendingReminders--", $scope.totalPendingReminders);
    // });


    $scope.completedReminders = function (data) {
        reminderService.findReminderOfCompletedByUser(function (data) {
            $scope.allReminders = data;
            $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
            console.log("1");

        });
    }

    $scope.pendingReminders = function (data) {
        reminderService.findReminderOfPendingSnoozeByUser(function (data) {
            $scope.allReminders = data;
            $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
            console.log("2");
        });
    }

    //REMINDER SECTION END

    //for ticket block

    ticketService.totalOpenTickets(function (data) {
        // $scope.ticketDetails = data;
        $scope.ticketDetails = _.slice(data.results, 0, 5);
        console.log(" $scope.ticketDetails --", $scope.ticketDetails);

    });

    // ticketService.totalClosedTickets(function (data) {
    //     $scope.ticketDetails = data;
    // });

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


    $scope.getClosedTickets = function () {
        ticketService.totalClosedTickets(function (data) {
            // $scope.ticketDetails = data;
            $scope.ticketDetails = _.slice(data, 0, 5);
        });
    }

    $scope.getOpenTickets = function () {
        ticketService.totalOpenTickets(function (data) {
            // $scope.ticketDetails = data;
            // console.log("----109----", data.results);
            $scope.ticketDetails = _.slice(data.results, 0, 5);

        });
    }


    //for ticket block end


    $scope.chnageStatus = function (data) {
        console.log("data", data);
        var changeStatusData = {};
        changeStatusData.status = 'Completed';
        changeStatusData._id = data;
        NavigationService.apiCallWithData("Reminder/save", changeStatusData, function (res) {
            if (res.value == true) {
                $state.reload();
            }
        });
    }

    $scope.statuses = [{
        isOpen: false
    }, {
        isOpen: false
    }, {
        isOpen: false
    }, {
        isOpen: false
    }, {
        isOpen: false
    }];

    $scope.deleteReminder = function (data, index) {
        $scope.deleteIndex = index;
        $scope.delete = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/cofirmDelete.html",
            scope: $scope,
            windowClass: 'app-modal-window',
            backdrop: 'static',
        });
        console.log("deleteReminder", data, index)
        if (!index) {
            $scope.accordianNotification.close();
        }
        $scope.confirmDelete = function () {
            // $scope.closeAccordian();
            var changeStatusData = {};
            changeStatusData._id = data;
            NavigationService.apiCallWithData("Reminder/delete", changeStatusData, function (res) {
                if (res.value == true) {
                    $scope.getReminder();
                    $scope.delete.close();

                    if (index) {
                        $scope.statuses[$scope.deleteIndex].isOpen = false;
                    }



                    console.log("-----------------------------------------------------------------------------");
                    console.log($scope.status)
                    // $scope.status.isItemOpen[0] = true;

                }
            });
        }
    }
    $scope.selectedReminders = [];
    $scope.checkCircle = function (data) {
        console.log("id", data);
        console.log("$scope.showLessReminders", $scope.showLessReminders);

        for (i = 0; i < 4; i++) {
            console.log("hafadfafhgf", $scope.showLessReminders[i])
            if ($scope.showLessReminders[i]._id == data) {
                $scope.selectedReminders.push(data);
                console.log("$scope.selectedReminders", $scope.selectedReminders);
                $(".blue-circle").toggleClass("selected");
            }
        }
    }


    $scope.notificationmodalOpen = function (notification, index, modal) {
        console.log("notification", notification);
        if (modal) {
            $scope.singleNotification = notification;
            $scope.accordianNotification = $uibModal.open({
                animation: true,
                templateUrl: "views/modal/notificationaccordian.html",
                scope: $scope,
                backdrop: 'static'
            });
        }

        if (!notification.isRead) {
            var changeisRead = {};
            changeisRead.id = notification._id;
            changeisRead.isRead = true;

            NavigationService.apiCallWithData("Reminder/changeIsReadStatus", changeisRead, function (data) {
                console.log("changeIsReadStatus", data);
                if (data.value) {
                    if (modal) {
                        $scope.getReminder();
                    } else {
                        $scope.showLessReminders[index].isRead = true;
                    }
                }
            })
        }




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

    if ($(window).width() <= 400) {

        console.log("mobile view");

    }

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

});