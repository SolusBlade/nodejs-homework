const HttpError = require("../helpers/HttpError");
const { Contact } = require("../models/contacts");

const getContacts = async (req, res, next) => {
	try {
		const { _id: owner } = req.user;
		const { page = 1, limit = 10, favorite } = req.query;
		const skip = (page - 1) * limit;

		if (favorite) {
			const list =
				favorite === true
					? await Contact.find(
							{ owner, favorite: true },
							"-createdAt -updatedAt",
							{ skip, limit }
					  )
					: await Contact.find(
							{ owner, favorite: false },
							"-createdAt -updatedAt",
							{ skip, limit }
					  );
			res.json(list);
		} else {
			const list = await Contact.find({ owner }, "-createdAt -updatedAt", {
				skip,
				limit,
			});
			res.json(list);
		}
	} catch (error) {
		next(error);
	}
};

const getContactById = async (req, res, next) => {
	try {
		const id = req.params.contactId;
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
		const { _id: owner } = req.user;
		const newContact = await Contact.create({ ...req.body, owner });

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
		const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
			new: true,
		});

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
		const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
			new: true,
		});

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
