passport.use(new FacebookStrategy({
        clientID: "622844211417911",
        clientSecret: "b8a6448d7a689462545c71150a347f15",
        callbackURL: "https://pumpkiin.wohlig.co.in/api/user/loginFacebook"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
        done(profile);
    }
));