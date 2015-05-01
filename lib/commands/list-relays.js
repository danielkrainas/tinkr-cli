var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');
var ActionBuilder = require('./action-builder');


exports.command = 'relays';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.getRelays(function (relays) {
            console.log(interpolate('[{name}]', client.remote));
            console.log('Relays: ');
            relays.forEach(function (relay) {
                console.log('-- ' + relay.name);
            });

            next();
        });
    })
    .build();