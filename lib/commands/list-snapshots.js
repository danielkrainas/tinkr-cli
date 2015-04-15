var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');
var ActionBuilder = require('./action-builder');


exports.command = 'snapshots [name]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.getProjectSnapshots(context.params.name, function (snapshots) {
            console.log(interpolate('[{name}]', client.remote));
            console.log(context.params.name + ' snapshots: ');
            snapshots.forEach(function (snapshot) {
                console.log('-- ' + snapshot.version);
            });

            next();
        });
    })
    .build();
