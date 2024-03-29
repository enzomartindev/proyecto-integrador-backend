const sendMail = require("./../mailer");

const {
    MESSAGE_500,
} = require("./../constants/messages");

const sendEmail = async (req, res) => {

    try {
        const { to, subject, content } = req.query;

        if (!to || !subject || !content) {
            return res.status(4000).send({ error: "Faltan datos relevantes" });
        }

        const result = await sendMail(to, subject, content);

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: MESSAGE_500 });
    }

};

module.exports = { sendEmail };