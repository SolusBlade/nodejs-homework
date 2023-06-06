const express = require("express");
const { schemas } = require("../../models/users");
const {
	register,
	login,
	getCurrent,
	logOut,
	changeSubscription,
} = require("../../controllers/authController");
const validateBody = require("../../utils/validateBody");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", validateBody(schemas.authSchema), register);

router.post("/login", validateBody(schemas.authSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logOut);

router.patch(
	"/",
	authenticate,
	validateBody(schemas.subscribeSchema),
	changeSubscription
);

module.exports = router;
