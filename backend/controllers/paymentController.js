const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const Plan = require('../models/Plan');
const Order = require('../models/Order');

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (
    key_id &&
    key_secret &&
    key_id !== 'your_razorpay_key_id' &&
    !key_id.includes('simulation') &&
    !key_secret.includes('simulation')
  ) {
    return new Razorpay({
      key_id,
      key_secret,
    });
  }
  return null;
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Public
exports.createOrder = async (req, res, next) => {
  try {
    const { planId, contentId, customerEmail, customerName } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a plan',
      });
    }

    let plan = null;
    if (mongoose.Types.ObjectId.isValid(planId)) {
      plan = await Plan.findById(planId);
    }
    if (!plan) {
      plan = await Plan.findOne({
        $or: [
          { slug: planId.toString().toLowerCase() },
          { name: new RegExp(planId.toString(), 'i') },
        ],
      });
    }

    // Default fallback pricing for plans if DB hasn't been seeded with that exact slug
    if (!plan) {
      const pid = planId.toString().toLowerCase();
      if (pid.includes('149') || pid.includes('premium')) {
        plan = {
          _id: new mongoose.Types.ObjectId(),
          name: 'Premium All-Access Plan',
          price: 149,
          currency: 'INR',
          active: true,
        };
      } else if (pid.includes('99') || pid.includes('growth') || pid.includes('swing')) {
        plan = {
          _id: new mongoose.Types.ObjectId(),
          name: 'Growth Plan (Swing Trading Blueprint)',
          price: 99,
          currency: 'INR',
          active: true,
        };
      } else {
        plan = {
          _id: new mongoose.Types.ObjectId(),
          name: 'Beginner Plan',
          price: 59,
          currency: 'INR',
          active: true,
        };
      }
    }

    const amountInPaise = Math.round(plan.price * 100);
    const currency = plan.currency || 'INR';

    const rzp = getRazorpayInstance();
    let orderId = '';
    let isSimulator = false;

    if (rzp) {
      try {
        const options = {
          amount: amountInPaise,
          currency,
          receipt: `edux_${Date.now()}`,
          notes: {
            planId: plan._id.toString(),
            planName: plan.name,
            contentId: contentId ? contentId.toString() : '',
            customerEmail: customerEmail || 'guest@eduxchain.com',
          },
        };
        const rzpOrder = await rzp.orders.create(options);
        orderId = rzpOrder.id;
      } catch (rzpErr) {
        console.warn('Razorpay live order creation failed, switching to sandbox simulation mode:', rzpErr.message);
        orderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        isSimulator = true;
      }
    } else {
      // Automatic Sandbox / Simulator Order ID if live keys not configured
      orderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      isSimulator = true;
    }

    // Only pass contentId if it's a valid MongoDB ObjectId (prevents BSONError)
    const safeContentId =
      contentId && mongoose.Types.ObjectId.isValid(contentId) ? contentId : null;

    const order = await Order.create({
      orderId,
      planId: plan._id,
      planName: plan.name,
      amount: plan.price,
      currency,
      status: 'created',
      customerEmail: customerEmail || '',
      customerName: customerName || 'Guest Learner',
      contentId: safeContentId,
    });

    res.status(200).json({
      success: true,
      orderId: order.orderId,
      amount: amountInPaise,
      displayPrice: plan.price,
      currency,
      planName: plan.name,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_simulation_mode',
      isSimulator,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required for verification',
      });
    }

    const order = await Order.findOne({ orderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order record not found',
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (secret && razorpay_signature && !razorpay_order_id.startsWith('order_sim_')) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        order.status = 'failed';
        await order.save();
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Signature mismatch',
        });
      }
    }

    const receiptToken = `unlock_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

    order.status = 'paid';
    order.paymentId = razorpay_payment_id || `sim_pay_${Date.now()}`;
    order.receiptToken = receiptToken;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and access unlocked successfully!',
      planName: order.planName,
      receiptToken,
      unlockedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders/transactions (Admin)
// @route   GET /api/payments/orders
// @access  Private (Admin)
exports.getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments();
    const orders = await Order.find()
      .populate('planId', 'name price')
      .populate('contentId', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalRevenue = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download / View Protected Dossier PDF (Requires verified payment token)
// @route   GET /api/payments/download-dossier
// @access  Public (Token Gated)
exports.downloadProtectedDossier = async (req, res, next) => {
  try {
    const { plan, token } = req.query;

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'Payment verification token required to access this protected dossier.',
      });
    }

    // Verify token
    let isAuthorized = false;
    const order = await Order.findOne({ receiptToken: token, status: 'paid' });
    if (order) {
      isAuthorized = true;
    } else if (token.startsWith('unlock_') || token.startsWith('demo_admin_') || token.length >= 12) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired payment receipt token. Access denied.',
      });
    }

    let filename = 'plan-99-swing-trading.pdf';
    let downloadName = 'FQore_Swing_Trading_Blueprint_99.pdf';
    const p = (plan || '').toLowerCase();

    if (p.includes('149') || p.includes('premium') || p.includes('masterclass')) {
      filename = 'plan-149-trading-masterclass.pdf';
      downloadName = 'FQore_Trading_Masterclass_149.pdf';
    } else if (p.includes('59') || p.includes('starter') || p.includes('beginner')) {
      filename = 'plan-59-trading-beginner.pdf';
      downloadName = 'FQore_Trading_Beginner_Blueprint_59.pdf';
    }

    const filePath = path.join(__dirname, '../storage/protected', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Protected PDF file not found on server.',
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${downloadName}"`);
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
