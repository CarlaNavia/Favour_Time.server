const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    date: { type: Date, required: true},
    time: { type: String, required: true},
    extraInformation: { type: String },
    clientBooking: { type: Schema.Types.ObjectId, ref: "User" },
    ownerService: { type: Schema.Types.ObjectId, ref: "User" },
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    status: { type: String , default: "pending", enum: ['accepted', 'declined', 'pending']},
    review: {type: Schema.Types.ObjectId, ref: "Review" }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;