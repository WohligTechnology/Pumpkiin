myApp.controller("TicketopenNotificationCtrl", function (
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
  ticketService,
  $window
) {
  $scope.template = TemplateService.getHTML(
    "content/ticketopen-notification/ticketopen-notification.html"
  );
  TemplateService.title = "Ticketopen Notification"; //This is the Title of the Website
  TemplateService.landingheader = "";
  TemplateService.cssMain = "notification-main";
  $scope.navigation = NavigationService.getNavigation();
  // TemplateService.header = " ";
  $scope.navigation = NavigationService.getNavigation();
  $scope.ticketService = ticketService;
  $scope.jstrgValue = $.jStorage.get('userData');
  $scope.pageNumber = 1;
  $scope.showGreenImage = false;
  var windowscreen = $window;
  // $scope.maxRow = 5;

  $scope.changePage = function (pageno) {
    $scope.currentPage = pageno;

    var start = (pageno - 1) * $scope.maxRow;
    var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
    // $scope.ticketDetails.page = pageno;
    $scope.ticketDetails = _.slice($scope.ticketData, start, end);
    // console.log(" $scope.ticketDetails", $scope.ticketData);
    $scope.pageNumber = pageno;
    $scope.getTickets();
  };

  $scope.askRegistration = function () {
    $scope.productCheck = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/productCheck.html",
      scope: $scope,
      backdrop: "static",
      windowClass: "app-modal-window"
    });
  };

  $scope.data = {};
  $scope.yesno = function () {
    $scope.yes = true;

    var user = $.jStorage.get("userData")._id;
    NavigationService.apiCallWithData(
      "Product/ticketNotGenerated", {
        user: user
      },
      function (data) {
        $scope.remainingProduct = data.data;
      }
    );
  };

  $scope.pumpkinRegistration = function () {
    $scope.pumpRegistration = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/pumpRegistration.html",
      scope: $scope,
      backdrop: "static",
      windowClass: "app-modal-window"
    });
    $scope.productCheck.close();
  };

  $scope.submitDocuments = function (docs) {
    docs.status = "Pending";
    NavigationService.apiCallWithData("Product/save", docs, function (res) {
      $scope.pumpRegistration.close();
      $scope.thanks = $uibModal.open({
        animation: true,
        templateUrl: "views/modal/upload-thanks.html",
        scope: $scope,
        windowClass: "app-modal-window"
      });
    });
  };

  //REMINDER SECTION
  $scope.searchForReminderData = function (data, data1) {
    var dataToSend = {};
    if (data.length > 0) {
      if (data1 == "open") {
        dataToSend.keyword = data;
        NavigationService.apiCallWithData(
          "Reminder/searchOpenReminders",
          dataToSend,
          function (response) {
            if (response.value) {
              $scope.allReminders = response.data;
              $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
            }
          }
        );
      } else {
        dataToSend.keyword = data;
        NavigationService.apiCallWithData(
          "Reminder/searchClosedReminders",
          dataToSend,
          function (response) {
            console.log(" response", response);

            if (response.value) {
              $scope.allReminders = response.data;
              $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
            }
          }
        );
      }
    }
  };
  $scope.getReminder = function () {
    reminderService.findReminderOfPendingSnoozeByUser(function (data) {
      $scope.allReminders = data;
      $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
    });

    reminderService.totalNumberOfReminders(function (data) {
      $scope.totalReminders = data;
    });
    reminderService.totalNumberOfCompletedReminders(function (data) {
      $scope.totalCompletedReminder = data;

    });

    reminderService.totalNumberOfPendingReminders(function (data) {
      $scope.totalPendingReminders = data;
    });

    $scope.completedReminders = function (data) {
      $scope.showGreenImage = true;
      reminderService.findReminderOfCompletedByUser(function (data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
      });
    };

    $scope.pendingReminders = function (data) {
      $scope.showGreenImage = false;
      reminderService.findReminderOfPendingSnoozeByUser(function (data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
      });
    };
  };
  $scope.getReminder();

  //REMINDER SECTION END

  //for ticket block

  $scope.callTickets = function () {
    ticketService.totalOpenTickets(function (data) {
      // $scope.ticketDetails = data;
      // $scope.ticketDetails = _.slice(data.results, 0, 5);
    });

    // ticketService.totalClosedTickets(function (data) {
    //     $scope.ticketDetails = data;
    // });

    ticketService.totalNumberOfTickets(function (data) {
      $scope.totalNumberOfTickets = data;
    });

    ticketService.totalNumberOfOpenTickets(function (data) {
      $scope.totalNumberOfOpenTickets = data;
      // console.log("res---totalNumberOfOpenTickets--", data);
    });

    ticketService.totalNumberOfClosedTickets(function (data) {
      $scope.totalNumberOfClosedTickets = data;
      // console.log("res---totalNumberOfClosedTickets--", data);
    });


  };
  $scope.callTickets();

  $scope.getClosedTickets = function () {
    ticketService.totalClosedTickets(function (data) {
      console.log("dtttttt", data)

      if (windowscreen.screen.width < 768) {
        $scope.ticketDetails = data;
        console.log(" if responsive ", $scope.ticketDetails);
      } else {
        $scope.ticketDetails = _.slice(data, 0, 5);
        console.log(" if desktop ", $scope.ticketDetails);
      }
    });
  };

  $scope.getOpenTickets = function () {
    ticketService.totalOpenTickets(function (data) {
      if (windowscreen.screen.width < 768) {
        $scope.ticketDetails = data;
        console.log(" if responsive ", $scope.ticketDetails);
      } else {
        $scope.ticketDetails = _.slice(data, 0, 5);
        console.log(" if desktop ", $scope.ticketDetails);
      }
    });
  };
  $scope.getClosedTickets();
  $scope.getOpenTickets();

  $scope.getTickets = function () {
    // if (!pageData) {
    //     pageData = undefined;
    // }
    if (windowscreen.screen.width > 768) {
      var pageData = $scope.pageNumber;
      ticketService.totalOpenTickets1(pageData, function (data) {
        $scope.ticketData = data.results;
        $scope.ticketDetails = _.slice(data.results, 0, 5);
        $scope.totalitems = data.total;
        $scope.maxRow = data.options.count;
      });
    }
  };
  $scope.getTickets();

  $scope.openmodalOpen = function (tickets, index) {
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


      NavigationService.apiCallWithData(
        "Ticket/changeIsReadStatus",
        changeisRead,
        function (data) {
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

  $scope.deleteReminder = function (data) {
    $scope.accordianNotification.close();
    $scope.delete = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/cofirmDelete.html",
      scope: $scope,
      windowClass: "app-modal-window",
      backdrop: "static"
    });
    $scope.accordianNotification.close();
    $scope.confirmDelete = function () {
      var changeStatusData = {};
      changeStatusData._id = data;
      NavigationService.apiCallWithData(
        "Reminder/delete",
        changeStatusData,
        function (res) {
          if (res.value == true) {
            $state.reload();
          }
        }
      );
    };
  };

  $scope.notificationmodalOpen = function (notification, index, modal) {
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
        function (data) {
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