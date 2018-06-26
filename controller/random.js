var Weather =  require('./weather');
var Dogs =  require('./dogs');
var Jobs =  require('./jobs');

var self = module.exports = {
        // Randomly select one of the supported API to fetch API details
        Request: function(slashCommand, message) {
            var MAX = 3;
            var rand = Math.floor((Math.random() * MAX) + 1);
            if (rand == 1) {
                Dogs.HttpRequest(slashCommand, message);
            } else if (rand == 2) {
                Weather.HttpRequest(slashCommand, message);
            } else {
                Jobs.HttpRequest(slashCommand, message);
            }
        }
    };
