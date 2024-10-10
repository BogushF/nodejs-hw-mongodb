import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = 'name',
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite || filter.isFavourite === false) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne(contactId, userId);
};

export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const updateContact = async (contactId, userId, payload) => {
  return await ContactsCollection.findOneAndUpdate(contactId, userId, payload, {
    new: true,
  });
};

export const deleteContactById = async (contactId, userId) => {
  return await ContactsCollection.findOneAndDelete(contactId, userId);
};
