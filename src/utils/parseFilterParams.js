import { BOOLEANS, CONTACT_TYPE } from '../constants/index.js';

const parseContactType = (value) => {
  if (CONTACT_TYPE.includes(value)) return value;
};

const parseBoolean = (value) => {
  if (!BOOLEANS.includes(value)) return;
  return value === 'true' ? true : false;
};

export const parseFilterParams = (query) => {
  const isFavourite = parseBoolean(query.isFavourite);
  const contactType = parseContactType(query.contactType);

  return {
    isFavourite,
    contactType,
  };
};
