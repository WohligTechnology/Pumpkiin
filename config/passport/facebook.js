passport.use(
  new FacebookStrategy({
      clientID: "162258734683832",
      clientSecret: "df28d801138155091db2be77b596176d",
      callbackURL: "https://pumpkiin.com/api/user/loginFacebook",
      profileFields: ["email", "name", "id", "picture"]
    },
    function (accessToken, refreshToken, profile, cb) {
      profile.googleAccessToken = accessToken;
      profile.googleRefreshToken = refreshToken;
      return cb(profile);
    }
  )
);