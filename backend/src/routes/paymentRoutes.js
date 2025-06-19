const express = require('express');
const axios = require('axios');
const Event = require('../models/eventModel');
const router = express.Router();

// 1. Initiate payment
router.post('/event/:id/payment/initiate', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, amount, userId } = req.body;

  // Generate a unique transaction reference
  const tx_ref = `event-${id}-${Date.now()}`; 
 
  try {
    // Call Chapa API to create a payment session
    const chapaRes = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount,
        currency: 'ETB',
        email,
        first_name,
        last_name,
        tx_ref,
        return_url: `http://localhost:5173/attend/${id}/payment-success?tx_ref=${tx_ref}`,
        callback_url: `http://localhost:5173/attend/${id}/payment-success?tx_ref=${tx_ref}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Optionally, you can store
    res.json({ checkoutUrl: chapaRes.data.data.checkout_url, tx_ref });
  } catch (error) {
    console.error('Payment initiation error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// 2. Verify payment
router.post('/event/:id/payment/verify', async (req, res) => {
  const { id } = req.params;
  const { tx_ref, userId } = req.body; // userId should be sent from frontend

  try {
    // 1. Verify payment with Chapa
    const verifyRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        }
      }
    );

    const status = verifyRes.data.data.status;

    if (status === 'success') {
      // 2. Add attendee to the event
      await Event.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            attendees: {
              user: userId,
              paymentStatus: 'completed', 
              paymentReference: tx_ref,
              registeredAt: new Date()
            }
          }
        },
        { new: true }
      );

      return res.json({ success: true, message: 'Payment verified and attendee added!' });
    } else {
      return res.status(400).json({ success: false, message: 'Payment not successful.' });
    }
  } catch (error) {
    console.error('Chapa verify error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
});
module.exports = router;