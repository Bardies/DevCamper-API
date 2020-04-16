
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: process.env.geocoder_provider,
    apiKey: process.env.geo_API_key,
    formatter: null,

}

const geocoder = NodeGeocoder(options);

module.exports = geocoder