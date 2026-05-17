/*
 * Title: Routes
 * Description: Application Routes
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/15/2020
 *
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
// step-6 : and then ekhane tokenHandler ta niye ashte hobe
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  // step-1 : ajke amra token niye kaj korbo, and eta start hoy ekhan theke, step-2 te amra tokenHandler function create korbo
  token: tokenHandler,
};

module.exports = routes;
