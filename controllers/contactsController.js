const contactsService = require("../models/contacts");

const HttpError = require("../helpers/HttpError");
const {
	contactAddSchema,
	contactUpdateSchema,
} = require("../helpers/ContactValidate");

const getContacts = async (_, res, next) => {
	try {
		const data = await contactsService.listContacts();

		if (!data) throw HttpError(404, `Not found`);

		res.json(data);
	} catch (error) {
		next(error);
	}
};

const getContactById = async (req, res, next) => {
	try {
		const Id = req.params.contactId;
		const contactById = await contactsService.getContactById(Id);

		if (!contactById)
			throw HttpError(404, `Contact with this ID ${Id} not found`);

		res.json(contactById);
	} catch (error) {
		next(error);
	}
};

const removeContact = async (req, res, next) => {
	try {
		const Id = req.params.contactId;
		const deletedContact = await contactsService.removeContact(Id);

		if (!deletedContact)
			throw HttpError(404, `Contact with this ID ${Id} not found`);

		// res.status(200).json(deletedContact);
		res.status(200).json({ message: "Contact deleted" });
	} catch (error) {
		next(error);
	}
};

const addContact = async (req, res, next) => {
	try {
        

		const newContact = await contactsService.addContact(req.body);

		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
};

const updateContact = async (req, res, next) => {
	try {
		if (Object.keys(req.body).length === 0)
			throw HttpError(400, "Missing fields");
		const { error } = contactUpdateSchema.validate(req.body);
		if (error) throw HttpError(404, error.message);

		const Id = req.params.contactId;
		const updatedContact = await contactsService.updateContact(Id, req.body);

		if (!updatedContact)
			throw HttpError(404, `Contact with this ID ${Id} not found`);

		res.status(200).json(updatedContact);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
