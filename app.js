const yargs = require('yargs');
const geocodeAddress = require('./geocode/geocode');
const darksky = require('./weather/weather.js');

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
var locationPromise = geocodeAddress.findLocation(location);
//console.log(locationPromise);
locationPromise.then((results) => {
    console.log('You are asking weather for : ', results.address);
    var darkskyPromise = darksky.getWeather(results.latitude, results.longitude);
    darkskyPromise.then((weatherData) => {
        console.log(weatherData.type);
        console.log('Precipitation :', weatherData.precipitation);
        console.log('Temperature :', weatherData.temperature, '\u00B0', 'C');
        console.log('Wind speed :', weatherData.wind, 'm/s');
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((errorMessage) => {
    console.log(errorMessage);
  });
