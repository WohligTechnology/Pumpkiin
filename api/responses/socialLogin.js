module.exports = function (profile) {
    var req = this.req;
    var res = this.res;
    var sails = req._sails;
    console.log("profileprofileprofile", profile)
    if (_.isEmpty(profile)) {
        console.log("prof")
        res.redirect(env.realHost + "/loogin/");
        // res.serverError();
    } else {
        User.existsSocial(profile, function (err, data) {
            console.log("*****************************************")
            console.log("data22222222222222222222222222222222", data)
            if (data.name == "noAccess") {
                data.accessToken[0] = "AccessNotAvailable";
                res.redirect("http://pumpkiinbackend.wohlig.in/#!/login" + "/" + data.accessToken[0]);
                req.session.destroy(function () {});
            } else {
                if (err || !data) {
                    res.callback(err, data);
                } else {
                    if (!data.accessLevel) {
                        data.accessToken[0] = "AccessNotAvailable";
                    }
                    console.log(req.session.returnUrl);
                    console.log("asaasa")

                    res.redirect("http://pumpkiinbackend.wohlig.in/#!/login" + "/" + data.accessToken[0]);
                    req.session.destroy(function () {});
                }
            }

        });
    }
};