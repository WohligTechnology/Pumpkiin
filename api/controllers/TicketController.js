module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    totalNumberOfTickets: function (req, res) {
        if (req.body) {
            Ticket.totalNumberOfTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    totalNumberOfOpenTickets: function (req, res) {
        if (req.body) {
            Ticket.totalNumberOfOpenTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    totalNumberOfClosedTickets: function (req, res) {
        if (req.body) {
            Ticket.totalNumberOfClosedTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    findActiveTicketOfUser: function (req, res) {
        if (req.body) {
            Ticket.findActiveTicketOfUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },


    findClosedTicketOfUser: function (req, res) {
        if (req.body) {
            Ticket.findClosedTicketOfUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    createNewTicket: function (req, res) {
        if (req.body) {
            Ticket.createNewTicket(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    TicketIdGenerate: function (req, res) {
        if (req.body) {
            Ticket.TicketIdGenerate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    totalOpenTickets: function (req, res) {
        if (req.body) {
            Ticket.totalOpenTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    totalClosedTickets: function (req, res) {
        if (req.body) {
            Ticket.totalClosedTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    addToChat: function (req, res) {
        if (req.body) {
            Ticket.addToChat(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getAllStatesOfIndia: function (req, res) {
        if (req.body) {
            Ticket.getAllStatesOfIndia(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getCity: function (req, res) {
        if (req.body) {
            Ticket.getCity(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getAllTickets: function (req, res) {
        if (req.body) {
            Ticket.getAllTickets(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    changeTicketStatus: function (req, res) {
        if (req.body) {
            Ticket.changeTicketStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);