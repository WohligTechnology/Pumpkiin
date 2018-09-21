myApp.controller('TicketCreationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, reminderService, $uibModal, $stateParams, $state, ticketService) {
    $scope.template = TemplateService.getHTML("content/ticketCreation/ticketCreation.html");
    TemplateService.title = "Ticket Creation"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "main";
    $scope.navigation = NavigationService.getNavigation();
    $scope.rate = 2;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.jstrgValue = $.jStorage.get('userData');

    $scope.chatData = {};
    $scope.ticketId = {};
    var productData = {};
    var productName;


    $scope.attachmentImage = true;

    $scope.newUserModalOpen = function () {
        $scope.addNewUser = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/addNewUser.html",
            scope: $scope,
        });
    };

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
                    console.log("/////////////////////////////////////////////////////////////  $scope.ticketDetails-----------", $scope.ticketDetails);

                    //timeline

                    $scope.statusArray = [{
                        status: "Repair/ Maintenance (On-site)",
                        activeClass: ''
                    }, {
                        status: "Scheduling service with customer (Open)",
                        activeClass: ''
                    }, {
                        status: "Coordinating with the service provider (Open)",
                        activeClass: ''
                    }, {
                        status: "Service confirmed (In-progress)",
                        activeClass: ''
                    }, {
                        status: "Service completed (Closed)",
                        activeClass: ''
                    }, {
                        status: "Awaiting feedback (Closed)",
                        activeClass: ''
                    }, {
                        status: "Appliance picked up (In-progress)",
                        activeClass: ''
                    }, {
                        status: "Appliance returned (Closed)",
                        activeClass: ''
                    }, {
                        status: "Completed (Completed)",
                        activeClass: ''
                    }];

                    _.each($scope.statusArray, function (x) {
                        // console.log("1 $scope.ticketDetails", $scope.ticketDetails);
                        _.each($scope.ticketDetails.substat, function (y) {
                            if (y.status == x.status) {
                                // console.log("-", _.findIndex($scope.statusArray, function (o) {
                                //     return o == x;
                                // }))
                                var index = _.findIndex($scope.statusArray, function (o) {
                                    return o.status == x.status;
                                });
                                $scope.statusArray[index].activeClass = 'timeline-active';

                                // $(".circle6").addClass("timeline-active");
                            }
                        })
                    })

                    ticketService.totalOpenTickets(function (data) {
                        // $scope.ticketDetails = data;
                        $scope.ticketDetails1 = _.slice(data.results, 0, 8);
                        console.log("1 $scope.ticketDetails --", data);

                    });

                    //timeline end

                });

                productData._id = $stateParams.id;
                NavigationService.apiCallWithData("Product/getOne", productData, function (res) {
                    $scope.productDetails = res.data;
                    productName = $scope.productDetails.productName;
                    console.log("$scope.productDetails-----------", $scope.productDetails);
                });
            } else {
                if ($scope.totalOpenTickets[0]) {
                    // console.log("res---totalOpenTickets--", $scope.totalOpenTickets[0]);
                    $scope.ticketDetails = $scope.totalOpenTickets[0];
                    productData._id = $scope.totalOpenTickets[0].product._id;
                    NavigationService.apiCallWithData("Product/getOne", productData, function (res) {
                        $scope.productDetails = res.data;
                        productName = $scope.productDetails.productName;
                        console.log("$scope.productDetails-----------", $scope.productDetails);
                    });
                }

                //timeline

                $scope.statusArray = [{
                    status: "Repair/ Maintenance (On-site)",
                    activeClass: ''
                }, {
                    status: "Scheduling service with customer (Open)",
                    activeClass: ''
                }, {
                    status: "Coordinating with the service provider (Open)",
                    activeClass: ''
                }, {
                    status: "Service confirmed (In-progress)",
                    activeClass: ''
                }, {
                    status: "Service completed (Closed)",
                    activeClass: ''
                }, {
                    status: "Awaiting feedback (Closed)",
                    activeClass: ''
                }, {
                    status: "Appliance picked up (In-progress)",
                    activeClass: ''
                }, {
                    status: "Appliance returned (Closed)",
                    activeClass: ''
                }, {
                    status: "Completed (Completed)",
                    activeClass: ''
                }];

                _.each($scope.statusArray, function (x) {
                    console.log("2 $scope.ticketDetails", $scope.ticketDetails);

                    _.each($scope.ticketDetails.substat, function (y) {
                        if (y.status == x.status) {
                            // console.log("-", _.findIndex($scope.statusArray, function (o) {
                            //     return o == x;
                            // }))
                            var index = _.findIndex($scope.statusArray, function (o) {
                                return o.status == x.status;
                            });
                            $scope.statusArray[index].activeClass = 'timeline-active';

                            // $(".circle6").addClass("timeline-active");
                        }
                    })
                })

                //timeline end
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

        $scope.getClosedTickets = function () {
            ticketService.totalClosedTickets(function (data) {
                // $scope.ticketDetails = data;
                $scope.ticketDetails1 = _.slice(data, 0, 8);
                console.log("2 $scope.ticketDetails --", $scope.ticketDetails);

            });
        }

        $scope.getOpenTickets = function () {
            ticketService.totalOpenTickets(function (data) {
                // $scope.ticketDetails = data;
                console.log("----109----", data.results);
                $scope.ticketDetails1 = _.slice(data.results, 0, 5);

            });
        }


        ticketService.totalOpenTickets(function (data) {
            // $scope.ticketDetails = data;
            $scope.ticketDetails = _.slice(data, 0, 5);
            // console.log(" $scope.ticketDetails --", $scope.ticketDetails);

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
        console.log("data", data);
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
            dataToSend.productName = productName;
            dataToSend.name = $.jStorage.get("userData").name;
            dataToSend.email = $.jStorage.get("userData").email;
            console.log("dataToSend", dataToSend);
            NavigationService.apiCallWithData("Ticket/createNewTicket", dataToSend, function (data) {
                console.log("callback", data);
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
            user
        }, function (data) {
            $scope.remainingProduct = data.data;
            console.log("hjhsakf", $scope.remainingProduct)
        })
    }

});