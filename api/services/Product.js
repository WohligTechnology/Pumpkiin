var schema = new Schema({
    brand: {
        type: String
    },
    productname: {
        type: String
    },
    serialno: {
        type: Number
    },
    retailer: {
        type: String
    },
    purchasedate: {
        type: Date
    },
    warrentyperiod: {
        type: String
    },
    WarrentyEndDate: {
        type: Date
    },
    purchasprice: {
        type: String
    },
    confirmationcode: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed']
    },
    localsupport: {
        type: String
    },
    warrentystatus: {
        type: String
    },
    tags: {
        type: String
    },
    type: {
        type: String,
        enum: ['Product', 'Accessory']
    },
    productaccessorymap: [{
        product: String,
    }]


});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Product', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);