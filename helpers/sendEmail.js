const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY, SENDGRID_FROM } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data, from = SENDGRID_FROM) => {
	const email = { ...data, from };
	await sgMail.send(email);
	return true;
};

module.exports = sendMail;
