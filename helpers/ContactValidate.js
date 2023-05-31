const Joi = require("joi")

const message = (field) => ({ "any.required": `Missing required ${field} field` });

const contactAddSchema = Joi.object({
	name: Joi.string().required().messages(message("name")),
	email: Joi.string().required().messages(message("email")),
	phone: Joi.string().required().messages(message("phone")),
	favorite: Joi.boolean(),
});

const contactUpdateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string(),
	phone: Joi.string(),
	favorite: Joi.boolean(),
})
	.or("name", "email", "phone", "favorite")
	.error(new Error("Missing fields"));

const contactUpdateFavoriteSchema = Joi.object({
	favorite: Joi.boolean()
		.required()
		.messages({ "any.required": `Missing field favorite` }),
});

module.exports = {
	contactAddSchema,
	contactUpdateSchema,
	contactUpdateFavoriteSchema,
};