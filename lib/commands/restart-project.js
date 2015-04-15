var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'restart <name>';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.changeProjectState(context.params.name, null, 'restart', function () {
            console.log('[' + client.remote.host + '] ' + context.params.name + ' restarting.');
            next();
        });
    })
    .build();
