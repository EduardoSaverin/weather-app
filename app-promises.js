const yargs = require('yargs');
const geocodeAddress = require('./geocode/geocode');
const darksky = require('./weather/weather.js');
const axios = require('axios');
const GEO_CODING_API = 'AIzaSyA7L_5zTZn9gP5hjUFUbNMLIgxPy02jPHw';
const DARK_SKY_KEY = 'a509ea28f7f4ceb5270ed387e7646f28';

const argv = yargs.options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

const location = argv.address;
const locationURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(location) + '&key=' + GEO_CODING_API;
axios.get(locationURL)
  .then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.');
    } else if (response.data.status === 'REQUEST_DENIED') {
      throw new Error('Request Denied');
    } else if (response.data.status === 'OK') {
      console.log('Asking weather for : ', response.data.results[0].formatted_address);
      var latitude = response.data.results[0].geometry.location.lat;
      var longitude = response.data.results[0].geometry.location.lng;
      return axios.get('https://api.darksky.net/forecast/' + DARK_SKY_KEY + '/' + latitude + ',' + longitude + '?units=auto');
    }
  })
  .then((response) => {
    console.log(response.data.currently.summary);
    console.log('Precipitation :', response.data.currently.precipProbability, '%');
    console.log('Current Temperature :', response.data.currently.temperature, '\u00B0', 'C');
    console.log('What it feels like :', response.data.currently.apparentTemperature, '\u00B0', 'C');
    console.log('Wind speed :', response.data.currently.windSpeed, 'm/s');
  })
  .catch((error) => {
    if (error.code === 'ENOTFOUND') {
      console.log('Unable to reach Google servers.');
    } else {
      console.log(error.message);
    }
  });
