// Link all the JS Docs here
var myApp = angular.module("myApp", [
  "ui.router",
  "pascalprecht.translate",
  "angulartics",
  "angulartics.google.analytics",
  "imageupload",
  "ui.bootstrap",
  // 'ngAnimate',
  // 'ngSanitize',
  "angularPromiseButtons",
  "toastr",
  "ui.select",
  "moment-picker",
  "ngMap",
  "ngAria",
  "ngMaterial",
  "ngMaterialDatePicker"
]);

// Define all the routes below
myApp.config(function(
  $stateProvider,
  $urlRouterProvider,
  $httpProvider,
  $locationProvider,
  momentPickerProvider
) {
  momentPickerProvider.options({
    /* Picker properties */
    locale: "en",
    format: "L LTS",
    minView: "year",
    maxView: "minute",
    startView: "year",
    autoclose: true,
    today: true,
    keyboard: true,

    /* Extra: Views properties */
    leftArrow: "&larr;",
    rightArrow: "&rarr;",
    yearsFormat: "YYYY",
    monthsFormat: "MMM",
    daysFormat: "D",
    hoursFormat: "HH:[00]",
    minutesFormat: moment
      .localeData()
      .longDateFormat("LT")
      .replace(/[aA]/, ""),
    secondsFormat: "ss",
    minutesStep: 5,
    secondsStep: 1
  });

  var tempateURL = "views/template/template.html"; //Default Template URL
  var tempateURLNew = "views/template/template2.html";
  // for http request with session
  $httpProvider.defaults.withCredentials = true;
  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: tempateURL,
      controller: "HomeCtrl"
    })
    .state("profile", {
      url: "/profile",
      templateUrl: tempateURL,
      controller: "ProfileCtrl"
    })
    .state("login", {
      url: "/login/:id",
      templateUrl: tempateURL,
      controller: "LoginCtrl"
    })
    .state("landing", {
      url: "/landing",
      templateUrl: tempateURL,
      controller: "LandingCtrl"
    })
    .state("productdetailregistered", {
      url: "/productdetailregistered/:id",
      templateUrl: tempateURL,
      controller: "ProductDetailRegisteredCtrl"
    })
    .state("productdetailunregistered", {
      url: "/productdetailunregistered",
      templateUrl: tempateURL,
      controller: "ProductDetailUnregisteredCtrl"
    })
    .state("productregistration", {
      url: "/productregistration",
      templateUrl: tempateURL,
      controller: "ProductRegistrationCtrl"
    })
    .state("productListing", {
      url: "/productListing",
      templateUrl: tempateURL,
      controller: "ProductlistingCtrl"
    })
    .state("ticketcreation", {
      url: "/ticketcreation/:id/{new:.*}/:ticketId",
      templateUrl: tempateURL,
      controller: "TicketCreationCtrl",
      params: {
        new: ""
      }
    })
    .state("closedTicketcreation", {
      url: "/closedTicketcreation/:id",
      templateUrl: tempateURL,
      controller: "ClosedTicketcreationCtrl"
    })
    .state("openticket", {
      url: "/openticket",
      templateUrl: tempateURL,
      controller: "OpenTicketCtrl"
    })
    .state("ticketopen-notification", {
      url: "/ticketopen-notification",
      templateUrl: tempateURL,
      controller: "TicketopenNotificationCtrl"
    })
    .state("ticketclose-notification", {
      url: "/ticketclose-notification",
      templateUrl: tempateURL,
      controller: "TicketcloseNotificationCtrl"
    })
    .state("notification", {
      url: "/notification",
      templateUrl: tempateURL,
      controller: "NotificationCtrl"
    })
    .state("verifyemail", {
      url: "/verifyemail/:userId",
      templateUrl: tempateURL,
      controller: "VerifyEmailCtrl"
    })
    .state("terms", {
      url: "/terms-conditions",
      templateUrl: tempateURL,
      controller: "TermsCtrl"
    })
    .state("privacy", {
      url: "/privacy-policy",
      templateUrl: tempateURL,
      controller: "PrivacyCtrl"
    })
    .state("links", {
      url: "/links",
      templateUrl: tempateURL,
      controller: "LinksCtrl"
    });
  $urlRouterProvider.otherwise("/");
  $locationProvider.html5Mode(isproduction);
});

// For Language JS
myApp.config(function($translateProvider) {
  $translateProvider.translations("en", LanguageEnglish);
  $translateProvider.translations("hi", LanguageHindi);
  $translateProvider.preferredLanguage("en");
});
