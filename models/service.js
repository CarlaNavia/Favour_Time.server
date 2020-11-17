const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    serviceName: { type: String, required: true},
    imageService: { type: String default: "FOTO" },
    description: { type: String, required: true },
    serviceType: { type: Schema.Types.ObjectId, ref: ServiceType },
    availableTime: { type: String },
    addressToBeHeld: { type: String, required: true  },
    credits: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: User },
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
