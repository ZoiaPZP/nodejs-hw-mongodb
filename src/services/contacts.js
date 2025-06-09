import Contact from '../models/contact.model.js';

export const listContacts = async () => {
  return await Contact.find();
};

export const getContact = async (contactId) => {
  return await Contact.findById(contactId);
};





