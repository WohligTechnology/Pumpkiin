passport.use(new FacebookStrategy({
        clientID: "622844211417911",
        clientSecret: "b8a6448d7a689462545c71150a347f15",
        callbackURL: "https://pumpkiin.wohlig.co.in/api/user/loginFacebook",
        profileFields: ['email', 'name', 'id']
    },
    function (accessToken, refreshToken, profile, cb) {
        profile.googleAccessToken = accessToken;
        profile.googleRefreshToken = refreshToken;
        return cb(profile);
    }
));