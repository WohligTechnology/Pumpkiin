var schema = new Schema({
    name: {
        type: String,
    },
    address: [{
        lineOne: String,
        lineTwo: String,
        lineThree: String,
        city: String,
        district: String,
        state: String,
        pincode: String
    }],
    contact: Number,
    communicationAddresss: [{
        lineOne: String,
        lineTwo: String,
        lineThree: String,
        city: String,
        district: String,
        state: String,
        pincode: String
    }],
    date: Date,
    time: Date
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ServiceCenter', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);