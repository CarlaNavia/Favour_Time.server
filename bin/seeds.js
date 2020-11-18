const mongoose = require('mongoose');
const ServiceType = require('../models/serviceType');

mongoose.connect(`mongodb://localhost/backend-server`, { useNewUrlParser: true, useUnifiedTopology: true } );


const serviceType = [
    {
        serviceName: "Babysitters",
        iconCode: 1,
    },
    {
        serviceName: "Elderly caregivers",
        iconCode: 2,
    },
    {
        serviceName: "Health services",
        iconCode: 3,
    },
    {
        serviceName: "Home duties",
        iconCode: 4,
    },
    {
        serviceName: "Language classes",
        iconCode: 5,
    },
    {
        serviceName: "Move",
        iconCode: 6,
    },
    {
        serviceName: "Personal trainers",
        iconCode: 7,
    },
    {
        serviceName: "Repairs",
        iconCode: 8,
    },
    {
        serviceName: "School support",
        iconCode: 9,
    },
    {
        serviceName: "Transport",
        iconCode: 10,
    },
    {
        serviceName: "Others",
        iconCode: 11,
    }
]


ServiceType.create(serviceType, (err) => {
    if (err) { throw(err) }
    console.log(`Created ${serviceType.length} service type`)
    mongoose.connection.close();
  });