global["GoogleKey"] = "AIzaSyDMgwXi6D38isibUfShc9C2mJyaHZZ2LpE";
global["GoogleclientId"] =
  "706391166551-95oie68n5o3q5dlcu48qhrs1en3t5gat.apps.googleusercontent.com";
global["GoogleclientSecret"] =
  "706391166551-95oie68n5o3q5dlcu48qhrs1en3t5gat.apps.googleusercontent.com";

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
