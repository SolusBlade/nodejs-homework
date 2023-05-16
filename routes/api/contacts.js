const express = require("express");
const {
	getContacts,
	getContactById,
	addContact,
	removeContact,
	updateContact,
} = require("../../controllers/contactsController");

const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", getContactById);

router.post("/", addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", updateContact);

module.exports = router;
