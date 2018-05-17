var schema = new Schema({
    name: {
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

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('WebUser', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
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