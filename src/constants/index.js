export const ENV_VARS = {
  PORT: 'PORT',
};

export const MONGO_VARS = {
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  MONGODB_URL: 'MONGODB_URL',
  MONGODB_DB: 'MONGODB_DB',
};

export const SORT_ORDER = ['asc', 'desc'];

export const SORT_BY_PROPS = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

export const BOOLEANS = ['true', 'false'];

export const CONTACT_TYPE = ['work', 'home', 'personal'];

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const MONTH = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
  JWT_SECRET: 'JWT_SECRET',
  APP_DOMAIN: 'APP_DOMAIN',
};

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
  IS_CLOUDINARY_ENABLED: 'IS_CLOUDINARY_ENABLED',
};
