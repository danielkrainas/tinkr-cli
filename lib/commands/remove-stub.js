var interpolate = require('interpolate');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');


exports.command = 'removestub [name]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.removeStub(context.params.name, function () {
            console.log(interpolate('[{client.remote}] {stub} removed.', { stub: context.params.name, client: client }));
            next();
        });
    })
    .build();
