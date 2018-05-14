var schema = new Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    productname: {
        type: String
    },
    serialno: {
        type: Number
    },
    retailer: {
        type: Schema.Types.ObjectId,
        ref: 'Retailer'
    },
    purchasedate: {
        type: Date
    },
    warrantyperiod: {
        type: String
    },
    warrantyenddate: {
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
        enum: ['Pending', 'Confirmed']
    },
    localsupport: [{
        name: String,
        contact: Number,
        email: String
    }],
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

schema.plugin(deepPopulate, {
    populate: {
        'brand': {
            select: ''
        },
        'retailer': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Product', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "brand retailer ", "brand retailer "));
var model = {};
module.exports = _.assign(module.exports, exports, model);