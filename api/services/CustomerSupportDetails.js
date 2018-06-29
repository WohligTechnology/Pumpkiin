var schema = new Schema({
    tollFreeNumber: Number,
    email: String,
    serviceCenterAddresses: [{
        lineOne: String,
        lineTwo: String,
        lineThree: String,
        city: String,
        district: String,
        state: String,
        pincode: String
    }],
    facebookPage: String,
    twitterPage: String,
    officialProductWebsite: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CustomerSupportDetails', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);