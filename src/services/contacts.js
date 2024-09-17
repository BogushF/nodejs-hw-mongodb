import { ContactsCollection } from '../db/models/contact';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

// export const getContactById = async (contactId) => {
//   const contact = await contactsModel.findById(contactId);
//   return contact;
// };
