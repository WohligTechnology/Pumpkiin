module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAllRetailer: function (req, res) {
        if (req.body) {
            Retailer.getAllRetailer(req.body, res.callback)
        }
    }
};
module.exports = _.assign(module.exports, controller);