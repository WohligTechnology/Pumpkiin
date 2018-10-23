myApp.controller("headerCtrl", function (
  $scope,
  TemplateService,
  $uibModal,
  $state,
  NavigationService,
  $timeout,
  toastr,
  $http, ticketService, reminderService, $window
) {
  $scope.template = TemplateService;
  $scope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    $(window).scrollTop(0);
  });

  $scope.userInfo = $.jStorage.get("userData");
  var windowscreen = $window;
  $scope.changeTicketName = false;

  if ($scope.userInfo) {
    $scope.jstrgValue = $scope.userInfo;
    var data = {};
    data._id = $scope.userInfo._id;
    // console.log("--------------------->", $scope.userInfo._id);
    NavigationService.apiCallWithData("User/getOne", data, function (response) {
      if (response.value == true) {
        $scope.userDataForProfile = response.data;
      }
    });
  }


  $scope.currentState = $state.current.name;
  var stateArray = ["login", "verifyemail", "privacy", "terms"];
  var stateIndex = _.findIndex(stateArray, function (state) {
    return state == $scope.currentState;
  });
  if (_.isEmpty($.jStorage.get("userData")) && stateIndex == -1) {
    $state.go("home");
  }
  $.fancybox.close(true);
  $scope.data = {};
  // $scope.productList = [{
  //     name: "Samsung s7 in Mobile",
  //     img: "../img/ticketCreation/warranty.png"
  // }, {
  //     name: "Samsung s7 in Mobile Black"
  // }, {
  //     name: "Samsung s7 edge"
  // }];

  $scope.reminderModalOpen = function (data) {
    if (data) {
      $scope.getReminder(data);
    }
    $scope.addReminder = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/addReminder.html",
      scope: $scope,
      backdrop: "static"
    });
  };

  $scope.chnageStatus = function (data) {
    console.log("data", data);
    var changeStatusData = {};
    changeStatusData.status = "Completed";
    changeStatusData._id = data;
    NavigationService.apiCallWithData(
      "Reminder/save",
      changeStatusData,
      function (res) {
        if (res.value == true) {
          $state.reload();
        }
      }
    );
  };

  $scope.changePageTickets = function (pageno) {
    $scope.currentPage = pageno;

    var start = (pageno - 1) * $scope.maxRow;
    var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
    // $scope.ticketDetails.page = pageno;
    $scope.ticketDetails = _.slice($scope.ticketData, start, end);
    console.log(" $scope.ticketDetails >>>>>>>>>>>>>>>", $scope.ticketData);
    $scope.pageNumber = pageno;
    if ($scope.ticketData[0].status == 'Active') {
      $scope.openTickets();
    } else {
      $scope.getTickets();
    }

  };
  // $scope.changePageClosedTickets = function (pageno) {
  //   $scope.currentPage = pageno;

  //   var start = (pageno - 1) * $scope.maxRow;
  //   var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
  //   // $scope.ticketDetails.page = pageno;
  //   $scope.ticketDetails = _.slice($scope.ticketData, start, end);
  //   // console.log(" $scope.ticketDetails", $scope.ticketData);
  //   $scope.pageNumber = pageno;
  //   $scope.openTickets();
  // };

  //call reminders

  // $scope.pendingReminders = function (data) {
  //   $scope.showGreenImage = false;
  //   reminderService.findReminderOfPendingSnoozeByUser(function (data) {
  //     $scope.showLessReminders = data;
  //     console.log("2", $scope.showLessReminders);
  //   });
  // };
  // $scope.completedReminders = function (data) {
  //   $scope.showGreenImage = true;
  //   reminderService.findReminderOfCompletedByUser(function (data) {
  //     $scope.showLessReminders = data;
  //     console.log("1", $scope.showLessReminders);
  //   });
  // };

  $scope.completedReminders = function () {
    $scope.showGreenImage = true;
    reminderService.findReminderOfCompletedByUser(function (data) {
      if (windowscreen.screen.width < 768) {
        $scope.showLessReminders = data;
      } else {
        $scope.showLessReminders = _.slice(data, 0, 5);
      }
    });
  };

  $scope.pendingReminders = function () {
    reminderService.findReminderOfPendingSnoozeByUser(function (data) {
      $scope.showGreenImage = false;
      if (windowscreen.screen.width < 768) {
        $scope.showLessReminders = data;
      } else {
        $scope.showLessReminders = _.slice(data, 0, 5);
      }
    });
  };

  $scope.getOpenTickets = function () {
    $scope.changeTicketName = false;
    $scope.openTickets();


    ticketService.totalOpenTickets(function (data) {
      // console.log("get Open tickets", data);
      $scope.countOpenTickets = data.length;
      if (windowscreen.screen.width < 768) {
        $scope.ticketDetails = data;
      } else {
        $scope.ticketDetails = _.slice(data, 0, 5);
      }
    });
  };

  //closed ticket pagenation
  $scope.getTickets = function () {
    var pageData = $scope.pageNumber;
    console.log("pageData", pageData);
    ticketService.totalClosedTickets1(pageData, function (data) {
      console.log("ticketData", data);
      $scope.ticketData = data.results;
      $scope.ticketDetails = _.slice(data.results, 0, 5);
      $scope.totalitems = data.total;
      $scope.maxRow = data.options.count;
      // $scope.callTickets();
    });
  };

  //open ticket pagenation
  $scope.openTickets = function () {
    // console.log("opentickets");
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
  $scope.openTickets();

  $scope.getClosedTickets = function () {
    $scope.changeTicketName = true;
    $scope.getTickets();
    ticketService.totalClosedTickets(function (data) {
      if (windowscreen.screen.width < 768) {
        $scope.ticketDetails = data;
      } else {
        $scope.ticketDetails = _.slice(data, 0, 5);
      }
    });
  };



  $scope.searchForReminderData = function (data, data1) {
    var dataToSend = {};
    console.log("data -->", data, "data1", data1);
    if (data.length > 0) {
      if (data1 == "open") {
        console.log("IN IFFFF");
        dataToSend.user = $.jStorage.get("userData")._id;
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
        console.log("IN Else");
        dataToSend.keyword = data;
        dataToSend.user = $.jStorage.get("userData")._id;
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
    } else {
      if (data1 == "closed") {
        $scope.completedReminders();
      } else {
        $scope.pendingReminders();
      }
    }
  };
  $scope.current = new Date();
  $scope.getReminder = function (data) {
    console.log("---------->>", data);
    var getReminder = {};
    getReminder._id = data;
    NavigationService.apiCallWithData("Reminder/getOne", getReminder, function (
      res
    ) {
      $scope.data = res.data;
      if (res.data.dateOfReminder) {
        $scope.data.dateOfReminder = moment(
          new Date(res.data.dateOfReminder)
        ).format("MM/DD/YYYY HH:mm:ss A");
      }
      console.log("$scope.data", $scope.data.dateOfReminder);
    });
  };



  // $scope.getOpenTickets = function () {
  //   ticketService.totalOpenTickets(function (data) {
  //     if (windowscreen.screen.width < 768) {
  //       $scope.ticketDetails = data;
  //     } else {
  //       $scope.ticketDetails = _.slice(data, 0, 5);
  //     }
  //   });
  // };

  $scope.searchForTicketData = function (data, data1) {
    console.log("Hi In Here------------->>>>>>>", data, data1);
    var dataToSend = {};
    if (data.length > 0) {
      console.log("Here");
      if (data1 == "open") {
        dataToSend.user = $.jStorage.get("userData")._id;
        dataToSend.keyword = data;
        NavigationService.apiCallWithData(
          "Ticket/searchOpenTickets",
          dataToSend,
          function (response) {
            if (response.value) {
              $scope.ticketDetails = response.data;
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
          function (response) {
            console.log(" response", response);

            if (response.value) {
              $scope.ticketDetails = response.data;
              console.log(" $scope.ticketDetails", $scope.ticketDetails);
            }
          }
        );
      }
    } else {
      // API For Normal Search of Ticket

      console.log("data1", data1);
      if (data1 == "closed") {
        $scope.getClosedTickets();
      } else {
        $scope.getOpenTickets();
      }

    }
  };

  $scope.saveReminder = function (data) {
    data.user = $.jStorage.get("userData")._id;
    if (data._id) {
      data.status = "Snooze";
    } else {
      data.status = "Pending";
    }

    NavigationService.apiCallWithData("Reminder/save", $scope.data, function (
      res
    ) {
      if (data._id) {
        toastr.success("Reminder Edited Successfully");
      } else {
        toastr.success("Reminder Added Successfully");
      }
      $scope.addReminder.close();
      $state.reload();
    });

    // console.log("-----$scope.data-----", data);
    //   data.user = $scope.userInfo._id;
    //   data.name = $scope.userInfo.name;
    //   data.email = $scope.userInfo.email;
    //   data.status = "Pending";
    //   NavigationService.apiCallWithData(
    //     "Reminder/sendReminderMail",
    //     data,
    //     function(res) {
    //       console.log("res.data", res.data);
    //       toastr.success("Reminder Added Successfully");
    //       $scope.addReminder.close();
    //       $state.reload();
    //     }
    //   );
  };

  $scope.searchData = function (data) {
    $scope.productList = [];
    if (data.length > 0) {
      var dataToSend = {};
      dataToSend.keyword = data;
      dataToSend.user = $scope.userInfo._id;
      NavigationService.apiCallWithData(
        "Product/getSearchProductAndBrand",
        dataToSend,
        function (response) {
          console.log("Search data", response.data);
          if (response.value) {
            _.each(response.data, function (n) {
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
            $scope.productList = response.data;
          }
        }
      );
    }
  };

  $scope.logout = function (data) {
    $.jStorage.flush();
    $state.go("home");
  };

  //for footer
  $scope.scrollTop = function () {
    $("html, body").animate({
        scrollTop: $("body,html").offset().top - 100
      },
      1000
    );
  };
  $scope.showMenu = false;
  $scope.toggleMenu = function () {
    $scope.showMenu = !$scope.showMenu;
    console.log("inside menu");
  };
  $scope.closeMenu = function () {
    $scope.showMenu = false;
  };



});