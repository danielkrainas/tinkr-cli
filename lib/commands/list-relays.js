var fmt = require('fmt');

var TinkrClient = require('../tinkr-client');
var ActionBuilder = require('./action-builder');


exports.command = 'relays';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.getRelays(function (relays) {
            fmt.msg('');
            fmt.title(client.remote.name);
            if (relays.length <= 0) {
                fmt.li('None');
            } else {
                relays.forEach(function (relay) {
                    fmt.li(relay.name);
                });

            }

            fmt.line();

            next();
        });
    })
    .build();
