var BotConfig = require('../config.json');
var request = require("request");

var self = module.exports = {
        // Make a POST call to weatherbit API to fetch weather details for specific zip code
        HttpRequest: function(slashCommand, message) {
            var options = { 
                method: 'GET',
                url: BotConfig.weather.api_url,
                qs: { 
                    postal_code: BotConfig.weather.postal_code,
                    country: BotConfig.weather.country,
                    key: BotConfig.weather.api_key 
                } 
            };
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            self.parseAndResponseWeatherbitJson(slashCommand, message, body);
            });
        },
        // Parse the Weather API response json and extracting temprature/city name details out of it.
        parseAndResponseWeatherbitJson: function(slashCommand, message, body) {
            var obj = JSON.parse(body);
            if (obj.data.length > 0) {
                var weathermsg = ":mostly_sunny: Current temprature is " + obj.data[0].temp + " degrees Celsius at : " + obj.data[0].city_name;
                slashCommand.replyPrivate(message, {
                    "attachments": [{
                        "color": "#36a64f",
                        "title": "Weather Update",
                        "text": weathermsg
                    }]
                });
            } else {
                slashCommand.replyPrivate(message, ":x: Unable to determine temprature for the location!");
            }
        }
    };