const { User } = require("../models/users");
const HttpError = require("../helpers/HttpError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const sendMail = require("../helpers/sendEmail");

const { SECRET_KEY, BASE_URL, PORT } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function register(req, res, next) {
	try {
		const { email, password } = req.body;
		const userExist = await User.findOne({ email });

		if (userExist) {
			throw HttpError(409, "Email is already in use");
		}

		const hashPassword = await bcrypt.hash(password, 10);
		const avatarURL = gravatar.url(email);
		const verificationToken = nanoid();

		const newUser = await User.create({
			...req.body,
			password: hashPassword,
			avatarURL,
			verificationToken,
		});

		const verifyEmailData = {
			to: email,
			subject: "Verify email",
			html: `<a target="_blank" href="http://${BASE_URL}:${PORT}/users/verify/${verificationToken}">Click verify email</a>`,
		};

		await sendMail(verifyEmailData);

		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
}

const verifyEmail = async (req, res, next) => {
	try {
		const { verificationToken } = req.params;
		const user = await User.findOne({ verificationToken });
		if (!user) {
			throw HttpError(404, "User not found");
		}

		await User.findByIdAndUpdate(user._id, {
			verify: true,
			verificationToken: null,
		});
		res.json({
			message: "Verification successful",
		});
	} catch (error) {
		next(error);
	}
};

const resendVerifyEmail = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			throw HttpError(401, "Email not found");
		}

		if (user.verify) {
			throw HttpError(400, "Verification has already been passed");
		}

		const verifyEmailData = {
			to: email,
			subject: "Verify email",
			html: `<a target="_blank" href="http://${BASE_URL}:${PORT}/users/verify/${user.verificationToken}">Click verify email</a>`,
		};

		await sendMail(verifyEmailData);

		res.status(200).json({ message: "Verification email sent" });
	} catch (error) {
		next(error);
	}
};

async function login(req, res, next) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			throw HttpError(401, "Email or password is wrong");
		}

		if (!user.verify) {
			throw HttpError(401, "Email not verified");
		}

		const passwordCompare = await bcrypt.compare(password, user.password);

		if (!passwordCompare) {
			throw HttpError(401, "Email or password is wrong");
		}

		const payload = {
			id: user._id,
		};

		const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
		await User.findByIdAndUpdate(user._id, { token });

		res.status(200).json({
			token,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
}

async function getCurrent(req, res, next) {
	try {
		const { email, subscription = "starter" } = req.user;
		res.status(200).json({ email, subscription });
	} catch (error) {
		next(error);
	}
}

async function logOut(req, res, next) {
	try {
		const { _id } = req.user;
		await User.findByIdAndUpdate(_id, { token: "" });

		res.status(204).json({ message: "No content" });
	} catch (error) {
		next(error);
	}
}

async function changeSubscription(req, res, next) {
	try {
		const { _id } = req.body;
		const updatedUser = await User.findByIdAndUpdate({ _id }, req.body, {
			new: true,
		});

		if (!updatedUser) {
			throw HttpError(404, "Not found");
		}
		return res.status(200).json(updatedUser);
	} catch (error) {
		next(error);
	}
}

async function updateAvatar(req, res, next) {
	try {
		const { _id } = req.user;
		const { path: tempUpload, originalname } = req.file;
		const filename = `${_id}_${originalname}`;
		const resultUpload = path.join(avatarsDir, filename);

		const avatar = await Jimp.read(tempUpload);
		avatar.cover(250, 250).write(tempUpload);

		await fs.rename(tempUpload, resultUpload);
		const avatarURL = path.join("avatars", filename);

		await User.findByIdAndUpdate(_id, { avatarURL });
		res.status(200).json({ avatarURL });
	} catch (error) {
		next(error);
	}
}

module.exports = {
	register,
	login,
	getCurrent,
	logOut,
	changeSubscription,
	updateAvatar,
	verifyEmail,
	resendVerifyEmail,
};
