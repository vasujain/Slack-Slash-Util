var BotConfig = require('../config.json');
var request = require("request");

var self = module.exports = {
        // Make a POST call to dogs API to fetch dogs details
        HttpRequest: function(slashCommand, message) {
            var options = { 
                method: 'GET',
                url: BotConfig.dogs.api_url,
            };
        
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
                self.parseAndResponseDogsJson(slashCommand, message, body);
            });
        },
        // Parse the dogs API response json and extracting dog details out of it.
        parseAndResponseDogsJson: function(slashCommand, message, body) {
            var obj = JSON.parse(body);
            slashCommand.replyPrivate(message, {
                "attachments": [{
                    "image_url":  obj.message
                }],
                "unfurl_media":true,
                "unfurl_links":true
            });
        }
    };