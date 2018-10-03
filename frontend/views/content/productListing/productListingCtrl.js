myApp.controller("ProductlistingCtrl", function(
  $scope,
  TemplateService,
  ticketService,
  NavigationService,
  $timeout,
  toastr,
  $http,
  $uibModal,
  $state,
  reminderService
) {
  $scope.template = TemplateService.getHTML(
    "content/productListing/productListing.html"
  );
  TemplateService.title = "Product Listing"; //This is the Title of the Website
  TemplateService.landingheader = "";
  TemplateService.cssMain = "main";
  $scope.navigation = NavigationService.getNavigation();

  $scope.jstrgValue = $.jStorage.get("userData");

  $scope.productInfo = [
    {
      largeimage: "img/iphone.jpeg",
      smallimage: "img/ticketCreation/mobile.png",
      productname: "Apple iPhone X 1",
      relation: "Sisters Phone",
      warranty: "Warranty Exp: 8 months"
    },
    {
      largeimage: "img/iphone.jpeg",
      smallimage: "img/ticketCreation/mobile.png",
      productname: "Apple iPhone X 2",
      relation: "Sisters Phone",
      warranty: "Warranty Exp: 8 months"
    },
    {
      largeimage: "img/iphone.jpeg",
      smallimage: "img/ticketCreation/mobile.png",
      productname: "Apple iPhone X 3",
      relation: "Sisters Phone",
      warranty: "Warranty Exp: 8 months"
    },
    {
      largeimage: "img/iphone.jpeg",
      smallimage: "img/ticketCreation/mobile.png",
      productname: "Apple iPhone X 4",
      relation: "Sisters Phone",
      warranty: "Warranty Exp: 8 months"
    },
    {
      largeimage: "img/iphone.jpeg",
      smallimage: "img/ticketCreation/mobile.png",
      productname: "Apple iPhone X 5",
      relation: "Sisters Phone",
      warranty: "Warranty Exp: 8 months"
    },
    {
      largeimage: "img/iphone.jpeg",
      smallimage: "img/ticketCreation/mobile.png",
      productname: "Apple iPhone X 6",
      relation: "Sisters Phone",
      warranty: "Warranty Exp: 8 months"
    },
    {
      largeimage: "img/iphone.jpeg",
      smallimage: "img/ticketCreation/mobile.png",
      productname: "Apple iPhone X 7",
      relation: "Sisters Phone",
      warranty: "Warranty Exp: 8 months"
    }
  ];

  //REMINDER SECTION
  $scope.maxRow = 7;
  $scope.changePage = function(pageno) {
    $scope.currentPage = pageno;
    var start = (pageno - 1) * $scope.maxRow;
    var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
    $scope.productPerPage = _.slice($scope.allProducts, start, end);

    _.each($scope.productPerPage, function(n) {
      var now = moment(new Date()),
        end = moment(n.warrantyExpDate),
        months = end.diff(now, "months");

      if (months < 1) {
        n.ribbon = true;
        days = end.diff(now, "days");
        n.daysLeft = days;
      } else {
        n.months = months;
        n.ribbon = false;
      }
      console.log("----days-----", days);
    });

    // console.log("$scope.productPerPage", $scope.productPerPage);
  };

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
    });

    $scope.completedReminders = function(data) {
      $scope.showGreenImage = false;
      reminderService.findReminderOfCompletedByUser(function(data) {
        $scope.allReminders = data;
        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
      });
    };

    $scope.pendingReminders = function(data) {
      $scope.showGreenImage = true;
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
      $scope.ticketDetails = _.slice(data.results, 0, 8);
      console.log("1 $scope.ticketDetails --", $scope.ticketDetails);
    });

    ticketService.totalNumberOfTickets(function(data) {
      $scope.totalNumberOfTickets = data;
      console.log("res--totalNumberOfTickets---", data);
    });

    ticketService.totalNumberOfOpenTickets(function(data) {
      $scope.totalNumberOfOpenTickets = data;
      console.log("res---totalNumberOfOpenTickets--", data);
    });

    ticketService.totalNumberOfClosedTickets(function(data) {
      $scope.totalNumberOfClosedTickets = data;
    });

    var dataToSendForProduct = {};
    dataToSendForProduct.user = $scope.jstrgValue._id;
    NavigationService.apiCallWithData(
      "Product/getAllProducts",
      dataToSendForProduct,
      function(res) {
        if (res.value == true) {
          // console.log("res-----", res.data.results);
          $scope.allProducts = res.data;
          $scope.products = _.slice($scope.allProducts, 0, 7);
        }
      }
    );

    $scope.getClosedTickets = function() {
      // $scope.gotoUrl = EditUrl;
      ticketService.totalClosedTickets(function(data) {
        // $scope.ticketDetails = data;
        $scope.ticketDetails = _.slice(data, 0, 5);
        console.log("2 $scope.ticketDetails --", $scope.ticketDetails);
      });
    };

    $scope.getOpenTickets = function() {
      // $scope.gotoUrl = CreateUrl;
      ticketService.totalOpenTickets(function(data) {
        // $scope.ticketDetails = data;
        console.log("----109----", data.results);
        $scope.ticketDetails = _.slice(data.results, 0, 5);
      });
    };
  };

  $scope.callTickets();

  //for ticket block end

  /*  $scope.deleteProduct = function (index) {

         var teest = $scope.allProducts.splice(index, 1);
         var dataToSend = {};
         dataToSend._id = teest[0]._id;
         // console.log("dataToSend", dataToSend);
         NavigationService.apiCallWithData("Product/delete", dataToSend, function (res) {
             if (res.value == true) {
                 toastr.success("Product deleted successfully");
             }
         });
     }; */

  $scope.productDelete = function(index) {
    $scope.productCheck = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/productDelete.html",
      scope: $scope,
      backdrop: "static",
      windowClass: "app-modal-window"
    });

    $scope.deleteProduct = function() {
      var teest = $scope.allProducts.splice(index, 1);
      var dataToSend = {};
      dataToSend._id = teest[0]._id;
      // console.log("dataToSend", dataToSend);
      NavigationService.apiCallWithData("Product/delete", dataToSend, function(
        res
      ) {
        if (res.value == true) {
          toastr.success("Product deleted successfully");
          $scope.productCheck.close();
          $scope.changePage($scope.currentPage);
        }
      });
    };
  };

  // $scope.addTicket = function (data) {
  //     var dataToSend = {};
  //     dataToSend.product = data;
  //     dataToSend.user = $scope.jstrgValue._id;
  //     console.log("dataToSend", dataToSend);
  //     NavigationService.apiCallWithData("Ticket/createNewTicket", dataToSend, function (res) {
  //         if (res.value == true) {
  //             // console.log("res", res.data._id);
  //             $state.go('ticketcreation', {
  //                 'id': res.data._id
  //             });
  //         }
  //     });
  // }

  $scope.searchForTicketData = function(data, data1) {
    var dataToSend = {};
    if (data.length > 0) {
      if (data1 == "open") {
        dataToSend.user = $.jStorage.get("userData")._id;
        dataToSend.keyword = data;
        NavigationService.apiCallWithData(
          "Ticket/searchOpenTickets",
          dataToSend,
          function(response) {
            if (response.value) {
              $scope.ticketDetails = response.data;
              console.log(" $scope.ticketDetails", $scope.ticketDetails);
            }
          }
        );
      } else {
        console.log("data", data);
        dataToSend.user = $.jStorage.get("userData")._id;
        dataToSend.keyword = data;
        NavigationService.apiCallWithData(
          "Ticket/searchClosedTickets",
          dataToSend,
          function(response) {
            console.log(" response", response);

            if (response.value) {
              $scope.ticketDetails = response.data;
              console.log(" $scope.ticketDetails", $scope.ticketDetails);
            }
          }
        );
      }
    }
  };

  $scope.searchForReminderData = function(data, data1) {
    var dataToSend = {};
    if (data.length > 0) {
      if (data1 == "open") {
        dataToSend.user = $.jStorage.get("userData")._id;
        dataToSend.keyword = data;
        NavigationService.apiCallWithData(
          "Reminder/searchOpenReminders",
          dataToSend,
          function(response) {
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
          function(response) {
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

  $scope.generateExcel = function() {
    var dataToSend = $scope.jstrgValue._id;
    window.open(adminurl + "Product/excelProductList/" + dataToSend, "_blank");
  };

  $scope.sortByProduct = function() {
    var dataToSend = {};
    dataToSend.user = $scope.jstrgValue._id;
    dataToSend.name = "productName";
    /*  NavigationService.apiCallWithData("Product/sortByProducts", dataToSend, function (response) {
             if (response.value) {
                 $scope.allProducts = response.data;
                 $scope.products = _.slice($scope.allProducts, 0, 7);
                 console.log("  $scope.allProducts", $scope.allProducts);
             }
         }); */

    NavigationService.apiCallWithData(
      "Product/sortFunction",
      dataToSend,
      function(response) {
        if (response.value) {
          $scope.allProducts = response.data;
          $scope.changePage(1);
          //$scope.products = _.slice($scope.allProducts, 0, 7);
          console.log("sortByProduct", response.data);
        }
      }
    );
  };

  $scope.sortByBrand = function() {
    var dataToSend = {};
    dataToSend.user = $scope.jstrgValue._id;
    dataToSend.name = "brand";
    console.log("sortByBrand", dataToSend);
    NavigationService.apiCallWithData(
      "Product/sortFunction",
      dataToSend,
      function(response) {
        if (response.value) {
          $scope.allProducts = response.data;
          $scope.changePage(1);
          // $scope.products = _.slice($scope.allProducts, 0, 7);
          console.log("sortByBrand1", response.data);
        }
      }
    );
    /* NavigationService.apiCallWithData("Product/sortProductsByBrands", dataToSend, function (response) {
            if (response.value) {
                $scope.allProducts = response.data;
                $scope.changePage(1);
                // $scope.products = _.slice($scope.allProducts, 0, 7);
                console.log(" result", response.data);
            }
        }); */
  };
  $scope.sortByBrand();
  // $scope.checkifRead() = function () {
  //     $state.go("ticketopen-notification");
  // }
  $scope.notificationmodalOpen = function(notification) {
    $scope.singleNotification = notification;
    $scope.accordianNotification = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/notificationaccordian.html",
      scope: $scope,
      backdrop: "static"
    });
  };
  // $scope.openmodalOpen = function (tickets) {
  //     $scope.singleTicket = tickets;
  //     $scope.openTicket = $uibModal.open({
  //         animation: true,
  //         templateUrl: "views/modal/openticket.html",
  //         scope: $scope,
  //         backdrop: 'static'
  //     });
  // }

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

  $scope.askRegistration = function() {
    $scope.productCheck = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/productCheck.html",
      scope: $scope,
      backdrop: "static",
      windowClass: "app-modal-window"
    });
    $scope.yes = false;
  };
  $scope.showText = function() {
    console.log("Csacd");
    $scope.showContentText = true;
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
});
