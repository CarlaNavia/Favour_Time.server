const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema({
    serviceName: { type: String, required: true },
    iconCode: Number,
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const ServiceType = mongoose.model('ServiceType', serviceTypeSchema);

module.exports = ServiceType;






