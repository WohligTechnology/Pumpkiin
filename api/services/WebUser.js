var schema = new Schema({
    name: {
        type: String,

    },
    nickName: {
        type: String,

    },
    relation: {
        type: String,

    },

    member: [{
        memberId: {
            type: Schema.Types.ObjectId,
            ref: 'WebUser',
            index: true
        }
    }],
    lastname: {
        type: String,

    },
    otp: {
        type: String,

    },
    mobile: {
        type: Number,
        unique: true
    },
    email: {
        type: String
    }
});
schema.plugin(deepPopulate, {
    populate: {
        'member.memberId': {
            select: ''
        },

    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('WebUser', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "member.memberId", "member.memberId"));
var model = {
    addUserRelationMember: function (userId, memberId, callback) {
        WebUser.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(userId)
        }, {
            $push: {
                'member': {
                    memberId: memberId
                }
            }

        }, {
            new: true
        }).deepPopulate('member.memberId').exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                callback(null, found);
            }

        });
    },

    removeUserRelationMember: function (userId, mobile, callback) {
        console.log("inside api", userId, mobile);
        async.waterfall([
            function (callback1) {
                WebUser.findOne({
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
                        WebUser.deleteData(found, function (err, created) {
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
                WebUser.findOneAndUpdate({
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
    // removeUserRelationMember: function (userId, mobile, callback) {
    //     console.log("inside USer RElation Memeber", userId, mobile)
    // WebUser.findOneAndUpdate({
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
    //         WebUser.deleteData(user, function (err, created) {
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
    verifyUser: function (mobile, callback) {
        WebUser.findOne({
            mobile: mobile
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataFound", null);
            } else {
                callback(null, found);
            }

        });

    },
    sendOtp: function (mobile, callback) {
        var otpNumber = (Math.random() + "").substring(2, 6);
        WebUser.findOneAndUpdate({
            mobile: mobile
        }, {
            otp: otpNumber
        }, {
            new: true
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataFound", null);
            } else {
                callback(null, found);
            }

        });

    },

    verifyUserWithOtpWhileSignUP: function (mobile, otp, name, email, callback) {

        WebUser.findOneAndUpdate({
            mobile: mobile,
            otp: otp
        }, {
            name: name,
            email: email
        }, {
            new: true
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataFound", null);
            } else {
                callback(null, found);
            }

        });

    },
    verifyUserWithOtpWhileLogin: function (mobile, otp, callback) {

        WebUser.find({
            mobile: mobile,
            otp: otp
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataFound", null);
            } else {
                callback(null, found);
            }

        });

    }



};
module.exports = _.assign(module.exports, exports, model);