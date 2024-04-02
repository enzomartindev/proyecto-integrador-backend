const Router = require("express");
const { logPurchase } = require("../controllers/purchases.controller");
const routes = Router();

routes
    .post("/", (req, res) => {
        logPurchase(req, res);
    });

module.exports = routes;