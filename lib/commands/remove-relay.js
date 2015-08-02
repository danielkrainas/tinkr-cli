var fmt = require('fmt');
var _ = require('lodash');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');

var successMessage = _.template('[<%= remote %>] <%= relay %> removed.');

exports.command = 'removerelay [name]';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.removeRelay(context.params.name, function () {
            fmt.msg(successMessage({ relay: context.params.name, remote: client.remote }));
            next();
        });
    })
    .build();
