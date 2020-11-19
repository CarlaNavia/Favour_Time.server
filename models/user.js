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
    dateOfBirth: {type: Date ,  default: "2000/01/01"},
    phoneNumber: {type: Number, default: 0},
    address: {
      streetName: {type:String, default: "C/"},
      streetNumber: {type:Number , default: 99},
      zipCode:{type:Number , default: 00000},
      city:{type:String, default: "---"},
      country: {type:String , default: "---"},
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;


