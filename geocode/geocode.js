const request = require('request');
const GEO_CODING_API = 'AIzaSyA7L_5zTZn9gP5hjUFUbNMLIgxPy02jPHw';

module.exports.findLocation = function(location) {
  return new Promise((resolve, reject) => {
    request.get({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(location) + '&key=' + GEO_CODING_API,
      json: true
    }, (err, res, body) => {
      if (err != undefined && err.code === 'ENOTFOUND') {
        reject('Unable to connect to host :', err.hostname);
      } else if (body.status === 'REQUEST_DENIED') {
        reject(body.error_message);
      } else if (body.status === 'ZERO_RESULTS') {
        reject('Sorry! But no data exists for this location/zip.');
      } else if (body.status === 'OK') {
        resolve({
          address: body.results[0].formatted_address,
          latitude: body.results[0].geometry.location.lat,
          longitude: body.results[0].geometry.location.lng
        });
      }
    });
  });

}
