myApp.controller('ProductlistingCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, $uibModal) {
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


    NavigationService.apiCallWithoutData("Product/search", function (res) {
        if (res.value == true) {
            // console.log("res-----", res.data.results);
            $scope.allProducts = res.data.results;
        }
    });

    $scope.deleteProduct = function (index) {
        var teest = $scope.allProducts.splice(index, 1);
        var dataToSend = {};
        dataToSend._id = teest[0]._id;
        console.log("dataToSend", dataToSend);
        // NavigationService.apiCallWithData("Product/delete", dataToSend, function (res) {
        //     if (res.value == true) {
        //         toastr.success("Product deleted successfully");
        //     }
        // });
    }

    var reminderData = {};
    reminderData.user = $scope.jstrgValue._id;
    NavigationService.apiCallWithData("Reminder/findReminderByUser", reminderData, function (res) {
        if (res.value == true) {
            // console.log("res--111---", res.data);
            $scope.allReminders = res.data;
        }
    });

    NavigationService.apiCallWithData("Reminder/totalNumberOfReminders", reminderData, function (res) {
        if (res.value == true) {
            // console.log("res---222--", res.data);
            $scope.totalReminders = res.data;

        }
    });
});