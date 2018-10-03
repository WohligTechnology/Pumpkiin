var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        excel: {
            name: "Name"
        }
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ContactUs', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    sendEmail: function (data, callback) {
        var email = {};
        email = data.email;
        Config.sendEmail({
                //from
                email: 'jagruti@wohlig.com',
                name: "Jagruti"
            },
            //to                    
            //emailData,
            [{
                email: "jagruti@wohlig.com"
            }],


            //subject
            "User Enquiry!.", "<html><body><h4>User has tried to contact you, Please find the details below:</h4> <p>" + "Name: " + data.name +
            "</p><p>Email: " + data.email + "</p><p>Phone: " + data.mobile + "</p><p>Subject: " + data.subject +
            "</p><p>Description: " + data.description + "</p> </body>Thankyou</html>", [],
            function (err, emailResp) {
                if (err) {
                    callback("canNotSendMail", null);
                } else {
                    callback(null, "mailSent");
                }
            });
    }
};
module.exports = _.assign(module.exports, exports, model);