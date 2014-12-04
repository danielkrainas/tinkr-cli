var interpolate = require('interpolate');

var helpers = require('./helpers');
var TinkrClient = require('../tinkr-client');


exports.command = 'projects';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(
        helpers.doForEachRemoteTarget(function (remote) {
            var client = new TinkrClient(remote);
            client.getProjects(function (projects) {
                console.log(interpolate('[{name}]', remote));
                console.log('Projects: ');
                projects.forEach(function (project) {
                    console.log('-- ' + project.name);
                });
            });
        })
    )
);
