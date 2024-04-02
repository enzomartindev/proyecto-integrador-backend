const { getCollection, generateId } = require("../connectionDB.js");
const { HEADER_CONTENT_TYPE } = require("../constants/headers.js");
const { getFormattedDateTimeString } = require("./../helpers/datetime.helper");

const {
    MESSAGE_500,
    ERROR_SERVER,
} = require("./../constants/messages");

const createSchema = (values) => {
    const { id, total, fullname } = values;

    return {
        id: Number(id),
        fullname: fullname,
        total: Number(total),
        date: getFormattedDateTimeString(),
    };
};

const logPurchase = async (req, res) => {

    res.set(HEADER_CONTENT_TYPE);

    try {

        console.log("Registrando compra en bd");

        const collection = await getCollection("compras");
        const id = await generateId(collection);
        const purchase = createSchema({ id, ...req.body });

        console.log(purchase);
        await collection.insertOne(purchase);

        res.status(201).send({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }

};

module.exports = { logPurchase };