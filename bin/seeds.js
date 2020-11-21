const mongoose = require('mongoose');
const ServiceType = require('../models/serviceType');

mongoose.connect(`mongodb+srv://FavourTime:Time1234!@cluster0.t2bcc.mongodb.net/fvTime?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true } );

const serviceType = [
    {
        serviceName: "Babysitters",
        iconCode: 1,
        services: []
    },
    {
        serviceName: "Elderly caregivers",
        iconCode: 2,
        services: []
    },
    {
        serviceName: "Health services",
        iconCode: 3,
        services: []
    },
    {
        serviceName: "Home duties",
        iconCode: 4,
        services: []
    },
    {
        serviceName: "Language classes",
        iconCode: 5,
        services: []
    },
    {
        serviceName: "Move",
        iconCode: 6,
        services: []
    },
    {
        serviceName: "Personal trainers",
        iconCode: 7,
        services: []
    },
    {
        serviceName: "Repairs",
        iconCode: 8,
        services: []
    },
    {
        serviceName: "School support",
        iconCode: 9,
        services: []
    },
    {
        serviceName: "Transport",
        iconCode: 10,
        services: []
    },
    {
        serviceName: "Others",
        iconCode: 11,
        services: []
    }
]


ServiceType.create(serviceType, (err) => {
    if (err) { throw(err) }
    console.log(`Created ${serviceType.length} service type`)
    mongoose.connection.close();
  });