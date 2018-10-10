global["GoogleKey"] = "AIzaSyDMgwXi6D38isibUfShc9C2mJyaHZZ2LpE";
global["GoogleclientId"] =
  "706391166551-ns7p3gpu3p07de34oeicvl0t98supa56.apps.googleusercontent.com";
global["GoogleclientSecret"] = "jmSqZWu9xGpwRKdU7aTigwtl";

passport.use(
  new GoogleStrategy(
    {
      clientId: GoogleclientId,
      clientSecret: GoogleclientSecret,
      callbackURL: global["env"].realHost + "/api/user/loginGoogle",
      accessType: "offline"
    },
    function(accessToken, refreshToken, profile, cb) {
      profile.googleAccessToken = accessToken;
      profile.googleRefreshToken = refreshToken;
      return cb(profile);
    }
  )
);
