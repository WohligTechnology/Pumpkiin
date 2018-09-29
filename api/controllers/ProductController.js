module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    saveProduct: function (req, res) {
        if (req.body) {
            Product.saveProduct(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getAllProducts: function (req, res) {
        if (req.body) {
            Product.getAllProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    removeRelation: function (req, res) {
        if (req.body) {
            Product.removeRelation(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    productRegistrationMail: function (req, res) {
        if (req.body) {
            Product.productRegistrationMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    saveFinalProduct: function (req, res) {
        if (req.body) {
            Product.saveFinalProduct(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getSearchProductAndBrand: function (req, res) {
        if (req.body) {
            Product.getSearchProductAndBrand(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },



    sortFunction: function (req, res) {
        if (req.body) {
            Product.sortFunction(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    sortProductsByBrands: function (req, res) {
        if (req.body) {
            Product.sortProductsByBrands(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    sortByProducts: function (req, res) {
        if (req.body) {
            Product.sortByProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    ticketNotGenerated: function (req, res) {
        if (req.body) {
            Product.ticketNotGenerated(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    searchProductWithInvoice: function (req, res) {
        if (req.body) {
            Product.searchProductWithInvoice(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    searchConfirmedProducts: function (req, res) {
        if (req.body) {
            Product.searchConfirmedProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    excelProductList: function (req, res) {
        console.log(req.params.id)
        Product.excelProductList(req.params.id, function (err, data) {
            Product.generateExcelforProduct(data, function (err, singleData) {
                Config.generateExcel("ProductExcel", singleData, res);
            });
        });
    },
};
module.exports = _.assign(module.exports, controller);