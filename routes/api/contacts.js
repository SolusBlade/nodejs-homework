const express = require("express");
const {
	getContacts,
	getContactById,
	addContact,
	removeContact,
	updateContact,
} = require("../../controllers/contactsController");
const {
	schemas: { addSchema, updateFavoriteSchema },
} = require("../../models/contacts");

const validateBody = require("../../utils/validateBody");

const isValidId = require("../../middlewares/isValidId");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.get("/", getContacts);

router.get("/:contactId", isValidId, getContactById);

router.post("/", validateBody(addSchema), addContact);

router.delete("/:contactId", isValidId, removeContact);

router.put("/:contactId", isValidId, validateBody(addSchema), updateContact);

router.patch(
	"/:contactId/favorite",
	isValidId,
	validateBody(updateFavoriteSchema),
	updateContact
);

module.exports = router;
