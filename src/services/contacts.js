import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await ContactsCollection.find();
};

export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};

export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return await ContactsCollection.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};

export const deleteContactById = async (contactId) => {
  return await ContactsCollection.findByIdAndDelete(contactId);
};
