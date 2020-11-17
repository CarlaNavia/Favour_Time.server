const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true},
    lastName: { type: String, required: true},
    credits: { type: Number, default: 30 },
    email: { type: String, required: true},
    password: { type: String, required: true},
    imageProfile: { type: String, default: "..." },
    review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;