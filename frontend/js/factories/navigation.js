var imgurl = "http://wohlig.io:80/api/upload/";

// var imgurl = "https://pumpkiin.wohlig.co.in/api/upload/";



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

        parseAccessToken: function (data, callback) {
            if (data) {
                $.jStorage.set("accessToken", data);
                callback();
            }
        },

        removeAccessToken: function (data, callback) {
            $.jStorage.flush();
        },

        profile: function (callback, errorCallback) {
            var data = {
                accessToken: $.jStorage.get("accessToken")
            };
            $http.post(adminurl + 'user/profile', data).then(function (data) {
                data = data.data;

                if (data.value === true) {
                    $.jStorage.set("userData", data.data);
                    callback();
                } else {
                    errorCallback(data.error);
                }
            });
        },
    };
});