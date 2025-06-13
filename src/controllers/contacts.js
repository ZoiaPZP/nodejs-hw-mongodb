import createError from 'http-errors';
import {
  listContacts,
  getContact,
  addContact as add,
  updateContact as update,
  deleteContact as remove,
} from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContact(contactId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const newContact = await add(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await remove(contactId);

    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully deleted contact with id ${contactId}!`,
      data: deletedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updated = await update(contactId, req.body);

    if (!updated) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully updated contact with id ${contactId}!`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { isFavourite } = req.body;

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
  } catch (error) {
    next(error);
  }
};











