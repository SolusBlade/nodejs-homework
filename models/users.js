const { Schema, model } = require("mongoose");
const Joi = require("joi");

const  handleMongooseError  = require("../helpers/handleMongooseError");

const subscriptionOptions = ["starter", "pro", "business"];

const userSchema = new Schema(
	{
		email: {
			type: String,
			reqired: [true, "Email is required"],
			unique: true,
		},
		password: {
			type: String,
			reqired: [true, "Set password for user"],
		},
		subscription: {
			type: String,
			enum: subscriptionOptions,
			default: "starter",
		},
		token: {
			type: String,
			default: "",
		},
		avatarURL: String,
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const authSchema = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().required(),
	subscription: Joi.string(),
});

const subscribeSchema = Joi.object({
	_id: Joi.string().required(),
	subscription: Joi.string()
		.valid(...subscriptionOptions)
		.required(),
});

const schemas = {
	authSchema,
	subscribeSchema,
};
const User = model("user", userSchema);

module.exports = {
	User,
	schemas,
};
