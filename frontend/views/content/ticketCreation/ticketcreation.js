myApp.controller("TicketCreationCtrl", function(
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

  $scope.chatData = {};
  $scope.ticketId = {};
  var productData = {};
  var productName;

  $scope.attachmentImage = true;

  $scope.newUserModalOpen = function() {
    $scope.addNewUser = $uibModal.open({
      animation: true,
      templateUrl: "views/modal/addNewUser.html",
      scope: $scope
    });
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

  $scope.getTicket = function() {
    ticketService.totalOpenTickets(function(data) {
      $scope.totalOpenTickets = data;
      $scope.showLessOpenTickets = _.slice($scope.totalOpenTickets, 0, 5);
      // console.log("res---totalOpenTickets--", data);
      if (!_.isEmpty($stateParams.id)) {
        var ticketData = {};
        // ticketData.ticketId = $scope.ticketId;
        ticketData.user = $scope.jstrgValue._id;
        ticketData.product = $stateParams.id;
        // console.log("$scope.ticketData-----------", ticketData);
        NavigationService.apiCallWithData(
          "Ticket/findActiveTicketOfUser",
          ticketData,
          function(res) {
            $scope.ticketDetails = res.data;
            console.log(
              "///////////////////////////////////////////////////////////$scope.ticketDetails-----------",
              res.data
            );

            //timeline

            $scope.statusArray = [
              {
                status: "Repair/ Maintenance (On-site)",
                activeClass: ""
              },
              {
                status: "Scheduling service with customer (Open)",
                activeClass: ""
              },
              {
                status: "Coordinating with the service provider (Open)",
                activeClass: ""
              },
              {
                status: "Service confirmed (In-progress)",
                activeClass: ""
              },
              {
                status: "Service completed (Closed)",
                activeClass: ""
              },
              {
                status: "Awaiting feedback (Closed)",
                activeClass: ""
              },
              {
                status: "Appliance picked up (In-progress)",
                activeClass: ""
              },
              {
                status: "Appliance returned (Closed)",
                activeClass: ""
              },
              {
                status: "Completed (Completed)",
                activeClass: ""
              }
            ];

            _.each($scope.statusArray, function(x) {
              // console.log("++++++++++++", x);
              _.each($scope.ticketDetails.substat, function(y) {
                // console.log("===========", y)
                if (y.status == x.status) {
                  // console.log("-", _.findIndex($scope.statusArray, function (o) {
                  //     return o == x;
                  // }))
                  var index = _.findIndex($scope.statusArray, function(o) {
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

            ticketService.totalOpenTickets(function(data) {
              // $scope.ticketDetails = data;
              $scope.ticketDetails = _.slice(data.results, 0, 5);
              console.log("1 $scope.ticketDetails --", $scope.ticketDetails);
            });

            //timeline end
          }
        );

        productData._id = $stateParams.id;
        NavigationService.apiCallWithData(
          "Product/getOne",
          productData,
          function(res) {
            $scope.productDetails = res.data;
            productName = $scope.productDetails.productName;
            console.log(
              "$scope.productDetails-----------",
              $scope.productDetails
            );
          }
        );
      } else {
        if ($scope.totalOpenTickets[0]) {
          console.log("res---totalOpenTickets--", $scope.totalOpenTickets[0]);
          $scope.ticketDetails = $scope.totalOpenTickets[0];
          productData._id = $scope.totalOpenTickets[0].product._id;
          NavigationService.apiCallWithData(
            "Product/getOne",
            productData,
            function(res) {
              $scope.productDetails = res.data;
              productName = $scope.productDetails.productName;
              console.log(
                "$scope.productDetails-----------",
                $scope.productDetails
              );
            }
          );
        }

        //timeline

        $scope.statusArray = [
          {
            status: "Repair/ Maintenance (On-site)",
            statusDate: "",
            activeClass: ""
          },
          {
            status: "Scheduling service with customer (Open)",
            activeClass: ""
          },
          {
            status: "Coordinating with the service provider (Open)",
            activeClass: ""
          },
          {
            status: "Service confirmed (In-progress)",

            activeClass: ""
          },
          {
            status: "Service completed (Closed)",
            activeClass: ""
          },
          {
            status: "Awaiting feedback (Closed)",
            activeClass: ""
          },
          {
            status: "Appliance picked up (In-progress)",
            activeClass: ""
          },
          {
            status: "Appliance returned (Closed)",
            activeClass: ""
          },
          {
            status: "Completed (Completed)",
            activeClass: ""
          }
        ];

        _.each($scope.statusArray, function(x) {
          console.log("2 $scope.ticketDetails", $scope.ticketDetails);

          _.each($scope.ticketDetails.substat, function(y) {
            if (y.status == x.status) {
              // console.log("-", _.findIndex($scope.statusArray, function (o) {
              //     return o == x;
              // }))
              var index = _.findIndex($scope.statusArray, function(o) {
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
      // console.log("res---totalNumberOfClosedTickets--", data);
    });

    $scope.getClosedTickets = function() {
      ticketService.totalClosedTickets(function(data) {
        // $scope.ticketDetails = data;
        $scope.ticketDetails = _.slice(data, 0, 5);
        console.log("2 $scope.ticketDetails --", $scope.ticketDetails);
      });
    };

    $scope.getOpenTickets = function() {
      ticketService.totalOpenTickets(function(data) {
        // $scope.ticketDetails = data;
        console.log("----109----", data.results);
        $scope.ticketDetails = _.slice(data.results, 0, 5);
      });
    };

    ticketService.totalOpenTickets(function(data) {
      // $scope.ticketDetails = data;
      $scope.ticketDetails = _.slice(data, 0, 5);
      console.log(" $scope.ticketDetails --", $scope.ticketDetails);
    });
  };

  $scope.getTicket();

  //for ticket block end

  $scope.ticketChatSocket = function(data) {
    if (data) {
      $scope.ticketDetails = data.ticketChatData;
      // console.log("$scope.ticketData$$$$$$$$$$------- ", $scope.ticketDetails);
      $scope.$apply();
    }
  };

  $scope.ticketChatSocket();
  io.socket.on("ticketChat", $scope.ticketChatSocket);

  $scope.addComment = function(data) {
    console.log("data", data);
    // console.log("  $.jStorage.get", $.jStorage.get("userData"));
    // console.log("$scope.ticketDetails-----------", $scope.ticketDetails);
    // console.log("$scope.ticketDetails-----------", _.isEmpty($scope.ticketDetails));

    var formData = {};
    var dataToSend = {};
    dataToSend.customerChat = [];
    if (
      !_.isEmpty($.jStorage.get("userData")) &&
      $scope.ticketDetails == "No Data Found"
    ) {
      formData.user = $.jStorage.get("userData")._id;
      formData.comment = data.comment;
      formData.file = data.image;
      // if (!dataToSend.customerChat) {
      //   dataToSend.customerChat = [];
      // }
      dataToSend.customerChat.push(formData);
      dataToSend.user = $scope.jstrgValue._id;
      dataToSend.product = $stateParams.id;
      dataToSend.productName = productName;
      dataToSend.name = $.jStorage.get("userData").name;
      dataToSend.email = $.jStorage.get("userData").email;
      console.log("dataToSend", dataToSend);
      NavigationService.apiCallWithData(
        "Ticket/createNewTicket",
        dataToSend,
        function(data) {
          console.log("callback", data);
          if (data.value == true) {
            $scope.ticketId = data.data._id;
            // $scope.ticketDetails = data.data;
            $scope.chatData.comment = null;
            $scope.chatData.image = null;
            $scope.getTicket();
          }
        }
      );
    } else {
      formData.user = $.jStorage.get("userData")._id;
      formData.comment = data.comment;
      formData.file = data.image;
      console.log("formData", formData);
      console.log(
        "$scope.ticketDetails.customerChat",
        $scope.ticketDetails.customerChat
      );
      if (!$scope.ticketDetails.customerChat) {
        $scope.ticketDetails.customerChat = [];
      }
      $scope.ticketDetails.customerChat.push(formData);
      console.log(" $scope.ticketDetails", $scope.ticketDetails.customerChat);
      
      NavigationService.apiCallWithData(
        "Ticket/addToChat",
        $scope.ticketDetails,
        function(data) {
          $scope.chatData.comment = null;
          $scope.chatData.image = null;
          if (data.value == true) {
            $scope.getTicket();
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
    $scope.closeModal = function() {
      $scope.openTicket.close();
    };

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
