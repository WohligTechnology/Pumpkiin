var schema = new Schema({
    name: {
        type: String
    },
    userName: {
        type: String
    },
    password: {
        type: String,
        default: ""
    },
    brandName: {
        type: String,
        default: ""
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Brand', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getAllBrand: function (data, callback) {
        Brand.find({}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                callback(null, found);
            }

        });
    }
};
module.exports = _.assign(module.exports, exports, model);