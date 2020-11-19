const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    description: { type: String },
    rating: {type:Number, min:0, max:5},
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;