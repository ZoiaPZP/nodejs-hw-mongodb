import express from 'express';
import {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from '../validation/contactsValidation.js';

const router = express.Router();


router.get('/', ctrlWrapper(getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post('/', validateBody(createContactSchema), ctrlWrapper(addContact));

router.delete('/:contactId', isValidId, ctrlWrapper(removeContact));

router.put('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));

router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));

router.patch('/:contactId/favorite', isValidId, validateBody(updateStatusSchema), ctrlWrapper(updateStatusContact));

export default router;







