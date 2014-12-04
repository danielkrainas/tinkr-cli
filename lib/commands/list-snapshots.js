var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');
var helpers = require('./helpers');


exports.command = 'snapshots [name]';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(function (name) {
        helpers.doForEachRemoteTarget(function (remote) {
            var client = new TinkrClient(remote);
            client.getProjectSnapshots(name, function (snapshots) {
                console.log(interpolate('[{name}]', remote));
                console.log(name + ' snapshots: ');
                snapshots.forEach(function (snapshot) {
                    console.log('-- ' + snapshot.version);
                });
            });
        })
    })
);
