var fmt = require('fmt');
var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'start <name> [version]';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.changeProjectState(context.params.name, context.params.version, 'start', function () {
            fmt.title(client.remote.toString('long'));
            fmt.field(context.params.name, 'starting');
            next();
        });
    })
    .build();
