const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    date: { type: Date, required: true},
    time: { type: Time, required: true},
    client: { type: Schema.Types.ObjectId, ref: User },
    owner: { type: Schema.Types.ObjectId, ref: User },
    service: { type: Schema.Types.ObjectId, ref: Service },
    status: { pending, accepted, declined },
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;