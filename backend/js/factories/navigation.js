var imgurl = adminurl + "upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;



myApp.factory('NavigationService', function ($http) {
    var navigation = [{
            name: "Users",
            classis: "active",
            sref: "#!/page/viewUser//",
            icon: "phone",
            access: false
        },
        {
            name: "Product",
            classis: "active",
            sref: "",
            subnav: [{
                    name: "Confirmed",
                    classis: "active",
                    uiSref: "viewproductpage({status:'Confirmed'})",
                    icon: "phone",
                },
                {
                    name: "Pending",
                    classis: "active",
                    uiSref: "viewproductpage({status:'Pending'})",
                    icon: "phone",
                }

            ]

        }, {
            name: "Brands",
            classis: "active",
            sref: "#!/page/viewBrand//",
            access: false

        },
        {
            name: "Retailer",
            classis: "active",
            sref: "#!/page/viewRetailer//",
            access: false

        },

    ];

    return {
        getnav: function () {
            console.log("navigationnavigation", navigation[0].name)

            var userData = $.jStorage.get("profile")
            if (userData && userData.accessLevel) {
                _.forEach(navigation, function (value) {
                    console.log("valuevaluevaluevalue", value.access)
                    if (userData.accessLevel == "Brand" || userData.accessLevel == "Retailer") {
                        if (value.name == "Product") {
                            value.access = true;
                        }
                    } else if (userData.accessLevel == "Admin") {
                        value.access = true;
                    }
                })
            }
            return navigation;
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
                    $.jStorage.set("profile", data.data);
                    callback();
                } else {
                    errorCallback(data.error);
                }
            });
        },
        makeactive: function (menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },

        search: function (url, formData, i, callback) {
            $http.post(adminurl + url, formData).then(function (data) {
                data = data.data;
                callback(data, i);
            });
        },
        delete: function (url, formData, callback) {
            $http.post(adminurl + url, formData).then(function (data) {
                data = data.data;
                callback(data);
            });
        },
        countrySave: function (formData, callback) {
            $http.post(adminurl + 'country/save', formData).then(function (data) {
                data = data.data;
                callback(data);

            });
        },

        apiCall: function (url, formData, callback) {
            console.log("urlurlurlurl", url)
            $http.post(adminurl + url, formData).then(function (data) {
                data = data.data;
                callback(data);

            });
        },
        searchCall: function (url, formData, i, callback) {
            $http.post(adminurl + url, formData).then(function (data) {
                data = data.data;
                callback(data, i);
            });
        },

        getOneCountry: function (id, callback) {
            $http.post(adminurl + 'country/getOne', {
                _id: id
            }).then(function (data) {
                data = data.data;
                callback(data);

            });
        },
        getLatLng: function (address, i, callback) {
            $http({
                url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyC62zlixVsjaq4zDaL4cefNCubjCgxkte4",
                method: 'GET',
                withCredentials: false,
            }).then(function (data) {
                data = data.data;
                callback(data, i);
            });
        },
        uploadExcel: function (form, callback) {
            $http.post(adminurl + form.model + '/import', {
                file: form.file
            }).then(function (data) {
                data = data.data;
                callback(data);

            });

        },

    };
});