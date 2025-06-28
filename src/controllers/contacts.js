import createError from 'http-errors';
import mongoose from 'mongoose';
import { uploadImageToCloudinary } from '../services/cloudinary.js';

import {
  listContacts,
  getContact,
  addContact as add,
  updateContact as update,
  deleteContact as remove,
} from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const filters = {
    ...(type && { contactType: type }),
    ...(isFavourite !== undefined && { isFavourite: isFavourite === 'true' }),
  };

  const result = await listContacts(
    req.user._id, 
    +page,
    +perPage,
    sortBy,
    sortOrder,
    filters
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: result.data,
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      hasPreviousPage: result.hasPreviousPage,
      hasNextPage: result.hasNextPage,
    },
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createError(404, 'Contact not found');
  }

  const contact = await getContact(contactId, req.user._id); 

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
  let photoUrl = null;

  if (req.file) {
    photoUrl = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
  }

  const newContact = await add(
    { ...req.body, photo: photoUrl },
    req.user._id
  );

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

  const deletedContact = await remove(contactId, req.user._id); 

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createError(404, 'Contact not found');
  }

  let photoUrl = null;

  if (req.file) {
    photoUrl = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
  }

  const updated = await update(
    contactId,
    photoUrl ? { ...req.body, photo: photoUrl } : req.body,
    req.user._id
  );

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

  const updated = await update(contactId, { isFavourite }, req.user._id); 

  if (!updated) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully updated favorite status for contact with id ${contactId}!`,
    data: updated,
  });
};



















