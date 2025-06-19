const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Educational/Academic Events',
      'Social & Cultural Events',
      'Sports & Recreational Events',
      ' Entertainment Events',
      'Professional & Educational Events',
      'religous',
    ],
  },
  pattern: {
    type: String,
    required: true,
  },
  imageUrl: { 
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },         
  },
  videoUrl: { 
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    }, 
  },
  description: {
    type: String,
  },
  updates: {
    type: String,
  },
  venue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue', 
  },
  attendees: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentReference: String,
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // refers to a user with role = 'organizer'
    required: true,
  },
  location: {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',  // Default status is pending
  },
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
