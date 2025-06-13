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

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(addContact));
router.delete('/:contactId', ctrlWrapper(removeContact));
router.put('/:contactId', ctrlWrapper(updateContact));
router.patch('/:contactId', ctrlWrapper(updateContact));
router.patch('/:contactId/favorite', ctrlWrapper(updateStatusContact));

export default router;





