var schema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  issueReported: {
    type: Date,
    default: Date.now()
  },
  isRead: {
    type: Boolean,
    default: false
  },
  ticketNumber: String,
  status: {
    type: String,
    enum: ["Closed", "Active"],
    default: "Active"
  },
  subStatus: String,
  elapsedTime: Date,
  customerCommunicationHistory: String,
  customerChat: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    comment: String,
    file: String,
    date: {
      type: Date,
      default: Date.now()
    },
    pickUpDetails: Schema.Types.Mixed
  }],
  closureDate: Date,
  closureCommentPumpkin: String,
  closureCommentCustomer: String,
  rating: String,
  cost: Number,
  repairRecepit: [String],
  substat: [{
    statusDate: Date,
    status: String
  }],
  feedbackStatus: {
    tyoe: Boolean,
    default: false
  }
});

schema.plugin(deepPopulate, {
  populate: {
    product: {
      select: ""
    },
    user: {
      select: ""
    },
    "product.user": {
      select: ""
    }
  }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model("Ticket", schema);

var exports = _.cloneDeep(
  require("sails-wohlig-service")(
    schema,
    "product product.user user",
    "product product.user user"
  )
);
var model = {
  totalNumberOfTickets: function (data, callback) {
    this.find({
        user: data.user
      })
      .count()
      .exec(callback);
  },

  totalOpenTickets: function (data, callback) {
    //take the page in data
    var page = 1;
    // var Model = this;
    // var Const = this(data);
    var maxRow = 5;
    if (data.page) {
      page = data.page;
    }
    var field = data.field;

    var options = {
      field: data.field,
      filters: {
        keyword: {
          fields: [""],
          term: data.keyword
        }
      },
      sort: {
        asc: ""
      },
      start: (page - 1) * maxRow,
      count: maxRow
    };

    this.find({
        user: data.user,
        status: "Active"
      })
      .deepPopulate("product product.user")
      .order(options)
      .keyword(options)
      .page(options, callback);
  },

  totalClosedTickets1: function (data, callback) {
    var page = 1;
    // var Model = this;
    // var Const = this(data);
    var maxRow = 5;
    if (data.page) {
      page = data.page;
    }
    var field = data.field;

    var options = {
      field: data.field,
      filters: {
        keyword: {
          fields: [""],
          term: data.keyword
        }
      },
      sort: {
        asc: ""
      },
      start: (page - 1) * maxRow,
      count: maxRow
    };
    this.find({
        user: data.user,
        status: "Closed"
      })
      .deepPopulate("product product.user")
      .order(options)
      .keyword(options)
      .page(options, callback);
  },

  totalClosedTickets: function (data, callback) {
    this.find({
        user: data.user,
        status: "Closed"
      })
      .deepPopulate("product product.user")
      .exec(callback);
  },

  totalNumberOfOpenTickets: function (data, callback) {
    this.find({
        user: data.user,
        status: "Active"
      })
      .count()
      .exec(callback);
  },

  totalNumberOfClosedTickets: function (data, callback) {
    this.find({
        user: data.user,
        status: "Closed"
      })
      .count()
      .exec(callback);
  },

  findActiveTicketOfUser: function (data, callback) {
    this.findOne({
        product: data.product,
        user: data.user,
        status: "Active"
      })
      .deepPopulate("product product.user")
      .exec(callback);
  },

  findClosedTicketOfUser: function (data, callback) {
    this.findOne({
        _id: data.ticketId,
        user: data.user
      })
      .deepPopulate("product product.user")
      .exec(callback);
  },

  createNewTicket: function (data, callback) {
    async.waterfall(
      [
        function (callback) {
          Product.findOneAndUpdate({
            _id: data.product
          }, {
            ticketGenerated: true
          }, {
            new: true
          }).exec(callback);
        },
        function (ticketData, callback) {
          console.log("----------Manish Rocks>>>>>>>", ticketData);
          Ticket.TicketIdGenerate(function (err, data2) {
            data.ticketNumber = data2;
            console.log("data", data);
            Ticket.saveData(data, function (err, data) {
              if (err) {
                callback(err, null)
              } else {
                console.log("ticketChat" + data._id);
                sails.sockets.blast("ticketChat" + data._id, {
                  ticketChatData: data
                });
                callback(null, data);
              }

            });
          });
        },
        function (finalData, callback) {
          var emailData = {};
          var time = new Date().getHours();
          var greeting;
          if (time < 10) {
            greeting = "Good morning";
          } else if (time < 17) {
            greeting = "Good Afternoon";
          } else {
            greeting = "Good evening";
          }
          emailData.from = "sahil@pumpkiin.com";
          emailData.name = data.name;
          emailData.email = data.email;
          emailData.greeting = greeting;
          emailData.productName = data.productName;
          emailData.ticketID = finalData.ticketNumber;
          emailData.filename = "ticketcreation";
          emailData.subject = "Ticket Creation";
          // console.log("emailData", emailData);
          Config.email(emailData, function (err, emailRespo) {
            // console.log("err", err);
            // console.log("emailRespo", emailRespo);
            callback(null, emailRespo);
          });
        }
      ],
      callback
    );
  },

  changeTicketStatus: function (data, callback) {
    async.waterfall(
      [
        function (callback) {
          Ticket.saveData(data, callback);
        },
        function (ticketData, callback) {
          Ticket.findOne({
              _id: data._id
            })
            .deepPopulate("user product")
            .exec(callback);
        },
        function (finalData, callback) {
          var emailData = {};
          var time = new Date().getHours();
          var greeting;
          if (finalData.status == "Active") {
            if (time < 10) {
              greeting = "Good morning";
            } else if (time < 17) {
              greeting = "Good Afternoon";
            } else {
              greeting = "Good evening";
            }
            emailData.from = "sahil@pumpkiin.com";
            emailData.name = finalData.user.name;
            emailData.email = finalData.user.email;
            emailData.greeting = greeting;
            emailData.productName = finalData.product.productName;
            emailData.ticketID = finalData.ticketNumber;
            emailData.statusMsg = finalData.subStatus;
            emailData.filename = "Ticketstatus";
            emailData.subject = "Ticket Status Changed";
            // console.log("emailData", emailData);
            Config.email(emailData, function (err, emailRespo) {
              // console.log("err", err);
              // console.log("emailRespo", emailRespo);
              callback(null, emailRespo);
            });
          } else {
            if (time < 10) {
              greeting = "Good morning";
            } else if (time < 17) {
              greeting = "Good Afternoon";
            } else {
              greeting = "Good evening";
            }
            emailData.from = "sahil@pumpkiin.com";
            emailData.name = finalData.user.name;
            emailData.email = finalData.user.email;
            emailData.greeting = greeting;
            emailData.ticketID = finalData.ticketNumber;
            emailData.filename = "ticket-closure";
            emailData.subject = "Ticket closure email";
            // console.log("emailData", emailData);
            Config.email(emailData, function (err, emailRespo) {
              // console.log("err", err);
              // console.log("emailRespo", emailRespo);
              callback(null, emailRespo);
            });
          }
        }
      ],
      callback
    );
  },

  TicketIdGenerate: function (callback) {
    Ticket.find({})
      .sort({
        createdAt: -1
      })
      .limit(1)
      .exec(function (err, found) {
        if (err) {
          callback(err, null);
        } else {
          if (_.isEmpty(found)) {
            var year = new Date()
              .getFullYear()
              .toString()
              .substr(-2);
            var month = new Date().getMonth() + 1;
            var m = month.toString().length;
            if (m == 1) {
              month = "0" + month;
              var ticketNumber = "T" + year + month + "-" + "1";
            } else if (m == 2) {
              var ticketNumber = "T" + year + month + "-" + "1";
            }
            // console.log("ticketNumber", ticketNumber)

            callback(null, ticketNumber);
          } else {
            console.log("ticketNumber", found, found[0]);
            var ticketNum = found[0].ticketNumber.split("-");
            var num = parseInt(ticketNum[1]);
            var nextNum = num + 1;
            var year = new Date()
              .getFullYear()
              .toString()
              .substr(-2);
            var month = new Date().getMonth() + 1;
            var m = month.toString().length;
            if (m == 1) {
              month = "0" + month;
              var ticketNumber = "T" + year + month + "-" + nextNum;
            } else if (m == 2) {
              var ticketNumber = "T" + year + month + "-" + nextNum;
            }
            console.log("ticketNumber", ticketNumber)
            callback(null, ticketNumber);
          }
        }
      });
  },

  addToChat: function (data, callback) {
    async.waterfall(
      [
        function (callback) {
          Ticket.saveData(data, callback);
        },
        function (newUserData, callback) {
          Ticket.findOne({
            _id: data._id
          }).exec(function (err, data) {
            sails.sockets.blast("ticketChat" + data._id, {
              ticketChatData: data
            });
            callback(err, data);
          });
        }
      ],
      callback
    );
  },

  getAllStatesOfIndia: function (data, callback) {
    var options = {
      method: "GET",
      url: "http://battuta.medunes.net/api/region/in/all/?key=dc633d8b43c95bc4ef251dc2dbd8ada0"
    };
    request(options, function (err, response, body) {
      // console.log("body", body);
      // console.log("------------", typeof (body));
      var myJSON = JSON.parse(body);
      callback(null, myJSON);
    });
  },

  getCity: function (data, callback) {
    var options = {
      method: "GET",
      url: "http://battuta.medunes.net/api/city/in/search/?region=" +
        data.region +
        "&key=dc633d8b43c95bc4ef251dc2dbd8ada0"
    };
    request(options, function (err, response, body) {
      // console.log("body", body);
      var myJSON = JSON.parse(body);
      callback(null, myJSON);
    });
  },

  //getAllTickets oF user For edit Product Page

  getAllTickets: function (data, callback) {
    this.find({
      user: data.user
    }).exec(callback);
  },

  searchClosedTickets: function (data, callback) {
    Ticket.aggregate(
      [{
          $match: {
            user: ObjectId(data.user)
          }
        },
        // Stage 1
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "product"
          }
        },

        // Stage 2
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: false // optional
          }
        },

        // Stage 3
        {
          $match: {
            "product.productName": {
              $regex: data.keyword,
              $options: "i"
            },
            status: "Closed"
          }
        }
      ],
      function (err, found) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, found);
        }
      }
    );
  },

  searchOpenTickets: function (data, callback) {
    Ticket.aggregate(
      [{
          $match: {
            user: ObjectId(data.user)
          }
        },
        // Stage 1
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "product"
          }
        },

        // Stage 2
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: false // optional
          }
        },

        // Stage 3
        {
          $match: {
            "product.productName": {
              $regex: data.keyword,
              $options: "i"
            },
            status: "Active"
          }
        }
      ],
      function (err, found) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, found);
        }
      }
    );
  },

  searchTickets: function (data, callback) {
    console.log("searchTickets", data);
    //take the page in data
    var page = 1;
    // var Model = this;
    // var Const = this(data);
    var maxRow = 10;
    if (data.page) {
      page = data.page;
    }
    var field = data.field;

    var options = {
      field: data.field,
      filters: {
        keyword: {
          fields: ["ticketNumber", "status"],
          term: data.keyword
        }
      },
      sort: {
        asc: ""
      },
      start: (page - 1) * maxRow,
      count: maxRow
    };

    this.find({})
      .deepPopulate("product product.user user")
      .order(options)
      .keyword(options)
      .page(options, callback);
  },
  changeIsReadStatus: function (data, callback) {
    console.log("-----------", data);
    Ticket.findOneAndUpdate({
      _id: data.id
    }, {
      isRead: data.isRead
    }, {
      new: true
    }).exec(function (err, data) {
      if (err || _.isEmpty(data)) {
        callback(err, "Error");
      } else {
        callback(null, data);
      }
    });
  },
  getallOpenTicktes: function (data, callback) {
    this.find({
        user: data.user,
        status: "Active"
      }).deepPopulate("product product.user")
      .exec(callback);
  },
  getallClosedTicktes: function (data, callback) {
    this.find({
        user: data.user,
        status: "Active"
      }).deepPopulate("product product.user")
      .exec(callback);
  },
  searchOnListPage: function (data, callback) {
    if (data.page == undefined) {
      data.page = 1;
    }
    var pagestartfrom = (data.page - 1) * 10;
    var aggArr = [{
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: {
          path: "$product"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user"
        }
      },
      {
        $project: {
          // specifications
          _id: "$_id",
          status: "$status",
          ticketNumber: "$ticketNumber",
          product: "$product.productName",
          issueReported: "$issueReported",
          userName: "$user.name",
          userEmail: "$user.email",
          userMobile: "$user.mobile",
          createdAt: "$createdAt"
        }
      },
      {
        $match: {
          $or: [{
              ticketNumber: {
                $regex: data.keyword,
                $options: "i"
              }
            },
            {
              product: {
                $regex: data.keyword,
                $options: "i"
              }
            },
            {
              status: {
                $regex: data.keyword,
                $options: "i"
              }
            },
            {
              userEmail: {
                $regex: data.keyword,
                $options: "i"
              }
            },
            {
              userName: {
                $regex: data.keyword,
                $options: "i"
              }
            }
          ]
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: parseInt(pagestartfrom)
      },
      {
        $limit: 10
      }
    ];
    async.parallel(
      [
        //Start
        function (callback) {
          var Search = Ticket.aggregate(aggArr, function (err, data1) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, data1);
            }
          });
        },

        function (callback) {
          var Search = Ticket.aggregate(
            [{
                $lookup: {
                  from: "products",
                  localField: "product",
                  foreignField: "_id",
                  as: "product"
                }
              },
              {
                $unwind: {
                  path: "$product"
                }
              },
              {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "user"
                }
              },
              {
                $unwind: {
                  path: "$user"
                }
              },
              {
                $project: {
                  // specifications
                  _id: "$_id",
                  status: "$status",
                  ticketNumber: "$ticketNumber",
                  product: "$product.productName",
                  issueReported: "$issueReported",
                  userName: "$user.name",
                  userEmail: "$user.email",
                  userMobile: "$user.mobile",
                  createdAt: "$createdAt"
                }
              },
              {
                $match: {
                  $or: [{
                      ticketNumber: {
                        $regex: data.keyword,
                        $options: "i"
                      }
                    },
                    {
                      product: {
                        $regex: data.keyword,
                        $options: "i"
                      }
                    },
                    {
                      status: {
                        $regex: data.keyword,
                        $options: "i"
                      }
                    },
                    {
                      userEmail: {
                        $regex: data.keyword,
                        $options: "i"
                      }
                    },
                    {
                      userName: {
                        $regex: data.keyword,
                        $options: "i"
                      }
                    }
                  ]
                }
              },
              {
                $group: {
                  _id: null,
                  count: {
                    $sum: 1
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  count: 1
                }
              }
            ],
            function (err, data2) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, data2);
              }
            }
          );
        }

        //end
      ],
      function (err, data4) {
        var data5 = {};
        if (err) {
          callback(err, null);
        } else if (_.isEmpty(data4[1])) {
          data5 = {
            results: data4[0],
            options: {
              count: 0
            }
          };
          callback(null, data5);
        } else {
          data5 = {
            results: data4[0],
            options: {
              count: 10
            }
          };
          data5.total = data4[1][0].count;
          callback(null, data5);
        }
      }
    );
  }
};
module.exports = _.assign(module.exports, exports, model);