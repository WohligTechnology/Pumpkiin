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
        console.log("data for email", data);
        // var emailData = {};
        // emailData.from = "sahil@pumpkiin.com";
        // emailData.name = data.name;
        // emailData.email = "manish.patil@wohlig.com";
        // emailData.greeting = "";
        // emailData.productName = "a";
        // emailData.ticketID = "1";
        // emailData.filename = "userEnquiry.ejs";
        // emailData.subject = "User Enquiry";
        //console.log("emailData", emailData);
        // Config.email(emailData, function (err, emailRespo) {
        //     // console.log("err", err);
        //     // console.log("emailRespo", emailRespo);
        //     callback(null, callback);
        // });
        Config.sendEmail({
                //from
                email: 'sahil@pumpkiin.com',
                name: "Sahil"
            },
            //to                    
            //emailData,
            [{
                email: "manish.patil@wohlig.com"
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