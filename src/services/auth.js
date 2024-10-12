import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, MONTH } from '../constants/index.js';
import crypto from 'node:crypto';

const createSession = () => ({
  accessToken: crypto.randomBytes(24).toString('base64'),
  refreshToken: crypto.randomBytes(24).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
  refreshTokenValidUntil: new Date(Date.now() + MONTH),
});

const findUserByEmail = async (email) =>
  await UsersCollection.findOne({ email });

export const registerUser = async (payload) => {
  let user = await findUserByEmail(payload.email);

  if (user) {
    throw createHttpError(409, 'User with this email already registered!');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  user = await UsersCollection.create({ ...payload, password: hashedPassword });

  return user;
};

export const loginUser = async (payload) => {
  const user = await findUserByEmail(payload.email);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'User email or password is incorrect!');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const session = await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });

  return session;
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  const newSession = createSession();

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
