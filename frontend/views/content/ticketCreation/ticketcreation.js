myApp.controller("TicketCreationCtrl", function (
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
    "content/ticketCreation/ticketCreation.html"
  );
  TemplateService.title = "Ticket Creation"; //This is the Title of the Website
  TemplateService.landingheader = "";
  TemplateService.cssMain = "main";
  $scope.navigation = NavigationService.getNavigation();
  $scope.rate = 2;
  $scope.max = 5;
  $scope.isReadonly = false;
  $scope.jstrgValue = $.jStorage.get("userData");
  $scope.showGreenImage = false;

  // $scope.ticketDetails = [];
  // $scope.ticketDetails[0] = {
  //   status: "Open"
  // };

  $scope.chatData = {};
  $scope.ticketId = {};
  var productData = {};
  var productName;

  $scope.attachmentImage = true;

  $scope.newUserModalOpen = function () {
    $scope.addNewUser = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/addNewUser.html",
      scope: $scope
    });
  };

  //REMINDER SECTION
  $scope.getReminder = function () {
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
      if (data.value) {
        $scope.totalPendingReminders = data.data;
      } else {
        $scope.totalPendingReminders = 0;
      }
      // console.log("$scope.totalPendingReminders--", $scope.totalPendingReminders);
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

  $scope.statusArray = [{
      status: "Repair/ Maintenance",
      activeClass: ""
    },
    {
      status: "Scheduling service with customer",
      activeClass: ""
    },
    {
      status: "Coordinating with the service provider",
      activeClass: ""
    },
    {
      status: "Service confirmed",
      activeClass: ""
    },
    {
      status: "Service completed",
      activeClass: ""
    },
    {
      status: "Appliance picked up",
      activeClass: ""
    },
    {
      status: "Appliance returned",
      activeClass: ""
    },
    {
      status: "Awaiting feedback",
      activeClass: ""
    },
    {
      status: "Completed",
      activeClass: ""
    }
  ];

  $scope.getTicket = function () {
    ticketService.totalOpenTickets(function (data) {
      $scope.totalOpenTickets = data;
      $scope.showLessOpenTickets = _.slice($scope.totalOpenTickets, 0, 5);
      if (!_.isEmpty($stateParams.id)) {
        var ticketData = {};
        ticketData.user = $scope.jstrgValue._id;
        ticketData.product = $stateParams.id;
        ticketData._id = $stateParams.ticketId;
        console.log("$scope.ticketData-----------", $stateParams.new);
        if ($stateParams.new == "") {
          console.log("HI");
          NavigationService.apiCallWithData(
            "Ticket/findActiveTicketOfUser",
            ticketData,
            function (res) {
              $scope.ticketDetails1 = res.data;
              if ($scope.ticketDetails1.ticketNumber) {
                $(".circle1").addClass("timeline-active");
              }
              establishSocket();

              //timeline

              $scope.statusArray = [{
                  status: "Repair/ Maintenance",
                  activeClass: ""
                },
                {
                  status: "Scheduling service with customer",
                  activeClass: ""
                },
                {
                  status: "Coordinating with the service provider",
                  activeClass: ""
                },
                {
                  status: "Service confirmed",
                  activeClass: ""
                },
                {
                  status: "Service completed",
                  activeClass: ""
                },
                {
                  status: "Appliance picked up",
                  activeClass: ""
                },
                {
                  status: "Appliance returned",
                  activeClass: ""
                },
                {
                  status: "Awaiting feedback",
                  activeClass: ""
                },
                {
                  status: "Completed",
                  activeClass: ""
                }
              ];

              _.each($scope.statusArray, function (x) {
                // console.log("++++++++++++", x);
                _.each($scope.ticketDetails1.substat, function (y) {
                  // console.log("===========", y)
                  if (y.status == x.status) {
                    // console.log("-", _.findIndex($scope.statusArray, function (o) {
                    //     return o == x;
                    // }))
                    var index = _.findIndex($scope.statusArray, function (o) {
                      return o.status == x.status;
                    });
                    $scope.statusArray[index].activeClass = "timeline-active";
                    $scope.statusArray[index].statusDate = moment(
                      y.statusDate
                    ).format("DD/MM/YYYY");

                    // $(".circle6").addClass("timeline-active");
                  }
                });
              });

              ticketService.totalOpenTickets(function (data) {
                // $scope.ticketDetails = data;
                // $scope.ticketDetails1 = _.slice(data.results, 0, 5);
              });

              //timeline end
            }
          );
        }

        productData._id = $stateParams.id;
        NavigationService.apiCallWithData(
          "Product/getOne",
          productData,
          function (res) {
            $scope.productDetails = res.data;
            productName = $scope.productDetails.productName;

          }
        );
      } else {
        if ($scope.totalOpenTickets[0]) {
          $scope.ticketDetails1 = $scope.totalOpenTickets[0];
          productData._id = $scope.totalOpenTickets[0].product._id;
          NavigationService.apiCallWithData(
            "Product/getOne",
            productData,
            function (res) {
              $scope.productDetails = res.data;
              productName = $scope.productDetails.productName;

            }
          );
        }

        //timeline
        $scope.tickitNumber = function (data) {
          if (data) {
            return "circle circle1 timeline - active";
          } else {
            return "circle circle1";
          }
        };

        $scope.statusArray = [{
            status: "Repair/ Maintenance",
            statusDate: "",
            activeClass: ""
          },
          {
            status: "Scheduling service with customer",
            activeClass: ""
          },
          {
            status: "Coordinating with the service provider",
            activeClass: ""
          },
          {
            status: "Service confirmed",

            activeClass: ""
          },
          {
            status: "Service completed",
            activeClass: ""
          },
          {
            status: "Appliance picked up",
            activeClass: ""
          },
          {
            status: "Appliance returned",
            activeClass: ""
          },
          {
            status: "Awaiting feedback",
            activeClass: ""
          },
          {
            status: "Completed",
            activeClass: ""
          }
        ];

        _.each($scope.statusArray, function (x) {
          _.each($scope.ticketDetails1.substat, function (y) {
            if (y.status == x.status) {
              // console.log("-", _.findIndex($scope.statusArray, function (o) {
              //     return o == x;
              // }))
              var index = _.findIndex($scope.statusArray, function (o) {
                return o.status == x.status;
              });
              $scope.statusArray[index].activeClass = "timeline-active";

              // $(".circle6").addClass("timeline-active");
            }
          });
        });

        //timeline end
      }
    });

    ticketService.totalNumberOfTickets(function (data) {
      $scope.totalNumberOfTickets = data;

    });

    ticketService.totalNumberOfOpenTickets(function (data) {
      if (data) {
        $scope.totalNumberOfOpenTickets = data;
      } else {
        $scope.totalNumberOfOpenTickets = 0;
      }
    });

    ticketService.totalNumberOfClosedTickets(function (data) {
      $scope.totalNumberOfClosedTickets = data;
      // console.log("res---totalNumberOfClosedTickets--", data);
    });

    $scope.getClosedTickets = function () {
      ticketService.totalClosedTickets(function (data) {
        $scope.ticketDetails = _.slice(data, 0, 5);
      });
    };
    $scope.getClosedTickets();

    $scope.getOpenTickets = function () {
      ticketService.totalOpenTickets(function (data) {
        $scope.countOpenTickets = data.length;
        // $scope.ticketDetails = data;
        $scope.ticketDetails = _.slice(data, 0, 5);
      });
    };
    $scope.getOpenTickets();
  };

  $scope.getTicket();

  $scope.getOpenTickets = function () {
    ticketService.totalOpenTickets(function (data) {
      $scope.countOpenTickets = data.length;
      $scope.ticketDetails = _.slice(data, 0, 5);
    });
  };
  $scope.getOpenTickets();

  //for ticket block end

  $scope.ticketChatSocket = function (data) {
    if (data) {
      $scope.ticketDetails1 = data.ticketChatData;
      $scope.$apply();
    }
  };

  $scope.ticketChatSocket();

  function establishSocket() {
    io.socket.on(
      "ticketChat" + $scope.ticketDetails1._id,
      $scope.ticketChatSocket
    );
  }

  $scope.addComment = function (data) {

    var formData = {};
    var dataToSend = {};
    dataToSend.customerChat = [];
    if ((!_.isEmpty($.jStorage.get("userData")) &&
        $scope.ticketDetails1 == "No Data Found"
      ) || ($stateParams.new && $scope.ticketDetails1 == undefined)) {

      console.log("In Here After Ticket Creation");
      formData.user = $.jStorage.get("userData")._id;
      formData.comment = data.comment;
      formData.file = data.image;
      formData.date = Date.now();
      dataToSend.customerChat.push(formData);
      dataToSend.user = $scope.jstrgValue._id;
      dataToSend.product = $stateParams.id;
      dataToSend.productName = productName;
      dataToSend.firstStage = $(".circle1").addClass("timeline-active");
      dataToSend.issueReported = Date.now();
      dataToSend.name = $.jStorage.get("userData").name;
      dataToSend.email = $.jStorage.get("userData").email;
      NavigationService.apiCallWithData(
        "Ticket/createNewTicket",
        dataToSend,
        function (data) {
          if (data.value == true) {
            $(".circle1").addClass("timeline-active");
            $scope.ticketId = data.data._id;
            // $scope.ticketDetails = data.data;
            $scope.chatData.comment = null;
            $scope.chatData.image = null;
            console.log("ticketId", data, "_id", $stateParams.id);
            $state.go("ticketcreation", {
              ticketId: data.data,
              id: $stateParams.id,
              new: ""
            });
            $scope.getTicket();
          }
        }
      );
      $('#chat').scrollTop($('#chat')[0].scrollHeight);
    } else {
      formData.user = $.jStorage.get("userData")._id;
      formData.comment = data.comment;
      formData.file = data.image;
      formData.date = Date.now();
      console.log("ABC", $scope.ticketDetails1);
      if (!$scope.ticketDetails1.customerChat) {
        $scope.ticketDetails1.customerChat = [];
      }
      $scope.ticketDetails1.customerChat.push(formData);

      NavigationService.apiCallWithData(
        "Ticket/addToChat",
        $scope.ticketDetails1,
        function (data) {
          console.log(
            "-----------------$scope.chatData--------",
            $scope.chatData
          );
          $(".circle1").addClass("timeline-active");
          delete $scope.chatData.comment;
          delete $scope.chatData.image;
          $scope.sentValue = true;
          if (data.value == true) {
            $scope.getTicket();
          }
          $('#chat').scrollTop($('#chat')[0].scrollHeight);
        }
      );
    }
  };
  $(window).load(function () {
    $('#chat').animate({
      scrollTop: $('#chat').get(0).scrollHeight
    }, 1000);
  });
  $scope.askRegistration = function () {
    $scope.productCheck = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/productCheck.html",
      scope: $scope,
      backdrop: "static",
      windowClass: "app-modal-window"
    });
    $scope.yes = false;
  };
  $scope.openmodalOpen = function (tickets, index) {
    console.log("open>>>>>>>>>>>>>>>>>>>>>>>>>>>", tickets);
    $scope.singleTicket = tickets;
    $scope.openTicket = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/openticket.html",
      scope: $scope,
      backdrop: "static"
    });
    $scope.closeModal = function () {
      $scope.openTicket.close();
    };

    if (!tickets.isRead) {
      var changeisRead = {};
      changeisRead.id = tickets._id;
      changeisRead.isRead = true;
      NavigationService.apiCallWithData(
        "Ticket/changeIsReadStatus",
        changeisRead,
        function (data) {
          console.log("changeIsReadStatus", data);
          if (data.value) {
            // if (modal) {
            $scope.getTicket();
            // } else {
            //     $scope.showLessReminders[index].isRead = true;
            // }
          }
        }
      );
    }
  };

  $scope.data = {};
  $scope.yesno = function () {
    $scope.yes = true;
    var user = $.jStorage.get("userData")._id;
    NavigationService.apiCallWithData(
      "Product/getAllProducts", {
        user: user
      },
      function (data) {
        $scope.remainingProduct = data.data;
        console.log("hjhsakf", $scope.remainingProduct);
      }
    );
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
  $scope.reloadPage = function () {
    $state.reload();
  }
});