import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

export async function ensureAdminUser() {
  const { email, password } = config.admin;
  if (!email || !password) {
    console.warn('Admin bootstrap skipped: ADMIN_EMAIL/ADMIN_PASSWORD not set');
    return;
  }

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) return;

  const normalized = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalized });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log(`Promoted existing user ${normalized} to admin`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    email: normalized,
    passwordHash,
    role: 'admin',
    firstName: 'Admin',
  });
  console.log(`Created admin user ${normalized}`);
}
