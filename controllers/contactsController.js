const contactsService = require("../models/contacts");

const HttpError = require("../helpers/HttpError");
const Contact = require("../models/contacts");

const getContacts = async (_, res, next) => {
	try {
		const data = await Contact.find();
		if (!data) throw HttpError(404, `Not found`);

		res.json(data);
	} catch (error) {
		next(error);
	}
};

const getContactById = async (req, res, next) => {
	try {
		const id = req.params.contactId;
		// const contactById = await contactsService.getContactById(Id);
		const contactById = await Contact.findById(id);

		if (!contactById)
			throw HttpError(404, `Contact with this ID ${id} not found`);

		res.json(contactById);
	} catch (error) {
		next(error);
	}
};

const removeContact = async (req, res, next) => {
	try {
		const id = req.params.contactId;
		const deletedContact = await Contact.findByIdAndRemove(id);

		if (!deletedContact)
			throw HttpError(404, `Contact with this ID ${id} not found`);

		// res.status(200).json(deletedContact);
		res.status(200).json({ message: "Contact deleted" });
	} catch (error) {
		next(error);
	}
};

const addContact = async (req, res, next) => {
	try {
		const newContact = await Contact.create(req.body);

		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
};

const updateContact = async (req, res, next) => {
	try {
		if (Object.keys(req.body).length === 0)
			throw HttpError(400, "Missing fields");

		const id = req.params.contactId;
		const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {new: true});

		if (!updatedContact)
			throw HttpError(404, `Contact with this ID ${id} not found`);

		res.status(200).json(updatedContact);
	} catch (error) {
		next(error);
	}
};

const updateContactFavorite = async (req, res, next) => {
	try {
		const id = req.params.contactId;
		const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {new: true});

		if (!updatedContact)
			throw HttpError(404, `Contact with this ID ${id} not found`);

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
	updateContactFavorite,
};
