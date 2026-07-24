import mongoose from 'mongoose';
import { DEPARTMENTS } from '../constants/catalog.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    onSale: { type: Boolean, default: false },
    salePrice: { type: Number, min: 0, default: null },
    images: { type: [String], default: [] },
    department: { type: String, required: true, enum: DEPARTMENTS },
    category: { type: String, trim: true, default: '' },
    color: { type: String, trim: true, default: '' },
    ringType: { type: String, trim: true, default: '' },
    material: { type: String, trim: true, default: '' },
    inStock: { type: Boolean, default: true },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.virtual('effectivePrice').get(function () {
  return this.onSale && this.salePrice != null ? this.salePrice : this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
