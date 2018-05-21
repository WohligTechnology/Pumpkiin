myApp.controller('ProductRegistrationCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
    $scope.template = TemplateService.getHTML("content/productRegistration/productRegistration.html");
    TemplateService.title = "product Registration"; //This is the Title of the Website
    TemplateService.landingheader = "";
    // TemplateService.header = " ";
    $scope.navigation = NavigationService.getNavigation();
    var circle1;
    $scope.activePage='circle1';
    $scope.makeActive = function (click) {
        $('.'+click).addClass("timeline-active");
        $scope.activePage=click;
        if(click){
            $('.'+click).nextAll().removeClass("timeline-active");
        }
    }
    $scope.addeduser=[{
        "name":"First Last Name",
        "relation":"Brother",
    },{
        "name":"First Last Name",
        "relation":"Brother",
    },{
        "name":"First Last Name",
        "relation":"Brother",
    },{
        "name":"First Last Name",
        "relation":"Brother",
    }];

    $scope.accessoriesMain=[{
        "name":"Accessories Name",
        "relation":"Accessories",
    },{
        "name":"Accessories Name",
        "relation":"Accessories",
    },{
        "name":"Accessories Name",
        "relation":"Accessories",
    },{
        "name":"Accessories Name",
        "relation":"Accessories",
    }];
});