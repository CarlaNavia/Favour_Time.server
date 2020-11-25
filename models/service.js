const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    serviceName: { type: String, required: true},
    imageService: { type: String, required: true},
    description: { type: String, required: true },
    serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
    availableTime: { type: String },
    cityToBeHeld: { type: String, required: true  },
    addressToBeHeld: { type: String, required: true  },
    streetNumberToBeHeld: { type: String, required: true  },
    credits: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    bookings:[{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
