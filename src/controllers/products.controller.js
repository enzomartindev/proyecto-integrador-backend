const path = require("path");
const { getCollection, generateId } = require("../connectionDB.js");
const { HEADER_CONTENT_TYPE } = require("../constants/headers.js");

const {
    ERROR_ID_NOT_FOUND,
    ERROR_SERVER,
    ERROR_UPLOAD_NULL,
} = require("../constants/messages.js");
const { DIR_IMAGES_PATH } = require("../constants/paths.js");
const { deletefile } = require("../fileSystem.js");

const normalizeValue = (value) => {
    return value
        .toUpperCase()
        .trim()
        .replace("Á", "A")
        .replace("É", "E")
        .replace("Í", "I")
        .replace("Ó", "O")
        .replace("Ú", "U");
};

const createSchema = (values) => {
    const { id, name, description, imageFileName, stock, price, isPromotion } = values;

    return {
        id: Number(id),
        name: normalizeValue(name),
        description: description ?? null,
        imageFileName,
        stock: Number(stock),
        price: Number(price),
        isPromotion: Boolean(isPromotion),
    };
};

const deleteImage = (imageFileName) => {
    if (imageFileName && imageFileName.length > 0) {
        const filePath = path.join(DIR_IMAGES_PATH, imageFileName);

        if (imageFileName != "default.jpg") {
            deletefile(filePath);
        }
    }
};

const getAll = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const { search } = req.query;
        const filters = {};
        let products = [];

        if (search) {
            filters["$or"] = [{ id: Number(search) }, { name: { $regex: normalizeValue(search), $options: "i" } }];
        }

        const collection = await getCollection("products");
        const countDocuments = await collection.countDocuments();

        if (countDocuments > 0) {
            products = await collection.find(filters).sort({ name: 1 }).hint("idx_id").hint("idx_name").toArray();
        }

        res.status(200).send({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

const getOne = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const { id } = req.params;

        const collection = await getCollection("products");
        const product = await collection.findOne({ id: Number(id) });

        if (!product) return res.status(404).send({ success: false, message: ERROR_ID_NOT_FOUND });

        res.status(200).send({ success: false, data: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

const create = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const collection = await getCollection("products");
        const id = await generateId(collection);
        const product = createSchema({ id, ...req.body });
        await collection.insertOne(product);

        res.status(201).send({ success: true, data: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

const update = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const { id } = req.params;

        const collection = await getCollection("products");
        const product = await collection.findOne({ id: Number(id) });

        if (!product) return res.status(404).send({ success: false, message: ERROR_ID_NOT_FOUND });

        const values = createSchema({ id, ...req.body });
        await collection.updateOne({ id: Number(id) }, { $set: values });

        if (product.imageFileName != values.imageFileName) {
            deleteImage(product.imageFileName);
        }

        res.status(200).send({ success: true, data: values });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

const remove = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const { id } = req.params;

        const collection = await getCollection("products");
        const product = await collection.findOne({ id: Number(id) });

        if (!product) return res.status(404).send({ success: false, message: ERROR_ID_NOT_FOUND });

        await collection.deleteOne({ id: Number(id) });

        deleteImage(product.imageFileName);

        res.status(200).send({ success: true, data: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

const uploadImage = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const file = req.file;

        if (!file) return res.status(400).send({ success: false, message: ERROR_UPLOAD_NULL });

        res.status(201).send({ success: true, data: file });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

module.exports = { getAll, getOne, create, update, remove, uploadImage };