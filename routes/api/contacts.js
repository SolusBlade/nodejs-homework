const express = require("express");
const {
	getContacts,
	getContactById,
	addContact,
	removeContact,
	updateContact,
} = require("../../controllers/contactsController");
const validateBody = require("../../utils/validateBody");
const { contactAddSchema, contactUpdateSchema } = require("../../helpers/ContactValidate");

const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", getContactById);

router.post("/", validateBody(contactAddSchema), addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", validateBody(contactUpdateSchema), updateContact);

module.exports = router;
