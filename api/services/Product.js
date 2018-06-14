var schema = new Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    productName: String,
    serialNo: Number,
    modelNo: String,
    retailer: {
        type: Schema.Types.ObjectId,
        ref: 'Retailer'
    },
    purchaseDate: Date,
    warrantyPeriod: String,
    warrantyExpDate: Date,
    bill: Schema.Types.Mixed,
    purchasePrice: Number,
    confirmationCode: String,
    status: {
        type: String,
        enum: ['Pending', 'Confirmed']
    },
    productImages: [String],
    purchaseProof: [String],
    localSupport: [{
        name: String,
        contact: Date,
        email: String
    }],
    warrentyStatus: String,
    document: [{
        name: String,
        doc: String
    }],
    invoiceImage: String,
    warrantyCardImage: String,
    tags: String,
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
        Product.saveData(data, function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);