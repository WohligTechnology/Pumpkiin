var schema = new Schema({
    name: {
        type: String
    },
    nickName: String,
    balance: {
        type: String
    },
    socialAccount: [{
        account: String
    }],
    relations: [{
        relationType: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
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
    location: [{
        location: String
    }],
    loginSession: [{
        timestamp: Date,
        ip: String,
        accessToken: String
    }],
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
        require: true
    },
    otp: {
        type: String,
        default: ""
    },
    otpTime: Date,
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
        enum: ['Retailer', 'Admin', 'Brand', 'User'],
        default: 'User'
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
        },
        'relations.user': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user retailer brand relations.user", "user retailer brand relations.user"));
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

    },

    //old api written

    addUserRelationMember: function (data, callback) {
        var newuserData;
        async.waterfall([
            function (callback) {
                // console.log("data", data);
                var dataToSend = {};
                dataToSend.name = data.name;
                dataToSend.nickName = data.nickName;
                dataToSend.email = data.email;
                dataToSend.mobile = data.contact;
                User.saveData(dataToSend, callback);
            },
            function (newUserData, callback) {
                // console.log("newUserData", newUserData);
                newuserData = newUserData;
                if (!_.isEmpty(newUserData)) {
                    User.findOne({
                        _id: data._id
                    }).exec(callback);
                } else {
                    callback(err, "noData");
                }
            },
            function (oldUserData, callback) {
                // console.log("oldUserData", oldUserData);
                var sendData = {};
                sendData = oldUserData;
                var arrData = [];
                arrData = oldUserData.relations;
                // console.log("arrData---------", arrData);
                var sendData1 = {};
                sendData1.relationType = data.relation;
                sendData1.user = newuserData._id;
                arrData.push(sendData1)
                sendData.relations = arrData;
                // console.log("sendData---------", sendData);
                User.saveData(sendData, callback);
            }
        ], callback);
    },

    addRelation: function (data, callback) {
        var sendData = {};
        sendData._id = data._id;
        var arrData = [];
        var sendData1 = {};
        sendData1.relationType = data.relationType;
        sendData1.user = newUserData._id;
        arrData.push(sendData1)
        sendData.relations = arrData;
        User.saveData(sendData, callback);
    },

    removeUserRelationMember: function (userId, mobile, callback) {
        console.log("inside api", userId, mobile);
        async.waterfall([
            function (callback1) {
                User.findOne({
                    mobile: mobile
                }).exec(function (err, found) {
                    console.log("found********", found)
                    if (err) {
                        callback1(err, null);
                    } else if (_.isEmpty(found)) {
                        callback1("noDataound", null);
                    } else {
                        var dataforDelete = {}
                        dataforDelete._id = found._id;
                        User.deleteData(found, function (err, created) {
                            if (err) {
                                callback1(err, null);
                            } else if (_.isEmpty(created)) {
                                callback1(null, "noDataound");
                            } else {

                                callback1(null, found._id);
                            }
                        });
                    }

                })
            },
            function (id, callback2) {
                console.log("idddddddddddddd", id);
                User.findOneAndUpdate({
                    _id: mongoose.Types.ObjectId(userId)
                }, {
                    $pull: {
                        'member': {
                            memberId: id
                        }
                    }

                }, {
                    new: true
                }).exec(function (err, found) {
                    if (err) {
                        callback2(err, null);
                    } else if (_.isEmpty(found)) {
                        callback2("noDataound", null);
                    } else {
                        callback2(null, found);
                    }

                });
            }
        ], function (err, data) {

            if (err || _.isEmpty(data)) {
                callback(err, [])
            } else {
                callback(null, data)
            }
        });
    },

    getAllMembersForSearch: function (data, callback) {
        User.find({}, {
            name: 1,
            _id: 1,
            mobile: 1
        }).lean().exec(function (err, data) {
            callback(null, data);
        });
    },

    // removeUserRelationMember: function (userId, mobile, callback) {
    //     console.log("inside USer RElation Memeber", userId, mobile)
    // User.findOneAndUpdate({
    //     _id: mongoose.Types.ObjectId(userId)
    // }, {
    //     $pull: {
    //         'member': {
    //             memberId: memberId
    //         }
    //     }

    // }, {
    //     new: true
    // }).deepPopulate('member.memberId').exec(function (err, found) {
    //     if (err) {
    //         callback(err, null);
    //     } else if (_.isEmpty(found)) {
    //         callback("noDataound", null);
    //     } else {
    //         var user = {}
    //         user._id = memberId;
    //         User.deleteData(user, function (err, created) {
    //             console.log("afte api response", created);
    //             if (err) {
    //                 callback(err, null);
    //             } else if (_.isEmpty(found)) {
    //                 callback(null, "noDataound");
    //             } else {
    //                 callback(null, found);
    //             }
    //         });
    //     }

    // });
    // },

    sendOtp: function (data, callback) {
        var otpNumber = (Math.random() + "").substring(2, 6);
        User.findOneAndUpdate({
            mobile: data.mobile
        }, {
            otp: otpNumber,
            accessToken: uid(16),
            otpTime: new Date()
        }, {
            new: true,
            upsert: true
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataFound", null);
            } else {
                data3 = found.toObject();
                delete data3.accessToken;
                delete data3.password;
                delete data3.forgotPassword;
                // var smsData = {};
                // smsData.message = 'Your verification code is ' + data3.otp;
                // delete data3.otp;
                // smsData.senderId = 'PUMPKIIN';
                // smsData.mobile = data.mobile;
                // Config.sendSms(smsData, function (err, smsRespo) {
                //     if (err) {
                //         console.log("*************************************************sms gateway error in photographer***********************************************", err);
                //     } else if (smsRespo) {
                //         console.log(smsRespo, "*************************************************sms sent partyyy hupppieeee**********************************************");
                //     } else {
                //         console.log("invalid data");
                //     }
                // });
                callback(null, data3);
            }
        });

    },

    sendOtpTest: function (data) {
        var otpNumber = (Math.random() + "").substring(2, 6);
        var smsData = {};
        smsData.message = 'Your verification code is ' + otpNumber;
        smsData.senderId = 'OTPSMS';
        smsData.mobile = 9004489552;
        Config.sendSms(smsData, function (err, smsRespo) {
            if (err) {
                console.log("*************************************************sms gateway error in photographer***********************************************", err);
            } else if (smsRespo) {
                console.log(smsRespo, "*************************************************sms sent partyyy hupppieeee**********************************************");
            } else {
                console.log("invalid data");
            }
        });
    },

    verifyUserWithOtp: function (data, callback) {
        User.findOne({
            mobile: data.mobile,
            otp: data.otp
        }).exec(function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                // console.log("found.otpTime", found.otpTime);
                // var ottym = found.otpTime;
                // var currentTime = new Date();
                // var diff = moment(currentTime).diff(ottym, 'minutes');
                // console.log("pre", moment(ottym).format('LTS'));
                // console.log("curr", moment(currentTime).format('LTS'));
                // console.log("diff", moment(currentTime).diff(ottym, 'minutes'));
                // if (diff <= 10) {
                //     data3 = found.toObject();
                //     delete data3.accessToken;
                //     delete data3.password;
                //     delete data3.forgotPassword;
                //     delete data3.otp;
                //     callback(null, data3);
                // } else {
                //     callback(null, "resendOtp");
                // }
                found.email = data.email;
                found.name = data.name;
                User.saveData(found, function () {});
                data3 = found.toObject();
                delete data3.accessToken;
                delete data3.password;
                delete data3.forgotPassword;
                delete data3.otp;
                data3.email = data.email;
                data3.name = data.name;
                callback(null, data3);

            }

        });

    }

};
module.exports = _.assign(module.exports, exports, model);