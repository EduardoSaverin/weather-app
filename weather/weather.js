const request = require('request');
const DARK_SKY_KEY = 'a509ea28f7f4ceb5270ed387e7646f28';
module.exports.getWeather = function(latitude, longitude) {
  return new Promise((resolve, reject) => {
    request.get({
      url: 'https://api.darksky.net/forecast/' + DARK_SKY_KEY + '/' + latitude + ',' + longitude + '?units=auto',
      json: true
    }, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode == 400) {
        reject(error);
      } else if (response.statusCode == 200) {
        resolve({
          type: body.currently.summary,
          precipitation: body.currently.precipProbability,
          temperature: body.currently.temperature,
          wind: body.currently.windSpeed
        });
      }
    });
  });
}
