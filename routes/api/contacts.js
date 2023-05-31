const express = require("express");
const {
	getContacts,
	getContactById,
	addContact,
	removeContact,
	updateContact,
} = require("../../controllers/contactsController");
const validateBody = require("../../utils/validateBody");
const { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } = require("../../helpers/ContactValidate");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", isValidId, getContactById);

router.post("/", validateBody(contactAddSchema), addContact);

router.delete("/:contactId", isValidId, removeContact);

router.put("/:contactId", isValidId, validateBody(contactUpdateSchema), updateContact);

router.patch(
	"/:contactId/favorite",
	isValidId,
	validateBody(contactUpdateFavoriteSchema),
	updateContact
);

module.exports = router;
