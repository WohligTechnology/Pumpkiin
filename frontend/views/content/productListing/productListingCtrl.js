myApp.controller('ProductlistingCtrl', function ($scope, TemplateService, ticketService, NavigationService, $timeout, toastr, $http, $uibModal, $state, reminderService) {
    $scope.template = TemplateService.getHTML("content/productListing/productListing.html");
    TemplateService.title = "Product Listing"; //This is the Title of the Website
    TemplateService.landingheader = "";
    TemplateService.cssMain = "main"
    $scope.navigation = NavigationService.getNavigation();

    $scope.jstrgValue = $.jStorage.get('userData');

    $scope.productInfo = [{
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X 1",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X 2",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X 3",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X 4",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X 5",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X 6",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X 7",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }];

    //REMINDER SECTION
    $scope.maxRow = 7;
    $scope.changePage = function (pageno) {
        $scope.currentPage = pageno;
        var start = (pageno - 1) * $scope.maxRow;
        var end = (pageno - 1) * $scope.maxRow + $scope.maxRow;
        $scope.productPerPage = _.slice($scope.allProducts, start, end);

        _.each($scope.productPerPage, function (n) {
            var now = moment(new Date()),
                end = moment(n.warrantyExpDate),
                days = end.diff(now, 'days');
            console.log("----days-----", days)
            if (days <= 30) {
                n.ribbon = true;
            } else {
                n.ribbon = false;
            }
        });



        console.log("$scope.productPerPage", $scope.productPerPage);

    }

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
        $scope.ticketDetails = _.slice(data, 0, 8);
        console.log("1 $scope.ticketDetails --", $scope.ticketDetails);

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
            $scope.ticketDetails = _.slice(data, 0, 8);
            console.log("2 $scope.ticketDetails --", $scope.ticketDetails);

        });
    }

    $scope.getOpenTickets = function () {
        ticketService.totalOpenTickets(function (data) {
            // $scope.ticketDetails = data;
            $scope.ticketDetails = _.slice(data, 0, 8);
            console.log("3 $scope.ticketDetails --", $scope.ticketDetails);

        });
    }

    //for ticket block end


    var dataToSendForProduct = {};
    dataToSendForProduct.user = $scope.jstrgValue._id;
    NavigationService.apiCallWithData("Product/getAllProducts", dataToSendForProduct, function (res) {
        if (res.value == true) {
            // console.log("res-----", res.data.results);
            $scope.allProducts = res.data;
            $scope.products = _.slice($scope.allProducts, 0, 7);
        }
    });

    $scope.deleteProduct = function (index) {
        var teest = $scope.allProducts.splice(index, 1);
        var dataToSend = {};
        dataToSend._id = teest[0]._id;
        // console.log("dataToSend", dataToSend);
        NavigationService.apiCallWithData("Product/delete", dataToSend, function (res) {
            if (res.value == true) {
                toastr.success("Product deleted successfully");
            }
        });
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

    $scope.searchForTicketData = function (data, data1) {
        var dataToSend = {};
        if (data.length > 0) {
            if (data1 == 'open') {
                dataToSend.keyword = data;
                NavigationService.apiCallWithData("Ticket/searchOpenTickets", dataToSend, function (response) {
                    if (response.value) {
                        $scope.ticketDetails = response.data;
                        console.log(" $scope.ticketDetails", $scope.ticketDetails);
                    }
                });
            } else {
                console.log("data", data);
                dataToSend.keyword = data;
                NavigationService.apiCallWithData("Ticket/searchClosedTickets", dataToSend, function (response) {
                    console.log(" response", response);

                    if (response.value) {
                        $scope.ticketDetails = response.data;
                        console.log(" $scope.ticketDetails", $scope.ticketDetails);
                    }
                });
            }
        }
    };

    $scope.searchForReminderData = function (data, data1) {
        var dataToSend = {};
        if (data.length > 0) {
            if (data1 == 'open') {
                dataToSend.keyword = data;
                NavigationService.apiCallWithData("Reminder/searchOpenReminders", dataToSend, function (response) {
                    if (response.value) {
                        $scope.allReminders = response.data;
                        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
                    }
                });
            } else {
                dataToSend.keyword = data;
                NavigationService.apiCallWithData("Reminder/searchClosedReminders", dataToSend, function (response) {
                    console.log(" response", response);

                    if (response.value) {
                        $scope.allReminders = response.data;
                        $scope.showLessReminders = _.slice($scope.allReminders, 0, 5);
                    }
                });
            }
        }
    };

    $scope.generateExcel = function () {
        var dataToSend = $scope.jstrgValue._id;
        window.open(adminurl + 'Product/excelProductList/' + dataToSend, '_blank');
    };

    $scope.sortByProduct = function () {
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



        NavigationService.apiCallWithData("Product/sortFunction", dataToSend, function (response) {
            if (response.value) {
                $scope.allProducts = response.data;
                $scope.changePage(1);
                //$scope.products = _.slice($scope.allProducts, 0, 7);
                console.log("sortByProduct", response.data);
            }
        });
    };

    $scope.sortByBrand = function () {
        var dataToSend = {};
        dataToSend.user = $scope.jstrgValue._id;
        dataToSend.name = "brand";
        console.log("sortByBrand", dataToSend);
        NavigationService.apiCallWithData("Product/sortFunction", dataToSend, function (response) {
            if (response.value) {
                $scope.allProducts = response.data;
                $scope.changePage(1);
                // $scope.products = _.slice($scope.allProducts, 0, 7);
                console.log("sortByBrand1", response.data);
            }
        })
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
});