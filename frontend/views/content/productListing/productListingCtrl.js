myApp.controller('ProductlistingCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/productListing/productListing.html");
    TemplateService.title = "Product Listing"; //This is the Title of the Website
    TemplateService.landingheader = "";
    $scope.navigation = NavigationService.getNavigation();
    $scope.productInfo = [{
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }, {
        "largeimage": "img/iphone.jpeg",
        "smallimage": "img/ticketCreation/mobile.png",
        "productname": "Apple iPhone X",
        "relation": "Sisters Phone",
        "warranty": "Warranty Exp: 8 months"
    }]
    $scope.deleteProduct = function (index) {
        $scope.productInfo.splice(index, 1);
    }

});