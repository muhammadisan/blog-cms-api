`src/controllers/userController.ts`

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { loginSchema, userSchema, updateUserSchema } from '../utils/validators';


// Generate JWT
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  const expiresIn = (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'];

  return jwt.sign({ id }, secret, { expiresIn });
};


// Public: list users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};


// Public: get single user
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};


// Protected: create user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { name, username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'Username already taken' });

    const newUser = await User.create({ name, username, password });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};


// Protected: update own user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id.equals(req.params.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { name, username } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, username },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    next(err);
  }
};


// Protected: delete own user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id.equals(req.params.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};


// Public: login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const user = await User.findOne({ username: req.body.username });

    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());

    res.json({ token });
  } catch (err) {
    next(err);
  }
};


// Protected: logout (client should discard token)
export const logout = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout successful' });
};
