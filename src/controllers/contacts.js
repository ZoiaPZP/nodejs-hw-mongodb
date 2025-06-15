import createError from 'http-errors';
import mongoose from 'mongoose';

import {
  listContacts,
  getContact,
  addContact as add,
  updateContact as update,
  deleteContact as remove,
} from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createError(404, 'Contact not found');
  }

  const contact = await getContact(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContact = async (req, res) => {
  const newContact = await add(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const removeContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createError(404, 'Contact not found');
  }

  const deletedContact = await remove(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully deleted contact with id ${contactId}!`,
    data: deletedContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createError(404, 'Contact not found');
  }

  const updated = await update(contactId, req.body);

  if (!updated) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully updated contact with id ${contactId}!`,
    data: updated,
  });
};

export const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { isFavourite } = req.body;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createError(404, 'Contact not found');
  }

  if (typeof isFavourite !== 'boolean') {
    throw createError(400, '"isFavourite" must be a boolean');
  }

  const updated = await update(contactId, { isFavourite });

  if (!updated) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully updated favorite status for contact with id ${contactId}!`,
    data: updated,
  });
};













