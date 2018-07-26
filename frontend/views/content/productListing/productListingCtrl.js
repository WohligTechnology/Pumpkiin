myApp.controller('ProductlistingCtrl', function ($scope, TemplateService, ticketService, NavigationService, $timeout, toastr, $http, $uibModal, $state, reminderService) {
    $scope.template = TemplateService.getHTML("content/productListing/productListing.html");
    TemplateService.title = "Product Listing"; //This is the Title of the Website
    TemplateService.landingheader = "";
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
        $scope.ticketDetails = _.slice(data, 0, 5);
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
            $scope.ticketDetails = _.slice(data, 0, 5);
        });
    }

    //for ticket block end



    NavigationService.apiCallWithoutData("Product/getAllProducts", function (res) {
        if (res.value == true) {
            // console.log("res-----", res.data.results);
            $scope.allProducts = res.data;
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
    }

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

});