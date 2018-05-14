module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAllBrand: function (req, res) {
        if (req.body) {
            Brand.getAllBrand(req.body, res.callback)
        }
    }
};
module.exports = _.assign(module.exports, controller);