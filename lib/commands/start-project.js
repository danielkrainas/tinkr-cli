var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'start <name> [version]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.changeProjectState(name, version, 'start', function () {
            console.log('[' + client.remote + '] ' + name + ' starting.');
            next();
        });
    })
    .build();
