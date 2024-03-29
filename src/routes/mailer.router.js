const Router = require("express");
const { sendEmail } = require("../controllers/mailer.controller");
const routes = Router();

routes
    .get("/", (req, res) => {
        sendEmail(req, res);
    });

module.exports = routes;