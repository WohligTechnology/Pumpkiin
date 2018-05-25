module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    addUserRelationMember: function (req, res) {
        if (req.body) {
            WebUser.addUserRelationMember(req.body.userId, req.body.memberId, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    removeUserRelationMember: function (req, res) {
        if (req.body) {
            WebUser.removeUserRelationMember(req.body.userId, req.body.mobile, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    verifyUserWithOtpWhileSignUP: function (req, res) {
        if (req.body) {
            WebUser.verifyUserWithOtpWhileSignUP(req.body.mobile, req.body.otp, req.body.name, req.body.email, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    verifyUserWithOtpWhileLogin: function (req, res) {
        if (req.body) {
            WebUser.verifyUserWithOtpWhileLogin(req.body.mobile, req.body.otp, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    verifyUser: function (req, res) {
        if (req.body) {
            WebUser.verifyUser(req.body.mobile, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    sendOtp: function (req, res) {
        if (req.body) {
            WebUser.sendOtp(req.body.mobile, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    }

};
module.exports = _.assign(module.exports, controller);