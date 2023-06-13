const express = require("express");
const { schemas } = require("../../models/users");
const {
	register,
	login,
	getCurrent,
	logOut,
	changeSubscription,
	updateAvatar,
	verifyEmail,
	resendVerifyEmail,
} = require("../../controllers/authController");
const validateBody = require("../../utils/validateBody");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", validateBody(schemas.authSchema), register);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(schemas.emailSchema), resendVerifyEmail);

router.post("/login", validateBody(schemas.authSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logOut);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

router.patch(
	"/",
	authenticate,
	validateBody(schemas.subscribeSchema),
	changeSubscription
);

module.exports = router;
