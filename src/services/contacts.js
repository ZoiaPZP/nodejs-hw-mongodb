import Contact from '../models/contact.js';

export const listContacts = async (
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

  const totalItems = await Contact.countDocuments(filters);

  const data = await Contact.find(filters)
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

export const getContact = async (id) => Contact.findById(id);

export const addContact = async (data) => Contact.create(data);

export const updateContact = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = async (id) => Contact.findByIdAndDelete(id);



