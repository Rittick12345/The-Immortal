const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdaptor: 'https',
  apiKey: '32rLunGKecseG8SB9I0vPgWMqzY69GGD',
  formatter: null,
};
const geocoder = NodeGeocoder(options);
module.exports = geocoder;
