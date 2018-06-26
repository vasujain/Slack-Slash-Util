var BotConfig = require('../config.json');
var request = require("request");

var self = module.exports = {
        // Make a POST call to Jobs API to fetch jobs details for specific query
        HttpRequest: function(slashCommand, message) {
            var options = { 
                method: 'GET',
                url: BotConfig.jobs.api_url,
                qs: { 
                    query: BotConfig.jobs.query
                } 
            };
        
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            self.parseAndResponseJobsJson(slashCommand, message, body);
            });
        },
        // Parse the Jobs API response json and extracting Job details out of it.
        parseAndResponseJobsJson: function(slashCommand, message, body) {
            var obj = JSON.parse(body);
            var response = "";
            if (obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    response += "\n :computer:" + " Position # " + obj[i].position_title + " at " + obj[i].organization_name + " at " + obj[i].locations[0];
                    response += "\n " + obj[i].url;
                }
                slashCommand.replyPrivate(message, {
                    "attachments": [{
                        "color": "#36a64f",
                        "title": "Weather Update",
                        "text": response
                    }]
                });
            } else {
                slashCommand.replyPrivate(message, ":x: Unable to find jobs with the keyword!");
            }
        }
    };
