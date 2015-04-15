var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');
var ActionBuilder = require('./action-builder');


exports.command = 'stubs';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.getStubs(function (stubs) {
            console.log(interpolate('[{name}]', client.remote));
            console.log('Stubs: ');
            stubs.forEach(function (stub) {
                console.log('-- ' + stub.name);
            });

            next();
        });
    })
    .build();
