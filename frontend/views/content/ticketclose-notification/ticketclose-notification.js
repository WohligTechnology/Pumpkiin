myApp.controller("TicketcloseNotificationCtrl", function(
  $scope,
  TemplateService,
  NavigationService,
  $timeout,
  toastr,
  $http,
  reminderService,
  $uibModal,
  $stateParams,
  $state,
  ticketService
) {
  $scope.template = TemplateService.getHTML(
    "content/ticketclose-notification/ticketclose-notification.html"
  );
  TemplateService.title = "Ticketclose Notification"; //This is the Title of the Website
  TemplateService.landingheader = "";
  TemplateService.cssMain = "notification-main";
  $scope.navigation = NavigationService.getNavigation();
  // TemplateService.header = " ";
  $scope.navigation = NavigationService.getNavigation();
  $scope.pageNumber = 1;

  $scope.changePage = function(pageno) {
    console.log("hey");
    $scope.currentPage = pageno;

    var start = (pageno - 1) * $scope.maxRow;
    var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
    // $scope.ticketDetails.page = pageno;
    $scope.ticketDetails = _.slice($scope.ticketData, start, end);
    // console.log(" $scope.ticketDetails", $scope.ticketData);
    $scope.pageNumber = pageno;
    $scope.getTickets();
  };

  //REMINDER SECTION
  $scope.getReminder = function() {
    reminderService.findReminderOfPendingSnoozeByUser(function(data) {
      $scope.allReminders = data;
      $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
    });

    reminderService.totalNumberOfReminders(function(data) {
      $scope.totalReminders = data;
      // console.log("$scope.totalReminders", $scope.totalReminders);
    });

    reminderService.totalNumberOfCompletedReminders(function(data) {
      $scope.showGreenImage = true;
      $scope.totalCompletedReminder = data;
      // console.log("res---totalCompletedReminder--", $scope.totalCompletedReminder);
    });

    reminderService.totalNumberOfPendingReminders(function(data) {
      $scope.totalPendingReminders = data;
      // console.log("$scope.totalPendingReminders--", $scope.totalPendingReminders);
    });

    $scope.completedReminders = function(data) {
      $scope.showGreenImage = true;
      reminderService.findReminderOfCompletedByUser(function(data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
      });
    };

    $scope.pendingReminders = function(data) {
      $scope.showGreenImage = false;
      reminderService.findReminderOfPendingSnoozeByUser(function(data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
      });
    };
  };
  $scope.getReminder();

  //REMINDER SECTION END

  //for ticket block
  $scope.callTickets = function() {
    ticketService.totalOpenTickets(function(data) {
      // $scope.ticketDetails = data;
      $scope.ticketDetails = _.slice(data, 0, 5);
      console.log(" $scope.ticketDetails --", $scope.ticketDetails);
    });

    // ticketService.totalClosedTickets(function (data) {
    //     $scope.ticketDetails = data;
    // });

    ticketService.totalNumberOfTickets(function(data) {
      $scope.totalNumberOfTickets = data;
      // console.log("res--totalNumberOfTickets---", data);
    });

    ticketService.totalNumberOfOpenTickets(function(data) {
      $scope.totalNumberOfOpenTickets = data;
      // console.log("res---totalNumberOfOpenTickets--", data);
    });

    ticketService.totalNumberOfClosedTickets(function(data) {
      $scope.totalNumberOfClosedTickets = data;
      // console.log("res---totalNumberOfClosedTickets--", data);
    });

    ticketService.totalClosedTickets(function(data) {
      $scope.ticketDetails = data;
      $scope.ticketDetails = _.slice(data, 0, 5);
    });
    $scope.getClosedTickets = function() {
      ticketService.totalClosedTickets(function(data) {
        $scope.ticketDetails = data;
        console.log("getClosedTickets", data);
        $scope.ticketDetails = _.slice(data, 0, 5);
      });
    };

    ticketService.totalOpenTickets(function(data) {
      $scope.ticketDetails = data;
      // console.log("----109----", data.results);
      $scope.ticketDetails = _.slice(data, 0, 5);
    });
    $scope.getOpenTickets = function() {
      ticketService.totalOpenTickets(function(data) {
        $scope.ticketDetails = data;
        // console.log("----109----", data.results);
        $scope.ticketDetails = _.slice(data, 0, 5);
      });
    };
  };
  // $scope.getOpenTickets = function () {
  //     ticketService.totalOpenTickets(function (data) {
  //         $scope.ticketDetails = data;
  //         // console.log("----109----", data.results);
  //         $scope.ticketDetails = _.slice(data.results, 0, 5);

  //     });
  // }
  // $scope.getClosedTickets = function () {
  //     ticketService.totalClosedTickets(function (data) {
  //         console.log("getClosedTickets", data)
  //         $scope.ticketDetails = data;
  //         $scope.ticketDetails = _.slice(data, 0, 5);
  //     });
  // }
  // $scope.getOpenTickets();
  // $scope.getClosedTickets();
  $scope.callTickets();

  $scope.getTickets = function() {
    var pageData = $scope.pageNumber;
    console.log("pageData", pageData);
    ticketService.totalClosedTickets1(pageData, function(data) {
      console.log("ticketData", data);
      $scope.ticketData = data.results;
      $scope.ticketDetails = _.slice(data.results, 0, 5);
      $scope.totalitems = data.total;
      $scope.maxRow = data.options.count;
      // $scope.getOpenTickets();
      // $scope.callTickets();
    });
  };
  $scope.getTickets();

  // ticketService.totalClosedTickets(function (data) {
  //     console.log("data", data)
  //     $scope.ticketData = data;
  // });

  $scope.askRegistration = function() {
    $scope.productCheck = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/productCheck.html",
      scope: $scope,
      backdrop: "static",
      windowClass: "app-modal-window"
    });
  };

  $scope.data = {};
  $scope.yesno = function() {
    $scope.yes = true;

    var user = $.jStorage.get("userData")._id;
    NavigationService.apiCallWithData(
      "Product/ticketNotGenerated",
      {
        user: user
      },
      function(data) {
        $scope.remainingProduct = data.data;
        console.log("hjhsakf", $scope.remainingProduct);
      }
    );
  };
  //for ticket block end

  $scope.deleteReminder = function(data) {
    $scope.accordianNotification.close();
    $scope.delete = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/cofirmDelete.html",
      scope: $scope,
      windowClass: "app-modal-window",
      backdrop: "static"
    });
    $scope.accordianNotification.close();
    $scope.confirmDelete = function() {
      var changeStatusData = {};
      changeStatusData._id = data;
      NavigationService.apiCallWithData(
        "Reminder/delete",
        changeStatusData,
        function(res) {
          if (res.value == true) {
            $state.reload();
          }
        }
      );
    };
  };
  $scope.notificationmodalOpen = function(notification, index, modal) {
    console.log("notification", notification);
    if (modal) {
      $scope.singleNotification = notification;
      $scope.accordianNotification = $uibModal.open({
        animation: true,
        templateUrl: "views/modal/notificationaccordian.html",
        scope: $scope,
        backdrop: "static"
      });
    }

    if (!notification.isRead) {
      var changeisRead = {};
      changeisRead.id = notification._id;
      changeisRead.isRead = true;

      NavigationService.apiCallWithData(
        "Reminder/changeIsReadStatus",
        changeisRead,
        function(data) {
          console.log("changeIsReadStatus", data);
          if (data.value) {
            if (modal) {
              $scope.getReminder();
            } else {
              $scope.showLessReminders[index].isRead = true;
            }
          }
        }
      );
    }
  };
  $scope.openmodalOpen = function(tickets, index) {
    console.log("tickets------------------", tickets);
    $scope.singleTicket = tickets;
    $scope.openTicket = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/openticket.html",
      scope: $scope,
      backdrop: "static"
    });

    if (!tickets.isRead) {
      var changeisRead = {};
      changeisRead.id = tickets._id;
      changeisRead.isRead = true;

      console.log("changeisRead", changeisRead);

      NavigationService.apiCallWithData(
        "Ticket/changeIsReadStatus",
        changeisRead,
        function(data) {
          console.log("changeIsReadStatus", data);
          if (data.value) {
            // if (modal) {
            $scope.callTickets();
            // } else {
            //     $scope.showLessReminders[index].isRead = true;
            // }
          }
        }
      );
    }
  };
});
