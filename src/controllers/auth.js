import { registerUser } from '../services/auth.js';
import { pareUser } from '../utils/pareUser.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: pareUser(user),
  });
};
