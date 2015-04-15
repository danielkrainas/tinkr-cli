var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'stop <name>';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.changeProjectState(context.params.name, null, 'stop', function () {
            console.log('[' + client.remote + '] ' + context.params.name + ' stopping.');
            next();
        });        
    })
    .build();
