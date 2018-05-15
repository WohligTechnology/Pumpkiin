module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    verifyUserWithOtp: function (req, res) {
        if (req.body) {
            WebUser.verifyUserWithOtp(req.body.mobile, req.body.otp, req.body.name, req.body.email, res.callback);
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