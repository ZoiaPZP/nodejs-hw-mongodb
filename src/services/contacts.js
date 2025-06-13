import Contact from '../models/contact.js';

export const listContacts = async () => Contact.find();

export const getContact = async (id) => Contact.findById(id);

export const addContact = async (data) => Contact.create(data);

export const updateContact = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = async (id) => Contact.findByIdAndDelete(id);






