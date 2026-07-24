import { Order } from '../models/Order.js';

const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING = 5;
const ADDRESS_FIELDS = ['firstName', 'lastName', 'phone', 'address', 'city', 'postalCode'];

async function createWithCode(data) {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const count = await Order.countDocuments();
    const orderCode = `AD-${year}-${String(count + 1 + attempt).padStart(6, '0')}`;
    try {
      return await Order.create({ ...data, orderCode });
    } catch (err) {
      if (err.code === 11000) continue;
      throw err;
    }
  }
  throw new Error('Could not generate a unique order code');
}

export async function createOrder(req, res) {
  const user = req.user;
  await user.populate('cart.product');
  const items = user.cart.filter((item) => item.product);

  if (items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty' });
  }
  if (items.some((item) => !item.product.inStock)) {
    return res.status(400).json({
      error: 'Some items in your cart are no longer available',
    });
  }

  const { shippingAddress, paymentMethod, card } = req.body;
  if (!shippingAddress || ADDRESS_FIELDS.some((f) => !shippingAddress[f])) {
    return res.status(400).json({ error: 'Please complete all shipping details' });
  }
  if (!['cod', 'card'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Please choose a valid payment method' });
  }

  let cardLast4 = '';
  if (paymentMethod === 'card') {
    const number = (card?.number || '').replace(/\s+/g, '');
    if (!card?.cardholderName || number.length < 12 || !card?.expiry || !card?.cvv) {
      return res.status(400).json({ error: 'Please complete the card details' });
    }
    cardLast4 = number.slice(-4);
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.effectivePrice * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  const orderItems = items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    code: item.product.code,
    image: item.product.images?.[0] || '',
    unitPrice: item.product.effectivePrice,
    quantity: item.quantity,
  }));

  const order = await createWithCode({
    user: user._id,
    items: orderItems,
    subtotal,
    shipping,
    total,
    shippingAddress: {
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      phone: shippingAddress.phone,
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
    },
    paymentMethod,
    cardLast4,
  });

  user.cart = [];
  await user.save();

  res.status(201).json({ order });
}

export async function listMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
}

export async function listAllOrders(req, res) {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate('user', 'email firstName lastName');
  res.json({ orders });
}

export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to view this order' });
  }
  res.json({ order });
}
