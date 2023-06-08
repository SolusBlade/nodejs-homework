const { User } = require("../models/users");
const HttpError = require("../helpers/HttpError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

async function register(req, res, next) {
	try {
		const { email, password } = req.body;
		const userExist = await User.findOne({ email });

		if (userExist) {
			throw HttpError(409, "Email is already in use");
		}

		const hashPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			...req.body,
			password: hashPassword,
		});

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

async function login(req, res, next) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			throw HttpError(401, "Email or password is wrong");
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

module.exports = {
	register,
	login,
	getCurrent,
	logOut,
	changeSubscription,
};
