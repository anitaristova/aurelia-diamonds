import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';

function authResponse(user) {
  return { token: signToken({ sub: user.id, role: user.role }), user };
}

export async function register(req, res) {
  const { email, password, firstName, lastName, phone } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const normalized = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalized });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: normalized,
    passwordHash,
    firstName,
    lastName,
    phone,
  });
  res.status(201).json(authResponse(user));
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.json(authResponse(user));
}

export async function me(req, res) {
  res.json({ user: req.user });
}
