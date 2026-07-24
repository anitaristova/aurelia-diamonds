import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    firstName: { type: String, trim: true, default: '' },
    lastName: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
