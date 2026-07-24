import { User } from '../models/User.js';

export async function updateProfile(req, res) {
  const { firstName, lastName, phone, email } = req.body;

  if (email && email.toLowerCase().trim() !== req.user.email) {
    const normalized = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    req.user.email = normalized;
  }
  if (firstName !== undefined) req.user.firstName = firstName;
  if (lastName !== undefined) req.user.lastName = lastName;
  if (phone !== undefined) req.user.phone = phone;

  await req.user.save();
  res.json({ user: req.user });
}
