var schema = new Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    productname: {
        type: String
    },
    serialNo: {
        type: Number
    },
    modelNo: {
        type: String
    },
    retailer: {
        type: Schema.Types.ObjectId,
        ref: 'Retailer'
    },
    productImages: [{
        image: String,
    }],
    purchaseproof: [{
        proofImage: String,
    }],
    purchasedate: {
        type: Date
    },

    purchaseprice: {
        type: String
    },
    confirmationcode: {
        type: String
    },
    invoiceImage: {
        type: String
    },
    warrantyCardImage: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed']
    },
    localsupport: [{
        name: String,
        contact: Date,
        email: String
    }],
    warrantyPeriod: String,
    warrantyExpDate: Date,
    warrantyProof: String,

    insurancePeriod: String,
    insuranceExpDate: Date,
    insuranceProof: String,
    warrentystatus: {
        type: String
    },
    tags: {
        type: String
    },

    doneBy: {
        type: String,
        enum: ['Admin', 'User']
    },
    pendingRequest: {
        type: Boolean,
        default: false
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
var model = {
    saveProduct: function (data, callback) {
        Product.saveData(data, function (err, created) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(created)) {
                callback(null, "noDatafound");
            } else {
                Product.findOne({
                    _id: data._id
                }, function (err, created) {
                    if (err) {
                        callback(err, null);
                    } else if (_.isEmpty(created)) {
                        callback(null, "noDataound");
                    } else {

                        callback(null, created);
                    }
                });
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);