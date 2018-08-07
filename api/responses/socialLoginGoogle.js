module.exports = function (profile) {
    var req = this.req;
    var res = this.res;
    var sails = req._sails;
    // console.log("profileprofileprofile", profile)
    if (_.isEmpty(profile)) {
        res.callback("Error fetching profile in Social Login", profile);
        // res.serverError();
    } else {
        if (req.session.returnUrl) {
            User.existsSocialFrontendLogin(profile, function (err, data) {
                // console.log("*****************************************")
                // console.log("data22222222222222222222222222222222", data)
                if (data.name == "noAccess") {
                    data.accessToken[0] = "AccessNotAvailable";
                    res.redirect(req.session.returnUrl + "/" + data.accessToken[0]);
                    req.session.destroy(function () {});
                } else {
                    if (err || !data) {
                        res.callback(err, data);
                    } else {
                        if (!data.accessLevel) {
                            data.accessToken[0] = "AccessNotAvailable";
                        }
                        console.log(req.session.returnUrl);
                        res.redirect(req.session.returnUrl + "/" + data.accessToken[0]);
                        req.session.destroy(function () {});
                    }
                }
            });
        } else {
            User.existsSocialFrontendLogin(profile, res.callback);
        }
    }
};