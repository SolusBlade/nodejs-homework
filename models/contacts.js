const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require("uuid");


const contactsPath = path.join(__dirname, "contacts.json");

const saveChanges = async (arr) => {
	return await fs.writeFile(contactsPath, JSON.stringify(arr, null, 2));
};

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
	return JSON.parse(data);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
	const contact =
		(await contacts.find((item) => item.id === contactId)) || null;

	return contact;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
	const index = contacts.findIndex((item) => item.id === contactId);
	if (index === -1) return null;
	const deletedContact = contacts.splice(index, 1);
	await saveChanges(contacts);

	return deletedContact[0];
}

const addContact = async (body) => {
  const contacts = await listContacts();
	const newContact = {
		id: uuidv4(),
		...body,
	};
	contacts.push(newContact);
	await saveChanges(contacts);

	return newContact;
}

const updateContact = async (contactId, body) => {
   const contacts = await listContacts();
		const index = contacts.findIndex((item) => item.id === contactId);
		if (index === -1) return null;
		const updatedContact = Object.assign({ ...contacts[index], ...body });
		contacts[index] = updatedContact;
		await saveChanges(contacts);
		return updatedContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
