/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": {
    controller: "WebController",
    action: "index",
    skipAssets: true,
    skipRegex: /api|backend/i
  },
  "GET /gitPull/:data": {
    controller: "WebController",
    action: "gitPull",
    skipAssets: true,
    skipRegex: /api|backend/i
  },
  "GET /profile": {
    controller: "WebController",
    action: "index"
  },
  "GET /login/:id": {
    controller: "WebController",
    action: "index"
  },
  "GET /landing": {
    controller: "WebController",
    action: "index"
  },
  "GET /productdetailregistered/:id": {
    controller: "WebController",
    action: "index"
  },
  "GET /productdetailunregistered": {
    controller: "WebController",
    action: "index"
  },
  "GET /productregistration": {
    controller: "WebController",
    action: "index"
  },
  "GET /productListing": {
    controller: "WebController",
    action: "index"
  },
  "GET /ticketcreation/:id": {
    controller: "WebController",
    action: "index"
  },
  "GET /closedTicketcreation/:id": {
    controller: "WebController",
    action: "index"
  },
  "GET /openticket": {
    controller: "WebController",
    action: "index"
  },
  "GET /ticketopen-notification": {
    controller: "WebController",
    action: "index"
  },
  "GET /ticketclose-notification": {
    controller: "WebController",
    action: "index"
  },
  "GET /notification": {
    controller: "WebController",
    action: "index"
  },
  "GET /terms-conditions": {
    controller: "WebController",
    action: "index"
  },
  "GET /privacy-policy": {
    controller: "WebController",
    action: "index"
  },
  "GET /links": {
    controller: "WebController",
    action: "index"
  },
  "/api/download/:filename": {
    controller: "WebController",
    action: "download"
  }

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/
};