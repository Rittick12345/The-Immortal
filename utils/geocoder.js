const NodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');

dotenv.config({ path: '../config/config.env' });

const options = {
  provider: 'mapquest',
  httpAdaptor: 'https',
  apiKey: '32rLunGKecseG8SB9I0vPgWMqzY69GGD',
  formatter: null,
};
const geocoder = NodeGeocoder(options);
module.exports = geocoder;
