var imgurl = "http://wohlig.io:80/api/upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;


myApp.factory('NavigationService', function ($http) {
    var navigation = [{
        name: "Home",
        classis: "active",
        anchor: "home",
        subnav: [{
            name: "Subnav1",
            classis: "active",
            anchor: "home"
        }]
    }, {
        name: "Links",
        classis: "active",
        anchor: "links",
        subnav: []
    }];

    return {
        getNavigation: function () {
            return navigation;
        },

        apiCallWithData: function (url, formData, callback) {
            $http.post(adminurl + url, formData).then(function (data) {
                data = data.data;
                callback(data);

            });
        },

        apiCallWithoutData: function (url, callback) {
            $http.post(adminurl + url).then(function (data) {
                data = data.data;
                callback(data);
            });
        },
    };
});