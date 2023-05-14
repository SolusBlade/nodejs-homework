const express = require('express')

const router = express.Router()
const {
	listContacts,
	getContactById,
	addContact,
	updateContact,
	removeContact,
} = require("../../models/contacts");
const HttpError = require("../../helpers/HttpError");
const {
	contactAddSchema,
	contactUpdateSchema,
} = require("../../helpers/ContactValidate");

router.get("/", async (req, res, next) => {
	try {
		const data = await listContacts();

		if (!data) throw HttpError(404, `Not found`);

		res.json(data);
	} catch (error) {
		next(error);
	}
});

router.get("/:contactId", async (req, res, next) => {
	try {
		const Id = req.params.contactId;
		const contactById = await getContactById(Id);

		if (!contactById)
			throw HttpError(404, `Contact with this ID ${Id} not found`);

		res.json(contactById);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const { error } = contactAddSchema.validate(req.body);
		if (error) throw HttpError(400, error.message);

		const newContact = await addContact(req.body);

		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
});

router.delete("/:contactId", async (req, res, next) => {
	try {
		const Id = req.params.contactId;
		const deletedContact = await removeContact(Id);

		if (!deletedContact)
			throw HttpError(404, `Contact with this ID ${Id} not found`);

		// res.status(200).json(deletedContact);
		res.status(200).json({ message: "Contact deleted" });
	} catch (error) {
		next(error);
	}
});

router.put("/:contactId", async (req, res, next) => {
	try {
		if (Object.keys(req.body).length === 0)
			throw HttpError(400, "Missing fields");
		const { error } = contactUpdateSchema.validate(req.body);
		if (error) throw HttpError(404, error.message);

		const Id = req.params.contactId;
		const updatedContact = await updateContact(Id, req.body);

		if (!updatedContact)
			throw HttpError(404, `Contact with this ID ${Id} not found`);

		res.status(200).json(updatedContact);
	} catch (error) {
		next(error);
	}
});

module.exports = router
