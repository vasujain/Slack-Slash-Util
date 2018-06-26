var Botkit = require('botkit');

var Weather =  require('./controller/weather');
var Dogs =  require('./controller/dogs');
var Jobs =  require('./controller/jobs');
var Random =  require('./controller/random');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

var config = {}
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: './db_slackbutton_slash_command/',
    };
}

var controller = Botkit.slackbot(config).configureSlackApp(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['commands'],
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});

controller.on('slash_command', function (slashCommand, message) {
    if (message.token !== process.env.VERIFICATION_TOKEN) return;
    
    switch (message.command) {
        case "/surprise": 
            if (message.text === "dogs") {
                Dogs.HttpRequest(slashCommand, message);
            } else if (message.text === "weather") {
                Weather.HttpRequest(slashCommand, message);
            } else if (message.text === "jobs") {
                Jobs.HttpRequest(slashCommand, message);
            } else {
                Random.Request(slashCommand, message);
            }
            break;
        default:
            slashCommand.replyPublic(message, ":x: I am not able to decipher " + message.command + " yet.");
    }
});

