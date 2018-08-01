passport.use(new FacebookStrategy({
        clientID: "622844211417911",
        clientSecret: "77dc40c5df0e0df179a831c2eb09aa0d",
        callbackURL: "http://wohlig.io/api/user/loginFacebook"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
        done(profile);
    }
));