var schema = new Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    productName: {
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
    purchaseDate: {
        type: Date
    },
    warrantyPeriod: String,
    warrantyExpDate: Date,
    bill: Schema.Types.Mixed,
    purchasePrice: {
        type: Number
    },
    confirmationCode: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed']
    },

    productImages: [{
        image: String,
    }],
    purchaseProof: [{
        proofImage: String,
    }],
    localSupport: [{
        name: String,
        contact: Date,
        email: String
    }],
    warrentyStatus: {
        type: String
    },
    document: [{
        name: String,
        doc: String
    }],
    invoiceImage: {
        type: String
    },
    warrantyCardImage: {
        type: String
    },
    tags: {
        type: String
    },
    type: {
        type: String,
        enum: ['Product', 'Accessory']
    },
    productAccessoryMap: [{
        product: String,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    relatedUser: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],


    //extra fields
    warrantyProof: String,
    insurancePeriod: String,
    insuranceExpDate: Date,
    insuranceProof: String,
    doneBy: {
        type: String,
        enum: ['Admin', 'User']
    },
    pendingRequest: {
        type: Boolean,
        default: false
    },
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