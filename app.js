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
geocodeAddress.findLocation(location,(errorMessage,results) => {
    if(errorMessage){
        console.log(errorMessage);
    }else{
        console.log('You are asking weather for : ',results.address);

        darksky.getWeather(results.latitude,results.longitude,(error,weatherData) => {
            if(error){
                console.log(error);
            }else{
                console.log(weatherData.type);
                console.log('Precipitation :',weatherData.precipitation);
                console.log('Temperature :',weatherData.temperature,'\u00B0','C');
                console.log('Wind speed :',weatherData.wind,'m/s');
            }
        });
    }
});
