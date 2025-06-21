import Contact from '../models/contact.js';

export const listContacts = async (
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filters = {}
) => {
  const skip = (page - 1) * perPage;

  const allowedSortFields = ['name', 'email', 'phoneNumber', 'contactType', 'createdAt'];
  const isValidSortBy = allowedSortFields.includes(sortBy);
  const sortField = isValidSortBy ? sortBy : 'name';
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortField]: sortDirection };

  const query = { userId, ...filters };

  const totalItems = await Contact.countDocuments(query);

  const data = await Contact.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContact = async (id, userId) =>
  Contact.findOne({ _id: id, userId });

export const addContact = async (data, userId) =>
  Contact.create({ ...data, userId });

export const updateContact = async (id, data, userId) =>
  Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteContact = async (id, userId) =>
  Contact.findOneAndDelete({ _id: id, userId });



