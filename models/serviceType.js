const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema({
    serviceName: { type: String, required: true },
    iconCode: { type: icon },
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });
  
const ServiceType = mongoose.model('ServiceType', serviceTypeSchema);

module.exports = ServiceType;






