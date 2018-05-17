var schema = new Schema({
    name: {
        type: String
    },
    balance: {
        type: String
    },
    socialAccount: [{
        account: String
    }],
    relations: [{
        relation: String
    }],
    email: {
        type: String
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    retailer: {
        type: Schema.Types.ObjectId,
        ref: 'Retailer'
    },
    dob: {
        type: Date,
        excel: {
            name: "Birthday",
            modify: function (val, data) {
                return moment(val).format("MMM DD YYYY");
            }
        }
    },
    photo: {
        type: String,
        default: "",
        excel: [{
            name: "Photo Val"
        }, {
            name: "Photo String",
            modify: function (val, data) {
                return "http://abc/" + val;
            }
        }, {
            name: "Photo Kebab",
            modify: function (val, data) {
                return data.name + " " + moment(data.dob).format("MMM DD YYYY");
            }
        }]
    },
    password: {
        type: String,
        default: ""
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },

    accessToken: {
        type: [String],
        index: true
    },
    googleAccessToken: String,
    googleRefreshToken: String,
    oauthLogin: {
        type: [{
            socialId: String,
            socialProvider: String
        }],
        index: true
    },
    accessLevel: {
        type: String,
        enum: ['Retailer', 'Admin', 'Brand']
    },
    address: [{
        lineOne: String,
        lineTwo: String,
        lineThree: String,
        city: String,
        district: String,
        state: String,
        pincode: String
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id'
        },
        'retailer': {
            select: ''
        },
        'brand': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user retailer brand", "user retailer brand"));
var model = {
    getOneUser: function (data, callback) {
        User.findOne({
            _id: data._id
        }).deepPopulate('retailer brand').exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                callback(null, found);
            }

        });
    },
    saveUser: function (data, callback) {

        User.findOne({
            _id: data._id
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                if (data.accessLevel == 'Brand') {
                    if (found.retailer) {
                        data.retailer = null;
                        User.saveData(data, function (err, data2) {
                            if (err) {
                                callback(err, data2);
                            } else {
                                callback(err, data2);
                            }
                        });
                    } else {
                        User.saveData(data, function (err, data2) {
                            if (err) {
                                callback(err, data2);
                            } else {
                                callback(err, data2);
                            }
                        });
                    }
                }
                if (data.accessLevel == "Retailer") {
                    if (found.brand) {
                        data.brand = null;
                        User.saveData(data, function (err, data2) {

                            if (err) {
                                callback(err, data2);
                            } else {
                                callback(err, data2);
                            }
                        });
                    } else {
                        User.saveData(data, function (err, data2) {
                            if (err) {
                                callback(err, data2);
                            } else {
                                callback(err, data2);
                            }
                        });
                    }
                }
            }

        });
    },
    add: function () {
        var sum = 0;
        _.each(arguments, function (arg) {
            sum += arg;
        });
        return sum;
    },
    existsSocial: function (user, callback) {
        var Model = this;
        console.log("existsSocial user: ", user);
        Model.findOne({
            "email": user.emails[0].value
        }).exec(function (err, data) {
            console.log("existsSocial: ", err, data);
            if (err) {
                callback(err, data);
            } else if (_.isEmpty(data)) {
                var envEmailIndex = _.indexOf(env.emails, user.emails[0].value);
                console.log("envEmailIndexenvEmailIndexenvEmailIndex", envEmailIndex)
                if (envEmailIndex > 0) {
                    var modelUser = {
                        name: user.displayName,
                        accessToken: [uid(16)],
                        oauthLogin: [{
                            socialId: user.id,
                            socialProvider: user.provider,
                        }]

                    };
                    modelUser.email = user.emails[0].value;
                    modelUser.accessLevel = "Admin";
                    modelUser.googleAccessToken = user.googleAccessToken;
                    modelUser.googleRefreshToken = user.googleRefreshToken;
                    if (user.image && user.image.url) {
                        modelUser.photo = user.image.url;
                    }
                    Model.saveData(modelUser, function (err, data2) {
                        if (err) {
                            callback(err, data2);
                        } else {
                            data3 = data2.toObject();
                            delete data3.oauthLogin;
                            delete data3.password;
                            delete data3.forgotPassword;
                            delete data3.otp;
                            callback(err, data3);
                        }
                    });
                } else {
                    data = {}
                    data.accessToken = []
                    data.name = "noAccess"
                    callback(err, data)
                }

            } else {
                console.log("00000000000000000000000000", data)
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;
                data.googleAccessToken = user.googleAccessToken;
                data.googleRefreshToken = user.googleRefreshToken;
                data.name = user.displayName,
                    data.accessToken = [uid(16)],
                    data.oauthLogin = [{
                        socialId: user.id,
                        socialProvider: user.provider,
                    }]
                data.save(function () {});
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel brand retailer";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            console.log("datadatadatadatadata", data)
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {
        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () {});
        });
    },
    /**
     * This function get all the media from the id.
     * @param {userId} data
     * @param {callback} callback
     * @returns  that number, plus one.
     */
    getAllMedia: function (data, callback) {

    }
};
module.exports = _.assign(module.exports, exports, model);