var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'removesnapshot <name> <version>';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.removeSnapshot(context.params.name, context.params.version, function () {
            console.log('[' + client.remote + '] ' + context.params.name + '#' + context.params.version + ' removed.');
            next();
        });
    })
    .build();