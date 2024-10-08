import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

export const registerUser = async (payload) => {
  let user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'User with this email already registered!');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  user = await UsersCollection.create({ ...payload, password: hashedPassword });

  return user;
};
