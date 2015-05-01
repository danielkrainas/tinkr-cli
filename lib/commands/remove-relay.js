var interpolate = require('interpolate');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');


exports.command = 'removerelay [name]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.removeRelay(context.params.name, function () {
            console.log(interpolate('[{client.remote}] {relay} removed.', { relay: context.params.name, client: client }));
            next();
        });
    })
    .build();
