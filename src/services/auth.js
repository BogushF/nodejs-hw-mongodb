import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, MONTH, SMTP } from '../constants/index.js';
import crypto from 'node:crypto';
import { emailClient } from '../utils/emailClient.js';
import { env } from '../utils/env.js';
import { generateResetEmail } from '../utils/generateResetEmail.js';
import jwt from 'jsonwebtoken';

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

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(SMTP.JWT_SECRET),
    { expiresIn: 60 * 5 },
  );

  const resetLink = `${env(
    SMTP.APP_DOMAIN,
  )}/reset-password?token=${resetToken}`;

  try {
    await emailClient.sendMail({
      to: email,
      from: env(SMTP.SMTP_FROM),
      html: generateResetEmail({
        name: user.name,
        resetLink: resetLink,
      }),
      subject: 'Reset your password',
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, env(SMTP.JWT_SECRET));
  } catch (err) {
    throw createHttpError(401, err.message);
  }
  const user = await UsersCollection.findById(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.findByIdAndUpdate(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
