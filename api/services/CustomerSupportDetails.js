var schema = new Schema({
    tollfreenumber: {
        type: Number,
    },
    email: {
        type: String
    },
    servicecenteraddresses: [{
        lineOne: String,
        lineTwo: String,
        lineThree: String,
        city: String,
        district: String,
        state: String,
        pincode: String
    }],
    facebookpage: {
        type: Number,
    },
    twitterpage: {
        type: Number,
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CustomerSupportDetails', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);