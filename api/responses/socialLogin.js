module.exports = function (profile) {
    var req = this.req;
    var res = this.res;
    var sails = req._sails;
    console.log("profileprofileprofile", profile)
    if (_.isEmpty(profile)) {
        res.redirect(env.realHost + "/login/");
        // res.serverError();
    } else {
        User.existsSocial(profile, function (err, data) {
            console.log("*****************************************")
            console.log("data22222222222222222222222222222222", data)
            if (data.name == "noAccess") {
                data.accessToken[0] = "AccessNotAvailable";
                res.redirect("https://pumpkiinbackend.wohlig.in/#!/login" + "/" + data.accessToken[0]);
                req.session.destroy(function () {});
            } else {
                if (err || !data) {
                    res.callback(err, data);
                } else {
                    if (!data.accessLevel) {
                        data.accessToken[0] = "AccessNotAvailable";
                    }
                    console.log(req.session.returnUrl);
                    res.redirect("https://pumpkiinbackend.wohlig.in/#!/login" + "/" + data.accessToken[0]);
                    req.session.destroy(function () {});
                }
            }

        });
    }
};