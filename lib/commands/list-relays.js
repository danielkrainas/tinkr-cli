var fmt = require('fmt');

var TinkrClient = require('../tinkr-client');
var ActionBuilder = require('./action-builder');


exports.command = 'relays';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.getRelays(function (relays) {
            fmt.msg('');
            fmt.title(client.remote);
            if (relays.length <= 0) {
                fmt.li('None');
            } else {
                relays.forEach(function (relay) {
                    fmt.li(relay.name);
                });

            }

            next();
        });
    })
    .build();
